import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Play, Plus, Filter, Calendar, Star, Heart, Bookmark, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroesData from "@/data/heroes.json";
import Footer from "@/components/Footer";
import { useMobileDetection } from "@/hooks/use-mobile-detection";

const Originals = () => {
    const navigate = useNavigate();
    const isMobile = useMobileDetection();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("popular");
    const [filterBy, setFilterBy] = useState("all");

    // Get all originals from heroes data (Cinesaga Originals)
    const allOriginals = heroesData;

    const filteredOriginals = allOriginals
        .filter(original => {
            const matchesSearch = original.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGenre = filterBy === "all" || original.genre.toLowerCase() === filterBy.toLowerCase();
            return matchesSearch && matchesGenre;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "popular":
                    return b.rating - a.rating;
                case "title":
                    return a.title.localeCompare(b.title);
                case "year":
                    return parseInt(b.year) - parseInt(a.year);
                case "rating":
                    return b.rating - a.rating;
                default:
                    return 0;
            }
        });

    const addToWatchlist = (id: string) => {
        // In a real app, this would call an API
        console.log("Add to watchlist:", id);
    };

    const toggleFavorite = (id: string) => {
        // In a real app, this would call an API
        console.log("Toggle favorite:", id);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
            </div>

            <div className="relative">
                {/* Header */}
                <div className="bg-background/95 backdrop-blur-md border-b border-border/20 sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(-1)}
                                    className="text-foreground-muted hover:text-foreground"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                                <div className="h-6 w-px bg-border" />
                                <h1 className="text-xl font-bold">Cinesaga Originals</h1>
                            </div>
                            <Link to="/" className="text-lg font-bold text-primary">
                                Cinesaga
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
                    <div className="space-y-6 sm:space-y-8">
                        {/* Hero Section */}
                        <div className="text-center py-6 sm:py-8">
                            <div className="flex items-center justify-center mb-3 sm:mb-4">
                                <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-primary mr-2" />
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Cinesaga Originals</h2>
                            </div>
                            <p className="text-foreground-muted text-base sm:text-lg max-w-2xl mx-auto px-4">
                                Discover exclusive content created specifically for Cinesaga.
                                From epic series to groundbreaking movies, experience stories you won't find anywhere else.
                            </p>
                        </div>

                        {/* Filters and Search */}
                        <Card className="backdrop-blur-md bg-background/95 border-border/20">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex flex-col gap-3 sm:gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
                                            <Input
                                                placeholder="Search originals..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 h-10 sm:h-11"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger className="w-full sm:w-40 h-10 sm:h-11">
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="popular">Most Popular</SelectItem>
                                                <SelectItem value="title">Title A-Z</SelectItem>
                                                <SelectItem value="year">Newest First</SelectItem>
                                                <SelectItem value="rating">Highest Rated</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={filterBy} onValueChange={setFilterBy}>
                                            <SelectTrigger className="w-full sm:w-32 h-10 sm:h-11">
                                                <SelectValue placeholder="Genre" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Genres</SelectItem>
                                                <SelectItem value="fantasy">Fantasy</SelectItem>
                                                <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                                                <SelectItem value="action">Action</SelectItem>
                                                <SelectItem value="horror">Horror</SelectItem>
                                                <SelectItem value="romance">Romance</SelectItem>
                                                <SelectItem value="comedy">Comedy</SelectItem>
                                                <SelectItem value="drama">Drama</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Results Count */}
                        <div className="flex items-center justify-between">
                            <p className="text-foreground-muted">
                                {filteredOriginals.length} original{filteredOriginals.length !== 1 ? 's' : ''} found
                            </p>
                        </div>

                        {/* Originals Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                            {filteredOriginals.length === 0 ? (
                                <div className="col-span-full">
                                    <Card className="backdrop-blur-md bg-background/95 border-border/20">
                                        <CardContent className="p-6 sm:p-8 text-center">
                                            <Search className="w-12 h-12 sm:w-16 sm:h-16 text-foreground-muted mx-auto mb-3 sm:mb-4" />
                                            <h3 className="text-base sm:text-lg font-semibold mb-2">No originals found</h3>
                                            <p className="text-foreground-muted mb-4 text-sm sm:text-base">
                                                Try adjusting your search or filters to find what you're looking for
                                            </p>
                                            <Button onClick={() => {
                                                setSearchQuery("");
                                                setFilterBy("all");
                                            }} className="text-sm sm:text-base">
                                                Clear Filters
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                filteredOriginals.map((original) => (
                                    <Card key={original.id} className="backdrop-blur-md bg-background/95 border-border/20 hover:border-primary/30 transition-colors group">
                                        <CardContent className="p-0">
                                            <div className="relative">
                                                <img
                                                    src={original.backgroundImage}
                                                    alt={original.title}
                                                    className="w-full h-48 sm:h-64 object-cover rounded-t-lg"
                                                />
                                                <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="secondary" asChild>
                                                            <Link to={`/watch/${original.id}`}>
                                                                <Play className="w-4 h-4 mr-1" />
                                                                Watch
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => addToWatchlist(original.id)}
                                                        >
                                                            <Bookmark className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Original Badge */}
                                                <div className="absolute top-2 right-2">
                                                    <Badge className="bg-primary text-primary-foreground">
                                                        <Crown className="w-3 h-3 mr-1" />
                                                        Original
                                                    </Badge>
                                                </div>

                                                {/* Rating Badge */}
                                                <div className="absolute top-2 left-2">
                                                    <Badge className="bg-primary/90 text-primary-foreground">
                                                        <Star className="w-3 h-3 mr-1" />
                                                        {original.rating}
                                                    </Badge>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="absolute bottom-2 left-2 flex gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70"
                                                        onClick={() => toggleFavorite(original.id)}
                                                    >
                                                        <Heart className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="p-3 sm:p-4">
                                                <div className="space-y-2">
                                                    <h3 className="font-semibold text-base sm:text-lg line-clamp-1">{original.title}</h3>
                                                    <p className="text-xs text-primary font-medium">{original.subtitle}</p>
                                                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                        <Badge variant="outline" className="text-xs">
                                                            {original.genre}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs">
                                                            {original.year}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-foreground-muted line-clamp-2">
                                                        {original.description}
                                                    </p>
                                                    <div className="flex items-center justify-between text-xs sm:text-sm text-foreground-muted">
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {original.year}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Star className="w-3 h-3" />
                                                                {original.rating}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs">{original.duration}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 sm:mt-4 flex gap-2">
                                                    <Button size="sm" className="flex-1 text-xs sm:text-sm" asChild>
                                                        <Link to={`/watch/${original.id}`}>
                                                            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                            Watch Now
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => addToWatchlist(original.id)}
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

                        {/* Call to Action */}
                        <Card className="backdrop-blur-md bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                            <CardContent className="p-6 sm:p-8 text-center">
                                <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-3 sm:mb-4" />
                                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">More Originals Coming Soon</h3>
                                <p className="text-foreground-muted mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                                    We're constantly working on new exclusive content. Stay tuned for more
                                    Cinesaga Originals that will captivate and entertain you.
                                </p>
                                <Button size="lg" asChild className="text-sm sm:text-base">
                                    <Link to="/">Explore All Content</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Originals;
