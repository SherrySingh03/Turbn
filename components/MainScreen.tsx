
import React, { useState, useRef } from 'react';
import { Translation, OutfitColors, TurbanSuggestion, Language } from '../types';
import { getColorsFromImage, getTurbanSuggestions, generateLookFromUpload, generateSikhLook } from '../services/geminiService';
import toast from 'react-hot-toast';
import UploadIcon from './icons/UploadIcon';
import PaletteIcon from './icons/PaletteIcon';
import SparklesIcon from './icons/SparklesIcon';
import { COMMON_HIGHLIGHTS_COLORS, COMMON_PANTS_COLORS, COMMON_SHIRT_COLORS, TRANSLATIONS } from '../constants';
import OutfitPreview from './OutfitPreview';
import DropperIcon from './icons/DropperIcon';
import LoadingIndicator from './LoadingIndicator';
import DownloadIcon from './icons/DownloadIcon';
import BookmarkIcon from './icons/BookmarkIcon';
import BackIcon from './icons/BackIcon';
import RedoIcon from './icons/RedoIcon';


interface MainScreenProps {
    t: (key: keyof Translation) => string;
    language: Language;
}

interface ColorSwatchProps {
    color: string;
    name: string;
    isSelected: boolean;
    onClick: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, name, isSelected, onClick }) => (
    <button onClick={onClick} className={`w-14 h-14 rounded-full border-2 transition-transform transform hover:scale-110 active:scale-100 ${isSelected ? 'border-amber-400 ring-2 ring-amber-400' : 'border-slate-600/50'}`} style={{ backgroundColor: color }} title={name} />
);

const MainScreen: React.FC<MainScreenProps> = ({ t, language }) => {
    const [mode, setMode] = useState<'upload' | 'manual' | null>(null);
    const [outfitColors, setOutfitColors] = useState<OutfitColors>({ shirtColor: '#FFFFFF', pantsColor: '#1E3A8A', highlightsColor: null });
    const [suggestions, setSuggestions] = useState<TurbanSuggestion[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState<TurbanSuggestion | null>(null);
    const [loadingState, setLoadingState] = useState<'suggestions' | 'image' | null>(null);
    const [outfitImage, setOutfitImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    
    const outfitFileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const imageUrl = e.target?.result as string;
            setOutfitImage(imageUrl);
            setLoadingState('suggestions');
            try {
                const colors = await getColorsFromImage(file);
                setOutfitColors({...colors, highlightsColor: null}); // Highlights not detectable from photo
                await handleGetSuggestions(colors, true);
            } catch (error) {
                toast.error(t('errorColorDetection'));
                console.error(error);
                setLoadingState(null);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleGetSuggestions = async (colors: OutfitColors, fromUpload = false) => {
        if (!fromUpload) setLoadingState('suggestions');
        try {
            const result = await getTurbanSuggestions(colors);
            const sortedResults = result.sort((a,b) => a.rank - b.rank);
            setSuggestions(sortedResults);
            setSelectedSuggestion(sortedResults[0]); // Auto-select the first suggestion
        } catch (error) {
            toast.error(t('errorSuggestions'));
            console.error(error);
        } finally {
            setLoadingState(null);
        }
    };
    
    const handleGenerateImage = async (turbanColor: string) => {
        if (loadingState) return;
        setLoadingState('image');
        setGeneratedImage(null); // Clear previous image

        try {
            let result;
            if (mode === 'manual') {
                result = await generateSikhLook(outfitColors, turbanColor);
            } else { // mode === 'upload'
                if (!outfitImage) {
                    toast.error("An outfit image is required.");
                    setLoadingState(null);
                    return;
                }
                const file = await (await fetch(outfitImage)).blob();
                result = await generateLookFromUpload(file, turbanColor);
            }
            setGeneratedImage(`data:image/png;base64,${result}`);
        } catch (error) {
            toast.error(t('errorImageGeneration'));
            console.error(error);
        } finally {
            setLoadingState(null);
        }
    };


    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'Turbn-Look.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSave = () => {
        if(!generatedImage) return;
        const savedLooks = JSON.parse(localStorage.getItem('savedLooks') || '[]');
        savedLooks.push({ image: generatedImage, timestamp: new Date().getTime() });
        localStorage.setItem('savedLooks', JSON.stringify(savedLooks));
        toast.success(t('saved'));
    };
    
    const handleBackToSuggestions = () => {
        setGeneratedImage(null);
    }

    const reset = () => {
        setMode(null);
        setOutfitColors({ shirtColor: '#FFFFFF', pantsColor: '#1E3A8A', highlightsColor: null });
        setSuggestions([]);
        setSelectedSuggestion(null);
        setOutfitImage(null);
        setGeneratedImage(null);
    };
    
    if (loadingState) {
        const titleKey = loadingState === 'suggestions' ? 'generatingSuggestionsTitle' : 'generatingLookTitle';
        const messagesKey = loadingState === 'suggestions' ? 'generatingSuggestionsMessages' : 'generatingLookMessages';
        
        return <LoadingIndicator 
            title={t(titleKey)} 
            messages={TRANSLATIONS[language][messagesKey]} 
        />;
    }

    return (
        <div className="pt-20">
            {!mode ? (
                 <div key="mode-selection" className="flex flex-col md:flex-row items-stretch justify-center h-[calc(100vh-5rem)] animate-fade-in">
                    <div onClick={() => setMode('upload')} className="group relative w-full md:w-1/2 flex-grow flex items-center justify-center p-8 text-center cursor-pointer transition-all duration-500 ease-in-out overflow-hidden md:hover:w-[55%]">
                         <div className="absolute inset-0 bg-cover bg-center bg-[url('https://user-gen-media-assets.s3.amazonaws.com/gemini_images/096c15f2-42c8-4796-9ea8-abb72ce55c03.png')] transition-all duration-500 ease-in-out transform group-hover:scale-110" aria-hidden="true"></div>
                         <div className="absolute inset-0 bg-slate-900/70 group-hover:bg-slate-900/50 transition-all duration-500 ease-in-out"></div>
                         <div className="relative z-10 flex flex-col items-center justify-center p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
                             <UploadIcon className="w-16 h-16 mb-4 text-slate-300 group-hover:text-amber-400 transition-colors duration-300 transform group-hover:scale-110" />
                             <h3 className="text-3xl font-bold text-white">{t('uploadOutfitPhoto')}</h3>
                             <p className="text-slate-300 mt-2 max-w-xs">Let AI find colors from your outfit picture.</p>
                         </div>
                    </div>
                    <div className="shrink-0 w-full h-px md:w-px md:h-full bg-slate-700/50 flex items-center justify-center">
                        <div className="absolute px-4 py-1 bg-slate-800 text-slate-400 text-sm font-bold rounded-full border border-slate-700 z-10">{t('or')}</div>
                    </div>
                    <div onClick={() => setMode('manual')} className="group relative w-full md:w-1/2 flex-grow flex items-center justify-center p-8 text-center cursor-pointer transition-all duration-500 ease-in-out overflow-hidden md:hover:w-[55%]">
                         <div className="absolute inset-0 bg-cover bg-center bg-[url('https://user-gen-media-assets.s3.amazonaws.com/seedream_images/d9f1d6a9-9c9d-4164-b9ca-b8b394686dfe.png')] transition-all duration-500 ease-in-out transform group-hover:scale-110" aria-hidden="true"></div>
                         <div className="absolute inset-0 bg-slate-900/70 group-hover:bg-slate-900/50 transition-all duration-500 ease-in-out"></div>
                         <div className="relative z-10 flex flex-col items-center justify-center p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
                             <PaletteIcon className="w-16 h-16 mb-4 text-slate-300 group-hover:text-amber-400 transition-colors duration-300 transform group-hover:scale-110" />
                             <h3 className="text-3xl font-bold text-white">{t('pickColorsManually')}</h3>
                             <p className="text-slate-300 mt-2 max-w-xs">Select your shirt, pants, and highlight colors.</p>
                         </div>
                    </div>
                 </div>
            ) : (
                <div className="container mx-auto p-4 max-w-6xl">
                    {mode === 'upload' && !outfitImage && (
                        <div className="text-center animate-fade-in pt-16">
                            <button onClick={() => outfitFileRef.current?.click()} className="p-8 border-2 border-dashed border-slate-600 rounded-xl hover:border-amber-500/80 hover:bg-slate-800/50 transition group w-full max-w-md mx-auto transform hover:scale-105 active:scale-95 backdrop-blur-lg">
                                <UploadIcon className="w-12 h-12 mx-auto mb-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                                <h3 className="text-2xl font-semibold">{t('uploadOutfit')}</h3>
                            </button>
                            <input type="file" ref={outfitFileRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        </div>
                    )}

                    {mode === 'manual' && suggestions.length === 0 && (
                        <div key="manual-mode" className="bg-slate-800/50 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-xl p-6 sm:p-8 animate-fade-in">
                            <div className="grid md:grid-cols-2 gap-8 items-start">
                                <div className="md:hidden p-4 rounded-lg flex flex-col items-center justify-center">
                                    <OutfitPreview shirtColor={outfitColors.shirtColor} pantsColor={outfitColors.pantsColor} highlightsColor={outfitColors.highlightsColor} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-semibold mb-6 text-center">{t('pickColors')}</h3>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-slate-400 mb-2">{t('shirtColor')}</label>
                                        <div className="flex flex-wrap gap-3">
                                            {COMMON_SHIRT_COLORS.map(c => <ColorSwatch key={c.hex + c.name} color={c.hex} name={c.name} isSelected={outfitColors.shirtColor === c.hex} onClick={() => setOutfitColors({...outfitColors, shirtColor: c.hex})} />)}
                                            <div className="relative w-14 h-14 flex items-center justify-center rounded-full border-2 border-slate-600/50 overflow-hidden cursor-pointer bg-slate-700/50 hover:border-amber-500/80 transition-colors">
                                                <DropperIcon className="w-8 h-8 text-slate-400" />
                                                <input type="color" value={outfitColors.shirtColor} onChange={(e) => setOutfitColors({...outfitColors, shirtColor: e.target.value})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Custom Color" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-slate-400 mb-2">{t('pantsColor')}</label>
                                        <div className="flex flex-wrap gap-3">
                                            {COMMON_PANTS_COLORS.map(c => <ColorSwatch key={c.hex + c.name} color={c.hex} name={c.name} isSelected={outfitColors.pantsColor === c.hex} onClick={() => setOutfitColors({...outfitColors, pantsColor: c.hex})} />)}
                                            <div className="relative w-14 h-14 flex items-center justify-center rounded-full border-2 border-slate-600/50 overflow-hidden cursor-pointer bg-slate-700/50 hover:border-amber-500/80 transition-colors">
                                                <DropperIcon className="w-8 h-8 text-slate-400" />
                                                <input type="color" value={outfitColors.pantsColor} onChange={(e) => setOutfitColors({...outfitColors, pantsColor: e.target.value})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Custom Color" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">{t('highlightsColor')}</label>
                                        <div className="flex flex-wrap gap-3">
                                            <button onClick={() => setOutfitColors({...outfitColors, highlightsColor: null})} className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-transform transform hover:scale-110 active:scale-100 ${!outfitColors.highlightsColor ? 'border-amber-400 ring-2 ring-amber-400' : 'border-slate-600/50 bg-slate-700'}`} title="No Highlight">
                                                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                            </button>
                                            {COMMON_HIGHLIGHTS_COLORS.map(c => <ColorSwatch key={c.hex + c.name} color={c.hex} name={c.name} isSelected={outfitColors.highlightsColor === c.hex} onClick={() => setOutfitColors({...outfitColors, highlightsColor: c.hex})} />)}
                                            <div className="relative w-14 h-14 flex items-center justify-center rounded-full border-2 border-slate-600/50 overflow-hidden cursor-pointer bg-slate-700/50 hover:border-amber-500/80 transition-colors">
                                                <DropperIcon className="w-8 h-8 text-slate-400" />
                                                <input type="color" value={outfitColors.highlightsColor || '#000000'} onChange={(e) => setOutfitColors({...outfitColors, highlightsColor: e.target.value})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Custom Color" />
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleGetSuggestions(outfitColors)} disabled={!!loadingState} className="w-full mt-8 px-6 py-3 bg-amber-600 text-slate-900 rounded-lg font-semibold hover:bg-amber-500 transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95 disabled:bg-amber-800/70 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20">{t('getSuggestions')}</button>
                                </div>
                                <div className="hidden md:flex p-6 rounded-lg flex-col items-center justify-center">
                                    <OutfitPreview shirtColor={outfitColors.shirtColor} pantsColor={outfitColors.pantsColor} highlightsColor={outfitColors.highlightsColor} />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {(suggestions.length > 0) && (
                         <div key="suggestions-mode" className="grid lg:grid-cols-2 gap-8 items-start animate-fade-in">
                            {/* Left Panel: Outfit Display */}
                            <div className="lg:sticky lg:top-24 space-y-4">
                                <h3 className="text-3xl font-bold text-center">{generatedImage && mode === 'manual' ? t('lookPalette') : t('yourOutfit')}</h3>
                                <div className="p-4 rounded-xl bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 min-h-[500px] flex flex-col justify-center">
                                    {mode === 'upload' && outfitImage ? (
                                        <img src={outfitImage} alt="Uploaded outfit" className="rounded-lg w-full object-cover aspect-[3/4]"/>
                                    ) : generatedImage && selectedSuggestion ? (
                                        <div className="animate-fade-in p-2 sm:p-4">
                                            <div className="space-y-4">
                                                {/* Turban */}
                                                <div className="flex items-center gap-4 p-3 bg-slate-900/40 rounded-lg border border-slate-700/50">
                                                    <div className="w-10 h-10 rounded-md shadow-inner flex-shrink-0" style={{ backgroundColor: selectedSuggestion.hexCode }}></div>
                                                    <div className="flex-grow">
                                                        <p className="font-semibold text-base">{selectedSuggestion.colorName}</p>
                                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Turban</p>
                                                    </div>
                                                    <p className="ml-auto text-sm font-mono text-slate-500">{selectedSuggestion.hexCode}</p>
                                                </div>
                                                {/* Shirt */}
                                                <div className="flex items-center gap-4 p-3 bg-slate-900/40 rounded-lg border border-slate-700/50">
                                                    <div className="w-10 h-10 rounded-md shadow-inner flex-shrink-0" style={{ backgroundColor: outfitColors.shirtColor }}></div>
                                                    <div className="flex-grow">
                                                        <p className="font-semibold text-base">Shirt Color</p>
                                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Outfit</p>
                                                    </div>
                                                    <p className="ml-auto text-sm font-mono text-slate-500">{outfitColors.shirtColor}</p>
                                                </div>
                                                {/* Pants */}
                                                <div className="flex items-center gap-4 p-3 bg-slate-900/40 rounded-lg border border-slate-700/50">
                                                    <div className="w-10 h-10 rounded-md shadow-inner flex-shrink-0" style={{ backgroundColor: outfitColors.pantsColor }}></div>
                                                    <div className="flex-grow">
                                                        <p className="font-semibold text-base">Pants Color</p>
                                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Outfit</p>
                                                    </div>
                                                    <p className="ml-auto text-sm font-mono text-slate-500">{outfitColors.pantsColor}</p>
                                                </div>
                                                {/* Highlights */}
                                                {outfitColors.highlightsColor && (
                                                    <div className="flex items-center gap-4 p-3 bg-slate-900/40 rounded-lg border border-slate-700/50">
                                                        <div className="w-10 h-10 rounded-md shadow-inner flex-shrink-0" style={{ backgroundColor: outfitColors.highlightsColor }}></div>
                                                        <div className="flex-grow">
                                                            <p className="font-semibold text-base">Highlight</p>
                                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Outfit</p>
                                                        </div>
                                                        <p className="ml-auto text-sm font-mono text-slate-500">{outfitColors.highlightsColor}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <OutfitPreview shirtColor={outfitColors.shirtColor} pantsColor={outfitColors.pantsColor} highlightsColor={outfitColors.highlightsColor} />
                                    )}
                                </div>
                                <div className="flex justify-center gap-2">
                                    <button onClick={reset} className="flex-1 px-4 py-2 bg-slate-700/50 backdrop-blur-md border border-white/10 text-slate-200 rounded-lg font-semibold hover:bg-slate-600/70 transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95">{t('startOver')}</button>
                                    {mode === 'manual' && <button onClick={() => { setSuggestions([]); setGeneratedImage(null); }} className="flex-1 px-4 py-2 bg-slate-700/50 backdrop-blur-md border border-white/10 text-slate-200 rounded-lg font-semibold hover:bg-slate-600/70 transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95">{t('editColors')}</button>}
                                </div>
                            </div>

                            {/* Right Panel: Stylist's Desk */}
                            <div className="space-y-6">
                               <h2 className="text-3xl font-bold text-center">{generatedImage ? t('yourLook') : t('suggestions')}</h2>
                               
                               {generatedImage ? (
                                    <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-lg p-4 animate-fade-in">
                                        <img src={generatedImage} alt="Generated Look" className="w-full rounded-lg aspect-[3/4] object-cover mb-4" />
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            <button onClick={handleBackToSuggestions} className="flex flex-col items-center justify-center gap-1 p-2 bg-slate-700/50 text-slate-200 rounded-lg font-semibold hover:bg-slate-600/70 transition-transform duration-200 transform hover:scale-105">
                                                <BackIcon className="w-6 h-6" />
                                                <span className="text-xs font-medium">Back</span>
                                            </button>
                                            <button onClick={handleDownload} className="flex flex-col items-center justify-center gap-1 p-2 bg-blue-600/80 text-white rounded-lg font-semibold hover:bg-blue-500/90 transition-transform duration-200 transform hover:scale-105">
                                                <DownloadIcon className="w-6 h-6" />
                                                <span className="text-xs font-medium">{t('download')}</span>
                                            </button>
                                            <button onClick={handleSave} className="flex flex-col items-center justify-center gap-1 p-2 bg-green-600/80 text-white rounded-lg font-semibold hover:bg-green-500/90 transition-transform duration-200 transform hover:scale-105">
                                                <BookmarkIcon className="w-6 h-6" />
                                                <span className="text-xs font-medium">Save</span>
                                            </button>
                                            <button onClick={() => selectedSuggestion && handleGenerateImage(selectedSuggestion.hexCode)} className="flex flex-col items-center justify-center gap-1 p-2 bg-purple-600/80 text-white rounded-lg font-semibold hover:bg-purple-500/90 transition-transform duration-200 transform hover:scale-105">
                                                <RedoIcon className="w-6 h-6" />
                                                <span className="text-xs font-medium">Regen</span>
                                            </button>
                                        </div>
                                    </div>
                               ) : (
                                    <div className="space-y-6">
                                        {/* Color Palette */}
                                        <div className="flex items-center justify-center gap-4 flex-wrap">
                                            {suggestions.map(suggestion => (
                                                <button key={suggestion.hexCode} onClick={() => setSelectedSuggestion(suggestion)} className={`suggestion-swatch w-16 h-16 rounded-full border-4 shadow-lg ${selectedSuggestion?.hexCode === suggestion.hexCode ? 'selected' : 'border-slate-600'}`} style={{ backgroundColor: suggestion.hexCode }} title={suggestion.colorName} />
                                            ))}
                                        </div>

                                        {/* Suggestion Details */}
                                        {selectedSuggestion && (
                                            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6 min-h-[200px] flex flex-col justify-between animate-fade-in">
                                                    <div>
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <div style={{ backgroundColor: selectedSuggestion.hexCode }} className="w-10 h-10 rounded-full border-2 border-slate-700 flex-shrink-0"></div>
                                                            <h3 className="text-2xl font-semibold">{selectedSuggestion.rank}. {selectedSuggestion.colorName}</h3>
                                                        </div>
                                                        <p className="text-slate-300 text-lg leading-relaxed">{selectedSuggestion.reason}</p>
                                                </div>
                                                    <button 
                                                        onClick={() => handleGenerateImage(selectedSuggestion.hexCode)}
                                                        className="w-full mt-6 px-6 py-3 bg-amber-600 text-slate-900 rounded-lg font-bold hover:bg-amber-500 transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                                                    >
                                                        <SparklesIcon className="w-5 h-5" />
                                                        <span>Generate This Look</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                               )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MainScreen;