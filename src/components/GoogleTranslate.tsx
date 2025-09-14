import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

const GoogleTranslate = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Check if Google Translate is already loaded
        const checkLoaded = () => {
            if ((window as any).google && (window as any).google.translate) {
                console.log('Google Translate loaded successfully');
                setIsLoaded(true);
                return;
            }
            setTimeout(checkLoaded, 100);
        };

        checkLoaded();

        // Check for the Google Translate element and handle URL parameters
        const checkElement = () => {
            const element = document.querySelector('#google_translate_element');
            if (element && element.children.length > 0) {
                console.log('Google Translate element rendered');
                setIsLoaded(true);

                // Wait for the select element to be available
                const waitForSelectElement = () => {
                    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                    if (selectElement) {
                        console.log('Google Translate select element found and ready');

                        // Handle URL parameters for translation
                        const urlParams = new URLSearchParams(window.location.search);
                        const googtrans = urlParams.get('googtrans');

                        if (googtrans) {
                            console.log('URL parameter detected for translation:', googtrans);
                            console.log('Setting language from URL parameter:', googtrans);
                            selectElement.value = googtrans;
                            selectElement.dispatchEvent(new Event('change'));
                        }

                        // Hide the Google Translate element after it's initialized
                        setTimeout(() => {
                            const googleTranslateElement = document.querySelector('#google_translate_element') as HTMLElement;
                            if (googleTranslateElement) {
                                console.log('Hiding Google Translate element after initialization');
                                googleTranslateElement.style.position = 'absolute';
                                googleTranslateElement.style.top = '-9999px';
                                googleTranslateElement.style.left = '-9999px';
                                googleTranslateElement.style.visibility = 'hidden';
                                googleTranslateElement.style.opacity = '0';
                                googleTranslateElement.style.height = '0';
                                googleTranslateElement.style.width = '0';
                                googleTranslateElement.style.overflow = 'hidden';
                                googleTranslateElement.style.zIndex = '-1';
                            }
                        }, 2000);
                    } else {
                        console.log('Select element not found yet, retrying...');
                        setTimeout(waitForSelectElement, 500);
                    }
                };

                // Start waiting for the select element
                setTimeout(waitForSelectElement, 500);
            } else {
                setTimeout(checkElement, 500);
            }
        };

        setTimeout(checkElement, 1000);

        // Hide Google Translate banner when it appears
        const hideGoogleTranslateBanner = () => {
            const banner = document.querySelector('.goog-te-banner-frame') as HTMLElement;
            if (banner) {
                banner.style.display = 'none';
                banner.style.visibility = 'hidden';
                banner.style.opacity = '0';
                banner.style.height = '0';
                banner.style.overflow = 'hidden';
                banner.style.position = 'absolute';
                banner.style.top = '-9999px';
                banner.style.left = '-9999px';
            }

            // Also remove any margin-top that Google Translate adds to body
            document.body.style.marginTop = '0';
            document.body.style.paddingTop = '0';
        };

        // Check for banner periodically
        const bannerInterval = setInterval(hideGoogleTranslateBanner, 100);

        // Clean up interval
        return () => {
            clearInterval(bannerInterval);
        };
    }, []);

    return (
        <div className="relative">
            {/* Google Translate Element - Always visible for proper initialization */}
            <div
                id="google_translate_element"
                className="google-translate-widget"
                style={{
                    position: 'relative',
                    top: '0',
                    left: '0',
                    visibility: 'visible',
                    opacity: 1,
                    height: 'auto',
                    width: 'auto',
                    overflow: 'visible',
                    zIndex: 1000,
                    display: 'block'
                }}
            ></div>

            {/* Loading indicator */}
            {!isLoaded && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-background/50 border border-border/50 rounded-md">
                    <Languages className="w-4 h-4 animate-pulse" />
                    <span className="text-sm text-muted-foreground">Loading Translate...</span>
                </div>
            )}
        </div>
    );
};

export default GoogleTranslate;
