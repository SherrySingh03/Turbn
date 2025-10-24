import React from 'react';

const DropperIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V5.25a.75.75 0 01.75-.75z" clipRule="evenodd" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.3 1.373A6.002 6.002 0 005.12 5.12l-2.437 2.438a.75.75 0 000 1.06l2.438 2.437a6.002 6.002 0 006.18 3.748l2.845-2.845a.75.75 0 000-1.06l-2.845-2.845A6.002 6.002 0 0011.3 1.373zM9 9.375a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

export default DropperIcon;
