import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from './i18n/translations';

type LanguageContextType = {
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // 从localStorage获取初始语言，默认英文
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
      return savedLanguage;
    }
    
    // 浏览器语言检测
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'zh') return 'zh';
    
    return 'en';
  });

  // 切换语言并保存到localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // 翻译函数
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // 如果找不到翻译，返回原键
      }
    }
    
    return value;
  };

  // 设置文档语言
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 创建单独的useTranslation变量来解决热更新问题
const useTranslationHook = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

// 导出为常量而不是函数
export const useTranslation = useTranslationHook;