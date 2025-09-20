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

                        {/* Movies Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                            {filteredMovies.length === 0 ? (
                                <div className="col-span-full">
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
                                </div>
                            ) : (
                                filteredMovies.map((movie) => (
                                    <Card key={movie.id} className="backdrop-blur-md bg-background/95 border-border/20 hover:border-primary/30 transition-colors group">
                                        <CardContent className="p-0">
                                            <div className="relative">
                                                <img
                                                    src={movie.thumbnail}
                                                    alt={movie.title}
                                                    className="w-full h-48 sm:h-64 object-cover rounded-t-lg"
                                                />
                                                <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="secondary" asChild>
                                                            <Link to={`/watch/${movie.id}`}>
                                                                <Play className="w-4 h-4 mr-1" />
                                                                Watch
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => addToWatchlist(movie.id)}
                                                        >
                                                            <Bookmark className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Rating Badge */}
                                                <div className="absolute top-2 right-2">
                                                    <Badge className="bg-primary/90 text-primary-foreground">
                                                        <Star className="w-3 h-3 mr-1" />
                                                        {movie.rating}
                                                    </Badge>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="absolute top-2 left-2 flex gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70"
                                                        onClick={() => toggleFavorite(movie.id)}
                                                    >
                                                        <Heart className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                {/* Live Badge */}
                                                {movie.isLive && (
                                                    <div className="absolute bottom-2 right-2">
                                                        <Badge className="bg-red-500/90 text-white animate-pulse">
                                                            LIVE
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-3 sm:p-4">
                                                <div className="space-y-2">
                                                    <h3 className="font-semibold text-base sm:text-lg line-clamp-1">{movie.title}</h3>
                                                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                        <Badge variant="outline" className="text-xs">
                                                            {movie.genre}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs">
                                                            {movie.year}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-foreground-muted line-clamp-2">
                                                        {movie.description}
                                                    </p>
                                                    <div className="flex items-center justify-between text-xs sm:text-sm text-foreground-muted">
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {movie.year}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Star className="w-3 h-3" />
                                                                {movie.rating}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col items-end text-xs">
                                                            <span>{movie.duration}</span>
                                                            <span className="text-foreground-muted">{movie.views} views</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-3 sm:mt-4 flex gap-2">
                                                    <Button size="sm" className="flex-1 text-xs sm:text-sm" asChild>
                                                        <Link to={`/watch/${movie.id}`}>
                                                            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                            Watch Now
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => addToWatchlist(movie.id)}
                                                        className="px-2 sm:px-3"
                                                    >
                                                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Movies;
