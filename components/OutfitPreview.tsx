
import React from 'react';
import { TopType } from '../types';
interface OutfitPreviewProps {
    shirtColor: string;
    pantsColor: string;
    topType: TopType;
    highlightsColor?: string | null;
}

const OutfitPreview: React.FC<OutfitPreviewProps> = ({ shirtColor, pantsColor, topType, highlightsColor }) => {
    return (
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 w-full h-full">
                <svg
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 250 500"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* SKIN / BODY */}
                    <g id="body" fill="#f2d6b3" stroke="#7a5e3a" strokeWidth="1">
                        {/* Head */}
                        <ellipse cx="125" cy="55" rx="25" ry="30" />
                        {/* Neck */}
                        <rect x="112" y="85" width="26" height="20" rx="5" />
                    </g>

                    {/* SHIRT (upper body) */}
                    <g id="shirt" fill={shirtColor} stroke="#222" strokeWidth="0.8">
                        {/* Arms */}
                        <path d="M55,120 Q45,200 60,260 Q70,270 80,260 Q65,200 80,130 Q72,120 55,120Z" />
                        <path d="M195,120 Q205,200 190,260 Q180,270 170,260 Q185,200 170,130 Q178,120 195,120Z" />
                        
                        {topType === 'tshirt' ? (
                            <path d="M80,105 Q125,100 170,105 L185,160 Q188,200 125,210 Q62,200 65,160 L80,105Z" />
                        ) : (
                            <>
                                <path d="M80,105 L65,160 Q62,200 125,210 Q188,200 185,160 L170,105 M100,105 L112,97 L138,97 L150,105" />
                                {/* Buttons */}
                                <g id="buttons" fill="rgba(0,0,0,0.2)" stroke="#111" strokeWidth="0.5">
                                    <circle cx="125" cy="130" r="3" />
                                    <circle cx="125" cy="155" r="3" />
                                    <circle cx="125" cy="180" r="3" />
                                </g>
                            </>
                        )}
                    </g>
                    
                    {highlightsColor && (
                        <g id="highlights" fill={highlightsColor} stroke="none">
                            {/* Chest Emblem */}
                            <path transform="translate(112, 130) scale(0.2)" d="M 20,30 Q 50,0 80,30 L 80,70 Q 50,100 20,70 Z" />
                        </g>
                    )}

                    {/* PANTS (lower body) */}
                    <g id="pants" fill={pantsColor} stroke="#111" strokeWidth="0.8">
                        <path d="M85,210 Q125,220 165,210 Q175,270 165,330 Q160,400 155,480 Q145,485 130,480 Q125,380 125,310 Q115,380 110,480 Q95,485 85,480 Q80,400 85,330 Q75,270 85,210Z" />
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default OutfitPreview;
