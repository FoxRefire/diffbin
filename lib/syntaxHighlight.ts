// Syntax highlighting utilities using Prism.js

import Prism from 'prismjs';
import { Language } from './detectLanguage';

// Language component mappings
const languageComponents: Record<Language, () => Promise<any>> = {
  javascript: () => import('prismjs/components/prism-javascript'),
  typescript: () => import('prismjs/components/prism-typescript'),
  jsx: () => import('prismjs/components/prism-jsx'),
  tsx: () => import('prismjs/components/prism-tsx'),
  python: () => import('prismjs/components/prism-python'),
  java: () => import('prismjs/components/prism-java'),
  cpp: () => import('prismjs/components/prism-cpp'),
  c: () => import('prismjs/components/prism-c'),
  csharp: () => import('prismjs/components/prism-csharp'),
  go: () => import('prismjs/components/prism-go'),
  rust: () => import('prismjs/components/prism-rust'),
  ruby: () => import('prismjs/components/prism-ruby'),
  php: () => import('prismjs/components/prism-php'),
  html: () => import('prismjs/components/prism-markup'),
  xml: () => import('prismjs/components/prism-markup'),
  css: () => import('prismjs/components/prism-css'),
  json: () => import('prismjs/components/prism-json'),
  yaml: () => import('prismjs/components/prism-yaml'),
  markdown: () => import('prismjs/components/prism-markdown'),
  bash: () => import('prismjs/components/prism-bash'),
  shell: () => import('prismjs/components/prism-bash'),
  sql: () => import('prismjs/components/prism-sql'),
  plaintext: async () => ({}),
};

// Load language component if needed
const loadedLanguages = new Set<string>();

export async function loadLanguage(language: Language): Promise<void> {
  if (language === 'plaintext' || loadedLanguages.has(language)) {
    return;
  }

  try {
    const loader = languageComponents[language];
    if (loader) {
      await loader();
      loadedLanguages.add(language);
    }
  } catch (error) {
    console.warn(`Failed to load language component for ${language}:`, error);
  }
}

/**
 * Highlight a line of code
 */
export function highlightLine(line: string, language: Language): string {
  if (language === 'plaintext' || !line.trim()) {
    return escapeHtml(line);
  }

  try {
    // Use Prism to highlight
    const grammar = Prism.languages[language];
    if (grammar) {
      const highlighted = Prism.highlight(line, grammar, language);
      return highlighted;
    }
    // Fallback to plaintext if language not loaded
    return escapeHtml(line);
  } catch (error) {
    console.warn(`Failed to highlight line for ${language}:`, error);
    return escapeHtml(line);
  }
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  if (typeof document === 'undefined') {
    // Server-side fallback
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

