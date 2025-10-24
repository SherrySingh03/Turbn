import React, { useState, useRef } from 'react';
import { Translation, OutfitColors, TurbanSuggestion, Language } from '../types';
import { getColorsFromImage, getTurbanSuggestions, generateLookFromUpload, generateSikhLook } from '../services/geminiService';
import toast from 'react-hot-toast';
import UploadIcon from './icons/UploadIcon';
import PaletteIcon from './icons/PaletteIcon';
import SparklesIcon from './icons/SparklesIcon';
import { COMMON_PANTS_COLORS, COMMON_SHIRT_COLORS, TRANSLATIONS } from '../constants';
import OutfitPreview from './OutfitPreview';
import DropperIcon from './icons/DropperIcon';
import LoadingIndicator from './LoadingIndicator';

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
    <button onClick={onClick} className={`w-16 h-16 rounded-2xl border-2 transition-transform transform hover:scale-110 active:scale-100 ${isSelected ? 'border-teal-500 ring-2 ring-teal-400' : 'border-white/50'}`} style={{ backgroundColor: color }} title={name} />
);

const MainScreen: React.FC<MainScreenProps> = ({ t, language }) => {
    const [mode, setMode] = useState<'upload' | 'manual' | null>(null);
    const [outfitColors, setOutfitColors] = useState<OutfitColors>({ shirtColor: '#FFFFFF', pantsColor: '#1E3A8A' });
    const [suggestions, setSuggestions] = useState<TurbanSuggestion[]>([]);
    const [loadingState, setLoadingState] = useState<'suggestions' | 'image' | null>(null);
    const [generatingForColor, setGeneratingForColor] = useState<string | null>(null);
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
                setOutfitColors(colors);
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
            setSuggestions(result);
        } catch (error) {
            toast.error(t('errorSuggestions'));
            console.error(error);
        } finally {
            setLoadingState(null);
        }
    };
    
    const handleGenerateImage = async (turbanColor: string) => {
        if (loadingState) return;
        setGeneratingForColor(turbanColor);
        setLoadingState('image');

        try {
            if (mode === 'manual') {
                const result = await generateSikhLook(outfitColors, turbanColor);
                setGeneratedImage(`data:image/png;base64,${result}`);
            } else { // mode === 'upload'
                if (!outfitImage) {
                    toast.error("An outfit image is required.");
                    setLoadingState(null);
                    setGeneratingForColor(null);
                    return;
                }
                const file = await (await fetch(outfitImage)).blob();
                const result = await generateLookFromUpload(file, turbanColor);
                setGeneratedImage(`data:image/png;base64,${result}`);
            }
        } catch (error) {
            toast.error(t('errorImageGeneration'));
            console.error(error);
        } finally {
            setLoadingState(null);
            setGeneratingForColor(null);
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
    
    const handleGoBack = () => {
        setGeneratedImage(null);
    }

    const reset = () => {
        setMode(null);
        setOutfitColors({ shirtColor: '#FFFFFF', pantsColor: '#1E3A8A' });
        setSuggestions([]);
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


    if (generatedImage) {
        return (
            <div className="container mx-auto p-4 pt-24 max-w-2xl text-center animate-fade-in">
                 <h2 className="text-3xl font-bold mb-4">{t('yourLook')}</h2>
                 <div className="bg-white/20 backdrop-blur-2xl border border-white/20 rounded-xl shadow-lg overflow-hidden mb-6 p-4">
                    <img src={generatedImage} alt="Generated Look" className="mx-auto w-full rounded-lg" />
                 </div>
                 <div className="flex flex-wrap justify-center gap-4">
                     <button onClick={handleGoBack} className="px-6 py-2 bg-white/20 backdrop-blur-lg border border-white/20 text-slate-800 hover:bg-white/30 rounded-lg font-semibold transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95">Back</button>
                     <button onClick={handleDownload} className="px-6 py-2 bg-teal-600/70 backdrop-blur-lg border border-white/20 text-white rounded-lg font-semibold hover:bg-teal-500/90 transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95">{t('download')}</button>
                     <button onClick={handleSave} className="px-6 py-2 bg-green-600/70 backdrop-blur-lg border border-white/20 text-white rounded-lg font-semibold hover:bg-green-500/90 transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95">{t('saved')}</button>
                     <button onClick={reset} className="px-6 py-2 bg-red-600/70 backdrop-blur-lg border border-white/20 text-white rounded-lg font-semibold hover:bg-red-500/90 transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95">{t('startOver')}</button>
                 </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto p-4 pt-24 max-w-6xl">
            {!mode && (
                 <div key="mode-selection" className="grid md:grid-cols-2 gap-8 text-center animate-fade-in">
                    <button onClick={() => setMode('upload')} className="p-8 bg-white/20 backdrop-blur-2xl border border-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 group transform hover:scale-105 active:scale-95 shadow-lg">
                        <UploadIcon className="w-12 h-12 mx-auto mb-4 text-slate-500 group-hover:text-teal-500 transition-colors" />
                        <h3 className="text-xl font-semibold">{t('uploadOutfitPhoto')}</h3>
                    </button>
                    <button onClick={() => setMode('manual')} className="p-8 bg-white/20 backdrop-blur-2xl border border-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 group transform hover:scale-105 active:scale-95 shadow-lg">
                        <PaletteIcon className="w-12 h-12 mx-auto mb-4 text-slate-500 group-hover:text-teal-500 transition-colors" />
                        <h3 className="text-xl font-semibold">{t('pickColorsManually')}</h3>
                    </button>
                 </div>
            )}

            {mode === 'upload' && !outfitImage && (
                <div className="text-center animate-fade-in">
                    <button onClick={() => outfitFileRef.current?.click()} className="p-8 border-2 border-dashed border-slate-400/50 rounded-xl hover:border-teal-500/80 hover:bg-white/20 transition group w-full max-w-md mx-auto transform hover:scale-105 active:scale-95 backdrop-blur-lg">
                        <UploadIcon className="w-12 h-12 mx-auto mb-4 text-slate-500 group-hover:text-teal-500 transition-colors" />
                        <h3 className="text-xl font-semibold">{t('uploadOutfit')}</h3>
                    </button>
                    <input type="file" ref={outfitFileRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
            )}

            {mode === 'manual' && suggestions.length === 0 && (
                <div key="manual-mode" className="bg-white/20 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-xl p-6 sm:p-8 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* Mobile first layout: Preview on top */}
                        <div className="md:hidden p-4 rounded-lg flex flex-col items-center justify-center">
                            <OutfitPreview shirtColor={outfitColors.shirtColor} pantsColor={outfitColors.pantsColor} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-center">{t('pickColors')}</h3>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-600 mb-2">{t('shirtColor')}</label>
                                <div className="flex flex-wrap gap-3">
                                    {COMMON_SHIRT_COLORS.map(c => <ColorSwatch key={c.hex + c.name} color={c.hex} name={c.name} isSelected={outfitColors.shirtColor === c.hex} onClick={() => setOutfitColors({...outfitColors, shirtColor: c.hex})} />)}
                                    <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl border-2 border-white/50 overflow-hidden cursor-pointer bg-white/30 hover:border-teal-500/80 transition-colors">
                                        <DropperIcon className="w-8 h-8 text-slate-400" />
                                        <input type="color" value={outfitColors.shirtColor} onChange={(e) => setOutfitColors({...outfitColors, shirtColor: e.target.value})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Custom Color" />
                                    </div>
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">{t('pantsColor')}</label>
                                 <div className="flex flex-wrap gap-3">
                                    {COMMON_PANTS_COLORS.map(c => <ColorSwatch key={c.hex + c.name} color={c.hex} name={c.name} isSelected={outfitColors.pantsColor === c.hex} onClick={() => setOutfitColors({...outfitColors, pantsColor: c.hex})} />)}
                                    <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl border-2 border-white/50 overflow-hidden cursor-pointer bg-white/30 hover:border-teal-500/80 transition-colors">
                                        <DropperIcon className="w-8 h-8 text-slate-400" />
                                        <input type="color" value={outfitColors.pantsColor} onChange={(e) => setOutfitColors({...outfitColors, pantsColor: e.target.value})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Custom Color" />
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => handleGetSuggestions(outfitColors)} disabled={!!loadingState} className="w-full mt-6 px-6 py-3 bg-teal-600/70 backdrop-blur-md border border-white/20 text-white rounded-lg font-semibold hover:bg-teal-500/90 transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95 disabled:bg-teal-800/70 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20">{t('getSuggestions')}</button>
                        </div>
                        {/* Desktop layout: Preview on side */}
                        <div className="hidden md:flex p-6 rounded-lg flex-col items-center justify-center">
                            <OutfitPreview shirtColor={outfitColors.shirtColor} pantsColor={outfitColors.pantsColor} />
                        </div>
                    </div>
                </div>
            )}
            
            {suggestions.length > 0 && (
                 <div key="suggestions-mode" className="space-y-8 animate-fade-in">
                    {/* Sophisticated mobile layout */}
                    <div className="md:hidden bg-white/20 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-xl p-4">
                        <h3 className="text-lg font-semibold text-center mb-3">{t('yourOutfit')}</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-1/3 flex-shrink-0">
                                {mode === 'upload' && outfitImage ? (
                                    <img src={outfitImage} alt="Uploaded outfit" className="rounded-lg w-full object-cover aspect-square"/>
                                ) : (
                                    <OutfitPreview shirtColor={outfitColors.shirtColor} pantsColor={outfitColors.pantsColor} />
                                )}
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-full border border-white/50" style={{backgroundColor: outfitColors.shirtColor}}></div>
                                    <p className="text-sm">{t('shirtColor')}</p>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 rounded-full border border-white/50" style={{backgroundColor: outfitColors.pantsColor}}></div>
                                    <p className="text-sm">{t('pantsColor')}</p>
                                </div>
                                {mode === 'manual' && <button onClick={() => setSuggestions([])} className="w-full px-3 py-2 text-sm bg-white/20 backdrop-blur-md border border-white/20 text-slate-700 rounded-lg font-semibold hover:bg-white/30 transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95">{t('editColors')}</button>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-xl p-6 sm:p-8 grid md:grid-cols-3 gap-8 items-start">
                        <div className="hidden md:block md:col-span-1 space-y-4">
                            <h3 className="text-xl font-semibold text-center">{t('yourOutfit')}</h3>
                            <div className="p-2 rounded-lg bg-white/30">
                                {mode === 'upload' && outfitImage ? (
                                    <div className="space-y-3">
                                        <img src={outfitImage} alt="Uploaded outfit" className="rounded-lg w-full object-cover"/>
                                        <div className="p-3 bg-black/5 rounded-lg">
                                            <p className="text-sm font-semibold mb-2 text-center text-slate-700">Analyzed Colors</p>
                                            <div className="flex justify-around gap-2">
                                                <div className="flex flex-col items-center gap-2 text-center">
                                                   <div className="w-8 h-8 rounded-full border border-white/50 shadow-md" style={{backgroundColor: outfitColors.shirtColor}}></div>
                                                   <span className="text-xs">{t('shirtColor')}</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-2 text-center">
                                                   <div className="w-8 h-8 rounded-full border border-white/50 shadow-md" style={{backgroundColor: outfitColors.pantsColor}}></div>
                                                   <span className="text-xs">{t('pantsColor')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center aspect-w-3 aspect-h-4">
                                         <OutfitPreview shirtColor={outfitColors.shirtColor} pantsColor={outfitColors.pantsColor} />
                                    </div>
                                )}
                            </div>
                            {mode === 'manual' && <button onClick={() => setSuggestions([])} className="w-full px-4 py-2 bg-white/20 backdrop-blur-md border border-white/20 text-slate-700 rounded-lg font-semibold hover:bg-white/30 transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95">{t('editColors')}</button>}
                        </div>

                        <div className="md:col-span-2">
                            <h2 className="text-2xl font-bold text-center mb-6">{t('suggestions')}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                                {suggestions.sort((a,b) => a.rank - b.rank).map((suggestion) => (
                                    <button 
                                        key={suggestion.hexCode} 
                                        className={`bg-white/20 border border-white/20 backdrop-blur-xl rounded-xl shadow-lg p-4 text-left transform hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex flex-row items-center gap-4 ${generatingForColor || loadingState ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`} 
                                        onClick={() => !generatingForColor && handleGenerateImage(suggestion.hexCode)} 
                                        disabled={!!generatingForColor || !!loadingState}
                                    >
                                        {generatingForColor === suggestion.hexCode ? (
                                            <div className="w-full flex-grow flex items-center justify-center h-20">
                                                <SparklesIcon className="w-10 h-10 text-teal-400 animate-spin" />
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ backgroundColor: suggestion.hexCode }} className="w-16 h-16 rounded-full border-4 border-white/50 shadow-inner flex-shrink-0"></div>
                                                <div className="flex-grow">
                                                    <h4 className="text-base font-semibold">{suggestion.rank}. {suggestion.colorName}</h4>
                                                    <p className="text-sm text-slate-500 mt-1">{suggestion.reason}</p>
                                                </div>
                                            </>
                                        )}
                                    </button>
                                ))}
                            </div>
                            
                            {mode === 'manual' && (
                                <div className="p-6 bg-green-500/10 border-l-4 border-green-500/50 rounded-r-lg text-center backdrop-blur-sm">
                                <p className="text-green-800 font-medium">{t('uploadPrompt')}</p>
                                </div>
                            )}
                             {mode === 'upload' && (
                                <div className="p-6 bg-teal-500/10 border-l-4 border-teal-500/50 rounded-r-lg text-center backdrop-blur-sm">
                                    <p className="text-teal-800 font-medium">{t('uploadPrompt')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainScreen;