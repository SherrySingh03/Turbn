import React from 'react';

interface OutfitPreviewProps {
    shirtColor: string;
    pantsColor: string;
}

const OutfitPreview: React.FC<OutfitPreviewProps> = ({ shirtColor, pantsColor }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-2">
            <svg viewBox="0 0 300 600" className="w-auto h-full max-h-[450px]">
                <defs>
                    <clipPath id="shirt-clip">
                        <path d="M60,100 Q150,85 240,100 L260,200 L225,220 L225,350 L75,350 L75,220 L40,200 Z" />
                    </clipPath>
                    <clipPath id="pants-clip">
                         <path d="M75,350 L225,350 L215,580 Q150,600 85,580 Z" />
                    </clipPath>
                </defs>
                
                {/* Mannequin Body */}
                <g id="mannequin-base" fill="#E0E0E0" stroke="#BDBDBD" strokeWidth="1">
                    {/* Head/Neck */}
                    <path d="M125,0 C125,0 120,50 150,50 C180,50 175,0 175,0 Z" fill="#F5F5F5" stroke="#E0E0E0" />
                    <rect x="135" y="50" width="30" height="40" fill="#F5F5F5" stroke="#E0E0E0" />
                    {/* Body */}
                    <path d="M60,100 Q150,85 240,100 L260,200 L215,580 Q150,600 85,580 L40,200 Z" />
                </g>

                {/* Clothing using Clip Paths for clean coloring */}
                <rect x="0" y="0" width="300" height="600" fill={pantsColor} clipPath="url(#pants-clip)" />
                <rect x="0" y="0" width="300" height="600" fill={shirtColor} clipPath="url(#shirt-clip)" />

            </svg>
        </div>
    );
};

export default OutfitPreview;
