import React from 'react';

const DropperIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-3.483 0l-1.26.98A1.875 1.875 0 0 1 3.25 18v-2.187c0-.528.21-1.02.582-1.393l3.418-3.417a3 3 0 0 0 4.242 0l1.82-1.82A3 3 0 0 0 9.53 5.47l-1.26-.98A1.875 1.875 0 0 1 6.75 3v2.187c0 .528.21 1.02.582 1.393l3.418 3.417a3 3 0 0 0 0 4.242l-1.82 1.82Z" />
    </svg>
);

export default DropperIcon;
