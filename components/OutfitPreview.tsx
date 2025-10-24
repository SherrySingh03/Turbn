import React from 'react';

interface OutfitPreviewProps {
    shirtColor: string;
    pantsColor: string;
}

const OutfitPreview: React.FC<OutfitPreviewProps> = ({ shirtColor, pantsColor }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-2">
            <svg viewBox="0 0 250 500" className="w-auto h-full max-h-[450px]">
                <g id="mannequin-body">
                    {/* Neck */}
                    <path d="M105 50 C 105 20, 145 20, 145 50 L 140 80 L 110 80 Z" fill="#d4aa78" />
                </g>
                <g id="pants">
                    <path 
                        d="M70 240 L 70 480 C 70 490, 80 500, 90 500 L 120 500 L 120 250 C 120 250, 100 230, 70 240 Z M130 250 L 130 500 L 160 500 C 170 500, 180 490, 180 480 L 180 240 C 150 230, 130 250, 130 250 Z" 
                        fill={pantsColor} 
                        stroke="#000000"
                        strokeOpacity="0.1"
                        strokeWidth="1"
                    />
                </g>
                <g id="shirt">
                    <path 
                        d="M125 80 C 70 80, 50 100, 50 130 L 70 250 L 180 250 L 200 130 C 200 100, 180 80, 125 80 Z" 
                        fill={shirtColor}
                        stroke="#000000"
                        strokeOpacity="0.1"
                        strokeWidth="1"
                    />
                     {/* Left Sleeve */}
                    <path 
                        d="M50 130 C 30 140, 20 160, 25 180 L 50 200 L 70 180 C 60 160, 55 140, 50 130 Z"
                        fill={shirtColor}
                        stroke="#000000"
                        strokeOpacity="0.1"
                        strokeWidth="1"
                    />
                    {/* Right Sleeve */}
                    <path
                        d="M200 130 C 220 140, 230 160, 225 180 L 200 200 L 180 180 C 190 160, 195 140, 200 130 Z"
                        fill={shirtColor}
                        stroke="#000000"
                        strokeOpacity="0.1"
                        strokeWidth="1"
                    />
                </g>
            </svg>
        </div>
    );
};

export default OutfitPreview;
