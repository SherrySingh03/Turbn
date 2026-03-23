import React from 'react';
import AppTopBar from './AppTopBar';
import BottomNav, { type AppTab } from './BottomNav';
import type { Language, Translation } from '../../types';

interface MobileShellProps {
    children: React.ReactNode;
    activeTab: AppTab;
    onTabChange: (tab: AppTab) => void;
    language: Language;
    setLanguage: (l: Language) => void;
    t: (key: keyof Translation) => string;
    topBarTitle?: string;
    showBack: boolean;
    onBack?: () => void;
    onTitleClick?: () => void;
}

const MobileShell: React.FC<MobileShellProps> = ({
    children,
    activeTab,
    onTabChange,
    language,
    setLanguage,
    t,
    topBarTitle,
    showBack,
    onBack,
    onTitleClick,
}) => {
    return (
        <div className="min-h-[100dvh] bg-surface flex justify-center">
            <div className="w-full max-w-md min-h-[100dvh] flex flex-col relative shadow-[0_0_80px_rgba(6,14,32,0.35)]">
                <AppTopBar
                    title={topBarTitle}
                    showBack={showBack}
                    onBack={onBack}
                    onTitleClick={onTitleClick}
                    language={language}
                    setLanguage={setLanguage}
                    t={t}
                />
                <div className="flex-1 overflow-y-auto overflow-x-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]">
                    {children}
                </div>
                <BottomNav active={activeTab} onChange={onTabChange} t={t} />
            </div>
        </div>
    );
};

export default MobileShell;
