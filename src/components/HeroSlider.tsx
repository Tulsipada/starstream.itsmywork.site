import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroesData from "@/data/heroes.json";

const HeroSlider = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroesData.length);
    }, 8000); // Auto-slide every 8 seconds

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
    <section className="relative h-screen overflow-hidden min-h-[600px] sm:min-h-screen hero-section">
      {/* Hero Slides */}
      <div className="relative w-full h-full">
        {heroesData.map((hero, index) => (
          <div
            key={hero.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
              }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 hero-bg-image">
              <img
                src={hero.backgroundImage}
                alt={hero.title}
                className="w-full h-full object-cover object-center hero-image"
                style={{
                  minHeight: '100vh',
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>

            {/* Gradient Overlays - Hotstar Style */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60 sm:via-background/80 sm:to-background/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />

            {/* Content */}
            <div className="relative z-10 flex items-center h-full">
              <div className="container mx-auto px-3 sm:px-4">
                <div className="max-w-2xl space-y-4 sm:space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <p className="text-accent font-medium text-sm sm:text-lg tracking-wide uppercase">
                      {hero.subtitle}
                    </p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                      {hero.title}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-foreground-muted text-sm sm:text-base">
                    <span className="bg-accent/20 text-accent px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium">
                      {hero.year}
                    </span>
                    <span className="hidden sm:inline">{hero.duration}</span>
                    <span className="flex items-center">
                      <div className="w-1 h-1 bg-foreground-muted rounded-full mr-1 sm:mr-2" />
                      {hero.rating}
                    </span>
                    <span className="flex items-center">
                      <div className="w-1 h-1 bg-foreground-muted rounded-full mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">{hero.genre}</span>
                      <span className="sm:hidden">Action</span>
                    </span>
                  </div>

                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground-muted leading-relaxed max-w-xl">
                    {hero.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                    <Button
                      size="lg"
                      onClick={() => handleWatchNow(hero.id)}
                      className="bg-primary hover:bg-primary-dark text-primary-foreground px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold"
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" />
                      Watch Now
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      Add to Watchlist
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold border border-white/20 hover:bg-white/10"
                    >
                      <Info className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      More Info
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-2 sm:left-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-background/20 hover:bg-background/40 backdrop-blur-sm border border-white/20"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </Button>
      </div>

      <div className="absolute inset-y-0 right-2 sm:right-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-background/20 hover:bg-background/40 backdrop-blur-sm border border-white/20"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-1 sm:space-x-2">
          {heroesData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                ? 'bg-primary scale-125'
                : 'bg-white/30 hover:bg-white/50'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

    </section>
  );
};

export default HeroSlider;