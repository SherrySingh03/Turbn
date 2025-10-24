import React from 'react';

interface OutfitPreviewProps {
    shirtColor: string;
    pantsColor: string;
}

const OutfitPreview: React.FC<OutfitPreviewProps> = ({ shirtColor, pantsColor }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-2">
            <svg viewBox="0 0 250 500" className="w-auto h-full max-h-96">
                <defs>
                    <clipPath id="shirt-clip">
                        <path d="M40,95 C40,40 210,40 210,95 L230,190 L125,270 L20,190 Z" />
                    </clipPath>
                </defs>
                <g id="mannequin-body" fill="#E0C0B1">
                    {/* Neck */}
                    <path d="M100,60 C100,20 150,20 150,60 L140,95 L110,95 Z" />
                </g>
                <g id="pants" fill={pantsColor} stroke="#999" strokeWidth="0.5">
                    <path d="M125,260 L60,265 L50,500 L125,500 Z" />
                    <path d="M125,260 L190,265 L200,500 L125,500 Z" />
                </g>
                <g id="shirt" fill={shirtColor} stroke="#999" strokeWidth="0.5">
                    {/* Main Body */}
                    <path d="M40,95 C40,40 210,40 210,95 L230,190 L125,270 L20,190 Z" />
                    {/* Sleeves */}
                    <path d="M210,95 L250,130 L230,190 Z" />
                    <path d="M40,95 L0,130 L20,190 Z" />
                </g>
            </svg>
        </div>
    );
};

export default OutfitPreview;