import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Play, Pause, Volume2, Maximize, Settings, Plus, ThumbsUp, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Import data
import moviesData from "@/data/movies.json";
import heroesData from "@/data/heroes.json";

// Combine all video data
const getAllVideoData = () => {
  const allVideos: { [key: string]: any } = {};
  
  // Add movies
  moviesData.forEach(movie => {
    allVideos[movie.id] = movie;
  });
  
  // Add heroes
  heroesData.forEach(hero => {
    allVideos[hero.id] = hero;
  });
  
  return allVideos;
};

const videoData = getAllVideoData();

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [volume, setVolume] = useState(50);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLDivElement>(null);

  const video = id ? videoData[id] : null;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => Math.min(prev + 1, duration));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    if (showControls) {
      hideTimer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(hideTimer);
  }, [showControls]);

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Video Not Found</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Video Player Section */}
      <div className="pt-20">
        <div 
          ref={videoRef}
          className="relative bg-black aspect-video w-full max-h-[80vh] group cursor-pointer"
          onMouseMove={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onClick={togglePlay}
        >
          {/* Video Placeholder - in a real app this would be a video element */}
          <div className="w-full h-full bg-gradient-to-br from-background-secondary to-background-tertiary flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                {isPlaying ? (
                  <Pause className="w-12 h-12 text-primary" />
                ) : (
                  <Play className="w-12 h-12 text-primary ml-1" fill="currentColor" />
                )}
              </div>
              <p className="text-foreground-muted">
                {isPlaying ? "Playing" : "Click to Play"} - {video.title}
              </p>
            </div>
          </div>

          {/* Video Controls Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            {/* Back Button */}
            <div className="absolute top-4 left-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/");
                }}
                className="bg-background/20 hover:bg-background/40 backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  onValueChange={handleProgressChange}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-foreground-muted">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" fill="currentColor" />
                    )}
                  </Button>

                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-5 h-5" />
                    <Slider
                      value={[volume]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Information */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {video.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-foreground-muted mb-6">
                  <span className="bg-accent/20 text-accent px-3 py-1 rounded">{video.year}</span>
                  <span>{video.duration}</span>
                  <span>• {video.rating}</span>
                  <span>• {video.genre}</span>
                </div>

                <p className="text-lg text-foreground-muted leading-relaxed mb-6">
                  {video.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button className="bg-primary hover:bg-primary-dark">
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Watchlist
                  </Button>
                  <Button variant="outline">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Rate
                  </Button>
                  <Button variant="outline">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Cast</h3>
                  <p className="text-foreground-muted">{video.cast}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Director</h3>
                  <p className="text-foreground-muted">{video.director}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">More Like This</h3>
                <div className="space-y-4">
                  {/* Related content would go here */}
                  <div className="text-foreground-muted text-sm">
                    Related content coming soon...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VideoPlayer;