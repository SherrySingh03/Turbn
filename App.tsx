
import React, { useState, useCallback, useEffect } from 'react';
import LandingScreen from './components/LandingScreen';
import MainScreen from './components/MainScreen';
import { Toaster } from 'react-hot-toast';
import { Language, Translation, OutfitColors, TurbanSuggestion } from './types';
import { TRANSLATIONS } from './constants';
import Header from './components/Header';

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<'landing' | 'main'>('landing');
    const [language, setLanguage] = useState<Language>('en');

    const t = useCallback((key: keyof Translation) => {
        return TRANSLATIONS[language][key];
    }, [language]);

    const handleGetStarted = () => {
        setCurrentScreen('main');
    };
    
    // Auto-delete saved images from localStorage after 24 hours
    useEffect(() => {
        const now = new Date().getTime();
        const savedLooks = JSON.parse(localStorage.getItem('savedLooks') || '[]');
        const filteredLooks = savedLooks.filter((look: { timestamp: number }) => {
            const twentyFourHours = 24 * 60 * 60 * 1000;
            return now - look.timestamp < twentyFourHours;
        });
        localStorage.setItem('savedLooks', JSON.stringify(filteredLooks));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
            <Toaster position="top-center" reverseOrder={false} />
             <Header language={language} setLanguage={setLanguage} t={t} />
            <main>
                {currentScreen === 'landing' && (
                    <LandingScreen onGetStarted={handleGetStarted} t={t} />
                )}
                {currentScreen === 'main' && <MainScreen t={t} />}
            </main>
        </div>
    );
};

export default App;
