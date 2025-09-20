import { useState, useEffect, useRef } from "react";
import { Play, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import videosData from "@/data/videos.json";

const MobileHeroSection = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Use first 3 videos for mobile hero section
    const mobileVideos = videosData.slice(0, 3).map(video => ({
        id: video.id,
        title: video.title,
        thumbnailUrl: video.thumbnailUrl,
        videoUrl: video.videoUrl,
        description: video.description,
        author: video.author,
        duration: video.duration,
        uploadTime: video.uploadTime,
        views: video.views,
        isLive: video.isLive
    }));

    // Debug logging for mobile videos
    console.log('Mobile Hero - Videos loaded:', mobileVideos.length);
    console.log('Mobile Hero - Video IDs:', mobileVideos.map(v => v.id));
    console.log('Mobile Hero - Current slide:', currentSlide);


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => {
                const newSlide = (prev + 1) % mobileVideos.length;
                console.log(`Mobile Hero - Auto-sliding from ${prev} to ${newSlide}`);
                return newSlide;
            });
        }, 6000); // Faster auto-slide for mobile

        return () => clearInterval(timer);
    }, [mobileVideos.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    // Swipe functionality
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const touchRef = useRef<HTMLDivElement>(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        console.log(`Mobile Hero - Swipe detected: distance=${distance}, isLeftSwipe=${isLeftSwipe}, isRightSwipe=${isRightSwipe}`);

        if (isLeftSwipe) {
            // Swipe left - go to next slide
            setCurrentSlide((prev) => {
                const newSlide = (prev + 1) % mobileVideos.length;
                console.log(`Mobile Hero - Swipe left: ${prev} -> ${newSlide}`);
                return newSlide;
            });
        }
        if (isRightSwipe) {
            // Swipe right - go to previous slide
            setCurrentSlide((prev) => {
                const newSlide = (prev - 1 + mobileVideos.length) % mobileVideos.length;
                console.log(`Mobile Hero - Swipe right: ${prev} -> ${newSlide}`);
                return newSlide;
            });
        }
    };

    const currentHero = mobileVideos[currentSlide];

    const handleWatchNow = () => {
        console.log('=== MOBILE HERO BUTTON CLICKED ===');
        console.log('Current slide index:', currentSlide);
        console.log('Current hero (at currentSlide):', currentHero);
        console.log('Current hero ID:', currentHero?.id);
        console.log('Current hero title:', currentHero?.title);
        console.log('All mobile videos:', mobileVideos.map(v => ({ id: v.id, title: v.title })));
        console.log('Navigating to:', `/watch/${currentHero?.id}`);
        console.log('==================================');
        navigate(`/watch/${currentHero?.id}`);
    };

    // Don't render if no videos
    if (!mobileVideos.length || !currentHero) {
        return (
            <section className="relative h-96 sm:h-[500px] overflow-hidden mobile-hero-section bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground mb-2">No Videos Available</h2>
                    <p className="text-foreground-muted">Please check back later for new content.</p>
                </div>
            </section>
        );
    }

    return (
        <section
            className="relative h-96 sm:h-[500px] overflow-hidden mobile-hero-section"
            ref={touchRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Hero Slides */}
            <div className="relative w-full h-full">
                {mobileVideos.map((hero, index) => (
                    <div
                        key={hero.id}
                        className={`absolute inset-0 transition-all duration-800 ease-in-out ${index === currentSlide
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105'
                            }`}
                    >
                        {/* Mobile-Optimized Background Image */}
                        <div className="absolute inset-0 mobile-hero-bg">
                            <img
                                src={hero.thumbnailUrl}
                                alt={hero.title}
                                className="w-full h-full object-contain object-center mobile-hero-image"
                                style={{
                                    minHeight: '24rem', // h-96 equivalent
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    objectPosition: 'center'
                                }}
                            />
                        </div>

                        {/* Mobile-Optimized Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/40" />

                        {/* Mobile Content */}
                        <div className="relative z-10 flex items-end h-full pb-6">
                            <div className="w-full px-4">
                                <div className="space-y-3 animate-fade-in">
                                    {/* Author */}
                                    <p className="text-accent font-medium text-xs tracking-wide uppercase">
                                        {hero.author}
                                    </p>

                                    {/* Title */}
                                    <h1 className="text-2xl font-bold text-foreground leading-tight">
                                        {hero.title}
                                    </h1>

                                    {/* Mobile Metadata */}
                                    <div className="flex items-center space-x-2 text-foreground-muted text-sm">
                                        <span className="bg-accent/20 text-accent px-3 py-1 rounded text-sm font-medium">
                                            {hero.uploadTime}
                                        </span>
                                        <span>{hero.duration}</span>
                                        <span>•</span>
                                        <span className="truncate">{hero.views}</span>
                                    </div>

                                    {/* Mobile Description */}
                                    <p className="text-sm text-foreground-muted leading-relaxed line-clamp-2">
                                        {hero.description}
                                    </p>

                                    {/* Mobile Action Buttons */}
                                    <div className="flex space-x-3 pt-2">
                                        <Button
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log('=== WATCH NOW BUTTON CLICKED ===');
                                                console.log('Hero being clicked:', hero);
                                                console.log('Hero ID:', hero.id);
                                                console.log('Hero title:', hero.title);
                                                console.log('Current slide index:', currentSlide);
                                                console.log('Is this the current slide?', index === currentSlide);
                                                console.log('Button index in map:', index);
                                                console.log('================================');
                                                handleWatchNow();
                                            }}
                                            className="bg-primary hover:bg-primary-dark text-primary-foreground px-6 py-3 text-sm font-semibold flex-1 rounded-lg min-w-0"
                                        >
                                            <Play className="w-4 h-4 mr-2" fill="currentColor" />
                                            Watch Now
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log('=== PLUS BUTTON CLICKED ===');
                                                console.log('Hero being clicked:', hero);
                                                console.log('Hero ID:', hero.id);
                                                console.log('Hero title:', hero.title);
                                                console.log('Current slide index:', currentSlide);
                                                console.log('Is this the current slide?', index === currentSlide);
                                                console.log('Button index in map:', index);
                                                console.log('==========================');
                                                handleWatchNow();
                                            }}
                                            className="px-4 py-3 text-sm font-semibold rounded-lg flex-shrink-0"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {/* Mobile Slide Indicators */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2">
                    {mobileVideos.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                ? 'bg-primary scale-125'
                                : 'bg-white/50 hover:bg-white/70'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MobileHeroSection;
