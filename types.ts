export type Language = 'en' | 'pa';
export type TopType = 'tshirt' | 'shirt' | 'kurta';
export type AttireContext = 'casual' | 'formal' | 'ceremonial';

export type StudioPhase =
    | 'hub'
    | 'upload'
    | 'outfitReview'
    | 'manual'
    | 'recommendations'
    | 'result';

export interface Translation {
    appName: string;
    tagline: string;
    getStarted: string;
    uploadOutfit: string;
    or: string;
    pickColors: string;
    shirtColor: string;
    pantsColor: string;
    highlightsColor: string;
    getSuggestions: string;
    uploadYourself: string;
    uploadPrompt: string;
    generatingLook: string;
    yourLook: string;
    download: string;
    share: string;
    tryAgain: string;
    suggestions: string;
    uploadOutfitPhoto: string;
    pickColorsManually: string;
    analyzingColors: string;
    generatingSuggestions: string;
    errorColorDetection: string;
    errorSuggestions: string;
    errorImageGeneration: string;
    selectTurban: string;
    saved: string;
    shared: string;
    language: string;
    editColors: string;
    startOver: string;
    yourOutfit: string;
    savedLooks: string;
    noSavedLooks: string;
    noSavedLooksCTA: string;
    deleteLook: string;
    generatingSuggestionsTitle: string;
    generatingSuggestionsMessages: string[];
    generatingLookTitle: string;
    generatingLookMessages: string[];
    lookPalette: string;
    topType: string;
    tshirt: string;
    shirt: string;
    kurta: string;
    /* Mobile shell & onboarding */
    tabDiscover: string;
    tabStudio: string;
    tabLibrary: string;
    tabInspo: string;
    tabProfile: string;
    welcomeBadge: string;
    welcomeTitle: string;
    welcomeSwipe: string;
    welcomeSkip: string;
    curatedLabel: string;
    discoverHeroLine1: string;
    discoverHeroAccent: string;
    discoverHeroSubtitle: string;
    cardUploadTitle: string;
    cardUploadDesc: string;
    cardUploadCta: string;
    cardManualTitle: string;
    cardManualDesc: string;
    cardManualCta: string;
    recentStyles: string;
    viewAll: string;
    topTrendsSection: string;
    trendMinimalTitle: string;
    trendMinimalDesc: string;
    trendMaxTitle: string;
    trendMaxDesc: string;
    studioCanvasTitle: string;
    studioCanvasAccent: string;
    studioCanvasSubtitle: string;
    attireContext: string;
    casual: string;
    formal: string;
    ceremonial: string;
    topColor: string;
    bottomColor: string;
    recommendTurbanColors: string;
    harmonyLogic: string;
    harmonyIntro: string;
    modelVersion: string;
    uploadScreenTitle: string;
    uploadScreenAccent: string;
    uploadScreenSubtitle: string;
    clickToCapture: string;
    browseOrCamera: string;
    selectedPreview: string;
    changePhoto: string;
    engineVersion: string;
    generateAestheticPreview: string;
    recommendationTags: string[];
    whyMattersTitle: string;
    whyMattersBody: string;
    aestheticBalance: string;
    culturalSignature: string;
    aiAnalyzingFabric: string;
    saveToLibrary: string;
    shareToGallery: string;
    selectedColor: string;
    inspoTitle: string;
    inspoBody: string;
    inspoGalleryLabel: string;
    inspoGallerySubtitle: string;
    welcomeDragFull: string;
    comingSoon: string;
    profileTitle: string;
    profileBody: string;
    back: string;
    regen: string;
    midnightPaletteTitle: string;
    midnightPaletteSubtitle: string;
    currentlyAvailable: string;
    howToGenerateTitle: string;
    howToGenerateSubtitle: string;
    useSampleModel: string;
    useYourPhoto: string;
    sampleModelHint: string;
    yourPhotoHint: string;
    previewFromSample: string;
    previewFromYourPhoto: string;
    previewFromOutfitPhoto: string;
    shareNotAvailable: string;
    lookDetails: string;
    turbanColorLabel: string;
    topGarment: string;
    bottomGarment: string;
    close: string;
    tapToView: string;
    previewSourceLabel: string;
    shareSuccess: string;
    shareCopied: string;
    shareFailed: string;
}

export interface OutfitColors {
    shirtColor: string;
    pantsColor: string;
    topType: TopType;
    highlightsColor?: string | null;
}

export interface TurbanSuggestion {
    rank: number;
    colorName: string;
    hexCode: string;
    reason: string;
}

/** Persisted in localStorage `savedLooks` — older entries may omit optional fields. */
export interface SavedLook {
    image: string;
    timestamp: number;
    shirtColor?: string;
    pantsColor?: string;
    highlightsColor?: string | null;
    topType?: TopType;
    turbanHex?: string;
    turbanName?: string;
    attireContext?: AttireContext;
    previewSource?: 'sample' | 'user' | 'upload';
}
