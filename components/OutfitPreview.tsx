import React from 'react';

interface OutfitPreviewProps {
    shirtColor: string;
    pantsColor: string;
}

const MANNEQUIN_IMAGE_URL = 'https://storage.googleapis.com/aistudio-misc-assets/mannequin-realistic-transparent-bg.png';
const BACKGROUND_IMAGE_URL = 'https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

const OutfitPreview: React.FC<OutfitPreviewProps> = ({ shirtColor, pantsColor }) => {
    return (
        <div 
            className="relative w-full h-full p-2 rounded-2xl overflow-hidden shadow-lg"
            style={{ 
                backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '200px'
            }}
        >
            {/* Container for positioning the color and mannequin layers */}
            <div className="relative w-full h-full" style={{ minHeight: '200px' }}>
                {/* Layer 1: SVG with solid, opaque color fills clipped to shape */}
                <svg 
                    viewBox="0 0 300 600" 
                    className="absolute top-0 left-0 w-full h-full" 
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <clipPath id="shirt-clip-path">
                            <path d="M130,102 C130,95 170,95 170,102 L195,115 L220,130 L225,170 L210,180 L205,325 H95 L90,180 L75,170 L80,130 L105,115 Z" />
                        </clipPath>
                        <clipPath id="pants-clip-path">
                             <path d="M95,325 L85,580 H125 V450 C135,430 165,430 175,450 V580 H215 L205,325 Z" />
                        </clipPath>
                    </defs>
                    
                    <rect x="0" y="0" width="300" height="600" fill={pantsColor} clipPath="url(#pants-clip-path)" />
                    <rect x="0" y="0" width="300" height="600" fill={shirtColor} clipPath="url(#shirt-clip-path)" />
                </svg>

                {/* Layer 2: Mannequin image overlay for texture and shadows */}
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        backgroundImage: `url(${MANNEQUIN_IMAGE_URL})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center bottom',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
            </div>
        </div>
    );
};

export default OutfitPreview;