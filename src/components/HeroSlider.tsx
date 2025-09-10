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
    <section className="relative h-screen overflow-hidden">
      {/* Hero Slides */}
      <div className="relative w-full h-full">
        {heroesData.map((hero, index) => (
          <div
            key={hero.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${hero.backgroundImage})`,
              }}
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            
            {/* Content */}
            <div className="relative z-10 flex items-center h-full">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <p className="text-accent font-medium text-lg tracking-wide uppercase">
                      {hero.subtitle}
                    </p>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                      {hero.title}
                    </h1>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-foreground-muted">
                    <span className="bg-accent/20 text-accent px-3 py-1 rounded text-sm font-medium">
                      {hero.year}
                    </span>
                    <span>{hero.duration}</span>
                    <span className="flex items-center">
                      <div className="w-1 h-1 bg-foreground-muted rounded-full mr-2" />
                      {hero.rating}
                    </span>
                    <span className="flex items-center">
                      <div className="w-1 h-1 bg-foreground-muted rounded-full mr-2" />
                      {hero.genre}
                    </span>
                  </div>
                  
                  <p className="text-lg md:text-xl text-foreground-muted leading-relaxed max-w-xl">
                    {hero.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button 
                      size="lg"
                      onClick={() => handleWatchNow(hero.id)}
                      className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-3 text-lg font-semibold"
                    >
                      <Play className="w-5 h-5 mr-2" fill="currentColor" />
                      Watch Now
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="lg"
                      className="px-8 py-3 text-lg font-semibold"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add to Watchlist
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="lg"
                      className="px-8 py-3 text-lg font-semibold border border-white/20 hover:bg-white/10"
                    >
                      <Info className="w-5 h-5 mr-2" />
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
      <div className="absolute inset-y-0 left-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-background/20 hover:bg-background/40 backdrop-blur-sm border border-white/20"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>
      
      <div className="absolute inset-y-0 right-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-background/20 hover:bg-background/40 backdrop-blur-sm border border-white/20"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {heroesData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-primary scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;