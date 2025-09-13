import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Clock, Play, Plus, Filter, Calendar, Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moviesData from "@/data/movies.json";
import Footer from "@/components/Footer";

const WatchHistory = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [filterBy, setFilterBy] = useState("all");

    // Mock watch history data - in a real app, this would come from an API
    const [watchHistory, setWatchHistory] = useState([
        {
            id: "movie1",
            title: "The Chronicles of Avalon",
            type: "Movie",
            duration: "2h 15m",
            watchedAt: "2024-01-15T14:30:00Z",
            progress: 85,
            thumbnail: "/assets/movies/movie1.jpg",
            rating: 4.5,
            genre: "Fantasy",
            year: "2024"
        },
        {
            id: "movie2",
            title: "Neon Nights",
            type: "Movie",
            duration: "1h 45m",
            watchedAt: "2024-01-14T20:15:00Z",
            progress: 100,
            thumbnail: "/assets/movies/movie2.jpg",
            rating: 4.2,
            genre: "Sci-Fi",
            year: "2024"
        },
        {
            id: "movie3",
            title: "Dragon's Crown",
            type: "Movie",
            duration: "2h 30m",
            watchedAt: "2024-01-13T16:45:00Z",
            progress: 60,
            thumbnail: "/assets/movies/movie3.jpg",
            rating: 4.8,
            genre: "Action",
            year: "2024"
        },
        {
            id: "movie4",
            title: "Midnight Terror",
            type: "Movie",
            duration: "1h 30m",
            watchedAt: "2024-01-12T22:00:00Z",
            progress: 100,
            thumbnail: "/assets/movies/movie4.jpg",
            rating: 3.9,
            genre: "Horror",
            year: "2024"
        },
        {
            id: "movie5",
            title: "Summer Love",
            type: "Movie",
            duration: "1h 55m",
            watchedAt: "2024-01-11T19:30:00Z",
            progress: 100,
            thumbnail: "/assets/movies/movie5.jpg",
            rating: 4.1,
            genre: "Romance",
            year: "2024"
        }
    ]);

    const filteredHistory = watchHistory
        .filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterBy === "all" || item.genre.toLowerCase() === filterBy.toLowerCase();
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "recent":
                    return new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime();
                case "title":
                    return a.title.localeCompare(b.title);
                case "rating":
                    return b.rating - a.rating;
                case "progress":
                    return b.progress - a.progress;
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

    const removeFromHistory = (id: string) => {
        setWatchHistory(prevHistory => prevHistory.filter(item => item.id !== id));
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
                                <h1 className="text-xl font-bold">Watch History</h1>
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
                                                placeholder="Search watch history..."
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
                                                <SelectItem value="progress">Progress</SelectItem>
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

                        {/* Watch History List */}
                        <div className="space-y-4">
                            {filteredHistory.length === 0 ? (
                                <Card className="backdrop-blur-md bg-background/95 border-border/20">
                                    <CardContent className="p-8 text-center">
                                        <Clock className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No watch history found</h3>
                                        <p className="text-foreground-muted mb-4">
                                            {searchQuery ? "Try adjusting your search or filters" : "Start watching to build your history"}
                                        </p>
                                        <Button asChild>
                                            <Link to="/">Browse Content</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                filteredHistory.map((item) => (
                                    <Card key={item.id} className="backdrop-blur-md bg-background/95 border-border/20 hover:border-primary/30 transition-colors">
                                        <CardContent className="p-4">
                                            <div className="flex gap-4">
                                                <div className="relative w-24 h-16 flex-shrink-0">
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <Button size="sm" variant="secondary" asChild>
                                                            <Link to={`/watch/${item.id}`}>
                                                                <Play className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
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
                                                            <div className="flex items-center gap-4 mt-2 text-sm text-foreground-muted">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {formatDate(item.watchedAt)}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {item.duration}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Star className="w-3 h-3" />
                                                                    {item.rating}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 ml-4">
                                                            <Button size="sm" variant="outline" asChild>
                                                                <Link to={`/watch/${item.id}`}>
                                                                    <Play className="w-4 h-4 mr-1" />
                                                                    {item.progress === 100 ? "Replay" : "Continue"}
                                                                </Link>
                                                            </Button>
                                                            <Button size="sm" variant="ghost">
                                                                <Plus className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="sm" variant="ghost" onClick={() => removeFromHistory(item.id)}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="mt-3">
                                                        <div className="flex items-center justify-between text-xs text-foreground-muted mb-1">
                                                            <span>Progress</span>
                                                            <span>{item.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-foreground-muted/20 rounded-full h-1.5">
                                                            <div
                                                                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                                                style={{ width: `${item.progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
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

export default WatchHistory;
