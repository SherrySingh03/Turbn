import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Translation } from '../types';
import { WELCOME_SLIDESHOW_IMAGES } from '../constants';

interface WelcomeScreenProps {
    onDone: () => void;
    t: (key: keyof Translation) => string;
}

const SLIDE_MS = 5000;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onDone, t }) => {
    const slides = WELCOME_SLIDESHOW_IMAGES;
    const trackRef = useRef<HTMLDivElement>(null);
    const [maxDrag, setMaxDrag] = useState(180);
    const maxDragRef = useRef(180);
    const [dragPx, setDragPx] = useState(0);
    const dragPxRef = useRef(0);
    const dragStartX = useRef(0);
    const dragOrigin = useRef(0);
    const dragging = useRef(false);
    const [isDragging, setIsDragging] = useState(false);

    const [slideIndex, setSlideIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let start = performance.now();
        let rafId: number;

        const loop = (now: number) => {
            const elapsed = now - start;
            const p = Math.min(1, elapsed / SLIDE_MS);
            setProgress(p);
            if (elapsed >= SLIDE_MS) {
                setSlideIndex((i) => (i + 1) % slides.length);
                start = now;
                setProgress(0);
            }
            rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId);
    }, [slides.length]);

    useLayoutEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => {
            const w = el.clientWidth;
            const knob = 48;
            const m = Math.max(0, w - knob - 16);
            maxDragRef.current = m;
            setMaxDrag(m);
        });
        ro.observe(el);
        const w = el.clientWidth;
        const knob = 48;
        const m = Math.max(0, w - knob - 16);
        maxDragRef.current = m;
        setMaxDrag(m);
        return () => ro.disconnect();
    }, []);

    const snapBack = useCallback(() => {
        dragPxRef.current = 0;
        setDragPx(0);
        dragging.current = false;
        setIsDragging(false);
    }, []);

    const finishIfFullSwipe = useCallback(() => {
        const end = maxDragRef.current;
        const atEnd = end > 0 && dragPxRef.current >= end - 3;
        if (atEnd) {
            onDone();
        }
        snapBack();
    }, [onDone, snapBack]);

    const onPointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        dragging.current = true;
        setIsDragging(true);
        dragStartX.current = e.clientX;
        dragOrigin.current = dragPxRef.current;
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!dragging.current) return;
        const delta = e.clientX - dragStartX.current;
        const next = Math.max(0, Math.min(dragOrigin.current + delta, maxDragRef.current));
        dragPxRef.current = next;
        setDragPx(next);
    };

    const onPointerUp = (e: React.PointerEvent) => {
        if (!dragging.current) return;
        try {
            (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
        } catch {
            /* ignore */
        }
        finishIfFullSwipe();
    };

    const onPointerCancel = () => {
        snapBack();
    };

    return (
        <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-surface">
            {/* Rotating backgrounds */}
            <div className="absolute inset-0">
                {slides.map((src, i) => (
                    <div
                        key={src}
                        className="absolute inset-0 transition-opacity duration-1000 ease-out"
                        style={{
                            opacity: i === slideIndex ? 1 : 0,
                            backgroundImage: `url(${src})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                        aria-hidden
                    />
                ))}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-surface via-surface/75 to-surface/40"
                    aria-hidden
                />
                <div
                    className="absolute inset-0 bg-surface/35"
                    style={{
                        background:
                            'radial-gradient(ellipse 100% 70% at 50% 0%, transparent 0%, color-mix(in srgb, var(--color-surface) 55%, transparent) 55%)',
                    }}
                    aria-hidden
                />
            </div>

            <div className="relative flex justify-end p-4 safe-area-pt z-10">
                <button
                    type="button"
                    onClick={onDone}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-surface-container-highest/85 text-on-surface backdrop-blur-md ghost-border border border-white/10"
                >
                    {t('welcomeSkip')}
                </button>
            </div>

            <div className="relative flex-1 flex flex-col justify-end px-6 pb-12 safe-area-pb z-10">
                <div className="rounded-[1.75rem] bg-white/[0.08] backdrop-blur-xl p-8 shadow-ambient border border-white/12 space-y-6">
                    {/* Segment progress — one bar per slide; current bar fills over 5s */}
                    <div className="flex justify-center gap-1.5 w-full">
                        {slides.map((_, i) => {
                            const fillPct =
                                i < slideIndex ? 100 : i === slideIndex ? Math.round(progress * 100) : 0;
                            return (
                                <div
                                    key={i}
                                    className="h-1.5 rounded-full flex-1 max-w-[4.5rem] bg-on-surface/15 overflow-hidden"
                                >
                                    <div
                                        className="h-full rounded-full bg-on-surface/90"
                                        style={{ width: `${fillPct}%` }}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <div className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-secondary/35 to-primary/25 text-on-surface border border-white/10">
                        {t('welcomeBadge')}
                    </div>
                    <h1 className="font-display text-3xl leading-tight text-on-surface text-center drop-shadow-sm">
                        {t('welcomeTitle')}
                    </h1>

                    <div
                        ref={trackRef}
                        className="relative w-full rounded-full bg-surface-container-highest/90 h-14 pl-2 pr-2 flex items-center ghost-border touch-pan-y select-none border border-white/10"
                    >
                        <div
                            className={`absolute h-12 w-12 rounded-full bg-gradient-to-br from-secondary to-primary/80 flex items-center justify-center shadow-lg text-surface pointer-events-none z-10 ${
                                !isDragging ? 'transition-[transform] duration-300 ease-out' : ''
                            }`}
                            style={{
                                left: 8,
                                top: '50%',
                                transform: `translate(${dragPx}px, -50%)`,
                            }}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </div>
                        <div
                            role="slider"
                            tabIndex={0}
                            aria-valuenow={dragPx}
                            aria-valuemin={0}
                            aria-valuemax={maxDrag}
                            aria-label={t('welcomeSwipe')}
                            className="absolute inset-y-0 left-0 right-0 z-20 cursor-grab active:cursor-grabbing"
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                            onPointerCancel={onPointerCancel}
                        />
                        <span className="relative z-0 block w-full text-center text-sm font-medium text-on-surface pl-14 pr-4 pointer-events-none">
                            {t('welcomeSwipe')}
                        </span>
                    </div>
                    <p className="text-center text-[0.7rem] text-on-surface-muted">{t('welcomeDragFull')}</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
