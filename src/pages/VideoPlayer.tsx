import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Plus,
  ThumbsUp,
  Share,
  SkipBack,
  SkipForward,
  Loader2,
  MessageCircle,
  Send,
  Clock,
  Star
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
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(95000);
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

  console.log('VideoPlayer - ID from params:', id);
  console.log('VideoPlayer - Available video data:', Object.keys(videoData));
  console.log('VideoPlayer - Looking for video with ID:', id);
  
  const video = id ? videoData[id] : null;
  console.log('VideoPlayer - Found video:', video);

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


  // Sync video element events with component state
  useEffect(() => {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (!videoElement) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

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
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
      setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  }, [isMuted]);

  const skipTime = useCallback((seconds: number) => {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.currentTime = Math.max(0, Math.min(videoElement.currentTime + seconds, videoElement.duration));
    }
    setCurrentTime(prev => Math.max(0, Math.min(prev + seconds, duration)));
    showControlsTemporarily();
  }, [duration, showControlsTemporarily]);

  const adjustVolume = useCallback((delta: number) => {
    const newVolume = Math.max(0, Math.min(100, volume + delta));
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.volume = newVolume / 100;
    }
    setVolume(newVolume);
    showControlsTemporarily();
  }, [volume, showControlsTemporarily]);

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
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.currentTime = value[0];
    }
    setCurrentTime(value[0]);
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  const handleVolumeChange = useCallback((value: number[]) => {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.volume = value[0] / 100;
    }
    setVolume(value[0]);
    if (value[0] === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
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

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  }, [isLiked]);

  const formatCommentTime = useCallback((timestamp: string) => {
    return timestamp;
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Modern Video Player Section */}
      <div className="pt-16 sm:pt-20">
        <div
          ref={videoRef}
          className={`relative bg-black aspect-video w-full max-h-[60vh] sm:max-h-[80vh] group cursor-pointer transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 max-h-none' : ''
            }`}
          onMouseMove={showControlsTemporarily}
          onMouseLeave={() => setShowControls(false)}
          onClick={togglePlay}
        >
          {/* Video Background with Thumbnail */}
          <div className="w-full h-full relative overflow-hidden">
            {/* Video thumbnail as background */}
            {video.thumbnail && (
              <div className="absolute inset-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>
            )}

            {/* Hidden Video Element */}
            <video
              className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
              preload="metadata"
              poster={video.thumbnail}
            >
              <source src={video.videoUrl || video.trailerUrl || ""} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                  <p className="text-white text-lg font-medium">Loading...</p>
                </div>
              </div>
            )}

            {/* Center Play Button - Large and Prominent */}
            {!isPlaying && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center hover:bg-white/30 hover:border-white/50 transition-all duration-300 hover:scale-110">
                    <Play className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
            )}

          {/* Video Controls Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Top Controls */}
              <div className="absolute top-0 left-0 right-0 p-4 lg:p-6">
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

            {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  onValueChange={handleProgressChange}
                  className="w-full"
                />
                  <div className="flex justify-between text-sm text-white/80 font-medium">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                  {/* Skip Back */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      skipTime(-10);
                    }}
                      className="w-10 h-10 text-white hover:text-white hover:bg-white/20"
                  >
                      <SkipBack className="w-5 h-5" />
                  </Button>

                  {/* Play/Pause */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                      className="w-10 h-10 text-white hover:text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                        <Pause className="w-5 h-5" />
                    ) : (
                        <Play className="w-5 h-5" fill="currentColor" />
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
                      className="w-10 h-10 text-white hover:text-white hover:bg-white/20"
                  >
                      <SkipForward className="w-5 h-5" />
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
                        className="w-10 h-10 text-white hover:text-white hover:bg-white/20"
                    >
                      {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5" />
                      ) : (
                          <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                      <div className="w-20">
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
                </div>
              </div>
            </div>

              </div>
          </div>
        </div>

        {/* Modern Video Information Section */}
        <div className="bg-black">
          <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Video Title and Info */}
                <div className="space-y-6">
              <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {video.title}
                </h1>

                     {/* Action Buttons */}
                     <div className="flex flex-wrap gap-4">
                       <Button 
                         onClick={togglePlay}
                         className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-xl"
                       >
                         <Play className="w-5 h-5 mr-3" />
                         Play Video
                       </Button>
                       <Button variant="outline" className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 border-2 border-white/30 text-white hover:bg-white/10">
                         <Plus className="w-5 h-5 mr-3" />
                       Add to Watchlist
                     </Button>
                       <Button 
                         variant="outline" 
                         onClick={handleLike}
                         className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 border-2 text-white hover:bg-white/10 ${
                           isLiked 
                             ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30' 
                             : 'border-white/30 hover:bg-white/10'
                         }`}
                       >
                         <ThumbsUp className={`w-5 h-5 mr-3 ${isLiked ? 'fill-current' : ''}`} />
                         {isLiked ? 'Liked' : 'Like'} ({likeCount.toLocaleString()})
                       </Button>
                     </div>

                     <div className="flex flex-wrap items-center gap-4 text-white/80 text-lg">
                       <div className="flex items-center gap-2">
                         <Clock className="w-5 h-5" />
                         <span className="font-medium">{video.duration}</span>
                       </div>
                       <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                     {video.year}
                   </span>
                     </div>

                     {/* Video Stats - Views, Likes, Comments */}
                     <div className="flex flex-wrap items-center gap-6 text-white/80">
                       <div className="flex items-center gap-2">
                         <span className="text-2xl font-bold text-white">1.2M</span>
                         <span className="text-lg">views</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <ThumbsUp className="w-5 h-5" />
                         <span className="text-2xl font-bold text-white">{likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount.toLocaleString()}</span>
                         <span className="text-lg">likes</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <MessageCircle className="w-5 h-5" />
                         <span className="text-2xl font-bold text-white">24K</span>
                         <span className="text-lg">comments</span>
                       </div>
                     </div>
                </div>

                  <p className="text-xl text-white/90 leading-relaxed max-w-4xl">
                  {video.description}
                </p>
              </div>

              {/* Cast and Crew */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-2 h-8 bg-white rounded-full"></div>
                    Cast
                  </h3>
                    <p className="text-white/90 text-lg leading-relaxed">{video.cast}</p>
                </div>
                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-2 h-8 bg-white rounded-full"></div>
                    Director
                  </h3>
                    <p className="text-white/90 text-lg leading-relaxed">{video.director}</p>
                </div>
              </div>

            </div>

            {/* Sidebar */}
              <div className="space-y-8">
              {/* Comments Section */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                   <div className="p-6 border-b border-white/20">
                     <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                       <MessageCircle className="w-6 h-6 text-white" />
                      Comments ({comments.length})
                    </h3>
                </div>

                <div className="p-6 space-y-6">
                    {/* Add Comment Form */}
                  <div className="p-4 bg-white/5 rounded-xl border border-white/20">
                    <div className="flex gap-3">
                        <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
                          alt="Your avatar"
                        className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <textarea
                            ref={commentInputRef}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Add a comment..."
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder:text-white/60 text-sm"
                          rows={3}
                          />
                        <div className="flex justify-end items-center mt-2">
                            <Button
                              onClick={handleAddComment}
                              disabled={!newComment.trim()}
                              size="sm"
                            className="bg-white text-black hover:bg-white/90 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                            <Send className="w-4 h-4 mr-2" />
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                      {comments.slice(0, 5).map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                          <img
                            src={comment.avatar}
                            alt={comment.user}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-white text-sm">{comment.user}</span>
                            <span className="text-xs text-white/60">{comment.timestamp}</span>
                            </div>
                          <p className="text-white/90 text-sm leading-relaxed">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View All Comments */}
                    {comments.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" size="sm" className="text-sm border-white/30 text-white hover:bg-white/10">
                          View All Comments ({comments.length})
                        </Button>
                      </div>
                    )}
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