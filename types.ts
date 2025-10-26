export type Language = 'en' | 'pa';

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
}

export interface OutfitColors {
    shirtColor: string;
    pantsColor: string;
    highlightsColor?: string | null;
}

export interface TurbanSuggestion {
    rank: number;
    colorName: string;
    hexCode: string;
    reason: string;
}