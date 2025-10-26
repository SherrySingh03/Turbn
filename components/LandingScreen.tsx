import React from 'react';
import { Translation } from '../types';
import ChevronRightIcon from './icons/ChevronRightIcon';

const HERO_IMAGE_URL = 'https://images.pexels.com/photos/15099685/pexels-photo-15099685.jpeg';

const LandingScreen: React.FC<{
    onGetStarted: () => void;
    t: (key: keyof Translation) => string;
}> = ({ onGetStarted, t }) => {
    
    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center z-0" 
                style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
                aria-hidden="true"
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 text-center p-8 bg-slate-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-lg mx-4 border border-white/10 animate-fade-in">
                <h2 className="text-6xl font-extrabold text-white mb-4 tracking-tight" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                    {t('appName')}
                </h2>
                <p className="text-xl text-slate-300 mb-8">
                    {t('tagline')}
                </p>
                <button
                    onClick={onGetStarted}
                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-900 bg-amber-500 rounded-full hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30"
                >
                    {t('getStarted')}
                    <ChevronRightIcon className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
};

export default LandingScreen;