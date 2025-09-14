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
  Loader2,
  MessageCircle,
  Send,
  Heart,
  MoreHorizontal,
  Reply,
  Flag,
  Smile,
  Image,
  Video
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
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "MovieFan123",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      text: "This movie is absolutely amazing! The cinematography is stunning and the story keeps you hooked from start to finish.",
      timestamp: "2 hours ago",
      likes: 24,
      replies: 3,
      isLiked: false,
      repliesList: [
        {
          id: 11,
          user: "CinemaLover",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
          text: "I totally agree! The visual effects were incredible.",
          timestamp: "1 hour ago",
          likes: 8,
          isLiked: false
        }
      ]
    },
    {
      id: 2,
      user: "CinemaLover",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      text: "The plot twist in the third act completely caught me off guard! Didn't see that coming at all.",
      timestamp: "1 hour ago",
      likes: 18,
      replies: 1,
      isLiked: true,
      repliesList: []
    },
    {
      id: 3,
      user: "FilmCritic",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      text: "Great performances from the entire cast. The director really brought out the best in everyone. Highly recommended!",
      timestamp: "45 minutes ago",
      likes: 31,
      replies: 0,
      isLiked: false,
      repliesList: []
    },
    {
      id: 4,
      user: "StreamingPro",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      text: "The soundtrack is phenomenal! It perfectly complements every scene and adds so much emotion to the story.",
      timestamp: "30 minutes ago",
      likes: 15,
      replies: 2,
      isLiked: false,
      repliesList: []
    }
  ]);
  const videoRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

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

  // Comment handling functions
  const handleAddComment = useCallback(() => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: "You",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
        text: newComment.trim(),
        timestamp: "Just now",
        likes: 0,
        replies: 0,
        isLiked: false,
        repliesList: []
      };
      setComments(prev => [comment, ...prev]);
      setNewComment("");
      setReplyingTo(null);
    }
  }, [newComment]);

  const handleLikeComment = useCallback((commentId: number) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId
        ? {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        }
        : comment
    ));
  }, []);

  const handleReplyToComment = useCallback((commentId: number) => {
    setReplyingTo(commentId);
    commentInputRef.current?.focus();
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  }, [handleAddComment]);

  const formatCommentTime = useCallback((timestamp: string) => {
    return timestamp;
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

                  {/* Comments Toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowComments(!showComments);
                    }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 text-white hover:text-white hover:bg-white/20 ${showComments ? 'bg-white/20' : ''
                      }`}
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>

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

        {/* Video Information with Comments */}
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
              {/* Comments Section */}
              <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/20">
                <div className="p-4 border-b border-border/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      Comments ({comments.length})
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowComments(!showComments)}
                      className="text-foreground-muted hover:text-foreground"
                    >
                      {showComments ? <MoreHorizontal className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {showComments ? (
                  <div className="p-4 space-y-4">
                    {/* Add Comment Form */}
                    <div className="p-3 bg-background/50 rounded-lg border border-border/20">
                      <div className="flex gap-2">
                        <img
                          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face"
                          alt="Your avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <textarea
                            ref={commentInputRef}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Add a comment..."
                            className="w-full p-2 bg-background border border-border/20 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-foreground placeholder:text-foreground-muted text-sm"
                            rows={2}
                          />
                          <div className="flex justify-end items-center mt-1">
                            <Button
                              onClick={handleAddComment}
                              disabled={!newComment.trim()}
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-white px-3 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {comments.slice(0, 5).map((comment) => (
                        <div key={comment.id} className="flex gap-2 p-3 bg-background/30 rounded-lg hover:bg-background/50 transition-colors">
                          <img
                            src={comment.avatar}
                            alt={comment.user}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="font-medium text-foreground text-xs">{comment.user}</span>
                              <span className="text-xs text-foreground-muted">{comment.timestamp}</span>
                            </div>
                            <p className="text-foreground text-xs leading-relaxed">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View All Comments */}
                    {comments.length > 5 && (
                      <div className="text-center pt-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          View All Comments ({comments.length})
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-foreground-muted text-sm mb-2">
                      {comments.length} comments
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowComments(true)}
                      className="text-xs"
                    >
                      View Comments
                    </Button>
                  </div>
                )}
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