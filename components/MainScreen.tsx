import React, { useState, useRef } from 'react';
import { Translation, OutfitColors, TurbanSuggestion } from '../types';
import { getColorsFromImage, getTurbanSuggestions, recolorTurban, generateSikhLook } from '../services/geminiService';
import toast from 'react-hot-toast';
import UploadIcon from './icons/UploadIcon';
import PaletteIcon from './icons/PaletteIcon';
import SparklesIcon from './icons/SparklesIcon';
import { COMMON_PANTS_COLORS, COMMON_SHIRT_COLORS, TURBAN_STYLES } from '../constants';
import OutfitPreview from './OutfitPreview';

interface MainScreenProps {
    t: (key: keyof Translation) => string;
}

interface ColorSwatchProps {
    color: string;
    name: string;
    isSelected: boolean;
    onClick: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, name, isSelected, onClick }) => (
    <button onClick={onClick} className={`w-14 h-14 rounded-xl border-2 transition-transform transform hover:scale-110 ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-400' : 'border-gray-200'}`} style={{ backgroundColor: color }} title={name} />
);

const MainScreen: React.FC<MainScreenProps> = ({ t }) => {
    const [mode, setMode] = useState<'upload' | 'manual' | null>(null);
    const [outfitColors, setOutfitColors] = useState<OutfitColors>({ shirtColor: '#FFFFFF', pantsColor: '#1E3A8A' });
    const [suggestions, setSuggestions] = useState<TurbanSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [outfitImage, setOutfitImage] = useState<string | null>(null);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [selectedTurbanStyle, setSelectedTurbanStyle] = useState<string>(TURBAN_STYLES[0].id);
    
    const outfitFileRef = useRef<HTMLInputElement>(null);
    const userFileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: 'outfit' | 'user') => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const imageUrl = e.target?.result as string;
            if (type === 'outfit') {
                setOutfitImage(imageUrl);
                setIsLoading(t('analyzingColors'));
                try {
                    const colors = await getColorsFromImage(file);
                    setOutfitColors(colors);
                    await handleGetSuggestions(colors);
                } catch (error) {
                    toast.error(t('errorColorDetection'));
                    console.error(error);
                } finally {
                    setIsLoading(null);
                }
            } else {
                setUserImage(imageUrl);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleGetSuggestions = async (colors: OutfitColors) => {
        setIsLoading(t('generatingSuggestions'));
        try {
            const result = await getTurbanSuggestions(colors);
            setSuggestions(result);
        } catch (error) {
            toast.error(t('errorSuggestions'));
            console.error(error);
        } finally {
            setIsLoading(null);
        }
    };
    
    const handleGenerateImage = async (turbanColor: string) => {
        const styleName = TURBAN_STYLES.find(s => s.id === selectedTurbanStyle)?.name || 'turban';

        if (mode === 'manual') {
            setIsLoading(t('generatingLook'));
            try {
                const result = await generateSikhLook(outfitColors, turbanColor, styleName);
                setGeneratedImage(`data:image/png;base64,${result}`);
            } catch (error) {
                toast.error(t('errorImageGeneration'));
                console.error(error);
            } finally {
                setIsLoading(null);
            }
        } else { // mode === 'upload'
            if (!userImage) {
                toast.error(t('uploadYourself'));
                userFileRef.current?.click();
                return;
            }
            setIsLoading(t('generatingLook'));
            try {
                const file = await (await fetch(userImage)).blob();
                const result = await recolorTurban(file, turbanColor, styleName);
                setGeneratedImage(`data:image/png;base64,${result}`);
            } catch (error) {
                toast.error(t('errorImageGeneration'));
                console.error(error);
            } finally {
                setIsLoading(null);
            }
        }
    };


    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'TurbanMatch-Look.png';
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
        setUserImage(null);
        setGeneratedImage(null);
        setSelectedTurbanStyle(TURBAN_STYLES[0].id);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
                <SparklesIcon className="w-16 h-16 text-indigo-500 animate-pulse mb-4" />
                <p className="text-xl font-medium">{isLoading}</p>
            </div>
        );
    }

    if (generatedImage) {
        return (
            <div className="container mx-auto p-4 pt-24 max-w-2xl text-center">
                 <h2 className="text-3xl font-bold mb-4">{t('yourLook')}</h2>
                 <img src={generatedImage} alt="Generated Look" className="rounded-xl shadow-lg mx-auto mb-6 w-full" />
                 <div className="flex flex-wrap justify-center gap-4">
                     <button onClick={handleGoBack} className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition">Back</button>
                     <button onClick={handleDownload} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">{t('download')}</button>
                     <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">{t('saved')}</button>
                     <button onClick={reset} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">{t('startOver')}</button>
                 </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto p-4 pt-24 max-w-6xl">
            {!mode && (
                 <div className="grid md:grid-cols-2 gap-8 text-center">
                    <button onClick={() => setMode('upload')} className="p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition group">
                        <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-indigo-600" />
                        <h3 className="text-xl font-semibold">{t('uploadOutfitPhoto')}</h3>
                    </button>
                    <button onClick={() => setMode('manual')} className="p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition group">
                        <PaletteIcon className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-indigo-600" />
                        <h3 className="text-xl font-semibold">{t('pickColorsManually')}</h3>
                    </button>
                 </div>
            )}

            {mode === 'upload' && !outfitImage && (
                <div className="text-center">
                    <button onClick={() => outfitFileRef.current?.click()} className="p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition group w-full max-w-md mx-auto">
                        <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-indigo-600" />
                        <h3 className="text-xl font-semibold">{t('uploadOutfit')}</h3>
                    </button>
                    <input type="file" ref={outfitFileRef} onChange={(e) => handleFileChange(e, 'outfit')} className="hidden" accept="image/*" />
                </div>
            )}

            {mode === 'manual' && suggestions.length === 0 && (
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Left side: Color selectors */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-center">{t('pickColors')}</h3>
                        {/* Shirt Colors */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('shirtColor')}</label>
                            <div className="flex flex-wrap gap-3">
                                {COMMON_SHIRT_COLORS.map(c => <ColorSwatch key={c.hex + c.name} color={c.hex} name={c.name} isSelected={outfitColors.shirtColor === c.hex} onClick={() => setOutfitColors({...outfitColors, shirtColor: c.hex})} />)}
                                <input type="color" value={outfitColors.shirtColor} onChange={(e) => setOutfitColors({...outfitColors, shirtColor: e.target.value})} className="w-14 h-14 rounded-xl border-2 border-gray-200 cursor-pointer p-1" title="Custom Color" />
                            </div>
                        </div>
                         {/* Pants Colors */}
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('pantsColor')}</label>
                             <div className="flex flex-wrap gap-3">
                                {COMMON_PANTS_COLORS.map(c => <ColorSwatch key={c.hex + c.name} color={c.hex} name={c.name} isSelected={outfitColors.pantsColor === c.hex} onClick={() => setOutfitColors({...outfitColors, pantsColor: c.hex})} />)}
                                <input type="color" value={outfitColors.pantsColor} onChange={(e) => setOutfitColors({...outfitColors, pantsColor: e.target.value})} className="w-14 h-14 rounded-xl border-2 border-gray-200 cursor-pointer p-1" title="Custom Color" />
                            </div>
                        </div>
                        <button onClick={() => handleGetSuggestions(outfitColors)} className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">{t('getSuggestions')}</button>
                    </div>

                    {/* Right side: Preview */}
                    <div className="p-6 rounded-lg bg-gray-100 flex flex-col items-center justify-center aspect-w-3 aspect-h-4">
                        <OutfitPreview shirtColor={outfitColors.shirtColor} pantsColor={outfitColors.pantsColor} />
                    </div>
                </div>
            )}
            
            {suggestions.length > 0 && (
                 <div className="grid md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-1 space-y-4">
                        <h3 className="text-xl font-semibold text-center">{t('yourOutfit')}</h3>
                        <div className="p-2 rounded-lg bg-gray-100 flex flex-col items-center justify-center aspect-w-3 aspect-h-4">
                             <OutfitPreview shirtColor={outfitColors.shirtColor} pantsColor={outfitColors.pantsColor} />
                        </div>
                         {mode === 'manual' && <button onClick={() => setSuggestions([])} className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition">{t('editColors')}</button>}
                    </div>

                    <div className="md:col-span-2">
                        {/* Turban Style Gallery */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-center mb-4">{t('selectTurbanStyle')}</h2>
                            <div className="flex justify-center gap-4 overflow-x-auto pb-4">
                                {TURBAN_STYLES.map(style => (
                                    <button key={style.id} onClick={() => setSelectedTurbanStyle(style.id)} className={`flex-shrink-0 p-3 rounded-lg text-center transition ${selectedTurbanStyle === style.id ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'bg-white hover:bg-gray-100 shadow-sm'}`}>
                                        <img src={style.imageUrl} alt={style.name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-gray-200" />
                                        <p className="mt-2 text-xs font-semibold">{style.name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-center mb-4">{t('suggestions')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {suggestions.map((suggestion) => (
                                <div key={suggestion.hexCode} className="bg-white rounded-xl shadow-lg p-5 text-center transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer" onClick={() => handleGenerateImage(suggestion.hexCode)}>
                                    <div style={{ backgroundColor: suggestion.hexCode }} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-100 shadow-inner"></div>
                                    <h4 className="text-base font-semibold">{suggestion.colorName}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{suggestion.reason}</p>
                                </div>
                            ))}
                        </div>
                        
                        {mode === 'upload' && (
                            <div className="p-6 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg text-center">
                                <h3 className="text-lg font-semibold mb-2">{t('uploadYourself')}</h3>
                                <p className="text-indigo-800 mb-4 text-sm">{t('uploadPrompt')}</p>
                                <button onClick={() => userFileRef.current?.click()} className="inline-flex items-center px-6 py-2 bg-white text-indigo-600 border border-indigo-300 rounded-lg font-semibold hover:bg-indigo-100 transition">
                                <UploadIcon className="w-5 h-5 mr-2" />
                                {userImage ? 'Change Photo' : 'Upload Photo'}
                                </button>
                                <input type="file" ref={userFileRef} onChange={(e) => handleFileChange(e, 'user')} className="hidden" accept="image/*" />
                                {userImage && <img src={userImage} alt="User" className="w-24 h-24 rounded-full mx-auto mt-4 object-cover border-2 border-indigo-200" />}
                            </div>
                        )}

                        {mode === 'manual' && (
                            <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-r-lg text-center">
                            <p className="text-green-800 font-medium">{t('uploadPrompt')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainScreen;
