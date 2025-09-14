import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Plus,
  ThumbsUp,
  Share,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Captions,
  PictureInPicture,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useRef, useEffect, useCallback } from "react";
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
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const video = id ? videoData[id] : null;

  // Auto-hide controls
  const hideControls = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    hideControls();
  }, [hideControls]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipTime(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          adjustVolume(10);
          break;
        case 'ArrowDown':
          e.preventDefault();
          adjustVolume(-10);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isFullscreen]);

  // Progress timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => Math.min(prev + 1, duration));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  // Auto-hide controls when playing
  useEffect(() => {
    if (isPlaying && showControls) {
      hideControls();
    }
  }, [isPlaying, showControls, hideControls]);

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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsPlaying(!isPlaying);
      setIsLoading(false);
    }, 300);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const skipTime = useCallback((seconds: number) => {
    setCurrentTime(prev => Math.max(0, Math.min(prev + seconds, duration)));
    showControlsTemporarily();
  }, [duration, showControlsTemporarily]);

  const adjustVolume = useCallback((delta: number) => {
    setVolume(prev => Math.max(0, Math.min(100, prev + delta)));
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  const exitFullscreen = useCallback(() => {
    document.exitFullscreen();
    setIsFullscreen(false);
  }, []);

  const handleProgressChange = useCallback((value: number[]) => {
    setCurrentTime(value[0]);
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  const handleVolumeChange = useCallback((value: number[]) => {
    setVolume(value[0]);
    if (value[0] === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    setPlaybackRate(rate);
    setShowSettings(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Video Player Section */}
      <div className="pt-16 sm:pt-20">
        <div
          ref={videoRef}
          className={`relative bg-black aspect-video w-full max-h-[60vh] sm:max-h-[80vh] group cursor-pointer transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 max-h-none' : ''
            }`}
          onMouseMove={showControlsTemporarily}
          onMouseLeave={() => setShowControls(false)}
          onClick={togglePlay}
        >
          {/* Video Placeholder with enhanced design */}
          <div className="w-full h-full bg-gradient-to-br from-background-secondary via-background-tertiary to-background flex items-center justify-center relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            </div>

            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}

            {/* Play/Pause button */}
            <div className="text-center px-4 relative z-20">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${isPlaying
                ? 'bg-primary/30 backdrop-blur-sm border-2 border-primary/50'
                : 'bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border-2 border-primary/30 hover:border-primary/50'
                }`}>
                {isLoading ? (
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary" />
                ) : (
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary ml-1" fill="currentColor" />
                )}
              </div>
              <p className="text-foreground-muted text-sm sm:text-base font-medium">
                {isLoading ? "Loading..." : isPlaying ? "Playing" : "Click to Play"} - {video.title}
              </p>
            </div>

            {/* Video thumbnail overlay */}
            {video.thumbnail && (
              <div className="absolute inset-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            )}
          </div>

          {/* Video Controls Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                {/* Back Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/");
                  }}
                  className="bg-black/30 hover:bg-black/50 backdrop-blur-sm w-10 h-10 sm:w-12 sm:h-12 text-white hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>

                {/* Right side controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSettings(!showSettings);
                    }}
                    className="bg-black/30 hover:bg-black/50 backdrop-blur-sm w-10 h-10 sm:w-12 sm:h-12 text-white hover:text-white"
                  >
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullscreen();
                    }}
                    className="bg-black/30 hover:bg-black/50 backdrop-blur-sm w-10 h-10 sm:w-12 sm:h-12 text-white hover:text-white"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Center Play Button (Large) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white hover:text-white transition-all duration-300 hover:scale-110"
              >
                {isLoading ? (
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                ) : (
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ml-1" fill="currentColor" />
                )}
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  onValueChange={handleProgressChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs sm:text-sm text-white/80 font-medium">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {/* Skip Back */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      skipTime(-10);
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 text-white hover:text-white hover:bg-white/20"
                  >
                    <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>

                  {/* Play/Pause */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 text-white hover:text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                    )}
                  </Button>

                  {/* Skip Forward */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      skipTime(10);
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 text-white hover:text-white hover:bg-white/20"
                  >
                    <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white hover:text-white hover:bg-white/20"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </Button>
                    <div className="w-16 sm:w-20">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Playback Speed */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSettings(!showSettings);
                      }}
                      className="text-white hover:text-white hover:bg-white/20 text-xs sm:text-sm"
                    >
                      {playbackRate}x
                    </Button>
                  </div>

                  {/* Picture in Picture */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Picture in picture functionality would go here
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 text-white hover:text-white hover:bg-white/20"
                  >
                    <PictureInPicture className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Settings Menu */}
            {showSettings && (
              <div className="absolute bottom-16 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-48">
                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm mb-2">Playback Speed</h4>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaybackRateChange(rate);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${playbackRate === rate
                        ? 'bg-primary text-primary-foreground'
                        : 'text-white hover:bg-white/20'
                        }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Information */}
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  {video.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-foreground-muted text-sm sm:text-base">
                  <span className="bg-primary/20 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                    {video.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {video.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    {video.rating}
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {video.genre}
                  </span>
                </div>

                <p className="text-base sm:text-lg text-foreground-muted leading-relaxed max-w-4xl">
                  {video.description}
                </p>

                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Watchlist
                  </Button>
                  <Button variant="outline" className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 border-2 hover:border-primary/50">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Rate
                  </Button>
                  <Button variant="outline" className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 border-2 hover:border-primary/50">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Cast and Crew */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/20">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    Cast
                  </h3>
                  <p className="text-foreground-muted text-sm sm:text-base leading-relaxed">{video.cast}</p>
                </div>
                <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/20">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    Director
                  </h3>
                  <p className="text-foreground-muted text-sm sm:text-base leading-relaxed">{video.director}</p>
                </div>
              </div>

              {/* Video Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">4.8</div>
                  <div className="text-xs text-foreground-muted">Rating</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-500 mb-1">1.2M</div>
                  <div className="text-xs text-foreground-muted">Views</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-500 mb-1">95%</div>
                  <div className="text-xs text-foreground-muted">Liked</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-500 mb-1">24K</div>
                  <div className="text-xs text-foreground-muted">Comments</div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/20">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  More Like This
                </h3>
                <div className="space-y-4">
                  {/* Related content would go here */}
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Play className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-foreground-muted text-sm">
                      Related content coming soon...
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/20">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restart
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <RotateCw className="w-4 h-4 mr-2" />
                    Replay
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Captions className="w-4 h-4 mr-2" />
                    Subtitles
                  </Button>
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