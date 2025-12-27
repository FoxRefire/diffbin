// Language detection utilities

export type Language =
  | 'javascript'
  | 'typescript'
  | 'jsx'
  | 'tsx'
  | 'python'
  | 'java'
  | 'cpp'
  | 'c'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'ruby'
  | 'php'
  | 'html'
  | 'xml'
  | 'css'
  | 'json'
  | 'yaml'
  | 'markdown'
  | 'bash'
  | 'shell'
  | 'sql'
  | 'plaintext';

const extensionMap: Record<string, Language> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  py: 'python',
  java: 'java',
  cpp: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  c: 'c',
  h: 'c',
  hpp: 'cpp',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  rb: 'ruby',
  php: 'php',
  html: 'html',
  htm: 'html',
  xml: 'xml',
  css: 'css',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  sh: 'bash',
  bash: 'bash',
  sql: 'sql',
};

/**
 * Detect language from filename
 */
export function detectLanguageFromFilename(filename: string): Language {
  const extension = filename.split('.').pop()?.toLowerCase();
  if (extension && extensionMap[extension]) {
    return extensionMap[extension];
  }
  return 'plaintext';
}

/**
 * Detect language from content (simple heuristics)
 */
export function detectLanguageFromContent(content: string): Language {
  const firstLines = content.split('\n').slice(0, 10).join('\n').toLowerCase();

  // Check for shebang
  if (content.startsWith('#!/')) {
    if (firstLines.includes('python')) return 'python';
    if (firstLines.includes('bash') || firstLines.includes('sh')) return 'bash';
    if (firstLines.includes('node')) return 'javascript';
  }

  // Check for specific patterns
  if (firstLines.includes('<!doctype') || firstLines.includes('<html')) return 'html';
  if (firstLines.includes('<?xml')) return 'xml';
  if (firstLines.includes('import react') || firstLines.includes('from react')) return 'jsx';
  if (firstLines.includes('import ') && firstLines.includes('.tsx')) return 'tsx';
  if (firstLines.includes('function ') && firstLines.includes('=>')) return 'javascript';
  if (firstLines.includes('interface ') || firstLines.includes('type ') && firstLines.includes(':')) return 'typescript';
  if (firstLines.includes('def ') || firstLines.includes('import ') && firstLines.includes('print(')) return 'python';
  if (firstLines.includes('public class') || firstLines.includes('public static')) return 'java';
  if (firstLines.includes('#include') || firstLines.includes('using namespace')) return 'cpp';
  if (firstLines.includes('package ') && firstLines.includes('func ')) return 'go';
  if (firstLines.includes('fn ') && firstLines.includes('let ')) return 'rust';
  if (firstLines.includes('<?php')) return 'php';
  if (firstLines.includes('{') && firstLines.includes('"') && firstLines.includes(':')) return 'json';
  if (firstLines.includes('---') || firstLines.includes('yaml')) return 'yaml';
  if (firstLines.includes('# ') || firstLines.includes('## ')) return 'markdown';

  return 'plaintext';
}

