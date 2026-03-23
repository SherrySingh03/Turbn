import React, { useState } from 'react';
import { Menu, ChevronLeft, X } from 'lucide-react';
import type { Language, Translation } from '../../types';

const LOGO_URL = 'https://www.svgrepo.com/show/66017/sikh.svg';

interface AppTopBarProps {
    title?: string;
    showBack: boolean;
    onBack?: () => void;
    /** Center title opens welcome / home when set */
    onTitleClick?: () => void;
    language: Language;
    setLanguage: (l: Language) => void;
    t: (key: keyof Translation) => string;
}

const AppTopBar: React.FC<AppTopBarProps> = ({
    title = 'Turbn',
    showBack,
    onBack,
    onTitleClick,
    language,
    setLanguage,
    t,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-40 glass-panel border-b border-outline-variant/10 px-4 py-3 flex items-center justify-between safe-area-pt">
                <div className="flex items-center gap-2 min-w-[2.5rem]">
                    {showBack ? (
                        <button
                            type="button"
                            onClick={onBack}
                            className="p-2 rounded-full text-on-surface hover:bg-surface-container/80 transition-colors"
                            aria-label={t('back')}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    ) : (
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/15 ghost-border">
                            <img src={LOGO_URL} alt="" className="w-full h-full object-cover opacity-90" />
                        </div>
                    )}
                </div>
                {onTitleClick ? (
                    <button
                        type="button"
                        onClick={onTitleClick}
                        className="font-display text-xl tracking-tight text-primary hover:opacity-90 transition-opacity"
                    >
                        {title}
                    </button>
                ) : (
                    <h1 className="font-display text-xl tracking-tight text-primary">{title}</h1>
                )}
                <button
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    className="p-2 rounded-full text-on-surface hover:bg-surface-container/80 transition-colors"
                    aria-label="Menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            {menuOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-surface-lowest/60 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="absolute inset-0"
                        onClick={() => setMenuOpen(false)}
                        aria-hidden
                    />
                    <div className="relative w-full max-w-sm rounded-2xl glass-panel p-6 shadow-ambient border border-outline-variant/15">
                        <div className="flex justify-between items-center mb-4">
                            <span className="label-caps text-on-surface-muted">{t('language')}</span>
                            <button
                                type="button"
                                onClick={() => setMenuOpen(false)}
                                className="p-1 rounded-lg text-on-surface-muted hover:text-on-surface"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setLanguage('en');
                                    setMenuOpen(false);
                                }}
                                className={`w-full py-3 rounded-xl text-left px-4 font-medium transition-colors ${
                                    language === 'en'
                                        ? 'bg-secondary-container text-on-secondary-container'
                                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                                }`}
                            >
                                English
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setLanguage('pa');
                                    setMenuOpen(false);
                                }}
                                className={`w-full py-3 rounded-xl text-left px-4 font-medium transition-colors ${
                                    language === 'pa'
                                        ? 'bg-secondary-container text-on-secondary-container'
                                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                                }`}
                            >
                                ਪੰਜਾਬੀ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppTopBar;
