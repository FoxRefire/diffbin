'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DiffViewer from '@/components/DiffViewer';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { importKey, decrypt } from '@/lib/crypto';
import { useI18n } from '@/hooks/useI18n';

interface PostData {
  oldText: string;
  newText: string;
}

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const id = params.id as string;
  
  const [postData, setPostData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        // Get key from URL fragment
        const keyBase64 = window.location.hash.substring(1);
        if (!keyBase64) {
          setError(t.post.keyNotFound);
          setLoading(false);
          return;
        }

        // Fetch encrypted post
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || t.post.failedToLoad);
        }

        const { encrypted_data, iv } = await response.json();

        // Import key and decrypt
        const key = await importKey(decodeURIComponent(keyBase64));
        const decryptedData = await decrypt(encrypted_data, iv, key);
        const data = JSON.parse(decryptedData) as PostData;

        setPostData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.post.failedToLoad);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.post.loadingPost}</p>
        </div>
      </div>
    );
  }

  if (error || !postData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.common.error}</h2>
            <p className="text-gray-600 mb-6">{error || t.post.postNotFound}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
            >
              {t.common.goHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {t.common.backToHome}
            </button>
            <LanguageSwitcher />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t.post.diffView}</h1>
          <p className="text-gray-600 mt-2">{t.post.postId}: {id}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <DiffViewer oldText={postData.oldText} newText={postData.newText} />
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            {t.post.securityNote}
          </p>
        </div>
      </div>
    </div>
  );
}

