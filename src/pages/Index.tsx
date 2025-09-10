import Navigation from "@/components/Navigation";
import HeroSlider from "@/components/HeroSlider";
import VideoCarousel from "@/components/VideoCarousel";
import Footer from "@/components/Footer";

// Import data
import moviesData from "@/data/movies.json";
import categoriesData from "@/data/categories.json";

const Index = () => {
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
        <HeroSlider />
        
        <div className="container mx-auto px-4 py-8 space-y-12">
          <VideoCarousel title="Trending Now" videos={trendingMovies} />
          <VideoCarousel title="Popular Movies" videos={popularMovies} />
          <VideoCarousel title="MyStar Originals" videos={originalsMovies} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
