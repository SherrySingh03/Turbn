import React, { useEffect, useRef } from 'react';
import { Translation } from '../types';
import { LANDING_PAGE_IMAGES } from '../constants';

const HERO_IMAGE_URL = 'https://images.pexels.com/photos/29261349/pexels-photo-29261349.jpeg';
const NEW_ICON_DATA_URL = "https://www.svgrepo.com/show/66017/sikh.svg";

const LandingScreen: React.FC<{
    onGetStarted: () => void;
    t: (key: keyof Translation) => string;
}> = ({ onGetStarted, t }) => {

    // Observer for fade-in animations on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
            }
        );

        const elements = document.querySelectorAll('.reveal');
        elements.forEach((el) => observer.observe(el));

        return () => elements.forEach((el) => observer.unobserve(el));
    }, []);

    const howItWorksSteps = [
        {
            title: "1. Inspire",
            description: "Begin with your vision. Upload a photo of your outfit, and let our AI instantly analyze its color profile.",
            image: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/28ad2fdf-c9fa-4175-9ffc-2e61413eb6d5.png"
        },
        {
            title: "2. Define",
            description: "Prefer a hands-on approach? Manually select your shirt, pants, and highlight colors from our curated palettes.",
            image: "https://user-gen-media-assets.s3.amazonaws.com/gemini_images/28b943fa-944c-41fe-9ef3-1269db4b3352.png"
        },
        {
            title: "3. Discover",
            description: "Receive a ranked list of turban color suggestions, each with a stylish rationale grounded in color theory.",
            image: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/2af2921d-b652-4a4e-9169-bc860fe79fa6.png"
        },
        {
            title: "4. Visualize",
            description: "Bring your chosen combination to life. Generate a stunning, photorealistic image of your complete look in seconds.",
            image: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/ca83f878-3c6e-4671-8790-db269a40a378.png"
        }
    ];
    
    const galleryImages = [
        { src: LANDING_PAGE_IMAGES[1], layout: 'row-span-2' },
        { src: LANDING_PAGE_IMAGES[2], layout: '' },
        { src: LANDING_PAGE_IMAGES[3], layout: '' },
        { src: LANDING_PAGE_IMAGES[4], layout: 'row-span-2 col-span-2' },
        { src: LANDING_PAGE_IMAGES[6], layout: '' },
        { src: LANDING_PAGE_IMAGES[7], layout: '' },
        { src: LANDING_PAGE_IMAGES[8], layout: '' },
        { src: LANDING_PAGE_IMAGES[0], layout: 'row-span-2' },
        { src: LANDING_PAGE_IMAGES[9], layout: 'col-span-2' },
    ];

    return (
        <div className="w-full bg-slate-900 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center w-full h-full opacity-20" 
                    style={{ 
                        backgroundImage: `url(${HERO_IMAGE_URL})`,
                        backgroundBlendMode: 'luminosity', 
                        filter: 'grayscale(50%)'
                    }}
                ></div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                       Define Your Style.<br/>Perfect Your Look.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        {t('tagline')} Use the power of AI to discover the ideal turban color for any outfit, effortlessly.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="group relative inline-flex items-center justify-center h-14 px-10 text-lg font-bold text-slate-900 bg-amber-400 rounded-full hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-400/50 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-100 shadow-2xl shadow-amber-500/20"
                    >
                       <span className="relative z-10">{t('getStarted')}</span>
                       <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></span>
                    </button>
                </div>
            </section>
            
            {/* How it Works Narrative Section */}
            <section className="py-20 md:py-24 bg-slate-900/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">
                    <div className="text-center max-w-3xl mx-auto reveal">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">An Effortless Process</h2>
                        <p className="text-slate-400 text-lg">From inspiration to visualization in four simple, elegant steps.</p>
                    </div>
                    {howItWorksSteps.map((step, index) => (
                        <div key={step.title} className={`grid md:grid-cols-2 gap-12 items-center reveal`}>
                            <div className={`text-left ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                                <h3 className="text-3xl font-bold text-amber-400 mb-4">{step.title}</h3>
                                <p className="text-slate-300 text-lg leading-relaxed">{step.description}</p>
                            </div>
                            <div className={`rounded-xl overflow-hidden shadow-2xl border-2 border-slate-800/50 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                                <img src={step.image} alt={step.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>


            {/* Gallery Section */}
            <section className="py-24 bg-slate-900">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 reveal">Inspiration Gallery</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mb-12 reveal">See how color combinations create stunning looks.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[250px] gap-4">
                        {galleryImages.map((img, index) => (
                             <div key={index} className={`group relative overflow-hidden rounded-xl shadow-lg border-2 border-slate-800/50 ${img.layout} reveal`} style={{ transitionDelay: `${index * 75}ms`}}>
                                <img src={img.src} alt={`Style example ${index + 1}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="font-bold text-lg">Elegant Style</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 text-center bg-slate-800/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 reveal">
                    <img src={NEW_ICON_DATA_URL} alt="Turbn Logo" className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-slate-700/50 shadow-lg" />
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to find your perfect look?</h2>
                    <p className="text-slate-400 max-w-xl mx-auto mb-8">Start creating your unique style combinations in just a few clicks.</p>
                    <button
                        onClick={onGetStarted}
                        className="px-10 py-4 text-lg font-bold text-slate-900 bg-amber-400 rounded-full hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-400/50 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-100 shadow-2xl animate-pulse-glow"
                    >
                        {t('getStarted')}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default LandingScreen;