import React from 'react';
import { Translation } from '../types';
import ChevronRightIcon from './icons/ChevronRightIcon';
import { LANDING_PAGE_IMAGES } from '../constants';

const HERO_IMAGE_URL = 'https://images.pexels.com/photos/15099685/pexels-photo-15099685.jpeg';

const LandingScreen: React.FC<{
    onGetStarted: () => void;
    t: (key: keyof Translation) => string;
}> = ({ onGetStarted, t }) => {
    
    // Inline SVG icon components for features
    const FeatureIconAI = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
    );
    const FeatureIconVisualize = () => (
         <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
    const FeatureIconPersonalize = () => (
         <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.563c0 .324.38.5.64.313l2.7-1.745a.5.5 0 000-.868l-2.7-1.746A.5.5 0 009 6.063v3.5zm6 0c0 .324.38.5.64.313l2.7-1.745a.5.5 0 000-.868l-2.7-1.746a.5.5 0 00-.64.313v3.5z" />
        </svg>
    );

    const features = [
        { icon: <FeatureIconAI />, title: "AI-Powered Suggestions", description: "Our smart algorithm analyzes your outfit's colors to suggest perfect turban pairings based on color theory." },
        { icon: <FeatureIconVisualize />, title: "Instant Visualization", description: "See your new look come to life. Generate a photorealistic image of yourself with your chosen turban color." },
        { icon: <FeatureIconPersonalize />, title: "Personalized For You", description: "Whether you upload a photo or pick colors manually, every suggestion is tailored to your unique style." },
    ];
    
    return (
        <div className="w-full">
            {/* Hero Section */}
            <div className="relative w-full h-screen flex items-center justify-center">
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0" 
                    style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
                    aria-hidden="true"
                >
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                
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

            {/* Features Section */}
            <div className="py-20 bg-slate-900/30">
                <div className="container mx-auto px-4">
                    <h3 className="text-4xl font-bold text-center mb-12">How It Works</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center shadow-lg transition-transform transform hover:-translate-y-2">
                                {feature.icon}
                                <h4 className="text-2xl font-semibold mb-3">{feature.title}</h4>
                                <p className="text-slate-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Gallery Section */}
            <div className="py-20">
                 <div className="container mx-auto px-4">
                    <h3 className="text-4xl font-bold text-center mb-12">Style Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {LANDING_PAGE_IMAGES.slice(0, 8).map((src, index) => (
                             <div key={index} className="aspect-w-1 aspect-h-1 overflow-hidden rounded-xl shadow-lg border-2 border-slate-800/50">
                                <img src={src} alt={`Style example ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingScreen;