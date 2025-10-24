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
    selectTurbanStyle: string;
    saved: string;
    shared: string;
    language: string;
    editColors: string;
    startOver: string;
    yourOutfit: string;
}

export interface OutfitColors {
    shirtColor: string;
    pantsColor: string;
}

export interface TurbanSuggestion {
    colorName: string;
    hexCode: string;
    reason: string;
}

export interface TurbanStyle {
    id: string;
    name: string;
    imageUrl: string;
}
