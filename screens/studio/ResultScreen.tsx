import React from 'react';
import { Download, Bookmark, Share2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStudioSession } from '../../context/StudioSessionContext';

const ResultScreen: React.FC = () => {
    const {
        generatedImage,
        selectedSuggestion,
        lastGenerationSource,
        handleDownload,
        handleSave,
        handleGenerateImage,
        handleBackToSuggestions,
        t,
    } = useStudioSession();

    const handleShare = async () => {
        if (!generatedImage) return;
        try {
            const res = await fetch(generatedImage);
            const blob = await res.blob();
            const file = new File([blob], 'turbn-look.png', {
                type: blob.type && blob.type.startsWith('image/') ? blob.type : 'image/png',
            });

            if (navigator.share) {
                const withFiles: ShareData = {
                    files: [file],
                    title: 'Turbn',
                    text: 'My Turbn look',
                };
                if (!navigator.canShare || navigator.canShare(withFiles)) {
                    await navigator.share(withFiles);
                    toast.success(t('shareSuccess'));
                    return;
                }
            }

            if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        [blob.type || 'image/png']: blob,
                    }),
                ]);
                toast.success(t('shareCopied'));
                return;
            }

            toast.error(t('shareFailed'));
        } catch (e) {
            const err = e as { name?: string };
            if (err?.name === 'AbortError') return;
            toast.error(t('shareFailed'));
        }
    };

    if (!generatedImage || !selectedSuggestion) {
        return null;
    }

    const previewNote =
        lastGenerationSource === 'upload'
            ? t('previewFromOutfitPhoto')
            : lastGenerationSource === 'user'
              ? t('previewFromYourPhoto')
              : t('previewFromSample');

    return (
        <div className="px-4 pt-4 pb-28 space-y-5 animate-fade-in">
            <div className="text-center space-y-1">
                <p className="label-caps text-tertiary">Composition</p>
                <h2 className="font-display text-2xl text-on-surface">
                    {selectedSuggestion.colorName}
                </h2>
            </div>

            <div className="rounded-[var(--radius-card)] bg-surface-container-low px-4 py-3 ghost-border">
                <p className="label-caps text-tertiary mb-1">Aesthetic preview</p>
                <p className="text-sm text-on-surface">{previewNote}</p>
            </div>

            <div className="rounded-[var(--radius-card)] overflow-hidden shadow-ambient bg-surface-container">
                <img
                    src={generatedImage}
                    alt={t('yourLook')}
                    className="w-full aspect-[3/4] object-contain bg-surface-container-high"
                />
            </div>

            <div className="rounded-[var(--radius-card)] bg-surface-container-low p-4 ghost-border">
                <h3 className="font-display text-primary text-lg mb-1">Fabric variations</h3>
                <p className="text-xs text-on-surface-muted mb-3">Curated textile selection</p>
                <div className="flex gap-3 text-sm text-on-surface-muted">
                    <span>Mulberry silk</span>
                    <span className="text-on-surface">·</span>
                    <span>Cotton voile</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-high text-on-surface text-sm font-semibold ghost-border"
                >
                    <Bookmark className="w-4 h-4" />
                    {t('saveToLibrary')}
                </button>
                <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-high text-on-surface text-sm font-semibold ghost-border"
                >
                    <Share2 className="w-4 h-4" />
                    {t('shareToGallery')}
                </button>
            </div>

            <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-surface-container text-sm">
                <span className="text-on-surface-muted">{t('selectedColor')}</span>
                <div className="flex items-center gap-2">
                    <span className="font-medium text-on-surface">{selectedSuggestion.colorName}</span>
                    <span
                        className="w-6 h-6 rounded-full border border-outline-variant/20 shadow-inner"
                        style={{ backgroundColor: selectedSuggestion.hexCode }}
                    />
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={handleBackToSuggestions}
                    className="flex-1 py-3 rounded-xl border border-outline-variant/20 text-on-surface font-semibold text-sm"
                >
                    {t('suggestions')}
                </button>
                <button
                    type="button"
                    onClick={() => handleGenerateImage(selectedSuggestion.hexCode)}
                    className="flex-1 py-3 rounded-xl bg-secondary-container text-on-secondary-container font-semibold text-sm flex items-center justify-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    {t('regen')}
                </button>
                <button
                    type="button"
                    onClick={handleDownload}
                    className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm flex items-center justify-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    {t('download')}
                </button>
            </div>
        </div>
    );
};

export default ResultScreen;
