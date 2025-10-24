import React, { useState, useCallback, useEffect } from 'react';
import LandingScreen from './components/LandingScreen';
import MainScreen from './components/MainScreen';
import { Toaster } from 'react-hot-toast';
import { Language, Translation } from './types';
import { TRANSLATIONS } from './constants';
import Header from './components/Header';
import SavedLooksScreen from './components/SavedLooksScreen';

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<'landing' | 'main' | 'saved'>('landing');
    const [language, setLanguage] = useState<Language>('en');

    const t = useCallback((key: keyof Translation) => {
        const value = TRANSLATIONS[language][key];
        // Ensure we always return a string for components expecting it.
        if (Array.isArray(value)) {
            return String(value[0] || '');
        }
        return String(value);
    }, [language]);

    const handleGetStarted = () => {
        setCurrentScreen('main');
    };

    const goToHome = () => {
        setCurrentScreen('landing');
    };

    const goToSaved = () => {
        setCurrentScreen('saved');
    }
    
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
        <div className="min-h-screen text-slate-800 antialiased">
            <Toaster position="top-center" reverseOrder={false} toastOptions={{
                style: {
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#1e293b', // slate-800
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }
            }}/>
             <Header language={language} setLanguage={setLanguage} t={t} onHomeClick={goToHome} onSavedClick={goToSaved} />
            <main>
                {currentScreen === 'landing' && (
                    <LandingScreen onGetStarted={handleGetStarted} t={t} />
                )}
                {currentScreen === 'main' && <MainScreen t={t} language={language} />}
                {currentScreen === 'saved' && <SavedLooksScreen t={t} />}
            </main>
        </div>
    );
};

export default App;