
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

// Import dynamic video data
import videosData from "@/data/videos.json";

// Convert array to object for easy lookup
const getAllVideoData = () => {
  const allVideos: { [key: string]: any } = {};
  
  videosData.forEach(video => {
    allVideos[video.id] = {
      ...video,
      // Map the new structure to match existing expectations
      thumbnail: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      title: video.title,
      description: video.description,
      duration: video.duration,
      year: video.uploadTime,
      rating: "PG",
      genre: "Various",
      cast: video.author,
      director: video.author
    };
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
  const [isDragging, setIsDragging] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
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
      avatar: "/placeholder.svg",
      text: "This movie is absolutely amazing! The cinematography is stunning and the story keeps you hooked from start to finish.",
      timestamp: "2 hours ago",
      likes: 24,
      replies: 3,
      isLiked: false,
      repliesList: [
        {
          id: 11,
          user: "CinemaLover",
          avatar: "/placeholder.svg",
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
      avatar: "/placeholder.svg",
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
      avatar: "/placeholder.svg",
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
      avatar: "/placeholder.svg",
      text: "The soundtrack is phenomenal! It perfectly complements every scene and adds so much emotion to the story.",
      timestamp: "30 minutes ago",
      likes: 15,
      replies: 2,
      isLiked: false,
      repliesList: []
    }
  ]);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
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

  // Progress timer - removed because video onTimeUpdate handles this

  // Auto-hide controls when playing
  useEffect(() => {
    if (isPlaying && showControls) {
      hideControls();
    }
  }, [isPlaying, showControls, hideControls]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      
      setIsFullscreen(isCurrentlyFullscreen);
      
      // Reset video element when exiting fullscreen
      if (!isCurrentlyFullscreen && videoElementRef.current) {
        const videoElement = videoElementRef.current;
        // Preserve current time when exiting fullscreen
        const currentVideoTime = videoElement.currentTime;
        
        videoElement.style.opacity = '1';
        videoElement.controls = false;
        videoElement.style.position = 'absolute';
        videoElement.style.top = '0';
        videoElement.style.left = '0';
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.zIndex = 'auto';
        videoElement.style.objectFit = 'cover';
        videoElement.style.backgroundColor = 'transparent';
        videoElement.style.pointerEvents = 'auto';
        
        // Ensure the time is preserved
        videoElement.currentTime = currentVideoTime;
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);


  // Sync video element events with component state
  // Initialize video source when component mounts or video changes
  useEffect(() => {
    if (videoElementRef.current && video) {
      const videoElement = videoElementRef.current;
      
      // Use actual video URL from data
      const videoSource = video.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      
      const currentSrc = videoElement.src;
      const newSrc = videoSource;
      
      if (currentSrc !== newSrc) {
        videoElement.src = newSrc;
        videoElement.load();
        
        // Reset states
        setIsVideoReady(false);
        setIsLoading(true);
        setIsPlaying(false);
        
        // Make sure video is visible
        videoElement.style.opacity = '1';
        videoElement.style.pointerEvents = 'auto';
      }
    }
  }, [video]);

  useEffect(() => {
    const videoElement = videoElementRef.current;
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
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = useCallback(async () => {
    const videoElement = videoElementRef.current;
    if (videoElement) {
      try {
        if (isPlaying) {
          videoElement.pause();
          setIsPlaying(false);
        } else {
          // Ensure video is ready before playing
          if (!isVideoReady) {
            videoElement.load();
            // Wait a bit for video to be ready
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          await videoElement.play();
          setIsPlaying(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error toggling play:', error);
        setIsLoading(false);
        // Don't change playing state on error
      }
    }
  }, [isPlaying, isVideoReady]);

  const toggleMute = useCallback(() => {
    const videoElement = videoElementRef.current;
    if (videoElement) {
      videoElement.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  }, [isMuted]);

  const skipTime = useCallback((seconds: number) => {
    const videoElement = videoElementRef.current;
    if (videoElement) {
      videoElement.currentTime = Math.max(0, Math.min(videoElement.currentTime + seconds, videoElement.duration));
    }
    setCurrentTime(prev => Math.max(0, Math.min(prev + seconds, duration)));
    showControlsTemporarily();
  }, [duration, showControlsTemporarily]);

  const adjustVolume = useCallback((delta: number) => {
    const newVolume = Math.max(0, Math.min(100, volume + delta));
    const videoElement = videoElementRef.current;
    if (videoElement) {
      videoElement.volume = newVolume / 100;
    }
    setVolume(newVolume);
    showControlsTemporarily();
  }, [volume, showControlsTemporarily]);

  const toggleFullscreen = useCallback(async () => {
    
    if (!document.fullscreenElement) {
      // Enter fullscreen
      const videoElement = videoElementRef.current;
      
      if (videoElement) {
        try {
          // Check if it's a mobile device
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          // Use actual video URL from data
          const videoSource = video.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
          
          // Store current time before any operations
          const savedCurrentTime = videoElement.currentTime;
          
          // Always set the video source to ensure it's correct
          const currentSrc = videoElement.src;
          const newSrc = videoSource.startsWith('http') ? videoSource : window.location.origin + videoSource;
          
          if (currentSrc !== newSrc) {
            videoElement.src = newSrc;
            videoElement.load();
            
            // Wait for video to be ready
            await new Promise((resolve) => {
              const onCanPlay = () => {
                videoElement.removeEventListener('canplay', onCanPlay);
                videoElement.removeEventListener('error', onError);
                // Set the current time after video is ready
                videoElement.currentTime = savedCurrentTime;
                // Small delay to ensure time is set
                setTimeout(() => {
                  videoElement.currentTime = savedCurrentTime;
                }, 100);
                resolve(true);
              };
              
              const onError = (error: any) => {
                videoElement.removeEventListener('canplay', onCanPlay);
                videoElement.removeEventListener('error', onError);
                console.error('Video error in fullscreen:', error);
                resolve(false);
              };
              
              videoElement.addEventListener('canplay', onCanPlay);
              videoElement.addEventListener('error', onError);
              
              // Timeout after 3 seconds
              setTimeout(() => {
                videoElement.removeEventListener('canplay', onCanPlay);
                videoElement.removeEventListener('error', onError);
                // Set the current time even if timeout
                videoElement.currentTime = savedCurrentTime;
                // Small delay to ensure time is set
                setTimeout(() => {
                  videoElement.currentTime = savedCurrentTime;
                }, 100);
                resolve(false);
              }, 3000);
            });
          } else {
            // If same source, just set the current time (no reload needed)
            videoElement.currentTime = savedCurrentTime;
          }
          
          // Set video element styles for fullscreen
          videoElement.style.position = 'fixed';
          videoElement.style.top = '0';
          videoElement.style.left = '0';
          videoElement.style.width = '100vw';
          videoElement.style.height = '100vh';
          videoElement.style.zIndex = '9999';
          videoElement.style.objectFit = 'contain';
          videoElement.style.backgroundColor = 'black';
          videoElement.style.opacity = '1';
          videoElement.style.pointerEvents = 'auto';
          videoElement.controls = true;
          
          // Video time is already set above
          
          // For mobile devices, try to lock orientation to landscape
          if (isMobile && screen.orientation && (screen.orientation as any).lock) {
            try {
              await (screen.orientation as any).lock('landscape');
            } catch (orientationError) {
            }
          }
          
          // Request fullscreen
          if (videoElement.requestFullscreen) {
            await videoElement.requestFullscreen();
          } else if ((videoElement as any).webkitRequestFullscreen) {
            (videoElement as any).webkitRequestFullscreen();
          } else if ((videoElement as any).mozRequestFullScreen) {
            (videoElement as any).mozRequestFullScreen();
          } else if ((videoElement as any).msRequestFullscreen) {
            (videoElement as any).msRequestFullscreen();
          }
          
          setIsFullscreen(true);
          setIsVideoReady(true);
          
          // Try to play the video
          try {
            // Ensure video is not muted if user wants sound
            if (!isMuted) {
              videoElement.muted = false;
            }
            await videoElement.play();
            setIsPlaying(true);
          } catch (e) {
            // If autoplay fails, ensure controls are visible for manual play
            videoElement.controls = true;
          }
          
        } catch (error) {
          console.error('Error entering fullscreen:', error);
        }
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
      setIsVideoReady(false);
      
      // Unlock orientation on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile && screen.orientation && (screen.orientation as any).unlock) {
        try {
          (screen.orientation as any).unlock();
        } catch (orientationError) {
        }
      }
      
      // Reset video element
      const videoElement = videoElementRef.current;
      if (videoElement) {
        // Preserve current time when exiting fullscreen
        const currentVideoTime = videoElement.currentTime;
        
        videoElement.pause();
        videoElement.style.opacity = '1';
        videoElement.controls = false;
        videoElement.style.position = 'absolute';
        videoElement.style.top = '0';
        videoElement.style.left = '0';
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.zIndex = 'auto';
        videoElement.style.objectFit = 'cover';
        videoElement.style.backgroundColor = 'transparent';
        videoElement.style.pointerEvents = 'auto';
        
        // Ensure the time is preserved
        videoElement.currentTime = currentVideoTime;
      }
    }
  }, [video]);

  const exitFullscreen = useCallback(() => {
    document.exitFullscreen();
    setIsFullscreen(false);
  }, []);

  const handleProgressChange = useCallback((value: number[]) => {
    const newTime = value[0];
    
    // Always update the display immediately for smooth slider movement
    setCurrentTime(newTime);
    
    // Only update video time when not dragging and change is significant
    if (!isDragging) {
      const videoElement = videoElementRef.current;
      if (videoElement && Math.abs(videoElement.currentTime - newTime) > 1) {
        videoElement.currentTime = newTime;
      }
    }
    
    showControlsTemporarily();
  }, [showControlsTemporarily, isDragging]);

  const handleProgressCommit = useCallback((value: number[]) => {
    const newTime = value[0];
    const videoElement = videoElementRef.current;
    
    if (videoElement) {
      videoElement.currentTime = newTime;
    }
    
    setIsDragging(false);
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  const handleVolumeChange = useCallback((value: number[]) => {
    const videoElement = videoElementRef.current;
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
        avatar: "/placeholder.svg",
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
          className={`relative bg-black aspect-video w-full max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-[80vh] group cursor-pointer transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 max-h-none w-full h-full' : ''
            }`}
          onMouseMove={() => {
            setShowControls(true);
          }}
          onMouseLeave={() => {
            setShowControls(false);
          }}
          onClick={(e) => {
            // Only toggle play if not clicking on controls
            if (e.target === e.currentTarget || !(e.target as Element).closest('button')) {
              togglePlay();
            }
          }}
          style={isFullscreen ? { 
            width: '100vw', 
            height: '100vh',
            aspectRatio: 'unset',
            background: 'black',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999
          } : {}}
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

            {/* Video Element */}
            <video
              ref={videoElementRef}
              className={`absolute inset-0 w-full h-full ${isFullscreen ? 'opacity-100 pointer-events-auto' : 'opacity-100 pointer-events-auto'}`}
              preload="auto"
              poster={video.thumbnail}
              controls={isFullscreen}
              playsInline
              webkit-playsinline="true"
              muted={isMuted}
              autoPlay={false}
              style={isFullscreen ? {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
                objectFit: 'contain',
                backgroundColor: 'black',
                opacity: 1,
                pointerEvents: 'auto'
              } : {
                opacity: 1,
                pointerEvents: 'auto',
                objectFit: 'cover'
              }}
              onLoadedMetadata={() => {
                if (videoElementRef.current) {
                  setDuration(videoElementRef.current.duration);
                  setIsVideoReady(true);
                }
              }}
              onTimeUpdate={() => {
                if (videoElementRef.current && !isDragging) {
                  const newTime = videoElementRef.current.currentTime;
                  
                  // Always update for smooth progression - no throttling
                  setCurrentTime(newTime);
                }
              }}
              onPlay={() => {
                setIsPlaying(true);
                setIsLoading(false);
              }}
              onPause={() => {
                setIsPlaying(false);
              }}
              onError={(e) => {
                console.error('Video error:', e);
                console.error('Video error details:', videoElementRef.current?.error);
                setIsLoading(false);
              }}
              onLoadStart={() => {
                setIsLoading(true);
              }}
              onCanPlay={() => {
                setIsLoading(false);
                setIsVideoReady(true);
              }}
              onCanPlayThrough={() => {
                setIsLoading(false);
                setIsVideoReady(true);
              }}
              onLoadedData={() => {
                setIsVideoReady(true);
              }}
              onError={(e) => {
                console.error('Video error:', e);
              }}
            >
              <source src={video.videoUrl || video.trailerUrl || '/videos/sample-video.mp4'} type="video/mp4" />
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

            {/* Fullscreen Loading indicator */}
            {isFullscreen && !isVideoReady && (
              <div className="fixed inset-0 bg-black flex items-center justify-center z-40">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
                  <p className="text-white text-xl font-medium">Loading video for fullscreen...</p>
                </div>
              </div>
            )}

            {/* Fullscreen Play Button - Shows if video is ready but not playing */}
            {isFullscreen && isVideoReady && !isPlaying && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
                <div className="text-center">
                  <Button
                    onClick={togglePlay}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent shadow-xl border-2 border-primary/40 flex items-center justify-center hover:from-primary/90 hover:to-accent/90 hover:border-primary/60 transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  </Button>
                  <p className="text-white text-lg font-medium mt-4">Click to play video</p>
                </div>
              </div>
            )}

            {/* Center Play Button - Perfectly Centered */}
            {!isPlaying && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-full bg-gradient-to-br from-primary to-accent shadow-xl border-2 border-primary/40 flex items-center justify-center hover:from-primary/90 hover:to-accent/90 hover:border-primary/60 transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation cursor-pointer group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white ml-0.5 drop-shadow-lg" fill="currentColor" />
                  </div>
                </div>
              </div>
            )}


          {/* Video Controls Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-all duration-300 z-30 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ pointerEvents: showControls ? 'auto' : 'none' }}>
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
                  className="bg-black/30 hover:bg-black/50 backdrop-blur-sm w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white hover:text-white touch-manipulation"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </Button>

                {/* Right side controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFullscreen();
                    }}
                    className="bg-black/30 hover:bg-black/50 backdrop-blur-sm w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white hover:text-white touch-manipulation z-50"
                    style={{ pointerEvents: 'auto', zIndex: 9999 }}
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    ) : (
                      <Maximize className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
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
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white hover:text-white hover:bg-white/20 touch-manipulation"
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
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white hover:text-white hover:bg-white/20 touch-manipulation"
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
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white hover:text-white hover:bg-white/20 touch-manipulation"
                  >
                      <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>

                  {/* Volume Control - Hidden on mobile, shown on larger screens */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                        className="w-10 h-10 text-white hover:text-white hover:bg-white/20 touch-manipulation"
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

                  {/* Mobile Volume Button */}
                <div className="flex sm:hidden items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                      className="w-8 h-8 text-white hover:text-white hover:bg-white/20 touch-manipulation"
                  >
                    {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4" />
                    ) : (
                        <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>

              </div>
            </div>

              </div>
          </div>
        </div>

        {/* Progress Bar - Below Video Player */}
        <div className="bg-black px-3 sm:px-4 py-2">
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleProgressChange}
              onValueCommit={handleProgressCommit}
              onPointerDown={() => setIsDragging(true)}
              onPointerUp={() => setIsDragging(false)}
              className="w-full"
            />
            <div className="flex justify-between text-xs sm:text-sm text-white/80 font-medium">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>


        {/* Modern Video Information Section */}
        <div className="bg-black">
          <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            {/* Main Content */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* Video Title and Info */}
                <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                  {video.title}
                </h1>

                     {/* Action Buttons */}
                     <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                       <Button 
                         onClick={togglePlay}
                         className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xl w-full sm:w-auto touch-manipulation border-2 border-primary/30 hover:border-primary/50"
                       >
                         <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center mr-2 sm:mr-3">
                           <Play className="w-3 h-3 sm:w-4 sm:h-4 text-white ml-0.5" fill="currentColor" />
                         </div>
                         Play Video
                       </Button>
                       <Button variant="outline" className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-white/30 text-white hover:bg-white/10 w-full sm:w-auto touch-manipulation backdrop-blur-sm">
                         <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 flex items-center justify-center mr-2 sm:mr-3">
                           <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                         </div>
                       Add to Watchlist
                     </Button>
                       <Button 
                         variant="outline" 
                         onClick={handleLike}
                         className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 hover:scale-105 active:scale-95 border-2 text-white hover:bg-white/10 w-full sm:w-auto touch-manipulation backdrop-blur-sm ${
                           isLiked 
                             ? 'bg-primary/20 border-primary/50 text-primary hover:bg-primary/30' 
                             : 'border-white/30 hover:bg-white/10'
                         }`}
                       >
                         <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${isLiked ? 'bg-primary/20' : 'bg-white/10'}`}>
                           <ThumbsUp className={`w-3 h-3 sm:w-4 sm:h-4 ${isLiked ? 'fill-current text-primary' : 'text-white'}`} />
                         </div>
                         <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
                         <span className="sm:hidden">{isLiked ? 'Liked' : 'Like'}</span>
                         <span className="ml-1">({likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount.toLocaleString()})</span>
                       </Button>
                     </div>

                     <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/80 text-sm sm:text-lg">
                       <div className="flex items-center gap-2">
                         <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                         <span className="font-medium">{video.duration}</span>
                       </div>
                       <span className="bg-white/20 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                     {video.year}
                   </span>
                     </div>

                     {/* Video Stats - Views, Likes, Comments */}
                     <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-white/80">
                       <div className="flex items-center gap-2">
                         <span className="text-lg sm:text-2xl font-bold text-white">1.2M</span>
                         <span className="text-sm sm:text-lg">views</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                         <span className="text-lg sm:text-2xl font-bold text-white">{likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount.toLocaleString()}</span>
                         <span className="text-sm sm:text-lg">likes</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                         <span className="text-lg sm:text-2xl font-bold text-white">24K</span>
                         <span className="text-sm sm:text-lg">comments</span>
                       </div>
                     </div>
                </div>

                  <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-4xl">
                  {video.description}
                </p>
              </div>

              {/* Cast and Crew */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-white/20">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                      <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-white rounded-full"></div>
                    Cast
                  </h3>
                    <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed">{video.cast}</p>
                </div>
                  <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-white/20">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                      <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-white rounded-full"></div>
                    Director
                  </h3>
                    <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed">{video.director}</p>
                </div>
              </div>

            </div>

            {/* Sidebar */}
              <div className="space-y-6 sm:space-y-8">
              {/* Comments Section */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20">
                   <div className="p-4 sm:p-6 border-b border-white/20">
                     <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                       <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      Comments ({comments.length})
                    </h3>
                </div>

                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Add Comment Form */}
                  <div className="p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/20">
                    <div className="flex gap-2 sm:gap-3">
                        <img
                        src="/placeholder.svg"
                          alt="Your avatar"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <textarea
                            ref={commentInputRef}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Add a comment..."
                          className="w-full p-2 sm:p-3 bg-white/10 border border-white/20 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder:text-white/60 text-xs sm:text-sm"
                          rows={2}
                          />
                        <div className="flex justify-end items-center mt-2">
                            <Button
                              onClick={handleAddComment}
                              disabled={!newComment.trim()}
                              size="sm"
                            className="bg-white text-black hover:bg-white/90 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                            >
                            <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                  <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
                      {comments.slice(0, 5).map((comment) => (
                      <div key={comment.id} className="flex gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors">
                          <img
                            src={comment.avatar}
                            alt={comment.user}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 sm:mb-2">
                            <span className="font-semibold text-white text-xs sm:text-sm">{comment.user}</span>
                            <span className="text-xs text-white/60">{comment.timestamp}</span>
                            </div>
                          <p className="text-white/90 text-xs sm:text-sm leading-relaxed">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View All Comments */}
                    {comments.length > 5 && (
                    <div className="text-center pt-3 sm:pt-4">
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm border-white/30 text-white hover:bg-white/10 touch-manipulation">
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
