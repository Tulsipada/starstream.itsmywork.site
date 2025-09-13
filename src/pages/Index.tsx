import Navigation from "@/components/Navigation";
import HeroSlider from "@/components/HeroSlider";
import MobileHeroSection from "@/components/MobileHeroSection";
import VideoCarousel from "@/components/VideoCarousel";
import Footer from "@/components/Footer";
import { useMobileDetection } from "@/hooks/use-mobile-detection";

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
  const originalsMovies = getMoviesByCategory(categoriesData.originals);

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
          <VideoCarousel title="Trending Now" videos={trendingMovies} />
          <VideoCarousel title="Popular Movies" videos={popularMovies} />
          <VideoCarousel title="Cinesaga Originals" videos={originalsMovies} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
