'use client';

import { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { calculateUnifiedDiff, calculateSideBySideDiff, DiffLine } from '@/lib/diff';
import { useI18n } from '@/hooks/useI18n';

type ViewMode = 'unified' | 'side-by-side' | 'inline';

interface DiffViewerProps {
  oldText: string;
  newText: string;
}

const DiffViewer = memo(function DiffViewer({ oldText, newText }: DiffViewerProps) {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<ViewMode>('unified');
  const [isCalculating, setIsCalculating] = useState(false);
  const [unifiedDiff, setUnifiedDiff] = useState<ReturnType<typeof calculateUnifiedDiff>>({ lines: [], oldText: '', newText: '' });
  const [sideBySideDiff, setSideBySideDiff] = useState<ReturnType<typeof calculateSideBySideDiff>>({ left: [], right: [] });

  // Calculate unified diff asynchronously
  useEffect(() => {
    setIsCalculating(true);
    // Use setTimeout to allow UI to update and show loading indicator
    const timer = setTimeout(() => {
      const result = calculateUnifiedDiff(oldText, newText);
      setUnifiedDiff(result);
      setIsCalculating(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [oldText, newText]);

  // Calculate side-by-side diff asynchronously when needed
  useEffect(() => {
    if (viewMode === 'side-by-side') {
      setIsCalculating(true);
      const timer = setTimeout(() => {
        const result = calculateSideBySideDiff(oldText, newText);
        setSideBySideDiff(result);
        setIsCalculating(false);
      }, 0);
      return () => clearTimeout(timer);
    } else {
      setSideBySideDiff({ left: [], right: [] });
    }
  }, [oldText, newText, viewMode]);

  const getLineClass = useCallback((type: DiffLine['type']) => {
    switch (type) {
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'insert':
        return 'bg-green-100 text-green-800';
      case 'equal':
        return 'bg-gray-50 text-gray-800';
      default:
        return '';
    }
  }, []);

  const getLinePrefix = useCallback((type: DiffLine['type']) => {
    switch (type) {
      case 'delete':
        return '-';
      case 'insert':
        return '+';
      case 'equal':
        return ' ';
      default:
        return '';
    }
  }, []);

  return (
    <div className="w-full">
      <div className="mb-4 flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setViewMode('unified')}
          className={`px-4 py-2 font-medium text-sm ${
            viewMode === 'unified'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t.diff.unified}
        </button>
        <button
          onClick={() => setViewMode('side-by-side')}
          className={`px-4 py-2 font-medium text-sm ${
            viewMode === 'side-by-side'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t.diff.sideBySide}
        </button>
        <button
          onClick={() => setViewMode('inline')}
          className={`px-4 py-2 font-medium text-sm ${
            viewMode === 'inline'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t.diff.inline}
        </button>
      </div>

      <div className="border border-gray-300 rounded-md overflow-hidden">
        {isCalculating ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">{t.common.loading}</p>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'unified' && (
          <div className="font-mono text-sm">
            {unifiedDiff.lines.map((line, index) => (
              <div
                key={`unified-${index}-${line.oldLineNumber || ''}-${line.newLineNumber || ''}`}
                className={`flex ${getLineClass(line.type)}`}
              >
                <span className="px-2 py-1 text-gray-500 select-none">
                  {getLinePrefix(line.type)}
                </span>
                <span className="px-2 py-1 flex-1 whitespace-pre-wrap">
                  {line.content}
                </span>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-2 font-mono text-sm">
            <div className="border-r border-gray-300">
              <div className="bg-gray-100 px-4 py-2 font-semibold text-sm border-b border-gray-300">
                {t.diff.old}
              </div>
              {sideBySideDiff.left.map((line, index) => (
                <div
                  key={`left-${index}-${line.lineNumber}`}
                  className={`px-2 py-1 ${
                    line.type === 'delete'
                      ? 'bg-red-100 text-red-800'
                      : line.type === 'empty'
                      ? 'bg-gray-50'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <span className="text-gray-500 select-none mr-2">
                    {line.lineNumber}
                  </span>
                  <span className="whitespace-pre-wrap">{line.content}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="bg-gray-100 px-4 py-2 font-semibold text-sm border-b border-gray-300">
                {t.diff.new}
              </div>
              {sideBySideDiff.right.map((line, index) => (
                <div
                  key={`right-${index}-${line.lineNumber}`}
                  className={`px-2 py-1 ${
                    line.type === 'insert'
                      ? 'bg-green-100 text-green-800'
                      : line.type === 'empty'
                      ? 'bg-gray-50'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <span className="text-gray-500 select-none mr-2">
                    {line.lineNumber}
                  </span>
                  <span className="whitespace-pre-wrap">{line.content}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'inline' && (
          <div className="font-mono text-sm">
            {unifiedDiff.lines.map((line, index) => (
              <div
                key={`inline-${index}-${line.oldLineNumber || ''}-${line.newLineNumber || ''}`}
                className={`flex ${getLineClass(line.type)}`}
              >
                <span className="px-2 py-1 text-gray-500 select-none">
                  {line.oldLineNumber || line.newLineNumber || ''}
                </span>
                <span className="px-2 py-1 text-gray-500 select-none">
                  {getLinePrefix(line.type)}
                </span>
                <span className="px-2 py-1 flex-1 whitespace-pre-wrap">
                  {line.content}
                </span>
              </div>
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
});

export default DiffViewer;

