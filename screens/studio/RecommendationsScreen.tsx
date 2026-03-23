import React, { useRef, useState } from 'react';
import { Sparkles, User, ImageIcon } from 'lucide-react';
import { useStudioSession } from '../../context/StudioSessionContext';
import { TRANSLATIONS } from '../../constants';

const RecommendationsScreen: React.FC = () => {
    const {
        suggestions,
        outfitColors,
        mode,
        handleGenerateImage,
        setSelectedSuggestion,
        selectedSuggestion,
        language,
        t,
    } = useStudioSession();

    const tagList = TRANSLATIONS[language].recommendationTags;
    const [generateChoice, setGenerateChoice] = useState<{ hex: string } | null>(null);
    const portraitInputRef = useRef<HTMLInputElement>(null);

    const openGenerateChoice = (hex: string) => {
        setGenerateChoice({ hex });
    };

    const onPickPortrait: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        const file = e.target.files?.[0];
        const hex = generateChoice?.hex;
        e.target.value = '';
        if (!file || !hex) return;
        setGenerateChoice(null);
        await handleGenerateImage(hex, { source: 'user', userFile: file });
    };

    const onChooseSample = async () => {
        const hex = generateChoice?.hex;
        if (!hex) return;
        setGenerateChoice(null);
        await handleGenerateImage(hex, { source: 'sample' });
    };

    return (
        <div className="px-4 pt-4 pb-28 space-y-6 animate-fade-in">
            <input
                ref={portraitInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickPortrait}
            />

            {generateChoice && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-surface/80 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="gen-choice-title"
                >
                    <button
                        type="button"
                        className="absolute inset-0 cursor-default"
                        aria-label={t('close')}
                        onClick={() => setGenerateChoice(null)}
                    />
                    <div className="relative w-full max-w-md rounded-[var(--radius-card)] bg-surface-container p-5 shadow-ambient ghost-border space-y-4 animate-fade-in">
                        <h2 id="gen-choice-title" className="font-display text-xl text-on-surface">
                            {t('howToGenerateTitle')}
                        </h2>
                        <p className="text-sm text-on-surface-muted leading-relaxed">
                            {t('howToGenerateSubtitle')}
                        </p>
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={onChooseSample}
                                className="w-full flex items-center gap-3 rounded-xl bg-primary text-on-primary px-4 py-3 text-left font-semibold text-sm"
                            >
                                <ImageIcon className="w-5 h-5 shrink-0" />
                                <span className="flex-1">
                                    <span className="block">{t('useSampleModel')}</span>
                                    <span className="block text-xs font-normal opacity-90 mt-0.5">
                                        {t('sampleModelHint')}
                                    </span>
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => portraitInputRef.current?.click()}
                                className="w-full flex items-center gap-3 rounded-xl bg-surface-container-high text-on-surface px-4 py-3 text-left font-semibold text-sm ghost-border"
                            >
                                <User className="w-5 h-5 shrink-0" />
                                <span className="flex-1">
                                    <span className="block">{t('useYourPhoto')}</span>
                                    <span className="block text-xs text-on-surface-muted mt-0.5">
                                        {t('yourPhotoHint')}
                                    </span>
                                </span>
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => setGenerateChoice(null)}
                            className="w-full py-2 text-sm text-on-surface-muted"
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <p className="label-caps text-tertiary">{t('currentlyAvailable')}</p>
                <h2 className="font-display text-3xl text-on-surface">{t('midnightPaletteTitle')}</h2>
                <p className="text-sm text-on-surface-muted leading-relaxed">{t('midnightPaletteSubtitle')}</p>
            </div>

            <div className="rounded-xl bg-surface-container-low px-4 py-3 flex items-center justify-between gap-3 ghost-border">
                <span className="label-caps text-on-surface-muted shrink-0">{t('currentlyAvailable')}</span>
                <div className="flex gap-2 items-center">
                    <div className="flex flex-col items-center gap-0.5">
                        <div
                            className="w-8 h-8 rounded-lg shadow-inner"
                            style={{ backgroundColor: outfitColors.shirtColor }}
                        />
                        <span className="text-[0.6rem] text-on-surface-muted">Top</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        <div
                            className="w-8 h-8 rounded-lg shadow-inner"
                            style={{ backgroundColor: outfitColors.pantsColor }}
                        />
                        <span className="text-[0.6rem] text-on-surface-muted">Bottom</span>
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                {suggestions.map((s, index) => {
                    const tag = tagList[index] ?? tagList[0] ?? '';
                    const isSel = selectedSuggestion?.hexCode === s.hexCode;
                    return (
                        <article
                            key={`${s.rank}-${s.hexCode}`}
                            className={`rounded-[var(--radius-card)] overflow-hidden bg-surface-container shadow-ambient transition-transform ${
                                isSel ? 'ring-1 ring-primary/40' : ''
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedSuggestion(s)}
                                className="w-full text-left"
                            >
                                <div
                                    className="h-36 w-full relative"
                                    style={{
                                        background: `linear-gradient(135deg, ${s.hexCode} 0%, color-mix(in srgb, ${s.hexCode} 70%, black) 100%)`,
                                    }}
                                >
                                    <span className="absolute top-3 left-3 label-caps text-[0.65rem] px-2 py-1 rounded-full bg-surface/50 text-on-surface backdrop-blur-sm">
                                        {tag}
                                    </span>
                                </div>
                                <div className="p-4 space-y-2">
                                    <h3 className="font-display text-xl text-on-surface">{s.colorName}</h3>
                                    <p className="text-sm text-on-surface-muted leading-relaxed">{s.reason}</p>
                                </div>
                            </button>
                            <div className="px-4 pb-4">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSuggestion(s);
                                        if (mode === 'upload') {
                                            void handleGenerateImage(s.hexCode);
                                        } else {
                                            openGenerateChoice(s.hexCode);
                                        }
                                    }}
                                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                                        index === 0
                                            ? 'bg-primary text-on-primary'
                                            : 'bg-surface-container-high text-on-surface ghost-border'
                                    }`}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    {t('generateAestheticPreview')}
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            <div className="rounded-[var(--radius-card)] bg-surface-container-low p-5 space-y-4 ghost-border">
                <h3 className="font-display text-lg text-on-surface">{t('whyMattersTitle')}</h3>
                <p className="text-sm text-on-surface-muted leading-relaxed">{t('whyMattersBody')}</p>
                <ul className="space-y-3 text-sm text-on-surface">
                    <li className="flex gap-2">
                        <Sparkles className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                        {t('aestheticBalance')}
                    </li>
                    <li className="flex gap-2">
                        <span className="text-tertiary shrink-0">✦</span>
                        {t('culturalSignature')}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default RecommendationsScreen;
