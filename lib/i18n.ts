// i18n configuration and translations

export type Locale = 'en' | 'ja' | 'es' | 'fr' | 'de' | 'zh-CN' | 'ko' | 'pt' | 'ru';

export const locales: Locale[] = ['en', 'ja', 'es', 'fr', 'de', 'zh-CN', 'ko', 'pt', 'ru'];
export const defaultLocale: Locale = 'en';

// Map browser language codes to our locale codes
const languageMap: Record<string, Locale> = {
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'en-AU': 'en',
  'en-CA': 'en',
  'ja': 'ja',
  'ja-JP': 'ja',
  'es': 'es',
  'es-ES': 'es',
  'es-MX': 'es',
  'es-AR': 'es',
  'es-CO': 'es',
  'es-CL': 'es',
  'fr': 'fr',
  'fr-FR': 'fr',
  'fr-CA': 'fr',
  'fr-BE': 'fr',
  'de': 'de',
  'de-DE': 'de',
  'de-AT': 'de',
  'de-CH': 'de',
  'zh': 'zh-CN',
  'zh-CN': 'zh-CN',
  'zh-Hans': 'zh-CN',
  'zh-Hans-CN': 'zh-CN',
  'ko': 'ko',
  'ko-KR': 'ko',
  'pt': 'pt',
  'pt-BR': 'pt',
  'pt-PT': 'pt',
  'ru': 'ru',
  'ru-RU': 'ru',
};

/**
 * Detect browser language and return matching locale
 */
export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }

  // Get browser languages
  const browserLanguages = navigator.languages || [navigator.language];

  // Try to find a match
  for (const browserLang of browserLanguages) {
    const normalizedLang = browserLang.toLowerCase();
    
    // Try exact match first (case-insensitive)
    if (languageMap[normalizedLang]) {
      return languageMap[normalizedLang];
    }

    // Try language code only (e.g., 'en-US' -> 'en')
    const langCode = normalizedLang.split('-')[0];
    if (languageMap[langCode]) {
      return languageMap[langCode];
    }
  }

  return defaultLocale;
}

export const translations = {
  en: {
    common: {
      title: 'Diffbin',
      subtitle: 'Share encrypted text diffs securely',
      loading: 'Loading...',
      error: 'Error',
      goHome: 'Go Home',
      backToHome: '← Back to Home',
    },
    home: {
      input: 'Input',
      preview: 'Preview',
      oldText: 'Old Text',
      newText: 'New Text',
      oldTextPlaceholder: 'Enter the old version of the text or upload a file...',
      newTextPlaceholder: 'Enter the new version of the text or upload a file...',
      upload: 'Upload',
      createDiff: 'Create Diff',
      creating: 'Creating...',
      previewPlaceholder: 'Enter both old and new text to see the diff preview',
      errorBothRequired: 'Please enter both old and new text',
      errorCreateFailed: 'Failed to create post',
      errorOccurred: 'An error occurred',
      securityNote: 'Your data is encrypted client-side before being sent to the server. Only you have the decryption key.',
    },
    post: {
      diffView: 'Diff View',
      postId: 'Post ID',
      loadingPost: 'Loading post...',
      postNotFound: 'Post not found',
      keyNotFound: 'Decryption key not found in URL',
      failedToLoad: 'Failed to load post',
      securityNote: 'This post is encrypted. The decryption key is in the URL fragment. Keep this URL private.',
    },
    diff: {
      unified: 'Unified',
      sideBySide: 'Side-by-Side',
      inline: 'Inline',
      old: 'Old',
      new: 'New',
    },
  },
  ja: {
    common: {
      title: 'Diffbin',
      subtitle: '暗号化されたテキスト差分を安全に共有',
      loading: '読み込み中...',
      error: 'エラー',
      goHome: 'ホームに戻る',
      backToHome: '← ホームに戻る',
    },
    home: {
      input: '入力',
      preview: 'プレビュー',
      oldText: '古いテキスト',
      newText: '新しいテキスト',
      oldTextPlaceholder: '古いバージョンのテキストを入力するか、ファイルをアップロード...',
      newTextPlaceholder: '新しいバージョンのテキストを入力するか、ファイルをアップロード...',
      upload: 'アップロード',
      createDiff: '差分を作成',
      creating: '作成中...',
      previewPlaceholder: '古いテキストと新しいテキストの両方を入力すると、差分プレビューが表示されます',
      errorBothRequired: '古いテキストと新しいテキストの両方を入力してください',
      errorCreateFailed: '投稿の作成に失敗しました',
      errorOccurred: 'エラーが発生しました',
      securityNote: 'データはサーバーに送信される前にクライアントサイドで暗号化されます。復号化キーはあなただけが持っています。',
    },
    post: {
      diffView: '差分表示',
      postId: '投稿ID',
      loadingPost: '投稿を読み込み中...',
      postNotFound: '投稿が見つかりません',
      keyNotFound: 'URLに復号化キーが見つかりません',
      failedToLoad: '投稿の読み込みに失敗しました',
      securityNote: 'この投稿は暗号化されています。復号化キーはURLフラグメントに含まれています。このURLは非公開にしてください。',
    },
    diff: {
      unified: '統一形式',
      sideBySide: '左右比較',
      inline: 'インライン',
      old: '古い',
      new: '新しい',
    },
  },
  es: {
    common: {
      title: 'Diffbin',
      subtitle: 'Comparte diferencias de texto encriptadas de forma segura',
      loading: 'Cargando...',
      error: 'Error',
      goHome: 'Ir al Inicio',
      backToHome: '← Volver al Inicio',
    },
    home: {
      input: 'Entrada',
      preview: 'Vista Previa',
      oldText: 'Texto Antiguo',
      newText: 'Texto Nuevo',
      oldTextPlaceholder: 'Ingresa la versión antigua del texto o sube un archivo...',
      newTextPlaceholder: 'Ingresa la versión nueva del texto o sube un archivo...',
      upload: 'Subir',
      createDiff: 'Crear Diferencia',
      creating: 'Creando...',
      previewPlaceholder: 'Ingresa tanto el texto antiguo como el nuevo para ver la vista previa de la diferencia',
      errorBothRequired: 'Por favor ingresa tanto el texto antiguo como el nuevo',
      errorCreateFailed: 'Error al crear la publicación',
      errorOccurred: 'Ocurrió un error',
      securityNote: 'Tus datos se encriptan en el cliente antes de ser enviados al servidor. Solo tú tienes la clave de desencriptación.',
    },
    post: {
      diffView: 'Vista de Diferencia',
      postId: 'ID de Publicación',
      loadingPost: 'Cargando publicación...',
      postNotFound: 'Publicación no encontrada',
      keyNotFound: 'Clave de desencriptación no encontrada en la URL',
      failedToLoad: 'Error al cargar la publicación',
      securityNote: 'Esta publicación está encriptada. La clave de desencriptación está en el fragmento de la URL. Mantén esta URL privada.',
    },
    diff: {
      unified: 'Unificado',
      sideBySide: 'Lado a Lado',
      inline: 'En Línea',
      old: 'Antiguo',
      new: 'Nuevo',
    },
  },
  fr: {
    common: {
      title: 'Diffbin',
      subtitle: 'Partagez des différences de texte cryptées en toute sécurité',
      loading: 'Chargement...',
      error: 'Erreur',
      goHome: 'Retour à l\'Accueil',
      backToHome: '← Retour à l\'Accueil',
    },
    home: {
      input: 'Saisie',
      preview: 'Aperçu',
      oldText: 'Ancien Texte',
      newText: 'Nouveau Texte',
      oldTextPlaceholder: 'Entrez l\'ancienne version du texte ou téléversez un fichier...',
      newTextPlaceholder: 'Entrez la nouvelle version du texte ou téléversez un fichier...',
      upload: 'Téléverser',
      createDiff: 'Créer la Différence',
      creating: 'Création...',
      previewPlaceholder: 'Entrez à la fois l\'ancien et le nouveau texte pour voir l\'aperçu de la différence',
      errorBothRequired: 'Veuillez entrer à la fois l\'ancien et le nouveau texte',
      errorCreateFailed: 'Échec de la création de la publication',
      errorOccurred: 'Une erreur s\'est produite',
      securityNote: 'Vos données sont cryptées côté client avant d\'être envoyées au serveur. Vous seul avez la clé de décryptage.',
    },
    post: {
      diffView: 'Vue de Différence',
      postId: 'ID de Publication',
      loadingPost: 'Chargement de la publication...',
      postNotFound: 'Publication introuvable',
      keyNotFound: 'Clé de décryptage introuvable dans l\'URL',
      failedToLoad: 'Échec du chargement de la publication',
      securityNote: 'Cette publication est cryptée. La clé de décryptage se trouve dans le fragment de l\'URL. Gardez cette URL privée.',
    },
    diff: {
      unified: 'Unifié',
      sideBySide: 'Côte à Côte',
      inline: 'En Ligne',
      old: 'Ancien',
      new: 'Nouveau',
    },
  },
  de: {
    common: {
      title: 'Diffbin',
      subtitle: 'Teile verschlüsselte Textunterschiede sicher',
      loading: 'Lädt...',
      error: 'Fehler',
      goHome: 'Zur Startseite',
      backToHome: '← Zur Startseite',
    },
    home: {
      input: 'Eingabe',
      preview: 'Vorschau',
      oldText: 'Alter Text',
      newText: 'Neuer Text',
      oldTextPlaceholder: 'Geben Sie die alte Version des Textes ein oder laden Sie eine Datei hoch...',
      newTextPlaceholder: 'Geben Sie die neue Version des Textes ein oder laden Sie eine Datei hoch...',
      upload: 'Hochladen',
      createDiff: 'Unterschied Erstellen',
      creating: 'Erstelle...',
      previewPlaceholder: 'Geben Sie sowohl den alten als auch den neuen Text ein, um die Unterschiedsvorschau zu sehen',
      errorBothRequired: 'Bitte geben Sie sowohl den alten als auch den neuen Text ein',
      errorCreateFailed: 'Fehler beim Erstellen des Beitrags',
      errorOccurred: 'Ein Fehler ist aufgetreten',
      securityNote: 'Ihre Daten werden clientseitig verschlüsselt, bevor sie an den Server gesendet werden. Nur Sie haben den Entschlüsselungsschlüssel.',
    },
    post: {
      diffView: 'Unterschiedsansicht',
      postId: 'Beitrags-ID',
      loadingPost: 'Lade Beitrag...',
      postNotFound: 'Beitrag nicht gefunden',
      keyNotFound: 'Entschlüsselungsschlüssel nicht in der URL gefunden',
      failedToLoad: 'Fehler beim Laden des Beitrags',
      securityNote: 'Dieser Beitrag ist verschlüsselt. Der Entschlüsselungsschlüssel befindet sich im URL-Fragment. Halten Sie diese URL privat.',
    },
    diff: {
      unified: 'Vereinheitlicht',
      sideBySide: 'Nebeneinander',
      inline: 'Inline',
      old: 'Alt',
      new: 'Neu',
    },
  },
  'zh-CN': {
    common: {
      title: 'Diffbin',
      subtitle: '安全地分享加密的文本差异',
      loading: '加载中...',
      error: '错误',
      goHome: '返回首页',
      backToHome: '← 返回首页',
    },
    home: {
      input: '输入',
      preview: '预览',
      oldText: '旧文本',
      newText: '新文本',
      oldTextPlaceholder: '输入旧版本的文本或上传文件...',
      newTextPlaceholder: '输入新版本的文本或上传文件...',
      upload: '上传',
      createDiff: '创建差异',
      creating: '创建中...',
      previewPlaceholder: '输入旧文本和新文本以查看差异预览',
      errorBothRequired: '请输入旧文本和新文本',
      errorCreateFailed: '创建帖子失败',
      errorOccurred: '发生错误',
      securityNote: '您的数据在发送到服务器之前会在客户端加密。只有您拥有解密密钥。',
    },
    post: {
      diffView: '差异视图',
      postId: '帖子ID',
      loadingPost: '加载帖子中...',
      postNotFound: '未找到帖子',
      keyNotFound: '在URL中未找到解密密钥',
      failedToLoad: '加载帖子失败',
      securityNote: '此帖子已加密。解密密钥位于URL片段中。请保持此URL私密。',
    },
    diff: {
      unified: '统一',
      sideBySide: '并排',
      inline: '内联',
      old: '旧',
      new: '新',
    },
  },
  ko: {
    common: {
      title: 'Diffbin',
      subtitle: '암호화된 텍스트 차이를 안전하게 공유',
      loading: '로딩 중...',
      error: '오류',
      goHome: '홈으로',
      backToHome: '← 홈으로',
    },
    home: {
      input: '입력',
      preview: '미리보기',
      oldText: '이전 텍스트',
      newText: '새 텍스트',
      oldTextPlaceholder: '이전 버전의 텍스트를 입력하거나 파일을 업로드하세요...',
      newTextPlaceholder: '새 버전의 텍스트를 입력하거나 파일을 업로드하세요...',
      upload: '업로드',
      createDiff: '차이 생성',
      creating: '생성 중...',
      previewPlaceholder: '이전 텍스트와 새 텍스트를 모두 입력하면 차이 미리보기가 표시됩니다',
      errorBothRequired: '이전 텍스트와 새 텍스트를 모두 입력해주세요',
      errorCreateFailed: '게시물 생성 실패',
      errorOccurred: '오류가 발생했습니다',
      securityNote: '데이터는 서버로 전송되기 전에 클라이언트 측에서 암호화됩니다. 복호화 키는 귀하만 가지고 있습니다.',
    },
    post: {
      diffView: '차이 보기',
      postId: '게시물 ID',
      loadingPost: '게시물 로딩 중...',
      postNotFound: '게시물을 찾을 수 없습니다',
      keyNotFound: 'URL에서 복호화 키를 찾을 수 없습니다',
      failedToLoad: '게시물 로드 실패',
      securityNote: '이 게시물은 암호화되어 있습니다. 복호화 키는 URL 조각에 있습니다. 이 URL을 비공개로 유지하세요.',
    },
    diff: {
      unified: '통합',
      sideBySide: '나란히',
      inline: '인라인',
      old: '이전',
      new: '새',
    },
  },
  pt: {
    common: {
      title: 'Diffbin',
      subtitle: 'Compartilhe diferenças de texto criptografadas com segurança',
      loading: 'Carregando...',
      error: 'Erro',
      goHome: 'Ir para Início',
      backToHome: '← Voltar para Início',
    },
    home: {
      input: 'Entrada',
      preview: 'Visualização',
      oldText: 'Texto Antigo',
      newText: 'Texto Novo',
      oldTextPlaceholder: 'Digite a versão antiga do texto ou faça upload de um arquivo...',
      newTextPlaceholder: 'Digite a versão nova do texto ou faça upload de um arquivo...',
      upload: 'Enviar',
      createDiff: 'Criar Diferença',
      creating: 'Criando...',
      previewPlaceholder: 'Digite tanto o texto antigo quanto o novo para ver a visualização da diferença',
      errorBothRequired: 'Por favor, digite tanto o texto antigo quanto o novo',
      errorCreateFailed: 'Falha ao criar postagem',
      errorOccurred: 'Ocorreu um erro',
      securityNote: 'Seus dados são criptografados no lado do cliente antes de serem enviados ao servidor. Apenas você tem a chave de descriptografia.',
    },
    post: {
      diffView: 'Visualização de Diferença',
      postId: 'ID da Postagem',
      loadingPost: 'Carregando postagem...',
      postNotFound: 'Postagem não encontrada',
      keyNotFound: 'Chave de descriptografia não encontrada na URL',
      failedToLoad: 'Falha ao carregar postagem',
      securityNote: 'Esta postagem está criptografada. A chave de descriptografia está no fragmento da URL. Mantenha esta URL privada.',
    },
    diff: {
      unified: 'Unificado',
      sideBySide: 'Lado a Lado',
      inline: 'Em Linha',
      old: 'Antigo',
      new: 'Novo',
    },
  },
  ru: {
    common: {
      title: 'Diffbin',
      subtitle: 'Безопасно делитесь зашифрованными различиями текста',
      loading: 'Загрузка...',
      error: 'Ошибка',
      goHome: 'На главную',
      backToHome: '← На главную',
    },
    home: {
      input: 'Ввод',
      preview: 'Предпросмотр',
      oldText: 'Старый текст',
      newText: 'Новый текст',
      oldTextPlaceholder: 'Введите старую версию текста или загрузите файл...',
      newTextPlaceholder: 'Введите новую версию текста или загрузите файл...',
      upload: 'Загрузить',
      createDiff: 'Создать Различия',
      creating: 'Создание...',
      previewPlaceholder: 'Введите как старый, так и новый текст, чтобы увидеть предпросмотр различий',
      errorBothRequired: 'Пожалуйста, введите как старый, так и новый текст',
      errorCreateFailed: 'Не удалось создать запись',
      errorOccurred: 'Произошла ошибка',
      securityNote: 'Ваши данные шифруются на стороне клиента перед отправкой на сервер. Только у вас есть ключ расшифровки.',
    },
    post: {
      diffView: 'Просмотр Различий',
      postId: 'ID Записи',
      loadingPost: 'Загрузка записи...',
      postNotFound: 'Запись не найдена',
      keyNotFound: 'Ключ расшифровки не найден в URL',
      failedToLoad: 'Не удалось загрузить запись',
      securityNote: 'Эта запись зашифрована. Ключ расшифровки находится во фрагменте URL. Держите этот URL в секрете.',
    },
    diff: {
      unified: 'Унифицированный',
      sideBySide: 'Рядом',
      inline: 'Встроенный',
      old: 'Старый',
      new: 'Новый',
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslations(locale: Locale) {
  return translations[locale];
}

