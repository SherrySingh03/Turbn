import React, { useState, useEffect } from 'react';

interface LoadingIndicatorProps {
    title: string;
    messages: string[];
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ title, messages }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm text-center animate-fade-in p-4">
            <div className="bg-slate-800/50 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-xl p-8 sm:p-12">
                <div className="relative w-24 h-24 mb-6 mx-auto">
                    <div className="absolute inset-0 border-4 border-amber-500 rounded-full animate-ping opacity-60"></div>
                    <div className="absolute inset-2 border-4 border-slate-700/50 rounded-full"></div>
                     <div className="absolute inset-0 flex items-center justify-center text-amber-400">
                        <svg className="w-12 h-12 animate-spin" style={{ animationDuration: '2s'}} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M50 10C72.0914 10 90 27.9086 90 50C90 72.0914 72.0914 90 50 90" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 15"/>
                        </svg>
                     </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">{title}</h2>
                <div className="h-6">
                    <p className="text-slate-400 text-lg transition-all duration-500 ease-in-out animate-fade-in" key={currentMessageIndex}>
                        {messages[currentMessageIndex]}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;