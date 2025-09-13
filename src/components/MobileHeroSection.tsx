import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Plus, Info } from "lucide-react";
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

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroesData.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroesData.length) % heroesData.length);
    };

    const handleWatchNow = (heroId: string) => {
        navigate(`/watch/${heroId}`);
    };

    const currentHero = heroesData[currentSlide];

    return (
        <section className="relative h-96 sm:h-[500px] overflow-hidden mobile-hero-section">
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
                                className="w-full h-full object-cover mobile-hero-image"
                                style={{
                                    minHeight: '24rem', // h-96 equivalent
                                }}
                            />
                        </div>

                        {/* Mobile-Optimized Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/40" />

                        {/* Mobile Content */}
                        <div className="relative z-10 flex items-end h-full pb-4">
                            <div className="w-full px-4">
                                <div className="space-y-2 animate-fade-in">
                                    {/* Subtitle */}
                                    <p className="text-accent font-medium text-xs tracking-wide uppercase">
                                        {hero.subtitle}
                                    </p>

                                    {/* Title */}
                                    <h1 className="text-xl font-bold text-foreground leading-tight">
                                        {hero.title}
                                    </h1>

                                    {/* Mobile Metadata */}
                                    <div className="flex items-center space-x-2 text-foreground-muted text-xs">
                                        <span className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium">
                                            {hero.year}
                                        </span>
                                        <span>{hero.rating}</span>
                                        <span>•</span>
                                        <span className="truncate">{hero.genre.split(',')[0]}</span>
                                    </div>

                                    {/* Mobile Description */}
                                    <p className="text-xs text-foreground-muted leading-relaxed line-clamp-2">
                                        {hero.description}
                                    </p>

                                    {/* Mobile Action Buttons */}
                                    <div className="flex space-x-2 pt-1">
                                        <Button
                                            size="sm"
                                            onClick={() => handleWatchNow(hero.id)}
                                            className="bg-primary hover:bg-primary-dark text-primary-foreground px-3 py-1.5 text-xs font-semibold flex-1"
                                        >
                                            <Play className="w-3 h-3 mr-1" fill="currentColor" />
                                            Watch Now
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="px-3 py-1.5 text-xs font-semibold"
                                        >
                                            <Plus className="w-3 h-3 mr-1" />
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Navigation Arrows */}
            <div className="absolute inset-y-0 left-2 flex items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevSlide}
                    className="w-8 h-8 rounded-full bg-background/30 hover:bg-background/50 backdrop-blur-sm border border-white/20"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
            </div>

            <div className="absolute inset-y-0 right-2 flex items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextSlide}
                    className="w-8 h-8 rounded-full bg-background/30 hover:bg-background/50 backdrop-blur-sm border border-white/20"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            {/* Mobile Slide Indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                    {heroesData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentSlide
                                ? 'bg-primary scale-125'
                                : 'bg-white/40 hover:bg-white/60'
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
