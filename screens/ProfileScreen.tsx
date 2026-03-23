import React from 'react';
import { User, Bell, Shield } from 'lucide-react';
import type { Translation } from '../types';

const ProfileScreen: React.FC<{ t: (key: keyof Translation) => string }> = ({ t }) => {
    return (
        <div className="px-5 pt-8 pb-28 space-y-8 animate-fade-in">
            <div className="space-y-2">
                <h2 className="font-display text-3xl text-on-surface">{t('profileTitle')}</h2>
                <p className="text-sm text-on-surface-muted leading-relaxed">{t('profileBody')}</p>
            </div>
            <div className="rounded-[var(--radius-card)] bg-surface-container divide-y divide-outline-variant/10 overflow-hidden ghost-border">
                <div className="flex items-center gap-4 p-4 text-on-surface-muted">
                    <User className="w-5 h-5 text-primary" />
                    <span>Account & sign-in</span>
                    <span className="ml-auto text-xs label-caps">{t('comingSoon')}</span>
                </div>
                <div className="flex items-center gap-4 p-4 text-on-surface-muted">
                    <Bell className="w-5 h-5 text-secondary" />
                    <span>Notifications</span>
                    <span className="ml-auto text-xs label-caps">{t('comingSoon')}</span>
                </div>
                <div className="flex items-center gap-4 p-4 text-on-surface-muted">
                    <Shield className="w-5 h-5 text-tertiary" />
                    <span>Privacy</span>
                    <span className="ml-auto text-xs label-caps">{t('comingSoon')}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
