
import React from 'react';
import { Language, Translation } from '../types';

interface HeaderProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof Translation) => string;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, t }) => {
    return (
        <header className="absolute top-0 left-0 right-0 p-4 z-20 bg-transparent">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                    {t('appName')}
                </h1>
                <div className="relative">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
