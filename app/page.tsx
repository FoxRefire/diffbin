'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextInput from '@/components/TextInput';
import DiffViewer from '@/components/DiffViewer';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { generateKey, encrypt, exportKey } from '@/lib/crypto';
import { useI18n } from '@/hooks/useI18n';

export default function Home() {
  const router = useRouter();
  const { t } = useI18n();
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!oldText || !newText) {
        setError(t.home.errorBothRequired);
        setLoading(false);
        return;
      }

      // Prepare data to encrypt
      const dataToEncrypt = JSON.stringify({
        oldText,
        newText,
      });

      // Generate encryption key
      const key = await generateKey();
      const { encrypted, iv } = await encrypt(dataToEncrypt, key);
      const keyBase64 = await exportKey(key);

      // Send to server
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encrypted_data: encrypted,
          iv: iv,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t.home.errorCreateFailed);
      }

      const { id } = await response.json();

      // Redirect to post page with key in URL fragment
      router.push(`/posts/${id}#${encodeURIComponent(keyBase64)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.home.errorOccurred);
      setLoading(false);
    }
  };

  const showDiff = oldText.length > 0 && newText.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.common.title}</h1>
            <p className="text-lg text-gray-600">
              {t.common.subtitle}
            </p>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.home.input}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <TextInput
                  label={t.home.oldText}
                  value={oldText}
                  onChange={setOldText}
                  placeholder={t.home.oldTextPlaceholder}
                  showUpload={true}
                />
                <TextInput
                  label={t.home.newText}
                  value={newText}
                  onChange={setNewText}
                  placeholder={t.home.newTextPlaceholder}
                  showUpload={true}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !showDiff}
                  className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? t.home.creating : t.home.createDiff}
                </button>
              </div>
            </form>
          </div>

          {/* Diff Preview */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.home.preview}</h2>
            {showDiff ? (
              <DiffViewer oldText={oldText} newText={newText} />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>{t.home.previewPlaceholder}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            {t.home.securityNote}
          </p>
        </div>
      </div>
    </div>
  );
}
