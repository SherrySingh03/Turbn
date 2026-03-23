import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useStudioSession } from '../../context/StudioSessionContext';

/** After upload: shows analyzed outfit photo and colors before turban recommendations. */
const OutfitReviewScreen: React.FC = () => {
    const { outfitImage, outfitColors, outfitFileRef, handleFileChange, handleGetSuggestions, t } =
        useStudioSession();

    if (!outfitImage) return null;

    return (
        <div className="px-4 pt-2 pb-28 space-y-6 animate-fade-in">
            <div className="space-y-2">
                <p className="label-caps text-primary">{t('curatedLabel')}</p>
                <h2 className="font-display text-2xl text-on-surface">{t('yourOutfit')}</h2>
                <p className="text-sm text-on-surface-muted leading-relaxed">{t('uploadScreenSubtitle')}</p>
            </div>

            <div className="flex justify-between items-center">
                <span className="label-caps text-primary">{t('selectedPreview')}</span>
                <button
                    type="button"
                    onClick={() => outfitFileRef.current?.click()}
                    className="text-xs font-semibold text-secondary flex items-center gap-1"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {t('changePhoto')}
                </button>
            </div>

            <div className="relative rounded-[var(--radius-card)] overflow-hidden bg-surface-container aspect-[3/4] max-h-[22rem] mx-auto w-full">
                <img src={outfitImage} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="rounded-xl bg-surface-container-low p-4 space-y-3 ghost-border">
                <p className="text-sm font-medium text-on-surface">{t('lookPalette')}</p>
                <div className="flex gap-3 items-center">
                    <div
                        className="w-10 h-10 rounded-lg shadow-inner shrink-0"
                        style={{ backgroundColor: outfitColors.shirtColor }}
                    />
                    <div className="min-w-0">
                        <p className="text-xs label-caps text-on-surface-muted">{t('shirtColor')}</p>
                        <p className="font-mono text-xs text-on-surface truncate">{outfitColors.shirtColor}</p>
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    <div
                        className="w-10 h-10 rounded-lg shadow-inner shrink-0"
                        style={{ backgroundColor: outfitColors.pantsColor }}
                    />
                    <div className="min-w-0">
                        <p className="text-xs label-caps text-on-surface-muted">{t('pantsColor')}</p>
                        <p className="font-mono text-xs text-on-surface truncate">{outfitColors.pantsColor}</p>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={() => handleGetSuggestions(outfitColors, false)}
                className="w-full py-4 rounded-2xl bg-primary text-on-primary font-bold text-sm tracking-wide shadow-ambient"
            >
                {t('recommendTurbanColors')}
            </button>
            <p className="text-center text-[0.65rem] text-on-surface-muted">{t('engineVersion')}</p>

            <input
                type="file"
                ref={outfitFileRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
        </div>
    );
};

export default OutfitReviewScreen;
