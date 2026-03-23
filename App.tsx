import React, { useCallback, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { StudioSessionProvider, useStudioSession } from './context/StudioSessionContext';
import MobileShell from './components/layout/MobileShell';
import type { AppTab } from './components/layout/BottomNav';
import WelcomeScreen from './screens/WelcomeScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import StudioStack from './screens/studio/StudioStack';
import LibraryScreen from './screens/LibraryScreen';
import InspoScreen from './screens/InspoScreen';
import ProfileScreen from './screens/ProfileScreen';
import type { Language, Translation } from './types';
import { TRANSLATIONS } from './constants';

const ONBOARD_KEY = 'turbn_onboarded';

function AppContent({
    language,
    setLanguage,
    tab,
    setTab,
    t,
    onGoWelcome,
}: {
    language: Language;
    setLanguage: (l: Language) => void;
    tab: AppTab;
    setTab: (tab: AppTab) => void;
    t: (key: keyof Translation) => string;
    onGoWelcome: () => void;
}) {
    const {
        studioPhase,
        goHub,
        handleBackToSuggestions,
        backFromRecommendations,
        backFromOutfitReview,
        startUpload,
        startManual,
    } = useStudioSession();

    const showBack = tab === 'studio' && studioPhase !== 'hub';
    const onBack = () => {
        if (studioPhase === 'result') handleBackToSuggestions();
        else if (studioPhase === 'recommendations') backFromRecommendations();
        else if (studioPhase === 'outfitReview') backFromOutfitReview();
        else goHub();
    };

    const openStudioUpload = () => {
        setTab('studio');
        startUpload();
    };

    const openStudioManual = () => {
        setTab('studio');
        startManual();
    };

    let body: React.ReactNode;
    switch (tab) {
        case 'discover':
            body = (
                <DiscoverScreen
                    t={t}
                    onOpenStudioUpload={openStudioUpload}
                    onOpenStudioManual={openStudioManual}
                />
            );
            break;
        case 'studio':
            body = <StudioStack />;
            break;
        case 'library':
            body = <LibraryScreen t={t} />;
            break;
        case 'inspo':
            body = <InspoScreen t={t} />;
            break;
        case 'profile':
            body = <ProfileScreen t={t} />;
            break;
        default:
            body = null;
    }

    return (
        <MobileShell
            activeTab={tab}
            onTabChange={setTab}
            language={language}
            setLanguage={setLanguage}
            t={t}
            showBack={showBack}
            onBack={showBack ? onBack : undefined}
            onTitleClick={onGoWelcome}
        >
            {body}
        </MobileShell>
    );
}

const App: React.FC = () => {
    const [language, setLanguage] = useState<Language>('en');
    const [tab, setTab] = useState<AppTab>('discover');
    const [onboarded, setOnboarded] = useState(() => localStorage.getItem(ONBOARD_KEY) === '1');
    const [showWelcome, setShowWelcome] = useState(false);

    const t = useCallback((key: keyof Translation) => {
        const value = TRANSLATIONS[language][key];
        if (Array.isArray(value)) {
            return String(value[0] || '');
        }
        return String(value);
    }, [language]);

    if (!onboarded || showWelcome) {
        return (
            <WelcomeScreen
                onDone={() => {
                    localStorage.setItem(ONBOARD_KEY, '1');
                    setOnboarded(true);
                    setShowWelcome(false);
                }}
                t={t}
            />
        );
    }

    return (
        <StudioSessionProvider language={language} t={t}>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: 'color-mix(in srgb, #2d3449 88%, transparent)',
                        color: '#dae2fd',
                        border: '1px solid color-mix(in srgb, #45464d 18%, transparent)',
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 20px 40px rgba(6, 14, 32, 0.35)',
                    },
                }}
            />
            <AppContent
                language={language}
                setLanguage={setLanguage}
                tab={tab}
                setTab={setTab}
                t={t}
                onGoWelcome={() => {
                    setShowWelcome(true);
                    setTab('discover');
                }}
            />
        </StudioSessionProvider>
    );
};

export default App;
