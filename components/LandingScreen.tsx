import React, { useMemo, useState, useEffect } from 'react';
import { Translation } from '../types';
import ChevronRightIcon from './icons/ChevronRightIcon';
import { LANDING_PAGE_IMAGES } from '../constants';

const LandingScreen: React.FC<{
    onGetStarted: () => void;
    t: (key: keyof Translation) => string;
}> = ({ onGetStarted, t }) => {
    
    const [numColumns, setNumColumns] = useState(5);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setNumColumns(2);
            } else if (window.innerWidth < 1024) {
                setNumColumns(3);
            } else {
                setNumColumns(5);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const columns = useMemo(() => {
        const shuffled = [...LANDING_PAGE_IMAGES].sort(() => 0.5 - Math.random());
        const cols = Array.from({ length: numColumns }, () => [] as string[]);
        shuffled.forEach((img, i) => {
            cols[i % numColumns].push(img);
        });
        // Duplicate to ensure columns are long enough for a seamless animation loop
        return cols.map(col => [...col, ...col]);
    }, [numColumns]);

    const durations = useMemo(() => ['40s', '60s', '35s', '55s', '45s'], []);

    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
            <style>
                {`
                .image-stream {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: space-around;
                    overflow: hidden;
                    z-index: 0;
                    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
                    mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
                }
                .image-column {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem; /* 24px */
                    width: calc(100% / 5 - 1.5rem); /* Default for desktop */
                    animation: endless-scroll linear infinite;
                }
                .image-column img {
                    border-radius: 1.5rem; /* 24px */
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
                    width: 100%;
                    height: auto;
                    aspect-ratio: 2 / 3;
                    object-fit: cover;
                }
                @media (max-width: 1023px) {
                    .image-column {
                        width: calc(100% / 3 - 1.5rem);
                    }
                }
                @media (max-width: 767px) {
                    .image-column {
                        width: calc(100% / 2 - 1.5rem);
                    }
                }
                `}
            </style>
            
            <div className="image-stream" aria-hidden="true">
                {columns.map((col, i) => (
                    <div key={i} className="image-column" style={{ animationDuration: durations[i] }}>
                        {col.map((src, j) => <img key={j} src={src} alt="" />)}
                    </div>
                ))}
            </div>

            <div className="relative z-10 text-center p-8 bg-slate-50/50 backdrop-blur-3xl rounded-3xl shadow-2xl max-w-lg mx-4 border border-white/30 animate-fade-in">
                <h2 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight" style={{textShadow: '0 1px 2px rgba(255,255,255,0.5)'}}>
                    {t('appName')}
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                    {t('tagline')}
                </p>
                <button
                    onClick={onGetStarted}
                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-teal-600/70 backdrop-blur-md border border-teal-500/50 rounded-full hover:bg-teal-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/20 hover:shadow-teal-400/30"
                >
                    {t('getStarted')}
                    <ChevronRightIcon className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
};

export default LandingScreen;