import { useEffect, useState, useRef } from "react";
import { Languages } from "lucide-react";

const GoogleTranslate = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const initAttemptsRef = useRef(0);
    const maxInitAttempts = 3;

    useEffect(() => {
        console.log('GoogleTranslate component mounted');

        // AGGRESSIVE RESET: Clear all Google Translate state before initialization
        console.log('Performing aggressive reset before initialization');

        // Clear all translation classes
        document.body.classList.remove('translated-ltr', 'translated-rtl');

        // Clear all Google Translate cookies
        const domain = window.location.hostname;
        const cookiesToClear = [
            `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`,
            `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`,
            `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`,
            `googto=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`,
            `googto=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`,
            `googto=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`,
            `_gtl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`,
            `_gtl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`,
            `_gtl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`
        ];

        cookiesToClear.forEach(cookie => {
            document.cookie = cookie;
        });

        // Simple initialization without state dependency
        const initializeGoogleTranslate = () => {
            if (initAttemptsRef.current >= maxInitAttempts) {
                console.log('Max initialization attempts reached');
                return;
            }

            initAttemptsRef.current += 1;

            if ((window as any).google && (window as any).google.translate) {
                console.log('Google Translate API available, initializing...');

                try {
                    // Create the Google Translate element
                    const element = document.getElementById('google_translate_element');
                    if (element) {
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

                        // Wait for initialization to complete
                        setTimeout(() => {
                            const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                            if (selectElement) {
                                setIsLoaded(true);
                                console.log('Google Translate successfully initialized');

                                // Handle URL parameters
                                const urlParams = new URLSearchParams(window.location.search);
                                const googtrans = urlParams.get('googtrans');
                                const reset = urlParams.get('_reset');

                                if (googtrans && googtrans !== 'en') {
                                    console.log('Applying translation from URL parameter:', googtrans);

                                    // AGGRESSIVE RESET before applying new language
                                    document.body.classList.remove('translated-ltr', 'translated-rtl');

                                    // Clear any existing translation state
                                    const domain = window.location.hostname;
                                    const cookiesToClear = [
                                        `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`,
                                        `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`,
                                        `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
                                    ];

                                    cookiesToClear.forEach(cookie => {
                                        document.cookie = cookie;
                                    });

                                    // AGGRESSIVE TRANSLATION: Try multiple methods
                                    const applyTranslation = () => {
                                        // Method 1: Set select element value
                                        selectElement.value = googtrans;

                                        // Method 2: Trigger multiple events with different approaches
                                        const events = ['change', 'input', 'click', 'blur', 'focus', 'mousedown', 'mouseup'];
                                        events.forEach(eventType => {
                                            const event = new Event(eventType, { bubbles: true, cancelable: true });
                                            selectElement.dispatchEvent(event);
                                        });

                                        // Method 3: Try MouseEvent for click
                                        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
                                        selectElement.dispatchEvent(clickEvent);

                                        // Method 4: Try Google Translate API
                                        if ((window as any).google && (window as any).google.translate) {
                                            try {
                                                const translateElement = (window as any).google.translate.TranslateElement.getInstance();
                                                if (translateElement && typeof translateElement.selectLanguage === 'function') {
                                                    console.log('Using API selectLanguage for URL parameter');
                                                    translateElement.selectLanguage(googtrans);
                                                }
                                            } catch (e) {
                                                console.log('API method failed for URL parameter');
                                            }
                                        }

                                        // Method 5: Force interaction with select element
                                        selectElement.click();
                                        selectElement.focus();
                                        selectElement.blur();

                                        // Method 6: Try to trigger change event multiple times
                                        for (let i = 0; i < 3; i++) {
                                            setTimeout(() => {
                                                selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                                            }, i * 100);
                                        }

                                        console.log('Translation applied from URL parameter');
                                    };

                                    // Apply immediately
                                    applyTranslation();

                                    // Apply again after short delay
                                    setTimeout(applyTranslation, 500);

                                    // Apply one more time after longer delay
                                    setTimeout(applyTranslation, 1000);

                                    // Apply one final time after even longer delay
                                    setTimeout(applyTranslation, 2000);

                                } else if (reset === 'true') {
                                    // Special handling for English reset
                                    console.log('English reset detected - ensuring clean English state');

                                    // AGGRESSIVE ENGLISH RESET
                                    document.body.classList.remove('translated-ltr', 'translated-rtl');

                                    // Clear all Google Translate related data
                                    localStorage.removeItem('googtrans');
                                    sessionStorage.removeItem('googtrans');

                                    // Clear any translation cookies - more aggressive for English
                                    const domain = window.location.hostname;
                                    const cookiesToClear = [
                                        `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`,
                                        `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`,
                                        `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`,
                                        `googto=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`,
                                        `googto=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`,
                                        `googto=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`,
                                        `_gtl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`,
                                        `_gtl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`,
                                        `_gtl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`,
                                        `_ts=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`,
                                        `_cb=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
                                    ];

                                    cookiesToClear.forEach(cookie => {
                                        document.cookie = cookie;
                                    });

                                    // Also try to set select element to English if available
                                    if (selectElement) {
                                        const englishValues = ['en', 'auto', ''];
                                        for (const value of englishValues) {
                                            selectElement.value = value;
                                            if (selectElement.value === value) break;
                                        }
                                        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                                    }

                                    // Force a small delay to ensure reset is complete
                                    setTimeout(() => {
                                        document.body.classList.remove('translated-ltr', 'translated-rtl');
                                    }, 100);

                                    // Clean up URL by removing reset parameter
                                    const cleanUrl = new URL(window.location.href);
                                    cleanUrl.searchParams.delete('_reset');
                                    cleanUrl.searchParams.delete('_cb');
                                    window.history.replaceState({}, '', cleanUrl.toString());

                                } else {
                                    // For English or no parameter, ensure we're in English state
                                    console.log('Ensuring English state (no translation)');

                                    // AGGRESSIVE ENGLISH RESET
                                    document.body.classList.remove('translated-ltr', 'translated-rtl');

                                    // Clear all Google Translate related data
                                    localStorage.removeItem('googtrans');
                                    sessionStorage.removeItem('googtrans');

                                    // Clear any translation cookies - more aggressive for English
                                    const domain = window.location.hostname;
                                    const cookiesToClear = [
                                        `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`,
                                        `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`,
                                        `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`,
                                        `googto=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`,
                                        `googto=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`,
                                        `googto=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`,
                                        `_gtl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`,
                                        `_gtl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`,
                                        `_gtl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`,
                                        `_ts=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`,
                                        `_cb=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
                                    ];

                                    cookiesToClear.forEach(cookie => {
                                        document.cookie = cookie;
                                    });

                                    // Also try to set select element to English if available
                                    if (selectElement) {
                                        const englishValues = ['en', 'auto', ''];
                                        for (const value of englishValues) {
                                            selectElement.value = value;
                                            if (selectElement.value === value) break;
                                        }
                                        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                                    }

                                    // Force a small delay to ensure reset is complete
                                    setTimeout(() => {
                                        document.body.classList.remove('translated-ltr', 'translated-rtl');
                                    }, 100);
                                }
                            } else {
                                console.log('Select element not found after initialization, retrying...');
                                setTimeout(initializeGoogleTranslate, 1000);
                            }
                        }, 2000);
                    }

                } catch (error) {
                    console.error('Error in Google Translate initialization:', error);
                    setTimeout(initializeGoogleTranslate, 1000);
                }
            } else {
                console.log('Google Translate API not ready yet, retrying...');
                setTimeout(initializeGoogleTranslate, 200);
            }
        };

        // Start initialization
        initializeGoogleTranslate();

        // Comprehensive banner hiding
        const hideBanner = () => {
            // Hide all possible Google Translate banner elements
            const bannerSelectors = [
                '.goog-te-banner-frame',
                '.VIpgJd-yAWNEb-L7lbkb',
                '.goog-te-banner-frame.skiptranslate',
                'iframe[src*="translate.google.com"]',
                '.goog-te-banner-frame iframe',
                '.VIpgJd-yAWNEb-L7lbkb iframe',
                '.goog-te-banner-frame.skiptranslate iframe'
            ];

            bannerSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    const htmlElement = element as HTMLElement;
                    htmlElement.style.display = 'none !important';
                    htmlElement.style.visibility = 'hidden !important';
                    htmlElement.style.opacity = '0 !important';
                    htmlElement.style.height = '0 !important';
                    htmlElement.style.overflow = 'hidden !important';
                    htmlElement.style.position = 'absolute !important';
                    htmlElement.style.top = '-9999px !important';
                    htmlElement.style.left = '-9999px !important';
                    htmlElement.style.zIndex = '-9999 !important';
                });
            });

            // Reset body margin and padding that Google Translate might add
            document.body.style.marginTop = '0 !important';
            document.body.style.paddingTop = '0 !important';

            // Hide any Google Translate top bar
            const topBar = document.querySelector('.goog-te-banner-frame.skiptranslate');
            if (topBar) {
                (topBar as HTMLElement).style.display = 'none !important';
            }
        };

        // Run immediately and then continuously
        hideBanner();
        const bannerInterval = setInterval(hideBanner, 50);

        // Also hide on DOM mutations
        const observer = new MutationObserver(() => {
            hideBanner();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        // Clear interval after 30 seconds but keep observer
        setTimeout(() => {
            clearInterval(bannerInterval);
        }, 30000);

        return () => {
            clearInterval(bannerInterval);
            observer.disconnect();
        };
    }, []); // Empty dependency array to prevent infinite loops

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
                        Loading Translate... {initAttemptsRef.current > 1 && `(${initAttemptsRef.current}/${maxInitAttempts})`}
                    </span>
                </div>
            )}
        </div>
    );
};

export default GoogleTranslate;
