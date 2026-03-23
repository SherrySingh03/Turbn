import React from 'react';
import { Camera } from 'lucide-react';
import { useStudioSession } from '../../context/StudioSessionContext';

/** Pick outfit photo only — analysis + palette shown on OutfitReviewScreen. */
const UploadFlowScreen: React.FC = () => {
    const { outfitFileRef, handleFileChange, t } = useStudioSession();

    return (
        <div className="px-4 pt-2 pb-28 space-y-6 animate-fade-in">
            <div className="space-y-2">
                <p className="label-caps text-primary">{t('curatedLabel')}</p>
                <h2 className="font-display text-3xl text-on-surface">
                    {t('uploadScreenTitle')}{' '}
                    <span className="text-primary italic">{t('uploadScreenAccent')}</span>
                </h2>
                <p className="text-sm text-on-surface-muted leading-relaxed">{t('uploadScreenSubtitle')}</p>
            </div>

            <button
                type="button"
                onClick={() => outfitFileRef.current?.click()}
                className="w-full rounded-[var(--radius-card)] min-h-[14rem] flex flex-col items-center justify-center gap-3 bg-surface-container ghost-border hover:bg-surface-container-high transition-colors"
            >
                <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-primary" />
                </div>
                <p className="font-semibold text-on-surface">{t('clickToCapture')}</p>
                <p className="text-xs text-on-surface-muted">{t('browseOrCamera')}</p>
                <input
                    type="file"
                    ref={outfitFileRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </button>
        </div>
    );
};

export default UploadFlowScreen;
