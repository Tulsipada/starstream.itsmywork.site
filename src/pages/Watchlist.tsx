import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Bookmark, Play, Plus, Filter, Calendar, Star, Heart, Trash2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moviesData from "@/data/movies.json";
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
            thumbnail: "/assets/movies/movie1.jpg",
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
            thumbnail: "/assets/movies/movie2.jpg",
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
            thumbnail: "/assets/movies/movie3.jpg",
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
            thumbnail: "/assets/movies/movie4.jpg",
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
            thumbnail: "/assets/movies/movie5.jpg",
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
                                <h1 className="text-xl font-bold">My Watchlist</h1>
                            </div>
                            <Link to="/" className="text-lg font-bold text-primary">
                                Cinesaga
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-8">
                    <div className="space-y-6">
                        {/* Filters and Search */}
                        <Card className="backdrop-blur-md bg-background/95 border-border/20">
                            <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
                                            <Input
                                                placeholder="Search watchlist..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger className="w-40">
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="recent">Most Recent</SelectItem>
                                                <SelectItem value="title">Title A-Z</SelectItem>
                                                <SelectItem value="rating">Highest Rated</SelectItem>
                                                <SelectItem value="watched">Watched Status</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={filterBy} onValueChange={setFilterBy}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Filter" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Genres</SelectItem>
                                                <SelectItem value="fantasy">Fantasy</SelectItem>
                                                <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                                                <SelectItem value="action">Action</SelectItem>
                                                <SelectItem value="horror">Horror</SelectItem>
                                                <SelectItem value="romance">Romance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Watchlist Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredWatchlist.length === 0 ? (
                                <div className="col-span-full">
                                    <Card className="backdrop-blur-md bg-background/95 border-border/20">
                                        <CardContent className="p-8 text-center">
                                            <Bookmark className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
                                            <p className="text-foreground-muted mb-4">
                                                {searchQuery ? "Try adjusting your search or filters" : "Add movies and shows you want to watch later"}
                                            </p>
                                            <Button asChild>
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
                                                    className="w-full h-48 object-cover rounded-t-lg"
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

                                            <div className="p-4">
                                                <div className="space-y-2">
                                                    <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                                                    <div className="flex items-center gap-2">
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
                                                    <p className="text-sm text-foreground-muted line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                    <div className="flex items-center justify-between text-sm text-foreground-muted">
                                                        <div className="flex items-center gap-3">
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

                                                <div className="mt-4 flex gap-2">
                                                    <Button size="sm" className="flex-1" asChild>
                                                        <Link to={`/watch/${item.id}`}>
                                                            <Play className="w-4 h-4 mr-1" />
                                                            {item.isWatched ? "Replay" : "Watch Now"}
                                                        </Link>
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <Heart className="w-4 h-4" />
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
