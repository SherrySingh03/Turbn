import React from 'react';

interface OutfitPreviewProps {
    shirtColor: string;
    pantsColor: string;
}

const OutfitPreview: React.FC<OutfitPreviewProps> = ({ shirtColor, pantsColor }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-2">
            <svg viewBox="0 0 200 400" className="w-auto h-full max-h-80">
                <g id="pants">
                    <path
                        d="M100 220 L50 220 L40 400 L100 400 Z"
                        fill={pantsColor}
                        stroke="#999"
                        strokeWidth="0.5"
                    />
                    <path
                        d="M100 220 L150 220 L160 400 L100 400 Z"
                        fill={pantsColor}
                        stroke="#999"
                        strokeWidth="0.5"
                    />
                </g>
                <g id="shirt">
                    <path
                        d="M100 40 C120 40 140 50 160 80 L170 150 L100 225 L30 150 L40 80 C60 50 80 40 100 40 Z"
                        fill={shirtColor}
                        stroke="#999"
                        strokeWidth="0.5"
                    />
                    {/* Sleeves */}
                    <path d="M160 80 L190 110 L170 150 Z" fill={shirtColor} stroke="#999" strokeWidth="0.5" />
                    <path d="M40 80 L10 110 L30 150 Z" fill={shirtColor} stroke="#999" strokeWidth="0.5" />
                </g>
                 <g id="neck">
                    <path d="M100 40 C90 60 110 60 100 40" fill="#E0C0B1" />
                </g>
            </svg>
        </div>
    );
};

export default OutfitPreview;
