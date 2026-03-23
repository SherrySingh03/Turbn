import React from 'react';
import { Pipette } from 'lucide-react';
import { useStudioSession } from '../../context/StudioSessionContext';
import OutfitPreview from '../../components/OutfitPreview';
import { COMMON_HIGHLIGHTS_COLORS, COMMON_PANTS_COLORS, COMMON_SHIRT_COLORS } from '../../constants';

const SHIRT_PICK = COMMON_SHIRT_COLORS.slice(0, 5);
const PANTS_PICK = COMMON_PANTS_COLORS.slice(0, 5);

const ManualStudioScreen: React.FC = () => {
    const {
        outfitColors,
        setOutfitColors,
        attireContext,
        setAttireContext,
        requestRecommendationsManual,
        t,
    } = useStudioSession();

    const contexts = [
        { id: 'casual' as const, label: t('casual') },
        { id: 'formal' as const, label: t('formal') },
        { id: 'ceremonial' as const, label: t('ceremonial') },
    ];

    return (
        <div className="px-4 pt-2 pb-28 space-y-6 animate-fade-in">
            <div className="space-y-1">
                <p className="label-caps text-on-surface-muted">{t('curatedLabel')}</p>
                <h2 className="font-display text-3xl text-on-surface">
                    {t('studioCanvasTitle')}{' '}
                    <span className="text-primary italic">{t('studioCanvasAccent')}</span>
                </h2>
                <p className="text-xs text-on-surface-muted leading-relaxed">{t('studioCanvasSubtitle')}</p>
            </div>

            <div className="space-y-2">
                <p className="label-caps text-on-surface-muted">{t('attireContext')}</p>
                <div className="flex rounded-xl overflow-hidden bg-surface-container p-1 gap-1">
                    {contexts.map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setAttireContext(id)}
                            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                                attireContext === id
                                    ? 'bg-secondary-container text-on-secondary-container'
                                    : 'text-on-surface-muted hover:text-on-surface'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-[var(--radius-card)] bg-surface-container p-4 space-y-4 ghost-border">
                <div className="flex justify-between items-center">
                    <span className="label-caps text-on-surface-muted">{t('topColor')}</span>
                    <span className="font-mono text-[0.65rem] text-on-surface-muted">{outfitColors.shirtColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {SHIRT_PICK.map((c) => (
                        <button
                            key={c.hex}
                            type="button"
                            onClick={() => setOutfitColors({ ...outfitColors, shirtColor: c.hex })}
                            className={`w-11 h-11 rounded-xl shadow-inner transition-transform active:scale-95 ${
                                outfitColors.shirtColor === c.hex
                                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container scale-105'
                                    : ''
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                        />
                    ))}
                    <label className="relative w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center cursor-pointer overflow-hidden ghost-border">
                        <Pipette className="w-5 h-5 text-on-surface-muted" />
                        <input
                            type="color"
                            value={outfitColors.shirtColor}
                            onChange={(e) => setOutfitColors({ ...outfitColors, shirtColor: e.target.value })}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                    </label>
                </div>
            </div>

            <div className="rounded-[var(--radius-card)] bg-surface-container p-4 space-y-4 ghost-border">
                <div className="flex justify-between items-center">
                    <span className="label-caps text-on-surface-muted">{t('bottomColor')}</span>
                    <span className="font-mono text-[0.65rem] text-on-surface-muted">{outfitColors.pantsColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {PANTS_PICK.map((c) => (
                        <button
                            key={c.hex}
                            type="button"
                            onClick={() => setOutfitColors({ ...outfitColors, pantsColor: c.hex })}
                            className={`w-11 h-11 rounded-xl shadow-inner transition-transform active:scale-95 ${
                                outfitColors.pantsColor === c.hex
                                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container scale-105'
                                    : ''
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                        />
                    ))}
                    <label className="relative w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center cursor-pointer overflow-hidden ghost-border">
                        <Pipette className="w-5 h-5 text-on-surface-muted" />
                        <input
                            type="color"
                            value={outfitColors.pantsColor}
                            onChange={(e) => setOutfitColors({ ...outfitColors, pantsColor: e.target.value })}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                    </label>
                </div>
            </div>

            <div className="rounded-[var(--radius-card)] bg-surface-container p-4 space-y-3 ghost-border">
                <span className="label-caps text-on-surface-muted">{t('highlightsColor')}</span>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setOutfitColors({ ...outfitColors, highlightsColor: null })}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 ${
                            !outfitColors.highlightsColor
                                ? 'border-primary ring-1 ring-primary/40'
                                : 'border-outline-variant/20'
                        }`}
                        title="None"
                    >
                        <span className="text-lg text-on-surface-muted">∅</span>
                    </button>
                    {COMMON_HIGHLIGHTS_COLORS.map((c) => (
                        <button
                            key={c.hex}
                            type="button"
                            onClick={() => setOutfitColors({ ...outfitColors, highlightsColor: c.hex })}
                            className={`w-10 h-10 rounded-lg ${
                                outfitColors.highlightsColor === c.hex
                                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container'
                                    : ''
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                        />
                    ))}
                </div>
            </div>

            <div className="rounded-[var(--radius-card)] bg-surface-container-low overflow-hidden ghost-border">
                <div className="flex justify-between items-center px-4 pt-3">
                    <span className="label-caps text-tertiary">{t('modelVersion')}</span>
                </div>
                <div className="p-4 pt-2 max-w-[220px] mx-auto">
                    <OutfitPreview
                        attireContext={attireContext}
                        shirtColor={outfitColors.shirtColor}
                        pantsColor={outfitColors.pantsColor}
                        highlightsColor={outfitColors.highlightsColor}
                    />
                </div>
            </div>

            <div className="rounded-[var(--radius-card)] bg-surface-container p-5 space-y-3 ghost-border">
                <h3 className="font-display text-lg text-primary">{t('harmonyLogic')}</h3>
                <p className="text-xs font-semibold text-secondary">
                    {t('attireContext')}: {t(attireContext)}
                </p>
                <p className="text-sm text-on-surface-muted leading-relaxed">{t('harmonyIntro')}</p>
            </div>

            <button
                type="button"
                onClick={() => requestRecommendationsManual()}
                className="w-full py-4 rounded-2xl bg-primary text-on-primary font-bold text-sm tracking-wide shadow-ambient animate-pulse-glow"
            >
                {t('recommendTurbanColors')}
            </button>
        </div>
    );
};

export default ManualStudioScreen;
