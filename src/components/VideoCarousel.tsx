import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
  year?: string;
  rating?: string;
}

interface VideoCarouselProps {
  title: string;
  videos: Video[];
}

const VideoCarousel = ({ title, videos }: VideoCarouselProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of one card plus gap
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      // Update scroll buttons state after scroll
      setTimeout(() => {
        if (scrollRef.current) {
          setCanScrollLeft(scrollRef.current.scrollLeft > 0);
          setCanScrollRight(
            scrollRef.current.scrollLeft < 
            scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
          );
        }
      }, 300);
    }
  };

  const handleVideoClick = (videoId: string) => {
    navigate(`/watch/${videoId}`);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-8 h-8 rounded-full bg-background-secondary/50 hover:bg-background-secondary disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-8 h-8 rounded-full bg-background-secondary/50 hover:bg-background-secondary disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            setCanScrollLeft(target.scrollLeft > 0);
            setCanScrollRight(
              target.scrollLeft < target.scrollWidth - target.clientWidth - 10
            );
          }}
        >
          {videos.map((video) => (
            <div
              key={video.id}
              className="video-card group flex-shrink-0 w-72 h-40 relative"
              onClick={() => handleVideoClick(video.id)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover rounded-lg"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm"
                >
                  <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                </Button>
              </div>

              {/* Video Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-foreground font-semibold text-sm mb-1 line-clamp-1">
                  {video.title}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-foreground-muted">
                  {video.year && <span>{video.year}</span>}
                  {video.duration && <span>• {video.duration}</span>}
                  {video.rating && <span>• {video.rating}</span>}
                </div>
              </div>

              {/* Duration Badge */}
              {video.duration && (
                <div className="absolute top-2 right-2 bg-background/80 text-foreground text-xs px-2 py-1 rounded backdrop-blur-sm">
                  {video.duration}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoCarousel;