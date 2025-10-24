import React from 'react';
import { Translation } from '../types';
import ChevronRightIcon from './icons/ChevronRightIcon';
import { LANDING_PAGE_IMAGES } from '../constants';

interface LandingScreenProps {
    onGetStarted: () => void;
    t: (key: keyof Translation) => string;
}

const FloatingImage: React.FC<{ imageUrl: string; animationClass: string; className: string }> = ({ imageUrl, animationClass, className }) => (
    <div
        className={`absolute rounded-2xl shadow-xl bg-cover bg-center ${className} ${animationClass}`}
        style={{ backgroundImage: `url(${imageUrl})` }}
    />
);

const LandingScreen: React.FC<LandingScreenProps> = ({ onGetStarted, t }) => {
    const images = LANDING_PAGE_IMAGES;
    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
            <style>
                {`
                    @keyframes float-up {
                        0% { transform: translateY(110vh) rotate(-10deg); opacity: 0; }
                        20% { opacity: 1; }
                        80% { opacity: 1; }
                        100% { transform: translateY(-110vh) rotate(10deg); opacity: 0; }
                    }
                    .animate-float-1 { animation: float-up 25s linear infinite; }
                    .animate-float-2 { animation: float-up 30s linear infinite 5s; }
                    .animate-float-3 { animation: float-up 20s linear infinite 10s; }
                    .animate-float-4 { animation: float-up 35s linear infinite 15s; }
                    .animate-float-5 { animation: float-up 28s linear infinite 2s; }
                    .animate-float-6 { animation: float-up 22s linear infinite 8s; }
                    .animate-float-7 { animation: float-up 32s linear infinite 12s; }
                    .animate-float-8 { animation: float-up 26s linear infinite 18s; }
                `}
            </style>
            
            <FloatingImage imageUrl={images[0]} animationClass="animate-float-1" className="w-40 h-60 top-0 left-[5%]" />
            <FloatingImage imageUrl={images[1]} animationClass="animate-float-2" className="w-32 h-48 top-0 left-[30%]" />
            <FloatingImage imageUrl={images[2]} animationClass="animate-float-3" className="w-48 h-72 top-0 left-[55%]" />
            <FloatingImage imageUrl={images[3]} animationClass="animate-float-4" className="w-36 h-52 top-0 left-[80%]" />
            <FloatingImage imageUrl={images[4]} animationClass="animate-float-5" className="w-28 h-40 top-0 left-[95%]" />
            <FloatingImage imageUrl={images[5]} animationClass="animate-float-6" className="w-32 h-48 top-0 left-[15%]" />
            <FloatingImage imageUrl={images[6]} animationClass="animate-float-7" className="w-40 h-60 top-0 left-[45%]" />
            <FloatingImage imageUrl={images[7]} animationClass="animate-float-8" className="w-36 h-52 top-0 left-[70%]" />

            <div className="relative z-10 text-center p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl max-w-lg mx-4">
                <h2 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    {t('appName')}
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                    {t('tagline')}
                </p>
                <button
                    onClick={onGetStarted}
                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-teal-600 rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform transform hover:scale-105"
                >
                    {t('getStarted')}
                    <ChevronRightIcon className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
};

export default LandingScreen;
