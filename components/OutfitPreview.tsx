
import React from 'react';
interface OutfitPreviewProps {
    shirtColor: string;
    pantsColor: string;
    highlightsColor?: string | null;
}

const MANNEQUIN_IMAGE_URL = 'https://storage.googleapis.com/aistudio-misc-assets/mannequin-realistic-transparent-bg.png';
const BACKGROUND_IMAGE_URL = 'https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

const OutfitPreview: React.FC<OutfitPreviewProps> = ({ shirtColor, pantsColor, highlightsColor }) => {
    return (
        <div 
            className="relative w-full h-full p-2 rounded-2xl overflow-hidden shadow-lg"
            style={{ 
                backgroundPosition: 'center',
                minHeight: '200px'
            }}
        >
            {/* Container for positioning the color and mannequin layers */}
            <div className="relative w-full h-full" style={{ minHeight: '200px' }}>
                {/* Layer 1: SVG with solid, opaque color fills clipped to shape */}
                <svg
                    width="100%"
                    height="400"
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
                            {/* Central V-shape pattern */}
                            <path d="M125,115 Q135,125 140,140" />
                            <path d="M125,115 Q115,125 110,140" />
                            
                            {/* Outer decorative curves */}
                            <path d="M140,140 Q145,155 135,165" />
                            <path d="M110,140 Q105,155 115,165" />
                            
                            {/* Center line decoration */}
                            <path d="M125,115 L125,170" strokeWidth="1.5" />
                            <circle cx="125" cy="175" r="3" fill={highlightsColor} stroke="none" />
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
