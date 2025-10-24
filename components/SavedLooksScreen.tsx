import React, { useState, useEffect } from 'react';
import { Translation } from '../types';
import TrashIcon from './icons/TrashIcon';

const SavedLooksScreen: React.FC<{ t: (key: keyof Translation) => string; }> = ({ t }) => {
    const [looks, setLooks] = useState<{ image: string; timestamp: number }[]>([]);

    useEffect(() => {
        const savedLooks = JSON.parse(localStorage.getItem('savedLooks') || '[]');
        // Sort by most recent first
        savedLooks.sort((a: { timestamp: number }, b: { timestamp: number }) => b.timestamp - a.timestamp);
        setLooks(savedLooks);
    }, []);

    const handleDelete = (timestamp: number) => {
        const updatedLooks = looks.filter(look => look.timestamp !== timestamp);
        setLooks(updatedLooks);
        localStorage.setItem('savedLooks', JSON.stringify(updatedLooks));
    };

    return (
        <div className="container mx-auto p-4 pt-24 max-w-6xl animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-8">{t('savedLooks')}</h2>
            
            {looks.length === 0 ? (
                <div className="text-center text-slate-500 mt-16 bg-white/20 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-xl p-16 max-w-lg mx-auto">
                    <svg className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-semibold text-slate-800">{t('noSavedLooks')}</h3>
                    <p className="mt-1 text-sm text-slate-500">{t('noSavedLooksCTA')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {looks.map((look) => (
                        <div key={look.timestamp} className="group relative aspect-w-1 aspect-h-1">
                            <img 
                                src={look.image} 
                                alt={`Saved look from ${new Date(look.timestamp).toLocaleString()}`}
                                className="w-full h-full object-cover rounded-lg shadow-md border-2 border-white/20" 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 group-hover:backdrop-blur-md transition-all duration-300 rounded-lg flex items-center justify-center">
                                <button
                                    onClick={() => handleDelete(look.timestamp)}
                                    className="absolute top-2 right-2 p-2 bg-white/20 backdrop-blur-xl rounded-full text-red-500 hover:bg-white/40 hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                                    aria-label={t('deleteLook')}
                                    title={t('deleteLook')}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedLooksScreen;