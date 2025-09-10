import { Play, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-series.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleWatchNow = () => {
    navigate('/watch/hero-series');
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="The Chronicles of Avalon"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4 backdrop-blur-sm">
            MyStar Original
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 animate-fade-in">
            The Chronicles of Avalon
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-foreground-muted mb-6 max-w-xl leading-relaxed animate-fade-in">
            An epic fantasy series that follows the legendary knights of Avalon as they embark on a quest to save their mystical realm from an ancient darkness.
          </p>

          {/* Meta Info */}
          <div className="flex items-center space-x-4 text-sm text-foreground-muted mb-8 animate-fade-in">
            <span className="bg-accent/20 text-accent px-2 py-1 rounded">2024</span>
            <span>Fantasy</span>
            <span>• 8 Episodes</span>
            <span>• 4K Ultra HD</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-scale-in">
            <Button
              onClick={handleWatchNow}
              size="lg"
              className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-glow"
            >
              <Play className="w-5 h-5 mr-2" fill="currentColor" />
              Watch Now
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-foreground/20 text-foreground hover:bg-foreground/10 px-8 py-3 text-lg rounded-lg transition-all duration-200 backdrop-blur-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to Watchlist
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="text-foreground hover:bg-foreground/10 px-6 py-3 text-lg rounded-lg transition-all duration-200 backdrop-blur-sm"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-foreground/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;