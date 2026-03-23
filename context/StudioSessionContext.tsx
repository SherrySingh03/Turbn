import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import toast from 'react-hot-toast';
import { TRANSLATIONS } from '../constants';
import {
    getColorsFromImage,
    getTurbanSuggestions,
    generateSikhLook,
    generateStyledLookFromPortrait,
    generateLookFromUpload,
} from '../services/geminiService';
import type {
    AttireContext,
    Language,
    OutfitColors,
    SavedLook,
    StudioPhase,
    Translation,
    TurbanSuggestion,
} from '../types';
import { attireContextToTopType } from '../utils/attire';

type Mode = 'upload' | 'manual' | null;
type LoadingState = 'colors' | 'suggestions' | 'image' | null;

interface StudioSessionContextValue {
    studioPhase: StudioPhase;
    mode: Mode;
    attireContext: AttireContext;
    setAttireContext: (v: AttireContext) => void;
    outfitColors: OutfitColors;
    setOutfitColors: React.Dispatch<React.SetStateAction<OutfitColors>>;
    suggestions: TurbanSuggestion[];
    selectedSuggestion: TurbanSuggestion | null;
    setSelectedSuggestion: (s: TurbanSuggestion | null) => void;
    loadingState: LoadingState;
    outfitImage: string | null;
    generatedImage: string | null;
    lastGenerationSource: 'sample' | 'user' | 'upload' | null;
    outfitFileRef: React.RefObject<HTMLInputElement | null>;
    language: Language;
    t: (key: keyof Translation) => string;
    goHub: () => void;
    startUpload: () => void;
    startManual: () => void;
    backFromRecommendations: () => void;
    backFromOutfitReview: () => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleGetSuggestions: (colors: OutfitColors, fromUpload?: boolean) => Promise<void>;
    requestRecommendationsManual: () => Promise<void>;
    handleGenerateImage: (
        turbanColor: string,
        options?: { source?: 'sample' | 'user'; userFile?: File | Blob | null }
    ) => Promise<void>;
    handleDownload: () => void;
    handleSave: () => void;
    handleBackToSuggestions: () => void;
    resetSession: () => void;
}

const StudioSessionContext = createContext<StudioSessionContextValue | null>(null);

const defaultOutfit: OutfitColors = {
    shirtColor: '#FFFFFF',
    pantsColor: '#1E3A8A',
    topType: 'tshirt',
    highlightsColor: null,
};

export function StudioSessionProvider({
    children,
    language,
    t,
}: {
    children: ReactNode;
    language: Language;
    t: (key: keyof Translation) => string;
}) {
    const [studioPhase, setStudioPhase] = useState<StudioPhase>('hub');
    const [mode, setMode] = useState<Mode>(null);
    const [attireContext, setAttireContext] = useState<AttireContext>('casual');
    const [outfitColors, setOutfitColors] = useState<OutfitColors>(defaultOutfit);
    const [suggestions, setSuggestions] = useState<TurbanSuggestion[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState<TurbanSuggestion | null>(null);
    const [loadingState, setLoadingState] = useState<LoadingState>(null);
    const [outfitImage, setOutfitImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [lastGenerationSource, setLastGenerationSource] = useState<'sample' | 'user' | 'upload' | null>(
        null
    );
    const outfitFileRef = useRef<HTMLInputElement>(null);
    const lastUserPortraitRef = useRef<Blob | null>(null);

    useEffect(() => {
        if (mode !== 'manual') return;
        setOutfitColors((prev) => {
            const nextTop = attireContextToTopType(attireContext);
            if (prev.topType === nextTop) return prev;
            return { ...prev, topType: nextTop };
        });
    }, [attireContext, mode]);

    const handleGetSuggestions = useCallback(
        async (colors: OutfitColors, fromUpload = false) => {
            if (!fromUpload) setLoadingState('suggestions');
            try {
                const result = await getTurbanSuggestions(colors, attireContext);
                const sortedResults = result.sort((a, b) => a.rank - b.rank);
                setSuggestions(sortedResults);
                setSelectedSuggestion(sortedResults[0] ?? null);
                setStudioPhase('recommendations');
            } catch (error) {
                toast.error(t('errorSuggestions'));
                console.error(error);
            } finally {
                setLoadingState(null);
            }
        },
        [attireContext, t]
    );

    const handleFileChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (e) => {
                const imageUrl = e.target?.result as string;
                setOutfitImage(imageUrl);
                setLoadingState('colors');
                try {
                    const colors = await getColorsFromImage(file);
                    setOutfitColors({ ...colors, highlightsColor: null });
                    setStudioPhase('outfitReview');
                } catch (error) {
                    toast.error(t('errorColorDetection'));
                    console.error(error);
                    setOutfitImage(null);
                } finally {
                    setLoadingState(null);
                }
            };
            reader.readAsDataURL(file);
        },
        [t]
    );

    const requestRecommendationsManual = useCallback(async () => {
        await handleGetSuggestions(outfitColors, false);
    }, [handleGetSuggestions, outfitColors]);

    const handleGenerateImage = useCallback(
        async (
            turbanColor: string,
            options?: { source?: 'sample' | 'user'; userFile?: File | Blob | null }
        ) => {
            if (loadingState) return;
            setLoadingState('image');
            setGeneratedImage(null);

            try {
                let result: string;
                if (mode === 'upload' && outfitImage) {
                    lastUserPortraitRef.current = null;
                    setLastGenerationSource('upload');
                    const fileBlob = await (await fetch(outfitImage)).blob();
                    result = await generateLookFromUpload(fileBlob, turbanColor);
                } else {
                    const explicit = options?.source;
                    const source =
                        explicit ??
                        (lastGenerationSource === 'user' && lastUserPortraitRef.current
                            ? 'user'
                            : 'sample');

                    if (source === 'sample') {
                        lastUserPortraitRef.current = null;
                        setLastGenerationSource('sample');
                        result = await generateSikhLook(outfitColors, turbanColor);
                    } else {
                        const blob = options?.userFile ?? lastUserPortraitRef.current;
                        if (!blob) {
                            toast.error(t('errorImageGeneration'));
                            setLoadingState(null);
                            return;
                        }
                        lastUserPortraitRef.current = blob;
                        setLastGenerationSource('user');
                        result = await generateStyledLookFromPortrait(
                            blob,
                            outfitColors,
                            turbanColor,
                            attireContext
                        );
                    }
                }
                setGeneratedImage(`data:image/png;base64,${result}`);
                setStudioPhase('result');
            } catch (error) {
                toast.error(t('errorImageGeneration'));
                console.error(error);
            } finally {
                setLoadingState(null);
            }
        },
        [loadingState, mode, outfitImage, lastGenerationSource, outfitColors, attireContext, t]
    );

    const handleDownload = useCallback(() => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'Turbn-Look.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [generatedImage]);

    const handleSave = useCallback(() => {
        if (!generatedImage || !selectedSuggestion) return;
        const savedLooks: SavedLook[] = JSON.parse(localStorage.getItem('savedLooks') || '[]');
        const entry: SavedLook = {
            image: generatedImage,
            timestamp: Date.now(),
            shirtColor: outfitColors.shirtColor,
            pantsColor: outfitColors.pantsColor,
            highlightsColor: outfitColors.highlightsColor ?? null,
            topType: outfitColors.topType,
            turbanHex: selectedSuggestion.hexCode,
            turbanName: selectedSuggestion.colorName,
            attireContext,
            previewSource: lastGenerationSource ?? 'sample',
        };
        savedLooks.push(entry);
        localStorage.setItem('savedLooks', JSON.stringify(savedLooks));
        toast.success(t('saved'));
    }, [generatedImage, selectedSuggestion, outfitColors, attireContext, lastGenerationSource, t]);

    const handleBackToSuggestions = useCallback(() => {
        setGeneratedImage(null);
        setStudioPhase('recommendations');
    }, []);

    const resetSession = useCallback(() => {
        setMode(null);
        setStudioPhase('hub');
        setOutfitColors(defaultOutfit);
        setSuggestions([]);
        setSelectedSuggestion(null);
        setOutfitImage(null);
        setGeneratedImage(null);
        setAttireContext('casual');
        setLastGenerationSource(null);
        lastUserPortraitRef.current = null;
    }, []);

    const goHub = useCallback(() => {
        resetSession();
    }, [resetSession]);

    const startUpload = useCallback(() => {
        setMode('upload');
        setStudioPhase('upload');
        setSuggestions([]);
        setSelectedSuggestion(null);
        setGeneratedImage(null);
        setOutfitImage(null);
        setLastGenerationSource(null);
        lastUserPortraitRef.current = null;
    }, []);

    const startManual = useCallback(() => {
        setMode('manual');
        setStudioPhase('manual');
        setSuggestions([]);
        setSelectedSuggestion(null);
        setGeneratedImage(null);
        setOutfitImage(null);
        setLastGenerationSource(null);
        lastUserPortraitRef.current = null;
    }, []);

    const backFromRecommendations = useCallback(() => {
        setSuggestions([]);
        setSelectedSuggestion(null);
        setGeneratedImage(null);
        if (mode === 'upload') setStudioPhase('outfitReview');
        else if (mode === 'manual') setStudioPhase('manual');
        else setStudioPhase('hub');
    }, [mode]);

    const backFromOutfitReview = useCallback(() => {
        setOutfitImage(null);
        setOutfitColors(defaultOutfit);
        setStudioPhase('upload');
    }, []);

    const value: StudioSessionContextValue = {
        studioPhase,
        mode,
        attireContext,
        setAttireContext,
        outfitColors,
        setOutfitColors,
        suggestions,
        selectedSuggestion,
        setSelectedSuggestion,
        loadingState,
        outfitImage,
        generatedImage,
        lastGenerationSource,
        outfitFileRef,
        language,
        t,
        goHub,
        startUpload,
        startManual,
        backFromRecommendations,
        backFromOutfitReview,
        handleFileChange,
        handleGetSuggestions,
        requestRecommendationsManual,
        handleGenerateImage,
        handleDownload,
        handleSave,
        handleBackToSuggestions,
        resetSession,
    };

    return (
        <StudioSessionContext.Provider value={value}>{children}</StudioSessionContext.Provider>
    );
}

export function useStudioSession() {
    const ctx = useContext(StudioSessionContext);
    if (!ctx) throw new Error('useStudioSession must be used within StudioSessionProvider');
    return ctx;
}

/** Messages for loading overlay — needs TRANSLATIONS for rotating lines */
export function getLoadingMessages(
    kind: 'colors' | 'suggestions' | 'image',
    language: Language
): string[] {
    if (kind === 'colors') {
        return [TRANSLATIONS[language].analyzingColors, ...TRANSLATIONS[language].generatingSuggestionsMessages.slice(0, 3)];
    }
    const key = kind === 'suggestions' ? 'generatingSuggestionsMessages' : 'generatingLookMessages';
    return TRANSLATIONS[language][key];
}
