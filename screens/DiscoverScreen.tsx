import React, { useMemo } from 'react';
import { Sparkles, Palette, ArrowRight, Camera } from 'lucide-react';
import { LANDING_PAGE_IMAGES } from '../constants';
import type { Translation } from '../types';

interface DiscoverScreenProps {
    t: (key: keyof Translation) => string;
    onOpenStudioUpload: () => void;
    onOpenStudioManual: () => void;
}

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
    t,
    onOpenStudioUpload,
    onOpenStudioManual,
}) => {
    const recent = useMemo(() => LANDING_PAGE_IMAGES.slice(0, 6), []);

    return (
        <div className="pb-8 animate-fade-in">
            <section className="px-5 pt-6 pb-8 space-y-4">
                <p className="label-caps text-tertiary">{t('curatedLabel')}</p>
                <h2 className="font-display text-[2rem] leading-[1.15] text-on-surface">
                    {t('discoverHeroLine1')}{' '}
                    <span className="text-primary italic">{t('discoverHeroAccent')}</span>
                </h2>
                <p className="text-sm text-on-surface-muted leading-relaxed max-w-prose">
                    {t('discoverHeroSubtitle')}
                </p>
            </section>

            <section className="px-4 pb-2 grid grid-cols-2 gap-4 items-stretch">
                <button
                    type="button"
                    onClick={onOpenStudioUpload}
                    className="min-h-[17rem] h-full w-full rounded-[var(--radius-card)] text-left overflow-hidden bg-surface-container shadow-ambient ghost-border active:scale-[0.99] transition-transform flex flex-col"
                >
                    <div className="flex flex-col flex-1 justify-between gap-3 p-5 h-full min-h-0">
                        <h3 className="font-display text-lg text-on-surface">{t('cardUploadTitle')}</h3>
                        <p className="text-sm text-on-surface-muted flex-1">{t('cardUploadDesc')}</p>
                        <span className="inline-flex items-center justify-center gap-2 text-primary text-sm font-bold bg-secondary/20 rounded-full px-3 py-2.5 w-full">
                            <Camera className="w-5 h-5 text-primary shrink-0" />
                            {t('cardUploadCta')}
                        </span>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={onOpenStudioManual}
                    className="min-h-[17rem] h-full w-full rounded-[var(--radius-card)] text-left overflow-hidden bg-surface-container shadow-ambient ghost-border active:scale-[0.99] transition-transform flex flex-col"
                >
                    <div className="flex flex-col flex-1 justify-between gap-3 p-5 h-full min-h-0">
                        <h3 className="font-display text-lg text-on-surface">{t('cardManualTitle')}</h3>
                        <p className="text-sm text-on-surface-muted flex-1">{t('cardManualDesc')}</p>
                        <span className="inline-flex items-center justify-center gap-2 text-on-surface text-sm font-bold bg-surface-container-high rounded-full px-3 py-2.5 w-full border border-outline-variant/15">
                            <Palette className="w-5 h-5 text-secondary shrink-0" />
                            {t('cardManualCta')}
                        </span>
                    </div>
                </button>
            </section>

            <section className="px-4 pb-8">
                <div className="flex justify-between items-baseline mb-4">
                    <h3 className="font-display text-xl text-on-surface">{t('recentStyles')}</h3>
                    <span className="text-xs font-semibold text-tertiary">{t('viewAll')}</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
                    {recent.map((src, i) => (
                        <div
                            key={src}
                            className="shrink-0 w-36 h-44 rounded-xl overflow-hidden bg-surface-container shadow-md"
                        >
                            <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-4 space-y-4">
                <h3 className="font-display text-xl text-on-surface px-1">{t('topTrendsSection')}</h3>
                <div className="rounded-[var(--radius-card)] overflow-hidden bg-surface-container ghost-border">
                    <div className="aspect-[16/10] bg-surface-container-high">
                        <img
                            src={LANDING_PAGE_IMAGES[4]}
                            alt=""
                            className="w-full h-full object-cover opacity-90"
                        />
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="font-display text-lg text-on-surface">{t('trendMinimalTitle')}</p>
                        <p className="text-sm text-on-surface-muted">{t('trendMinimalDesc')}</p>
                    </div>
                </div>
                <div className="rounded-[var(--radius-card)] overflow-hidden bg-surface-container ghost-border">
                    <div className="aspect-[16/10] bg-surface-container-high">
                        <img
                            src={LANDING_PAGE_IMAGES[5]}
                            alt=""
                            className="w-full h-full object-cover opacity-90"
                        />
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="font-display text-lg text-on-surface">{t('trendMaxTitle')}</p>
                        <p className="text-sm text-on-surface-muted">{t('trendMaxDesc')}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DiscoverScreen;
