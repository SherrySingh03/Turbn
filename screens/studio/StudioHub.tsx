import React from 'react';
import { Camera, Palette, Sparkles, ArrowRight } from 'lucide-react';
import { useStudioSession } from '../../context/StudioSessionContext';

const IMG_UPLOAD =
    'https://user-gen-media-assets.s3.amazonaws.com/gemini_images/096c15f2-42c8-4796-9ea8-abb72ce55c03.png';
const IMG_MANUAL =
    'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/d9f1d6a9-9c9d-4164-b9ca-b8b394686dfe.png';

const StudioHub: React.FC = () => {
    const { startUpload, startManual, t } = useStudioSession();

    return (
        <div className="px-4 pt-4 pb-8 space-y-6 animate-fade-in-up">
            <header className="space-y-2">
                <p className="label-caps text-tertiary">{t('curatedLabel')}</p>
                <h2 className="font-display text-3xl leading-tight text-on-surface">
                    {t('discoverHeroLine1')}{' '}
                    <span className="text-primary italic">{t('discoverHeroAccent')}</span>
                </h2>
                <p className="text-sm text-on-surface-muted leading-relaxed">{t('discoverHeroSubtitle')}</p>
            </header>

            <button
                type="button"
                onClick={startUpload}
                className="w-full text-left rounded-[var(--radius-card)] overflow-hidden group shadow-ambient"
            >
                <div className="relative min-h-[9.5rem]">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${IMG_UPLOAD})` }}
                    />
                    <div className="absolute inset-0 bg-surface/75" />
                    <div className="relative p-5 flex flex-col gap-3">
                        <Camera className="w-10 h-10 text-primary" />
                        <div>
                            <h3 className="font-display text-xl text-on-surface">{t('cardUploadTitle')}</h3>
                            <p className="text-sm text-on-surface-muted mt-1">{t('cardUploadDesc')}</p>
                        </div>
                        <span className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold">
                            <Sparkles className="w-4 h-4" />
                            {t('cardUploadCta')}
                        </span>
                    </div>
                </div>
            </button>

            <button
                type="button"
                onClick={startManual}
                className="w-full text-left rounded-[var(--radius-card)] overflow-hidden group shadow-ambient ghost-border bg-surface-container"
            >
                <div className="relative min-h-[9.5rem]">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${IMG_MANUAL})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/90 to-transparent" />
                    <div className="relative p-5 flex flex-col gap-3">
                        <Palette className="w-10 h-10 text-secondary" />
                        <div>
                            <h3 className="font-display text-xl text-on-surface">{t('cardManualTitle')}</h3>
                            <p className="text-sm text-on-surface-muted mt-1">{t('cardManualDesc')}</p>
                        </div>
                        <span className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full border border-outline-variant/20 text-on-surface text-sm font-semibold">
                            {t('cardManualCta')}
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default StudioHub;
