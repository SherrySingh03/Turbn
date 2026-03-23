import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingIndicatorProps {
    title: string;
    messages: string[];
    statusLine?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ title, messages, statusLine }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-surface/80 backdrop-blur-md animate-fade-in">
            <div className="flex-1 grid place-items-center p-6">
                <div className="rounded-[var(--radius-card)] glass-panel ghost-border max-w-sm w-full p-8 text-center shadow-ambient">
                    <div className="relative w-20 h-20 mb-6 mx-auto">
                        <div className="absolute inset-0 border-[3px] border-primary/50 rounded-full animate-ping opacity-40" />
                        <div className="absolute inset-2 border-2 border-surface-container-highest rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center text-primary">
                            <Sparkles className="w-10 h-10 animate-spin" style={{ animationDuration: '2.5s' }} />
                        </div>
                    </div>
                    <h2 className="font-display text-xl text-on-surface mb-3">{title}</h2>
                    <div className="min-h-[1.5rem]">
                        <p
                            className="text-on-surface-muted text-sm transition-all duration-500"
                            key={currentMessageIndex}
                        >
                            {messages[currentMessageIndex]}
                        </p>
                    </div>
                </div>
            </div>
            {statusLine && (
                <div className="shrink-0 flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-low/90 text-on-surface-muted text-xs border-t border-outline-variant/10 safe-area-pb">
                    <Sparkles className="w-3.5 h-3.5 text-tertiary" />
                    <span>{statusLine}</span>
                </div>
            )}
        </div>
    );
};

export default LoadingIndicator;
