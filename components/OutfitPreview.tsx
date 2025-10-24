import React from 'react';

interface OutfitPreviewProps {
    shirtColor: string;
    pantsColor: string;
}

const OutfitPreview: React.FC<OutfitPreviewProps> = ({ shirtColor, pantsColor }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-2">
            <svg viewBox="0 0 300 600" className="w-auto h-full max-h-[450px]" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <clipPath id="shirt-clip">
                        <path d="M79,90 C85,120 70,140 60,165 L60,175 L40,190 L75,200 V350 H225 V200 L260,190 L240,175 V165 C230,140 215,120 221,90 Q150,75 79,90 Z" />
                    </clipPath>
                    <clipPath id="pants-clip">
                         <path d="M75,350 H225 L220,580 Q150,600 80,580 Z" />
                    </clipPath>
                </defs>
                
                {/* Mannequin Body */}
                <g id="mannequin-base" fill="#EAEAEA" stroke="#DCDCDC" strokeWidth="0.5">
                    {/* Neck */}
                    <path d="M140,55 C140,80 160,80 160,55 Z" />
                    {/* Body */}
                    <path d="M79,90 C85,120 70,140 60,165 L40,190 L80,580 Q150,600 220,580 L260,190 L240,165 C230,140 215,120 221,90 Q150,75 79,90 Z" />
                </g>

                {/* Clothing using Clip Paths for clean coloring */}
                <g>
                    <rect x="0" y="0" width="300" height="600" fill={pantsColor} clipPath="url(#pants-clip)" />
                    <rect x="0" y="0" width="300" height="600" fill={shirtColor} clipPath="url(#shirt-clip)" />
                </g>

            </svg>
        </div>
    );
};

export default OutfitPreview;