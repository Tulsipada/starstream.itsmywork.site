import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import CustomDropdown from "@/components/ui/custom-dropdown";
import { ArrowLeft, Search, Play, Plus, Filter, Calendar, Star, Heart, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import videosData from "@/data/videos.json";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useMobileDetection } from "@/hooks/use-mobile-detection";

const Movies = () => {
    const navigate = useNavigate();
    const isMobile = useMobileDetection();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("popular");
    const [filterBy, setFilterBy] = useState("all");
    const [yearFilter, setYearFilter] = useState("all");

    const sortOptions = [
        { value: "popular", label: "Most Popular" },
        { value: "title", label: "Title A-Z" },
        { value: "year", label: "Newest First" },
        { value: "views", label: "Most Viewed" },
        { value: "duration", label: "Duration" }
    ];

    // Helper function to detect genre from title and description
    const detectGenre = (title: string, description: string) => {
        const text = (title + " " + description).toLowerCase();
        if (text.includes("bunny") || text.includes("cartoon") || text.includes("animation")) return "Animation";
        if (text.includes("blender") || text.includes("open movie")) return "Documentary";
        if (text.includes("bigger") || text.includes("blaze") || text.includes("escape")) return "Action";
        if (text.includes("chromecast") || text.includes("google")) return "Tech";
        return "Various";
    };

    // Helper function to parse duration string to minutes
    const parseDuration = (duration: string) => {
        const match = duration.match(/(\d+):(\d+)/);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            return minutes * 60 + seconds;
        }
        return 0;
    };

    // Transform video data to movie format for display
    const allMovies = videosData.map(video => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnailUrl,
        videoUrl: video.videoUrl,
        duration: video.duration,
        year: video.uploadTime,
        rating: "PG", // Default rating since videos.json doesn't have rating
        genre: detectGenre(video.title, video.description),
        description: video.description,
        cast: video.author,
        director: video.author,
        views: video.views,
        isLive: video.isLive
    }));

    // Get unique genres from the transformed data
    const uniqueGenres = [...new Set(allMovies.map(movie => movie.genre))].sort();
    
    const genreOptions = [
        { value: "all", label: "All Genres" },
        ...uniqueGenres.map(genre => ({ value: genre.toLowerCase(), label: genre }))
    ];

    const filteredMovies = allMovies
        .filter(movie => {
            const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGenre = filterBy === "all" || movie.genre.toLowerCase() === filterBy.toLowerCase();
            const matchesYear = yearFilter === "all" || movie.year === yearFilter;
            return matchesSearch && matchesGenre && matchesYear;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "popular":
                    // Sort by views (convert to number for proper sorting)
                    const viewsA = parseInt(a.views.replace(/[^\d]/g, '')) || 0;
                    const viewsB = parseInt(b.views.replace(/[^\d]/g, '')) || 0;
                    return viewsB - viewsA;
                case "title":
                    return a.title.localeCompare(b.title);
                case "year":
                    return parseInt(b.year) - parseInt(a.year);
                case "views":
                    const viewsA2 = parseInt(a.views.replace(/[^\d]/g, '')) || 0;
                    const viewsB2 = parseInt(b.views.replace(/[^\d]/g, '')) || 0;
                    return viewsB2 - viewsA2;
                case "duration":
                    // Sort by duration (convert to minutes for comparison)
                    const durationA = parseDuration(a.duration);
                    const durationB = parseDuration(b.duration);
                    return durationB - durationA;
                default:
                    return 0;
            }
        });

    const addToWatchlist = (id: string) => {
        // In a real app, this would call an API
    };

    const toggleFavorite = (id: string) => {
        // In a real app, this would call an API
    };

    // Get unique years for year filter
    const years = [...new Set(allMovies.map(movie => movie.year))].sort((a, b) => parseInt(b) - parseInt(a));
    
    const yearOptions = [
        { value: "all", label: "All Years" },
        ...years.map(year => ({ value: year, label: year }))
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
            </div>

            <Navigation />

            {/* Content */}
            <div className="pt-20 sm:pt-24">
                <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
                    <div className="space-y-8 sm:space-y-10">
                        {/* Filters and Search */}
                        <Card className="backdrop-blur-md bg-background/95 border-border/20 relative filter-section mb-8">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex flex-col gap-3 sm:gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
                                            <Input
                                                placeholder="Search movies..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 h-10 sm:h-11"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        <CustomDropdown
                                            options={sortOptions}
                                            value={sortBy}
                                            onValueChange={setSortBy}
                                            placeholder="Sort by"
                                            triggerClassName="w-full sm:w-40 h-10 sm:h-11"
                                        />

                                        <CustomDropdown
                                            options={genreOptions}
                                            value={filterBy}
                                            onValueChange={setFilterBy}
                                            placeholder="Genre"
                                            triggerClassName="w-full sm:w-32 h-10 sm:h-11"
                                        />

                                        <CustomDropdown
                                            options={yearOptions}
                                            value={yearFilter}
                                            onValueChange={setYearFilter}
                                            placeholder="Year"
                                            triggerClassName="w-full sm:w-24 h-10 sm:h-11"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Results Count */}
                        <div className="flex items-center justify-between">
                            <p className="text-foreground-muted">
                                {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} found
                            </p>
                        </div>

                        {/* Movies Carousel */}
                        {filteredMovies.length === 0 ? (
                            <Card className="backdrop-blur-md bg-background/95 border-border/20">
                                <CardContent className="p-6 sm:p-8 text-center">
                                    <Search className="w-12 h-12 sm:w-16 sm:h-16 text-foreground-muted mx-auto mb-3 sm:mb-4" />
                                    <h3 className="text-base sm:text-lg font-semibold mb-2">No movies found</h3>
                                    <p className="text-foreground-muted mb-4 text-sm sm:text-base">
                                        Try adjusting your search or filters to find what you're looking for
                                    </p>
                                    <Button onClick={() => {
                                        setSearchQuery("");
                                        setFilterBy("all");
                                        setYearFilter("all");
                                    }} className="text-sm sm:text-base">
                                        Clear Filters
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-8">
                                {/* All Movies Section */}
                                <div className="space-y-4">
                                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">All Movies</h2>
                                    <div className="relative">
                                        <div className="flex space-x-3 sm:space-x-4 overflow-x-auto scrollbar-hide pb-4">
                                            {filteredMovies.map((movie) => (
                                                <div
                                                    key={movie.id}
                                                    className="video-card group flex-shrink-0 w-64 sm:w-72 h-32 sm:h-40 relative cursor-pointer"
                                                    onClick={() => navigate(`/watch/${movie.id}`)}
                                                >
                                                    <img
                                                        src={movie.thumbnail}
                                                        alt={movie.title}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />

                                                    {/* Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

                                                    {/* Play Button */}
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <Button
                                                            size="icon"
                                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm"
                                                        >
                                                            <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" fill="currentColor" />
                                                        </Button>
                                                    </div>

                                                    {/* Video Info */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        <h3 className="text-foreground font-semibold text-xs sm:text-sm mb-1 line-clamp-1">
                                                            {movie.title}
                                                        </h3>
                                                        <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-foreground-muted">
                                                            {movie.cast && <span className="line-clamp-1">{movie.cast}</span>}
                                                            {movie.views && <span className="hidden sm:inline">• {movie.views}</span>}
                                                            {movie.duration && <span>• {movie.duration}</span>}
                                                        </div>
                                                    </div>

                                                    {/* Duration Badge */}
                                                    {movie.duration && (
                                                        <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-background/80 text-foreground text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded backdrop-blur-sm">
                                                            {movie.duration}
                                                        </div>
                                                    )}

                                                    {/* Live Badge */}
                                                    {movie.isLive && (
                                                        <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                                                            <Badge className="bg-red-500/90 text-white animate-pulse text-xs">
                                                                LIVE
                                                            </Badge>
                                                        </div>
                                                    )}

                                                    {/* Genre Badge */}
                                                    <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2">
                                                        <Badge className="bg-primary/90 text-primary-foreground text-xs">
                                                            {movie.genre}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Genre-based Sections */}
                                {uniqueGenres.map(genre => {
                                    const genreMovies = filteredMovies.filter(movie => movie.genre === genre);
                                    if (genreMovies.length === 0) return null;
                                    
                                    return (
                                        <div key={genre} className="space-y-4">
                                            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{genre} Movies</h2>
                                            <div className="relative">
                                                <div className="flex space-x-3 sm:space-x-4 overflow-x-auto scrollbar-hide pb-4">
                                                    {genreMovies.map((movie) => (
                                                        <div
                                                            key={movie.id}
                                                            className="video-card group flex-shrink-0 w-64 sm:w-72 h-32 sm:h-40 relative cursor-pointer"
                                                            onClick={() => navigate(`/watch/${movie.id}`)}
                                                        >
                                                            <img
                                                                src={movie.thumbnail}
                                                                alt={movie.title}
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />

                                                            {/* Overlay */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

                                                            {/* Play Button */}
                                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                <Button
                                                                    size="icon"
                                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm"
                                                                >
                                                                    <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" fill="currentColor" />
                                                                </Button>
                                                            </div>

                                                            {/* Video Info */}
                                                            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                                <h3 className="text-foreground font-semibold text-xs sm:text-sm mb-1 line-clamp-1">
                                                                    {movie.title}
                                                                </h3>
                                                                <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-foreground-muted">
                                                                    {movie.cast && <span className="line-clamp-1">{movie.cast}</span>}
                                                                    {movie.views && <span className="hidden sm:inline">• {movie.views}</span>}
                                                                    {movie.duration && <span>• {movie.duration}</span>}
                                                                </div>
                                                            </div>

                                                            {/* Duration Badge */}
                                                            {movie.duration && (
                                                                <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-background/80 text-foreground text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded backdrop-blur-sm">
                                                                    {movie.duration}
                                                                </div>
                                                            )}

                                                            {/* Live Badge */}
                                                            {movie.isLive && (
                                                                <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                                                                    <Badge className="bg-red-500/90 text-white animate-pulse text-xs">
                                                                        LIVE
                                                                    </Badge>
                                                                </div>
                                                            )}

                                                            {/* Genre Badge */}
                                                            <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2">
                                                                <Badge className="bg-primary/90 text-primary-foreground text-xs">
                                                                    {movie.genre}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Movies;
