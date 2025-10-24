import React from 'react';
import { Language, Translation } from '../types';

interface HeaderProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof Translation) => string;
    onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, t, onHomeClick }) => {

    return (
        <header className="absolute top-0 left-0 right-0 p-4 z-20 bg-transparent">
            <div className="container mx-auto flex justify-between items-center">
                 <button onClick={onHomeClick} className="flex items-center gap-2 text-gray-800" aria-label="Go to homepage">
                    <svg className="w-8 h-8 text-teal-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M50 10C72.0914 10 90 27.9086 90 50C90 72.0914 72.0914 90 50 90" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 15"/>
                        <path d="M30 50H70" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                        <path d="M50 30V10" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                    </svg>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {t('appName')}
                    </h1>
                </button>
                <div className="relative">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        aria-label={t('language')}
                    >
                        <option value="en">English</option>
                        <option value="pa">ਪੰਜਾਬੀ</option>
                    </select>
                </div>
            </div>
        </header>
    );
};

export default Header;