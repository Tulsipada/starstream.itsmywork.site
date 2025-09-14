import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import CustomDropdown from "@/components/ui/custom-dropdown";
import { ArrowLeft, Search, Bookmark, Play, Plus, Filter, Calendar, Star, Heart, Trash2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moviesData from "@/data/movies.json";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Watchlist = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [filterBy, setFilterBy] = useState("all");

    // Mock watchlist data - in a real app, this would come from an API
    const [watchlist, setWatchlist] = useState([
        {
            id: "movie1",
            title: "The Chronicles of Avalon",
            type: "Movie",
            duration: "2h 15m",
            addedAt: "2024-01-15T14:30:00Z",
            thumbnail: "/src/assets/movies/movie1.jpg",
            rating: 4.5,
            genre: "Fantasy",
            year: "2024",
            description: "An epic fantasy series that follows the legendary knights of Avalon as they embark on a quest to save their mystical realm from an ancient darkness.",
            isWatched: false
        },
        {
            id: "movie2",
            title: "Neon Nights",
            type: "Movie",
            duration: "1h 45m",
            addedAt: "2024-01-14T20:15:00Z",
            thumbnail: "/src/assets/movies/movie2.jpg",
            rating: 4.2,
            genre: "Sci-Fi",
            year: "2024",
            description: "A cyberpunk thriller set in a neon-lit future where technology and humanity collide.",
            isWatched: false
        },
        {
            id: "movie3",
            title: "Dragon's Crown",
            type: "Movie",
            duration: "2h 30m",
            addedAt: "2024-01-13T16:45:00Z",
            thumbnail: "/src/assets/movies/movie3.jpg",
            rating: 4.8,
            genre: "Action",
            year: "2024",
            description: "An action-packed adventure following a group of warriors as they battle dragons and ancient evils.",
            isWatched: true
        },
        {
            id: "movie4",
            title: "Midnight Terror",
            type: "Movie",
            duration: "1h 30m",
            addedAt: "2024-01-12T22:00:00Z",
            thumbnail: "/src/assets/movies/movie4.jpg",
            rating: 3.9,
            genre: "Horror",
            year: "2024",
            description: "A spine-chilling horror movie that will keep you on the edge of your seat.",
            isWatched: false
        },
        {
            id: "movie5",
            title: "Summer Love",
            type: "Movie",
            duration: "1h 55m",
            addedAt: "2024-01-11T19:30:00Z",
            thumbnail: "/src/assets/movies/movie5.jpg",
            rating: 4.1,
            genre: "Romance",
            year: "2024",
            description: "A heartwarming romantic story about love, friendship, and summer adventures.",
            isWatched: false
        }
    ]);

    const filteredWatchlist = watchlist
        .filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterBy === "all" || item.genre.toLowerCase() === filterBy.toLowerCase();
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "recent":
                    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
                case "title":
                    return a.title.localeCompare(b.title);
                case "rating":
                    return b.rating - a.rating;
                case "watched":
                    return a.isWatched === b.isWatched ? 0 : a.isWatched ? 1 : -1;
                default:
                    return 0;
            }
        });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const removeFromWatchlist = (id: string) => {
        setWatchlist(prevWatchlist => prevWatchlist.filter(item => item.id !== id));
    };

    const markAsWatched = (id: string) => {
        setWatchlist(prevWatchlist =>
            prevWatchlist.map(item =>
                item.id === id ? { ...item, isWatched: !item.isWatched } : item
            )
        );
    };

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
                                                placeholder="Search watchlist..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 h-10 sm:h-11"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        <CustomDropdown
                                            options={[
                                                { value: "recent", label: "Most Recent" },
                                                { value: "title", label: "Title A-Z" },
                                                { value: "rating", label: "Highest Rated" },
                                                { value: "watched", label: "Watched Status" }
                                            ]}
                                            value={sortBy}
                                            onValueChange={setSortBy}
                                            placeholder="Sort by"
                                            className="w-full sm:w-40"
                                            triggerClassName="h-10 sm:h-11"
                                        />

                                        <CustomDropdown
                                            options={[
                                                { value: "all", label: "All Genres" },
                                                { value: "fantasy", label: "Fantasy" },
                                                { value: "sci-fi", label: "Sci-Fi" },
                                                { value: "action", label: "Action" },
                                                { value: "horror", label: "Horror" },
                                                { value: "romance", label: "Romance" }
                                            ]}
                                            value={filterBy}
                                            onValueChange={setFilterBy}
                                            placeholder="Filter"
                                            className="w-full sm:w-32"
                                            triggerClassName="h-10 sm:h-11"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Watchlist Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {filteredWatchlist.length === 0 ? (
                                <div className="col-span-full">
                                    <Card className="backdrop-blur-md bg-background/95 border-border/20">
                                        <CardContent className="p-6 sm:p-8 text-center">
                                            <Bookmark className="w-12 h-12 sm:w-16 sm:h-16 text-foreground-muted mx-auto mb-3 sm:mb-4" />
                                            <h3 className="text-base sm:text-lg font-semibold mb-2">Your watchlist is empty</h3>
                                            <p className="text-foreground-muted mb-4 text-sm sm:text-base">
                                                {searchQuery ? "Try adjusting your search or filters" : "Add movies and shows you want to watch later"}
                                            </p>
                                            <Button asChild className="text-sm sm:text-base">
                                                <Link to="/">Browse Content</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                filteredWatchlist.map((item) => (
                                    <Card key={item.id} className="backdrop-blur-md bg-background/95 border-border/20 hover:border-primary/30 transition-colors group">
                                        <CardContent className="p-0">
                                            <div className="relative">
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
                                                />
                                                <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="sm" variant="secondary" asChild>
                                                        <Link to={`/watch/${item.id}`}>
                                                            <Play className="w-4 h-4 mr-1" />
                                                            {item.isWatched ? "Replay" : "Watch Now"}
                                                        </Link>
                                                    </Button>
                                                </div>

                                                {/* Watched Badge */}
                                                {item.isWatched && (
                                                    <div className="absolute top-2 right-2">
                                                        <Badge className="bg-green-500 text-white">
                                                            <Check className="w-3 h-3 mr-1" />
                                                            Watched
                                                        </Badge>
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="absolute top-2 left-2 flex gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70"
                                                        onClick={() => markAsWatched(item.id)}
                                                    >
                                                        {item.isWatched ? (
                                                            <Check className="w-4 h-4" />
                                                        ) : (
                                                            <Play className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70"
                                                        onClick={() => removeFromWatchlist(item.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="p-3 sm:p-4">
                                                <div className="space-y-2">
                                                    <h3 className="font-semibold text-base sm:text-lg line-clamp-1">{item.title}</h3>
                                                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {item.type}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs">
                                                            {item.genre}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs">
                                                            {item.year}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-foreground-muted line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                    <div className="flex items-center justify-between text-xs sm:text-sm text-foreground-muted">
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {formatDate(item.addedAt)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Star className="w-3 h-3" />
                                                                {item.rating}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs">{item.duration}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 sm:mt-4 flex gap-2">
                                                    <Button size="sm" className="flex-1 text-xs sm:text-sm" asChild>
                                                        <Link to={`/watch/${item.id}`}>
                                                            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                            {item.isWatched ? "Replay" : "Watch Now"}
                                                        </Link>
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="px-2 sm:px-3">
                                                        <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
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

export default Watchlist;
