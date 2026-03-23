import React from 'react';
import { Sparkles, Palette, Heart } from 'lucide-react';
import type { Translation } from '../types';
import { INSPO_GALLERY_IMAGES } from '../constants';

const aspectPattern = (i: number) => {
    const m = i % 5;
    if (m === 0) return 'aspect-[3/4]';
    if (m === 1) return 'aspect-[4/5]';
    if (m === 2) return 'aspect-square';
    if (m === 3) return 'aspect-[5/6]';
    return 'aspect-[2/3]';
};

const InspoScreen: React.FC<{ t: (key: keyof Translation) => string }> = ({ t }) => {
    return (
        <div className="pb-28 animate-fade-in">
            <div className="px-5 pt-8 pb-6 space-y-3">
                <p className="label-caps text-tertiary">{t('inspoGalleryLabel')}</p>
                <h2 className="font-display text-3xl text-on-surface leading-tight">{t('inspoTitle')}</h2>
                <p className="text-sm text-on-surface-muted leading-relaxed max-w-prose">{t('inspoBody')}</p>
                <p className="text-xs text-on-surface-muted/90 leading-relaxed max-w-prose pt-1 border-l-2 border-primary/40 pl-3">
                    {t('inspoGallerySubtitle')}
                </p>
            </div>

            <div className="px-4 grid grid-cols-2 gap-3">
                {INSPO_GALLERY_IMAGES.map((src, i) => (
                    <div
                        key={`${src}-${i}`}
                        className={`group relative rounded-2xl overflow-hidden bg-surface-container shadow-md ${aspectPattern(i)}`}
                    >
                        <img
                            src={src}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent opacity-80 pointer-events-none" />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-[0.65rem] font-medium text-on-surface truncate">Turbn mood</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-5 pt-10 space-y-3">
                <p className="label-caps text-on-surface-muted">{t('comingSoon')}</p>
                <div className="rounded-[var(--radius-card)] bg-surface-container p-6 space-y-4 ghost-border border border-outline-variant/10">
                    <div className="flex items-center gap-3 text-on-surface">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="font-medium">Editorial drops</span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-muted">
                        <Palette className="w-5 h-5 text-secondary" />
                        <span>Seasonal palette stories</span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-muted">
                        <Heart className="w-5 h-5 text-primary/70" />
                        <span>Curators you follow</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspoScreen;
