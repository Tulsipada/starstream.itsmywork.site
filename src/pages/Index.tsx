import Navigation from "@/components/Navigation";
import HeroSlider from "@/components/HeroSlider";
import MobileHeroSection from "@/components/MobileHeroSection";
import VideoCarousel from "@/components/VideoCarousel";
import Footer from "@/components/Footer";
import { useMobileDetection } from "@/hooks/use-mobile-detection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, Star } from "lucide-react";

// Import data
import moviesData from "@/data/movies.json";
import categoriesData from "@/data/categories.json";

const Index = () => {
  const isMobile = useMobileDetection();

  // Filter movies by category
  const getMoviesByCategory = (categoryIds: string[]) => {
    return categoryIds.map(id => moviesData.find(movie => movie.id === id)).filter(Boolean);
  };

  const trendingMovies = getMoviesByCategory(categoriesData.trending);
  const popularMovies = getMoviesByCategory(categoriesData.popular);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Conditional Hero Section - Mobile vs Desktop */}
        {isMobile ? (
          <MobileHeroSection />
        ) : (
          <HeroSlider />
        )}

        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-8 sm:space-y-12">
          {/* Pre-Launch Offers CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-6 sm:p-8 border border-primary/20">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                <span>Limited Time Offer</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Get Early Access with
                <span className="text-primary block">Pre-Launch Offers</span>
              </h2>

              <p className="text-foreground-muted mb-6 max-w-2xl mx-auto">
                Be among the first to experience Cinesaga with exclusive pre-launch pricing.
                Save up to ₹989 and enjoy premium content from day one.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-3">
                  <Link to="/prelaunch-offers">
                    <Star className="w-5 h-5 mr-2" />
                    View Offers
                  </Link>
                </Button>

                <div className="text-sm text-foreground-muted">
                  <span className="font-semibold text-primary">Starting at ₹149/month</span>
                  <span className="block sm:inline sm:ml-2">• Save up to 55%</span>
                </div>
              </div>
            </div>
          </div>

          <VideoCarousel title="Trending Now" videos={trendingMovies} />
          <VideoCarousel title="Popular Movies" videos={popularMovies} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
