import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, X } from 'lucide-react';
import type { SavedLook, TopType, Translation, AttireContext } from '../types';

function topLabel(tt: TopType | undefined, t: (key: keyof Translation) => string): string {
    if (!tt) return '—';
    if (tt === 'tshirt') return t('tshirt');
    if (tt === 'shirt') return t('shirt');
    return t('kurta');
}

function attireLabel(ctx: AttireContext | undefined, t: (key: keyof Translation) => string): string {
    if (!ctx) return '—';
    if (ctx === 'formal') return t('formal');
    if (ctx === 'ceremonial') return t('ceremonial');
    return t('casual');
}

function previewLabel(
    source: SavedLook['previewSource'],
    t: (key: keyof Translation) => string
): string {
    if (source === 'user') return t('previewFromYourPhoto');
    if (source === 'upload') return t('previewFromOutfitPhoto');
    return t('previewFromSample');
}

const LibraryScreen: React.FC<{ t: (key: keyof Translation) => string }> = ({ t }) => {
    const [looks, setLooks] = useState<SavedLook[]>([]);
    const [detail, setDetail] = useState<SavedLook | null>(null);
    const [mounted, setMounted] = useState(false);

    const load = useCallback(() => {
        const raw = JSON.parse(localStorage.getItem('savedLooks') || '[]') as SavedLook[];
        raw.sort((a, b) => b.timestamp - a.timestamp);
        setLooks(raw);
    }, []);

    useEffect(() => {
        setMounted(true);
        load();
    }, [load]);

    useEffect(() => {
        if (!detail) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [detail]);

    const handleDelete = (timestamp: number) => {
        const updatedLooks = looks.filter((look) => look.timestamp !== timestamp);
        setLooks(updatedLooks);
        localStorage.setItem('savedLooks', JSON.stringify(updatedLooks));
        setDetail((d) => (d?.timestamp === timestamp ? null : d));
    };

    const detailModal =
        mounted &&
        detail &&
        createPortal(
            <div
                className="fixed inset-0 z-[100] flex flex-col bg-surface/98 max-h-[100dvh] min-h-0 overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby="look-detail-title"
            >
                <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-outline-variant/15 pt-[max(0.75rem,env(safe-area-inset-top))]">
                    <h3 id="look-detail-title" className="font-display text-lg text-on-surface pr-2">
                        {t('lookDetails')}
                    </h3>
                    <button
                        type="button"
                        onClick={() => setDetail(null)}
                        className="p-2 rounded-full bg-surface-container text-on-surface shrink-0"
                        aria-label={t('close')}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-4 touch-pan-y">
                    <div className="rounded-[var(--radius-card)] overflow-hidden bg-surface-container">
                        <img
                            src={detail.image}
                            alt=""
                            className="w-full max-h-[55vh] object-contain bg-surface-container-high mx-auto"
                        />
                    </div>
                    <div className="rounded-[var(--radius-card)] bg-surface-container-low p-4 space-y-3 ghost-border">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm text-on-surface-muted">{t('turbanColorLabel')}</span>
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="font-medium text-on-surface truncate">
                                    {detail.turbanName ?? '—'}
                                </span>
                                {detail.turbanHex && (
                                    <span
                                        className="w-8 h-8 rounded-full border border-outline-variant/20 shadow-inner shrink-0"
                                        style={{ backgroundColor: detail.turbanHex }}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm text-on-surface-muted">{t('topGarment')}</span>
                            <div className="flex items-center gap-2">
                                {detail.shirtColor && (
                                    <span
                                        className="w-7 h-7 rounded-lg border border-outline-variant/20 shadow-inner"
                                        style={{ backgroundColor: detail.shirtColor }}
                                    />
                                )}
                                <span className="text-sm font-mono text-on-surface truncate max-w-[40%]">
                                    {detail.shirtColor ?? '—'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm text-on-surface-muted">{t('bottomGarment')}</span>
                            <div className="flex items-center gap-2">
                                {detail.pantsColor && (
                                    <span
                                        className="w-7 h-7 rounded-lg border border-outline-variant/20 shadow-inner"
                                        style={{ backgroundColor: detail.pantsColor }}
                                    />
                                )}
                                <span className="text-sm font-mono text-on-surface truncate max-w-[40%]">
                                    {detail.pantsColor ?? '—'}
                                </span>
                            </div>
                        </div>
                        {detail.highlightsColor ? (
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm text-on-surface-muted">
                                    {t('highlightsColor')}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-7 h-7 rounded-lg border border-outline-variant/20 shadow-inner"
                                        style={{ backgroundColor: detail.highlightsColor }}
                                    />
                                    <span className="text-sm font-mono text-on-surface">
                                        {detail.highlightsColor}
                                    </span>
                                </div>
                            </div>
                        ) : null}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-outline-variant/10">
                            <span className="text-sm text-on-surface-muted">{t('topType')}</span>
                            <span className="text-sm text-on-surface">{topLabel(detail.topType, t)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm text-on-surface-muted">{t('attireContext')}</span>
                            <span className="text-sm text-on-surface">
                                {attireLabel(detail.attireContext, t)}
                            </span>
                        </div>
                        {detail.previewSource && (
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm text-on-surface-muted">
                                    {t('previewSourceLabel')}
                                </span>
                                <span className="text-sm text-on-surface text-right">
                                    {previewLabel(detail.previewSource, t)}
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => handleDelete(detail.timestamp)}
                        className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-semibold flex items-center justify-center gap-2 mb-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        {t('deleteLook')}
                    </button>
                </div>
            </div>,
            document.body
        );

    return (
        <div className="px-4 pt-6 pb-28 animate-fade-in">
            <h2 className="font-display text-3xl text-on-surface mb-2">{t('savedLooks')}</h2>
            <p className="text-sm text-on-surface-muted mb-6">{t('tapToView')}</p>

            {detailModal}

            {looks.length === 0 ? (
                <div className="rounded-[var(--radius-card)] bg-surface-container-low px-6 py-16 text-center space-y-3 ghost-border">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-muted">
                        <svg
                            className="w-8 h-8 opacity-50"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <p className="text-on-surface font-medium">{t('noSavedLooks')}</p>
                    <p className="text-sm text-on-surface-muted">{t('noSavedLooksCTA')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {looks.map((look) => (
                        <div
                            key={look.timestamp}
                            className="group relative rounded-xl overflow-hidden bg-surface-container"
                        >
                            <button
                                type="button"
                                onClick={() => setDetail(look)}
                                className="relative block w-full p-0 border-0 bg-transparent text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset rounded-xl"
                            >
                                <div className="aspect-[3/4] w-full bg-surface-container-high flex items-center justify-center">
                                    <img
                                        src={look.image}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-surface/95 to-transparent pt-8 pb-2 px-2 pointer-events-none">
                                    <div className="flex items-center gap-1.5">
                                        {look.turbanHex && (
                                            <span
                                                className="w-4 h-4 rounded-full border border-white/20 shadow shrink-0"
                                                style={{ backgroundColor: look.turbanHex }}
                                            />
                                        )}
                                        <span className="text-xs font-medium text-on-surface truncate drop-shadow">
                                            {look.turbanName ?? t('turbanColorLabel')}
                                        </span>
                                    </div>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(look.timestamp)}
                                className="absolute top-2 right-2 z-[1] p-2 rounded-full bg-surface/80 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={t('deleteLook')}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LibraryScreen;
