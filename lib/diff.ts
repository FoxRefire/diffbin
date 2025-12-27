// Diff calculation utilities using diff-match-patch

import DiffMatchPatch from 'diff-match-patch';

const dmp = new DiffMatchPatch();
const DIFF_DELETE = -1;
const DIFF_INSERT = 1;
const DIFF_EQUAL = 0;

export interface DiffLine {
  type: 'equal' | 'delete' | 'insert';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface DiffResult {
  lines: DiffLine[];
  oldText: string;
  newText: string;
}

/**
 * Calculate unified diff between two texts
 */
export function calculateUnifiedDiff(oldText: string, newText: string): DiffResult {
  const diffs = dmp.diff_main(oldText, newText);
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

/**
 * Calculate side-by-side diff
 */
export function calculateSideBySideDiff(oldText: string, newText: string): {
  left: Array<{ lineNumber: number; content: string; type: 'equal' | 'delete' | 'empty' }>;
  right: Array<{ lineNumber: number; content: string; type: 'equal' | 'insert' | 'empty' }>;
} {
  const diffs = dmp.diff_main(oldText, newText);
  dmp.diff_cleanupSemantic(diffs);

  const left: Array<{ lineNumber: number; content: string; type: 'equal' | 'delete' | 'empty' }> = [];
  const right: Array<{ lineNumber: number; content: string; type: 'equal' | 'insert' | 'empty' }> = [];
  
  let leftLineNum = 1;
  let rightLineNum = 1;

  for (const [operation, text] of diffs) {
    const textLines = text.split('\n');
    
    for (let i = 0; i < textLines.length; i++) {
      const line = textLines[i];
      const isLastLine = i === textLines.length - 1;
      
      if (operation === DIFF_DELETE) {
        if (!isLastLine || line !== '') {
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
        }
      } else if (operation === DIFF_INSERT) {
        if (!isLastLine || line !== '') {
          left.push({
            lineNumber: leftLineNum,
            content: '',
            type: 'empty',
          });
          right.push({
            lineNumber: rightLineNum++,
            content: line,
            type: 'insert',
          });
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
  const diffs = dmp.diff_main(oldText, newText);
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

