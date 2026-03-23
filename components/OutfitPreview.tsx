import React from 'react';
import type { AttireContext } from '../types';

interface OutfitPreviewProps {
    attireContext: AttireContext;
    shirtColor: string;
    pantsColor: string;
    highlightsColor?: string | null;
}

const OutfitPreview: React.FC<OutfitPreviewProps> = ({
    attireContext,
    shirtColor,
    pantsColor,
    highlightsColor,
}) => {
    return (
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 w-full h-full">
                <svg
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 250 500"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="body" fill="#f2d6b3" stroke="#7a5e3a" strokeWidth="1">
                        <ellipse cx="125" cy="55" rx="25" ry="30" />
                        <rect x="112" y="85" width="26" height="20" rx="5" />
                    </g>

                    {attireContext === 'casual' && (
                        <g id="top-casual" fill={shirtColor} stroke="#222" strokeWidth="0.8">
                            <path d="M55,120 Q45,200 60,260 Q70,270 80,260 Q65,200 80,130 Q72,120 55,120Z" />
                            <path d="M195,120 Q205,200 190,260 Q180,270 170,260 Q185,200 170,130 Q178,120 195,120Z" />
                            <path d="M80,105 Q125,100 170,105 L185,160 Q188,200 125,210 Q62,200 65,160 L80,105Z" />
                        </g>
                    )}

                    {attireContext === 'formal' && (
                        <g id="top-formal" fill={shirtColor} stroke="#222" strokeWidth="0.8">
                            <path d="M55,120 Q45,200 60,260 Q70,270 80,260 Q65,200 80,130 Q72,120 55,120Z" />
                            <path d="M195,120 Q205,200 190,260 Q180,270 170,260 Q185,200 170,130 Q178,120 195,120Z" />
                            <path d="M80,105 L65,160 Q62,200 125,210 Q188,200 185,160 L170,105 M100,105 L112,97 L138,97 L150,105" />
                            <g id="buttons" fill="rgba(0,0,0,0.2)" stroke="#111" strokeWidth="0.5">
                                <circle cx="125" cy="130" r="3" />
                                <circle cx="125" cy="155" r="3" />
                                <circle cx="125" cy="180" r="3" />
                            </g>
                        </g>
                    )}

                    {attireContext === 'ceremonial' && (
                        <g id="top-ceremonial-kurta" fill={shirtColor} stroke="#222" strokeWidth="0.8">
                            {/* Long sleeves */}
                            <path d="M52,118 Q40,210 55,275 Q62,285 78,278 Q68,210 82,128 Q72,118 52,118Z" />
                            <path d="M198,118 Q210,210 195,275 Q188,285 172,278 Q182,210 168,128 Q178,118 198,118Z" />
                            {/* Kurta body — knee length, slight flare */}
                            <path d="M82,108 L68,175 Q65,230 72,285 Q78,295 125,300 Q172,295 178,285 Q185,230 182,175 L168,108 Q125,102 82,108Z" />
                            <g fill="rgba(0,0,0,0.15)" stroke="#111" strokeWidth="0.4">
                                <circle cx="125" cy="135" r="2.5" />
                                <circle cx="125" cy="158" r="2.5" />
                                <circle cx="125" cy="181" r="2.5" />
                                <circle cx="125" cy="204" r="2.5" />
                            </g>
                        </g>
                    )}

                    {highlightsColor && attireContext !== 'ceremonial' && (
                        <g id="highlights" fill={highlightsColor} stroke="none">
                            <path
                                transform="translate(112, 130) scale(0.2)"
                                d="M 20,30 Q 50,0 80,30 L 80,70 Q 50,100 20,70 Z"
                            />
                        </g>
                    )}
                    {highlightsColor && attireContext === 'ceremonial' && (
                        <g id="highlights-kurta" fill={highlightsColor} stroke="none">
                            <rect x="118" y="145" width="14" height="18" rx="2" transform="rotate(-4 125 154)" />
                        </g>
                    )}

                    {attireContext === 'ceremonial' ? (
                        <g id="pants-pyjama" fill={pantsColor} stroke="#111" strokeWidth="0.8">
                            {/* Looser straight pajama */}
                            <path d="M78,295 Q125,305 172,295 Q178,360 172,420 Q168,485 158,492 Q145,495 130,488 Q125,400 125,340 Q115,400 110,488 Q95,495 82,492 Q72,485 78,420 Q72,360 78,295Z" />
                        </g>
                    ) : (
                        <g id="pants" fill={pantsColor} stroke="#111" strokeWidth="0.8">
                            <path d="M85,210 Q125,220 165,210 Q175,270 165,330 Q160,400 155,480 Q145,485 130,480 Q125,380 125,310 Q115,380 110,480 Q95,485 85,480 Q80,400 85,330 Q75,270 85,210Z" />
                        </g>
                    )}
                </svg>
            </div>
        </div>
    );
};

export default OutfitPreview;
