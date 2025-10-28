
import React from 'react';
interface OutfitPreviewProps {
    shirtColor: string;
    pantsColor: string;
    highlightsColor?: string | null;
}

const OutfitPreview: React.FC<OutfitPreviewProps> = ({ shirtColor, pantsColor, highlightsColor }) => {
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
                    <rect x="112" y="85" width="26" height="12" rx="5" />
                    {/* Arms */}
                    <path
                        d="M55,120 
                        Q45,200 60,260 
                        Q70,270 80,260 
                        Q65,200 80,130 
                        Q72,120 55,120Z"
                    />
                    <path
                        d="M195,120 
                        Q205,200 190,260 
                        Q180,270 170,260 
                        Q185,200 170,130 
                        Q178,120 195,120Z"
                    />
                    {/* Legs */}
                    </g>

                    {/* SHIRT (upper body) */}
                    <g id="shirt" fill={shirtColor} stroke="#222" strokeWidth="0.8">
                    <path
                        d="
                        M80,100 
                        Q125,80 170,100 
                        Q180,120 185,160 
                        Q188,200 125,210 
                        Q62,200 65,160 
                        Q70,120 80,100Z"
                    />
                    </g>
                    
                    {highlightsColor && (
                        <g id="highlights" stroke={highlightsColor} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            {/* Chest Emblem */}
                            <g transform="translate(112, 130) scale(0.25)">
                                <path d="M 20,30 Q 50,0 80,30 L 80,70 Q 50,100 20,70 Z" />
                                <circle cx="50" cy="50" r="10" fill={highlightsColor} stroke="none" />
                            </g>
                            {/* Collar Details */}
                             <g transform="translate(0, 95) scale(1)">
                                {/* Left Collar */}
                                <path d="M 90,5 L 85,15 L 95,15 Z" />
                                {/* Right Collar */}
                                <path d="M 160,5 L 165,15 L 155,15 Z" />
                            </g>
                            {/* Sleeve Cuffs */}
                            <path d="M 67, 160 A 10 10 0 0 1 83, 160" />
                            <path d="M 183, 160 A 10 10 0 0 0 167, 160" />
                        </g>
                    )}

                    {/* PANTS (lower body) */}
                    <g id="pants" fill={pantsColor} stroke="#111" strokeWidth="0.8">
                    <path
                        d="
                        M85,210 
                        Q125,220 165,210 
                        Q175,270 165,330 
                        Q160,400 155,480 
                        Q145,485 130,480 
                        Q125,380 125,310 
                        Q115,380 110,480 
                        Q95,485 85,480 
                        Q80,400 85,330 
                        Q75,270 85,210Z"
                    />
                    </g>

                    {/* OUTLINE */}
                    <path
                    d="M125,20 Q140,25 145,50 Q150,80 180,100 Q200,150 190,250 Q175,380 165,480 Q155,495 125,495 Q95,495 85,480 Q75,380 60,250 Q50,150 70,100 Q100,80 105,50 Q110,25 125,20Z"
                    fill="none"
                    stroke="#333"
                    strokeWidth="0"
                    opacity="0.25"
                    />
                </svg>
            </div>
        </div>
    );
};

export default OutfitPreview;