// Diff calculation utilities using diff-match-patch

import DiffMatchPatch from 'diff-match-patch';

const dmp = new DiffMatchPatch();
const DIFF_DELETE = -1;
const DIFF_INSERT = 1;
const DIFF_EQUAL = 0;

export interface CharDiff {
  type: 'equal' | 'delete' | 'insert';
  text: string;
}

export interface DiffLine {
  type: 'equal' | 'delete' | 'insert';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
  charDiffs?: CharDiff[]; // Character-level diffs for changed lines
}

export interface DiffResult {
  lines: DiffLine[];
  oldText: string;
  newText: string;
}

/**
 * Calculate character-level diff between two lines
 */
function calculateCharDiff(oldLine: string, newLine: string): CharDiff[] {
  const diffs = dmp.diff_main(oldLine, newLine);
  dmp.diff_cleanupSemantic(diffs);
  
  return diffs.map(([operation, text]) => ({
    type: operation === DIFF_DELETE ? 'delete' : operation === DIFF_INSERT ? 'insert' : 'equal',
    text,
  }));
}

/**
 * Calculate unified diff between two texts
 */
export function calculateUnifiedDiff(oldText: string, newText: string): DiffResult {
  // Use diff_linesToChars_ to calculate line-level diff (private method with underscore)
  const lineChars = (dmp as any).diff_linesToChars_(oldText, newText);
  const diffs = dmp.diff_main(lineChars.chars1, lineChars.chars2, false);
  (dmp as any).diff_charsToLines_(diffs, lineChars.lineArray);
  dmp.diff_cleanupSemantic(diffs);

  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const lines: DiffLine[] = [];
  let oldLineNum = 1;
  let newLineNum = 1;
  let oldLineIndex = 0;
  let newLineIndex = 0;

  for (let diffIndex = 0; diffIndex < diffs.length; diffIndex++) {
    const [operation, text] = diffs[diffIndex];
    const textLines = text.split('\n');
    
    for (let i = 0; i < textLines.length; i++) {
      const line = textLines[i];
      const isLastLine = i === textLines.length - 1;
      
      if (operation === DIFF_DELETE) {
        if (!isLastLine || line !== '') {
          const oldLine = oldLines[oldLineIndex] || '';
          // Check if next operation is INSERT (line was modified, not deleted)
          let charDiffs: CharDiff[] | undefined;
          let correspondingNewLine: string | null = null;
          
          if (diffIndex + 1 < diffs.length && diffs[diffIndex + 1][0] === DIFF_INSERT) {
            const nextText = diffs[diffIndex + 1][1];
            const nextLines = nextText.split('\n');
            if (nextLines.length > 0 && nextLines[0] !== '') {
              correspondingNewLine = nextLines[0];
            }
          }
          
          if (correspondingNewLine !== null) {
            // Line was modified, calculate character-level diff
            charDiffs = calculateCharDiff(oldLine, correspondingNewLine);
          }
          
          lines.push({
            type: 'delete',
            content: line,
            oldLineNumber: oldLineNum++,
            charDiffs,
          });
          oldLineIndex++;
        }
      } else if (operation === DIFF_INSERT) {
        if (!isLastLine || line !== '') {
          const newLine = newLines[newLineIndex] || '';
          // Check if previous operation was DELETE (line was modified, not inserted)
          let charDiffs: CharDiff[] | undefined;
          let correspondingOldLine: string | null = null;
          
          if (diffIndex > 0 && diffs[diffIndex - 1][0] === DIFF_DELETE) {
            // Get the corresponding old line from oldLines array
            // Since DELETE was processed before and oldLineIndex was incremented,
            // the corresponding old line is at oldLineIndex - 1
            if (oldLineIndex > 0) {
              correspondingOldLine = oldLines[oldLineIndex - 1] || '';
            }
            // If that doesn't work, try getting from the DELETE operation text
            if (!correspondingOldLine || correspondingOldLine === '') {
              const prevText = diffs[diffIndex - 1][1];
              const prevLines = prevText.split('\n').filter(l => l !== '');
              if (prevLines.length > 0) {
                // Use the last line from the DELETE operation
                correspondingOldLine = prevLines[prevLines.length - 1];
              }
            }
          }
          
          if (correspondingOldLine !== null && correspondingOldLine !== '') {
            // Line was modified, calculate character-level diff
            charDiffs = calculateCharDiff(correspondingOldLine, newLine);
          }
          
          lines.push({
            type: 'insert',
            content: line,
            newLineNumber: newLineNum++,
            charDiffs,
          });
          newLineIndex++;
        }
      } else {
        // DIFF_EQUAL
        if (!isLastLine || line !== '') {
          lines.push({
            type: 'equal',
            content: line,
            oldLineNumber: oldLineNum++,
            newLineNumber: newLineNum++,
          });
          oldLineIndex++;
          newLineIndex++;
        }
      }
    }
  }

  return {
    lines,
    oldText,
    newText,
  };
}

/**
 * Calculate side-by-side diff
 */
export function calculateSideBySideDiff(oldText: string, newText: string): {
  left: Array<{ lineNumber: number; content: string; type: 'equal' | 'delete' | 'empty'; charDiffs?: CharDiff[] }>;
  right: Array<{ lineNumber: number; content: string; type: 'equal' | 'insert' | 'empty'; charDiffs?: CharDiff[] }>;
} {
  // Use diff_linesToChars_ to calculate line-level diff (private method with underscore)
  const lineChars = (dmp as any).diff_linesToChars_(oldText, newText);
  const diffs = dmp.diff_main(lineChars.chars1, lineChars.chars2, false);
  (dmp as any).diff_charsToLines_(diffs, lineChars.lineArray);
  dmp.diff_cleanupSemantic(diffs);

  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const left: Array<{ lineNumber: number; content: string; type: 'equal' | 'delete' | 'empty'; charDiffs?: CharDiff[] }> = [];
  const right: Array<{ lineNumber: number; content: string; type: 'equal' | 'insert' | 'empty'; charDiffs?: CharDiff[] }> = [];
  
  let leftLineNum = 1;
  let rightLineNum = 1;
  let oldLineIndex = 0;
  let newLineIndex = 0;

  for (let diffIndex = 0; diffIndex < diffs.length; diffIndex++) {
    const [operation, text] = diffs[diffIndex];
    const textLines = text.split('\n');
    
    for (let i = 0; i < textLines.length; i++) {
      const line = textLines[i];
      const isLastLine = i === textLines.length - 1;
      
      if (operation === DIFF_DELETE) {
        if (!isLastLine || line !== '') {
          const oldLine = oldLines[oldLineIndex] || '';
          // Check if next operation is INSERT (line was modified, not deleted)
          let charDiffs: CharDiff[] | undefined;
          let correspondingNewLine: string | null = null;
          
          if (diffIndex + 1 < diffs.length && diffs[diffIndex + 1][0] === DIFF_INSERT) {
            const nextText = diffs[diffIndex + 1][1];
            const nextLines = nextText.split('\n');
            if (nextLines.length > 0 && nextLines[0] !== '') {
              correspondingNewLine = nextLines[0];
            }
          }
          
          if (correspondingNewLine !== null) {
            // Line was modified, calculate character-level diff
            charDiffs = calculateCharDiff(oldLine, correspondingNewLine);
          }
          
          left.push({
            lineNumber: leftLineNum++,
            content: line,
            type: 'delete',
            charDiffs,
          });
          right.push({
            lineNumber: rightLineNum,
            content: '',
            type: 'empty',
          });
          oldLineIndex++;
        }
      } else if (operation === DIFF_INSERT) {
        if (!isLastLine || line !== '') {
          const newLine = newLines[newLineIndex] || '';
          // Check if previous operation was DELETE (line was modified, not inserted)
          let charDiffs: CharDiff[] | undefined;
          let correspondingOldLine: string | null = null;
          
          if (diffIndex > 0 && diffs[diffIndex - 1][0] === DIFF_DELETE) {
            const prevText = diffs[diffIndex - 1][1];
            const prevLines = prevText.split('\n');
            if (prevLines.length > 0 && prevLines[prevLines.length - 1] !== '') {
              correspondingOldLine = prevLines[prevLines.length - 1];
            }
          }
          
          if (correspondingOldLine !== null) {
            // Line was modified, calculate character-level diff
            charDiffs = calculateCharDiff(correspondingOldLine, newLine);
          }
          
          left.push({
            lineNumber: leftLineNum,
            content: '',
            type: 'empty',
          });
          right.push({
            lineNumber: rightLineNum++,
            content: line,
            type: 'insert',
            charDiffs,
          });
          newLineIndex++;
        }
      } else {
        // DIFF_EQUAL
        if (!isLastLine || line !== '') {
          left.push({
            lineNumber: leftLineNum++,
            content: line,
            type: 'equal',
          });
          right.push({
            lineNumber: rightLineNum++,
            content: line,
            type: 'equal',
          });
          oldLineIndex++;
          newLineIndex++;
        }
      }
    }
  }

  return { left, right };
}

/**
 * Calculate inline diff (word-level)
 */
export function calculateInlineDiff(oldText: string, newText: string): DiffResult {
  // Use diff_linesToChars_ to calculate line-level diff (private method with underscore)
  const lineChars = (dmp as any).diff_linesToChars_(oldText, newText);
  const diffs = dmp.diff_main(lineChars.chars1, lineChars.chars2, false);
  (dmp as any).diff_charsToLines_(diffs, lineChars.lineArray);
  dmp.diff_cleanupSemantic(diffs);

  const lines: DiffLine[] = [];
  let oldLineNum = 1;
  let newLineNum = 1;

  for (const [operation, text] of diffs) {
    const textLines = text.split('\n');
    
    for (let i = 0; i < textLines.length; i++) {
      const line = textLines[i];
      const isLastLine = i === textLines.length - 1;
      
      if (operation === DIFF_DELETE) {
        if (!isLastLine || line !== '') {
          lines.push({
            type: 'delete',
            content: line,
            oldLineNumber: oldLineNum++,
          });
        }
      } else if (operation === DIFF_INSERT) {
        if (!isLastLine || line !== '') {
          lines.push({
            type: 'insert',
            content: line,
            newLineNumber: newLineNum++,
          });
        }
      } else {
        // DIFF_EQUAL
        if (!isLastLine || line !== '') {
          lines.push({
            type: 'equal',
            content: line,
            oldLineNumber: oldLineNum++,
            newLineNumber: newLineNum++,
          });
        }
      }
    }
  }

  return {
    lines,
    oldText,
    newText,
  };
}

