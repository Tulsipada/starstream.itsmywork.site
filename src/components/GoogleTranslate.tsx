import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

const GoogleTranslate = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        console.log('GoogleTranslate component mounted');

        // Wait for Google Translate API to be available
        const waitForGoogleTranslate = () => {
            if ((window as any).google && (window as any).google.translate) {
                console.log('Google Translate API available, initializing...');

                // Create the Google Translate element
                const element = document.getElementById('google_translate_element');
                if (element) {
                    try {
                        new (window as any).google.translate.TranslateElement({
                            pageLanguage: 'en',
                            includedLanguages: 'en,hi,gu,pa,mr,bn,or,as,bho,ta,te,ml,kn',
                            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
                            autoDisplay: false,
                            multilanguagePage: true,
                            gaTrack: false,
                            gaId: null,
                        }, 'google_translate_element');

                        console.log('Google Translate element created successfully');

                        // Wait a bit for the element to fully initialize, then hide it
                        setTimeout(() => {
                            setIsLoaded(true);
                            console.log('Google Translate element hidden after initialization');
                        }, 2000);

                        // Handle URL parameters
                        const urlParams = new URLSearchParams(window.location.search);
                        const googtrans = urlParams.get('googtrans');

                        if (googtrans) {
                            console.log('Applying translation from URL parameter:', googtrans);
                            setTimeout(() => {
                                const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                                if (selectElement) {
                                    selectElement.value = googtrans;
                                    selectElement.dispatchEvent(new Event('change'));
                                    console.log('Translation applied from URL parameter');
                                }
                            }, 1000);
                        }

                    } catch (error) {
                        console.error('Error creating Google Translate element:', error);
                    }
                }
            } else {
                console.log('Google Translate API not ready yet, retrying...');
                setTimeout(waitForGoogleTranslate, 100);
            }
        };

        waitForGoogleTranslate();

        // Hide Google Translate banner
        const hideBanner = () => {
            const banner = document.querySelector('.goog-te-banner-frame');
            if (banner) {
                (banner as HTMLElement).style.display = 'none';
            }
            document.body.style.marginTop = '0';
        };

        const bannerInterval = setInterval(hideBanner, 100);

        return () => clearInterval(bannerInterval);
    }, []);

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
                <div className="flex items-center space-x-2 px-3 py-2 bg-background/50 border border-border/50 rounded-md">
                    <Languages className="w-4 h-4 animate-pulse" />
                    <span className="text-sm text-muted-foreground">Loading Translate...</span>
                </div>
            )}
        </div>
    );
};

export default GoogleTranslate;
