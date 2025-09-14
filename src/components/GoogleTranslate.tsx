import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { initializeGoogleTranslate } from "@/utils/translateHelper";

const GoogleTranslate = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [initAttempts, setInitAttempts] = useState(0);
    const maxInitAttempts = 3;

    useEffect(() => {
        console.log('GoogleTranslate component mounted');

        // Enhanced initialization with retry logic
        const initializeWithRetry = () => {
            if (initAttempts >= maxInitAttempts) {
                console.log('Max initialization attempts reached');
                return;
            }
            
            setInitAttempts(prev => prev + 1);
            
            if ((window as any).google && (window as any).google.translate) {
                console.log('Google Translate API available, initializing...');

                try {
                    // Use the enhanced initialization
                    initializeGoogleTranslate();
                    
                    // Wait for initialization to complete
                    setTimeout(() => {
                        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                        if (selectElement) {
                            setIsLoaded(true);
                            console.log('Google Translate successfully initialized');
                            
                            // Handle URL parameters
                            const urlParams = new URLSearchParams(window.location.search);
                            const googtrans = urlParams.get('googtrans');
                            
                            if (googtrans && googtrans !== 'en') {
                                console.log('Applying translation from URL parameter:', googtrans);
                                setTimeout(() => {
                                    selectElement.value = googtrans;
                                    const events = ['change', 'input'];
                                    events.forEach(eventType => {
                                        selectElement.dispatchEvent(new Event(eventType, { bubbles: true }));
                                    });
                                    console.log('Translation applied from URL parameter');
                                }, 500);
                            }
                        } else {
                            console.log('Select element not found after initialization, retrying...');
                            setTimeout(initializeWithRetry, 1000);
                        }
                    }, 2000);
                    
                } catch (error) {
                    console.error('Error in Google Translate initialization:', error);
                    setTimeout(initializeWithRetry, 1000);
                }
            } else {
                console.log('Google Translate API not ready yet, retrying...');
                setTimeout(initializeWithRetry, 200);
            }
        };

        // Start initialization
        initializeWithRetry();

        // Enhanced banner hiding
        const hideBanner = () => {
            const banners = document.querySelectorAll('.goog-te-banner-frame, .VIpgJd-yAWNEb-L7lbkb');
            banners.forEach(banner => {
                (banner as HTMLElement).style.display = 'none';
                (banner as HTMLElement).style.visibility = 'hidden';
                (banner as HTMLElement).style.opacity = '0';
            });
            
            // Reset body margin that Google Translate might add
            if (document.body.style.marginTop) {
                document.body.style.marginTop = '0';
            }
        };

        const bannerInterval = setInterval(hideBanner, 100);
        
        // Clear interval after 10 seconds
        setTimeout(() => {
            clearInterval(bannerInterval);
        }, 10000);

        return () => {
            clearInterval(bannerInterval);
        };
    }, [initAttempts]);

    return (
        <div className="relative">
            {/* Google Translate Element - Initially visible for proper initialization, then hidden */}
            <div
                id="google_translate_element"
                style={{
                    position: isLoaded ? 'absolute' : 'relative',
                    top: isLoaded ? '-9999px' : '0',
                    left: isLoaded ? '-9999px' : '0',
                    visibility: isLoaded ? 'hidden' : 'visible',
                    opacity: isLoaded ? 0 : 1,
                    height: isLoaded ? '1px' : 'auto',
                    width: isLoaded ? '1px' : 'auto',
                    overflow: isLoaded ? 'hidden' : 'visible',
                    zIndex: isLoaded ? -1 : 1000,
                    display: 'block',
                    pointerEvents: isLoaded ? 'none' : 'auto'
                }}
            ></div>

            {/* Loading indicator */}
            {!isLoaded && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-background/50 border border-border/50 rounded-md animate-pulse">
                    <Languages className="w-4 h-4 animate-pulse" />
                    <span className="text-sm text-muted-foreground">
                        Loading Translate... {initAttempts > 1 && `(${initAttempts}/${maxInitAttempts})`}
                    </span>
                </div>
            )}
        </div>
    );
};

export default GoogleTranslate;
