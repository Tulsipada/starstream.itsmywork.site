import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import CustomDropdown from "@/components/ui/custom-dropdown";
import { ArrowLeft, Search, Clock, Play, Plus, Filter, Calendar, Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moviesData from "@/data/movies.json";
import Navigation from "@/components/Navigation";
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
            thumbnail: "/src/assets/movies/movie1.jpg",
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
            thumbnail: "/src/assets/movies/movie2.jpg",
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
            thumbnail: "/src/assets/movies/movie3.jpg",
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
            thumbnail: "/src/assets/movies/movie4.jpg",
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
            thumbnail: "/src/assets/movies/movie5.jpg",
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
                                                placeholder="Search watch history..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                                        <CustomDropdown
                                            options={[
                                                { value: "recent", label: "Most Recent" },
                                                { value: "title", label: "Title A-Z" },
                                                { value: "rating", label: "Highest Rated" },
                                                { value: "progress", label: "Progress" }
                                            ]}
                                            value={sortBy}
                                            onValueChange={setSortBy}
                                            placeholder="Sort by"
                                            className="w-full"
                                            triggerClassName="h-10 sm:h-11 text-xs sm:text-sm"
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
                                            className="w-full"
                                            triggerClassName="h-10 sm:h-11 text-xs sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Watch History List */}
                        <div className="space-y-4">
                            {filteredHistory.length === 0 ? (
                                <Card className="backdrop-blur-md bg-background/95 border-border/20">
                                    <CardContent className="p-6 sm:p-8 text-center">
                                        <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-foreground-muted mx-auto mb-3 sm:mb-4" />
                                        <h3 className="text-base sm:text-lg font-semibold mb-2">No watch history found</h3>
                                        <p className="text-foreground-muted mb-4 text-sm sm:text-base">
                                            {searchQuery ? "Try adjusting your search or filters" : "Start watching to build your history"}
                                        </p>
                                        <Button asChild className="text-sm sm:text-base">
                                            <Link to="/">Browse Content</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                filteredHistory.map((item) => (
                                    <Card key={item.id} className="backdrop-blur-md bg-background/95 border-border/20 hover:border-primary/30 transition-colors">
                                        <CardContent className="p-3 sm:p-4">
                                            <div className="flex gap-3 sm:gap-4">
                                                <div className="relative w-16 h-12 sm:w-24 sm:h-16 flex-shrink-0">
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <Button size="sm" variant="secondary" asChild className="p-1 sm:p-2">
                                                            <Link to={`/watch/${item.id}`}>
                                                                <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-sm sm:text-lg truncate">{item.title}</h3>
                                                            <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                                                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                                                    {item.type}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                                                    {item.genre}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                                                    {item.year}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-1 sm:gap-4 mt-2 text-xs text-foreground-muted flex-wrap">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span className="hidden sm:inline">{formatDate(item.watchedAt)}</span>
                                                                    <span className="sm:hidden">{formatDate(item.watchedAt).split(' ')[0]}</span>
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

                                                        <div className="flex items-center gap-1 sm:gap-2 sm:ml-4">
                                                            <Button size="sm" variant="outline" asChild className="text-xs h-8 sm:h-9 px-2 sm:px-3">
                                                                <Link to={`/watch/${item.id}`}>
                                                                    <Play className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                                                                    <span className="hidden sm:inline">{item.progress === 100 ? "Replay" : "Continue"}</span>
                                                                    <span className="sm:hidden">{item.progress === 100 ? "Replay" : "Play"}</span>
                                                                </Link>
                                                            </Button>
                                                            <Button size="sm" variant="ghost" className="p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9">
                                                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            </Button>
                                                            <Button size="sm" variant="ghost" onClick={() => removeFromHistory(item.id)} className="p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9">
                                                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
