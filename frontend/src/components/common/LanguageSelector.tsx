import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export interface LanguageSelectorProps {
  variant?: 'header' | 'drawer';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  className = ''
}) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language?.startsWith('hi') ? 'hi' : 'en';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
    try {
      localStorage.setItem('ait_language', nextLang);
    } catch {}
  };

  if (variant === 'drawer') {
    return (
      <div className={`flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/70 text-xs ${className}`}>
        <span className="font-semibold text-slate-300 text-[11px] flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t('nav.language')}</span>
        </span>
        <button
          type="button"
          onClick={toggleLanguage}
          className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
          title={currentLang === 'en' ? t('nav.switchToHindi') : t('nav.switchToEnglish')}
        >
          <span className="text-amber-300 font-bold">{currentLang === 'en' ? t('nav.english') : t('nav.hindi')}</span>
          <span className="text-[10px] text-slate-400">({currentLang === 'en' ? t('nav.hindi') : 'EN'})</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`px-2.5 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-slate-200 hover:text-white border border-slate-700/80 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs group ${className}`}
      title={currentLang === 'en' ? t('nav.switchToHindi') : t('nav.switchToEnglish')}
      aria-label={currentLang === 'en' ? t('nav.switchToHindi') : t('nav.switchToEnglish')}
    >
      <Languages className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
      <span className="text-[11px] font-bold">
        {currentLang === 'en' ? 'EN' : 'हिं'}
      </span>
      <span className="text-[10px] text-slate-400 hidden sm:inline">
        {currentLang === 'en' ? t('nav.hindi') : t('nav.english')}
      </span>
    </button>
  );
};
