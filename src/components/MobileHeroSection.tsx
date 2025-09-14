import { useState, useEffect, useRef } from "react";
import { Play, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroesData from "@/data/heroes.json";

const MobileHeroSection = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroesData.length);
        }, 6000); // Faster auto-slide for mobile

        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };


    const handleWatchNow = (heroId: string) => {
        navigate(`/watch/${heroId}`);
    };

    // Swipe functionality
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const touchRef = useRef<HTMLDivElement>(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            // Swipe left - go to next slide
            setCurrentSlide((prev) => (prev + 1) % heroesData.length);
        }
        if (isRightSwipe) {
            // Swipe right - go to previous slide
            setCurrentSlide((prev) => (prev - 1 + heroesData.length) % heroesData.length);
        }
    };

    const currentHero = heroesData[currentSlide];

    return (
        <section
            className="relative h-96 sm:h-[500px] overflow-hidden mobile-hero-section"
            ref={touchRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Hero Slides */}
            <div className="relative w-full h-full">
                {heroesData.map((hero, index) => (
                    <div
                        key={hero.id}
                        className={`absolute inset-0 transition-all duration-800 ease-in-out ${index === currentSlide
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105'
                            }`}
                    >
                        {/* Mobile-Optimized Background Image */}
                        <div className="absolute inset-0 mobile-hero-bg">
                            <img
                                src={hero.backgroundImage}
                                alt={hero.title}
                                className="w-full h-full object-contain object-center mobile-hero-image"
                                style={{
                                    minHeight: '24rem', // h-96 equivalent
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    objectPosition: 'center'
                                }}
                            />
                        </div>

                        {/* Mobile-Optimized Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/40" />

                        {/* Mobile Content */}
                        <div className="relative z-10 flex items-end h-full pb-6">
                            <div className="w-full px-4">
                                <div className="space-y-3 animate-fade-in">
                                    {/* Subtitle */}
                                    <p className="text-accent font-medium text-xs tracking-wide uppercase">
                                        {hero.subtitle}
                                    </p>

                                    {/* Title */}
                                    <h1 className="text-2xl font-bold text-foreground leading-tight">
                                        {hero.title}
                                    </h1>

                                    {/* Mobile Metadata */}
                                    <div className="flex items-center space-x-2 text-foreground-muted text-sm">
                                        <span className="bg-accent/20 text-accent px-3 py-1 rounded text-sm font-medium">
                                            {hero.year}
                                        </span>
                                        <span>{hero.rating}</span>
                                        <span>•</span>
                                        <span className="truncate">{hero.genre.split(',')[0]}</span>
                                    </div>

                                    {/* Mobile Description */}
                                    <p className="text-sm text-foreground-muted leading-relaxed line-clamp-2">
                                        {hero.description}
                                    </p>

                                    {/* Mobile Action Buttons */}
                                    <div className="flex space-x-3 pt-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleWatchNow(hero.id)}
                                            className="bg-primary hover:bg-primary-dark text-primary-foreground px-6 py-3 text-sm font-semibold flex-1 rounded-lg min-w-0"
                                        >
                                            <Play className="w-4 h-4 mr-2" fill="currentColor" />
                                            Watch Now
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleWatchNow(hero.id)}
                                            className="px-4 py-3 text-sm font-semibold rounded-lg flex-shrink-0"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {/* Mobile Slide Indicators */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2">
                    {heroesData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                ? 'bg-primary scale-125'
                                : 'bg-white/50 hover:bg-white/70'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MobileHeroSection;
