import React from 'react';
import { Language, Translation } from '../types';
import { Bookmark } from 'lucide-react';

interface HeaderProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof Translation) => string;
    onHomeClick: () => void;
    onSavedClick: () => void;
}

const NEW_ICON_DATA_URL = "https://www.svgrepo.com/show/66017/sikh.svg"
const Header: React.FC<HeaderProps> = ({ language, setLanguage, t, onHomeClick, onSavedClick }) => {

    return (
        <header className="fixed top-0 left-0 right-0 p-4 z-20 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                 <button onClick={onHomeClick} className="flex items-center gap-3 text-slate-100" aria-label="Go to homepage">
                    <img src={NEW_ICON_DATA_URL} alt="Turbn Logo" className="w-10 h-10 rounded-full border-2 border-slate-600" />
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t('appName')}
                    </h1>
                </button>
                <div className="flex items-center gap-4">
                     <button onClick={onSavedClick} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-200 hover:bg-slate-600/70 transition-colors font-semibold" aria-label={t('savedLooks')}>
                        <Bookmark className="w-5 h-5" />
                        <span className="hidden sm:inline">{t('savedLooks')}</span>
                    </button>
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as Language)}
                            className="bg-slate-700/50 border border-slate-600 rounded-md py-2 pl-3 pr-8 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/80 focus:border-amber-500 appearance-none"
                            aria-label={t('language')}
                        >
                            <option value="en">English</option>
                            <option value="pa">ਪੰਜਾਬੀ</option>
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;