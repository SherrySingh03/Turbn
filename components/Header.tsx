import React from 'react';
import { Language, Translation } from '../types';
import BookmarkIcon from './icons/BookmarkIcon';

interface HeaderProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof Translation) => string;
    onHomeClick: () => void;
    onSavedClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, t, onHomeClick, onSavedClick }) => {

    return (
        <header className="fixed top-0 left-0 right-0 p-4 z-20 bg-white/20 backdrop-blur-2xl border-b border-white/20 shadow-sm">
            <div className="container mx-auto flex justify-between items-center">
                 <button onClick={onHomeClick} className="flex items-center gap-2 text-slate-800" aria-label="Go to homepage">
                    <svg className="w-8 h-8 text-teal-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M50 10C72.0914 10 90 27.9086 90 50C90 72.0914 72.0914 90 50 90" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 15"/>
                        <path d="M30 50H70" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                        <path d="M50 30V10" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                    </svg>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {t('appName')}
                    </h1>
                </button>
                <div className="flex items-center gap-4">
                     <button onClick={onSavedClick} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/20 text-slate-700 hover:bg-white/30 transition-colors font-semibold" aria-label={t('savedLooks')}>
                        <BookmarkIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">{t('savedLooks')}</span>
                    </button>
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as Language)}
                            className="bg-white/20 backdrop-blur-md border border-white/20 rounded-md py-2 pl-3 pr-8 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/80 focus:border-teal-500 appearance-none"
                            aria-label={t('language')}
                        >
                            <option value="en">English</option>
                            <option value="pa">ਪੰਜਾਬੀ</option>
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;