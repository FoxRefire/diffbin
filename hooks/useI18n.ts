'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Locale, defaultLocale, getTranslations, locales, detectBrowserLocale } from '@/lib/i18n';

const COOKIE_NAME = 'NEXT_LOCALE';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export function useI18n() {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Get locale from cookie first
    const savedLocale = Cookies.get(COOKIE_NAME) as Locale | undefined;
    
    if (savedLocale && locales.includes(savedLocale)) {
      // Use saved locale from cookie
      setLocaleState(savedLocale);
    } else {
      // Detect browser language if no cookie is set
      const browserLocale = detectBrowserLocale();
      setLocaleState(browserLocale);
      // Save detected locale to cookie
      Cookies.set(COOKIE_NAME, browserLocale, { expires: COOKIE_MAX_AGE });
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    Cookies.set(COOKIE_NAME, newLocale, { expires: COOKIE_MAX_AGE });
  };

  const t = getTranslations(locale);

  return {
    locale,
    setLocale,
    t,
  };
}

