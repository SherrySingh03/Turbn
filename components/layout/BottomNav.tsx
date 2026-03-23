import React from 'react';
import { Compass, Palette, BookOpen, Lightbulb, User } from 'lucide-react';
import type { Translation } from '../../types';

export type AppTab = 'discover' | 'studio' | 'library' | 'inspo' | 'profile';

interface BottomNavProps {
    active: AppTab;
    onChange: (tab: AppTab) => void;
    t: (key: keyof Translation) => string;
}

const tabs: { id: AppTab; icon: typeof Compass; labelKey: keyof Translation }[] = [
    { id: 'discover', icon: Compass, labelKey: 'tabDiscover' },
    { id: 'studio', icon: Palette, labelKey: 'tabStudio' },
    { id: 'library', icon: BookOpen, labelKey: 'tabLibrary' },
    { id: 'inspo', icon: Lightbulb, labelKey: 'tabInspo' },
    { id: 'profile', icon: User, labelKey: 'tabProfile' },
];

const BottomNav: React.FC<BottomNavProps> = ({ active, onChange, t }) => {
    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
            aria-label="Main"
        >
            <div className="w-full max-w-md pointer-events-auto glass-panel border-t border-outline-variant/15 safe-area-pb px-2 pt-2 pb-3">
                <div className="flex justify-between items-center gap-1">
                    {tabs.map(({ id, icon: Icon, labelKey }) => {
                        const isActive = active === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => onChange(id)}
                                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl transition-colors min-w-0 ${
                                    isActive
                                        ? 'text-primary bg-surface-container/90'
                                        : 'text-on-surface-muted hover:text-on-surface'
                                }`}
                            >
                                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                                <span className="text-[0.65rem] font-medium truncate w-full text-center leading-tight">
                                    {t(labelKey)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;
