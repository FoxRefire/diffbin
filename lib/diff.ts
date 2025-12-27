// Diff calculation utilities using diff-match-patch

import DiffMatchPatch from 'diff-match-patch';

const dmp = new DiffMatchPatch();
// Set timeout for large texts to prevent UI freezing
dmp.Diff_Timeout = 0.2;

const DIFF_DELETE = -1;
const DIFF_INSERT = 1;
const DIFF_EQUAL = 0;

/**
 * Convert lines to characters for line-level diff calculation
 * This is a replacement for the private API diff_linesToChars_
 */
function linesToChars(text1: string, text2: string): {
  chars1: string;
  chars2: string;
  lineArray: string[];
} {
  const lineArray: string[] = [];
  const lineHash: Map<string, number> = new Map();
  lineArray[0] = ''; // Index 0 is reserved for empty string

  function getLineHash(line: string): number {
    if (lineHash.has(line)) {
      return lineHash.get(line)!;
    }
    const lineNum = lineArray.length;
    lineArray.push(line);
    lineHash.set(line, lineNum);
    return lineNum;
  }

  let chars1 = '';
  const lines1 = text1.split('\n');
  for (const line of lines1) {
    chars1 += String.fromCharCode(getLineHash(line));
  }

  let chars2 = '';
  const lines2 = text2.split('\n');
  for (const line of lines2) {
    chars2 += String.fromCharCode(getLineHash(line));
  }

  return { chars1, chars2, lineArray };
}

/**
 * Convert character diff results back to line diff
 * This is a replacement for the private API diff_charsToLines_
 */
function charsToLines(
  diffs: Array<[number, string]>,
  lineArray: string[]
): void {
  for (let i = 0; i < diffs.length; i++) {
    const [operation, text] = diffs[i];
    let lineText = '';
    for (let j = 0; j < text.length; j++) {
      const charCode = text.charCodeAt(j);
      if (charCode < lineArray.length) {
        lineText += lineArray[charCode];
        if (j < text.length - 1) {
          lineText += '\n';
        }
      }
    }
    diffs[i] = [operation, lineText];
  }
}

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
  // Use custom linesToChars instead of private API
  const lineChars = linesToChars(oldText, newText);
  const diffs = dmp.diff_main(lineChars.chars1, lineChars.chars2, false);
  charsToLines(diffs, lineChars.lineArray);
  dmp.diff_cleanupSemantic(diffs);

  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const lines: DiffLine[] = [];
  let oldLineNum = 1;
  let newLineNum = 1;
  let oldLineIndex = 0;
  let newLineIndex = 0;

  // Buffer to store pending deleted lines for proper matching
  let pendingDeletedLines: string[] = [];

  for (let diffIndex = 0; diffIndex < diffs.length; diffIndex++) {
    const [operation, text] = diffs[diffIndex];
    const textLines = text.split('\n');
    
    if (operation === DIFF_DELETE) {
      // Store deleted lines in buffer
      const deleteLines = textLines.filter((line, i) => i < textLines.length - 1 || line !== '');
      pendingDeletedLines.push(...deleteLines);
      
      // Process each deleted line
      for (const line of deleteLines) {
        const oldLine = oldLines[oldLineIndex] || '';
        lines.push({
          type: 'delete',
          content: line,
          oldLineNumber: oldLineNum++,
        });
        oldLineIndex++;
      }
    } else if (operation === DIFF_INSERT) {
      const insertLines = textLines.filter((line, i) => i < textLines.length - 1 || line !== '');
      
      // Process each inserted line
      for (let i = 0; i < insertLines.length; i++) {
        const newLine = newLines[newLineIndex] || '';
        let charDiffs: CharDiff[] | undefined;
        
        // Only calculate char diff if:
        // 1. There's a pending deleted line
        // 2. Both are single lines (1 DELETE : 1 INSERT)
        if (pendingDeletedLines.length === 1 && insertLines.length === 1) {
          const deletedLine = pendingDeletedLines[0];
          charDiffs = calculateCharDiff(deletedLine, newLine);
        }
        
        lines.push({
          type: 'insert',
          content: insertLines[i],
          newLineNumber: newLineNum++,
          charDiffs,
        });
        newLineIndex++;
      }
      
      // Clear buffer after processing INSERT
      pendingDeletedLines = [];
    } else {
      // DIFF_EQUAL - clear any pending deleted lines
      pendingDeletedLines = [];
      
      const equalLines = textLines.filter((line, i) => i < textLines.length - 1 || line !== '');
      for (const line of equalLines) {
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
  // Use custom linesToChars instead of private API
  const lineChars = linesToChars(oldText, newText);
  const diffs = dmp.diff_main(lineChars.chars1, lineChars.chars2, false);
  charsToLines(diffs, lineChars.lineArray);
  dmp.diff_cleanupSemantic(diffs);

  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const left: Array<{ lineNumber: number; content: string; type: 'equal' | 'delete' | 'empty'; charDiffs?: CharDiff[] }> = [];
  const right: Array<{ lineNumber: number; content: string; type: 'equal' | 'insert' | 'empty'; charDiffs?: CharDiff[] }> = [];
  
  let leftLineNum = 1;
  let rightLineNum = 1;
  let oldLineIndex = 0;
  let newLineIndex = 0;

  // Buffer to store pending deleted lines for proper matching
  let pendingDeletedLines: string[] = [];

  for (let diffIndex = 0; diffIndex < diffs.length; diffIndex++) {
    const [operation, text] = diffs[diffIndex];
    const textLines = text.split('\n');
    
    if (operation === DIFF_DELETE) {
      const deleteLines = textLines.filter((line, i) => i < textLines.length - 1 || line !== '');
      pendingDeletedLines.push(...deleteLines);
      
      for (const line of deleteLines) {
        left.push({
          lineNumber: leftLineNum++,
          content: line,
          type: 'delete',
        });
        right.push({
          lineNumber: rightLineNum,
          content: '',
          type: 'empty',
        });
        oldLineIndex++;
      }
    } else if (operation === DIFF_INSERT) {
      const insertLines = textLines.filter((line, i) => i < textLines.length - 1 || line !== '');
      
      for (let i = 0; i < insertLines.length; i++) {
        const newLine = newLines[newLineIndex] || '';
        let charDiffs: CharDiff[] | undefined;
        
        // Only calculate char diff if:
        // 1. There's a pending deleted line
        // 2. Both are single lines (1 DELETE : 1 INSERT)
        if (pendingDeletedLines.length === 1 && insertLines.length === 1) {
          const deletedLine = pendingDeletedLines[0];
          charDiffs = calculateCharDiff(deletedLine, newLine);
        }
        
        left.push({
          lineNumber: leftLineNum,
          content: '',
          type: 'empty',
        });
        right.push({
          lineNumber: rightLineNum++,
          content: insertLines[i],
          type: 'insert',
          charDiffs,
        });
        newLineIndex++;
      }
      
      pendingDeletedLines = [];
    } else {
      // DIFF_EQUAL - clear any pending deleted lines
      pendingDeletedLines = [];
      
      const equalLines = textLines.filter((line, i) => i < textLines.length - 1 || line !== '');
      for (const line of equalLines) {
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

  return { left, right };
}

/**
 * Calculate inline diff (GitHub-style: shows changes within lines)
 * Modified lines are shown as a single line with char-level diffs
 */
export function calculateInlineDiff(oldText: string, newText: string): DiffResult {
  // Use custom linesToChars instead of private API
  const lineChars = linesToChars(oldText, newText);
  const diffs = dmp.diff_main(lineChars.chars1, lineChars.chars2, false);
  charsToLines(diffs, lineChars.lineArray);
  dmp.diff_cleanupSemantic(diffs);

  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const lines: DiffLine[] = [];
  let oldLineNum = 1;
  let newLineNum = 1;
  let oldLineIndex = 0;
  let newLineIndex = 0;

  // Buffer to store pending deleted lines for proper matching
  let pendingDeletedLines: string[] = [];

  for (let diffIndex = 0; diffIndex < diffs.length; diffIndex++) {
    const [operation, text] = diffs[diffIndex];
    const textLines = text.split('\n');
    
    if (operation === DIFF_DELETE) {
      const deleteLines = textLines.filter((line, i) => i < textLines.length - 1 || line !== '');
      pendingDeletedLines.push(...deleteLines);
      oldLineIndex += deleteLines.length;
    } else if (operation === DIFF_INSERT) {
      const insertLines = textLines.filter((line, i) => i < textLines.length - 1 || line !== '');
      
      // If we have matching DELETE and INSERT (both single lines), combine them into one line
      if (pendingDeletedLines.length === 1 && insertLines.length === 1) {
        const deletedLine = pendingDeletedLines[0];
        const insertedLine = insertLines[0];
        const charDiffs = calculateCharDiff(deletedLine, insertedLine);
        
        // Show as a single modified line (use new line content with char diffs)
        lines.push({
          type: 'equal', // Treat as equal line but with char diffs
          content: insertedLine,
          oldLineNumber: oldLineNum++,
          newLineNumber: newLineNum++,
          charDiffs,
        });
        newLineIndex++;
      } else {
        // No match - show as separate DELETE and INSERT
        for (const deletedLine of pendingDeletedLines) {
          lines.push({
            type: 'delete',
            content: deletedLine,
            oldLineNumber: oldLineNum++,
          });
        }
        
        for (const insertedLine of insertLines) {
          lines.push({
            type: 'insert',
            content: insertedLine,
            newLineNumber: newLineNum++,
          });
          newLineIndex++;
        }
      }
      
      pendingDeletedLines = [];
    } else {
      // DIFF_EQUAL
      pendingDeletedLines = [];
      
      const equalLines = textLines.filter((line, i) => i < textLines.length - 1 || line !== '');
      for (const line of equalLines) {
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

  // Handle any remaining pending deleted lines
  for (const deletedLine of pendingDeletedLines) {
    lines.push({
      type: 'delete',
      content: deletedLine,
      oldLineNumber: oldLineNum++,
    });
  }

  return {
    lines,
    oldText,
    newText,
  };
}

