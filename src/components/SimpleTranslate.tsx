import { useState, useEffect, useRef } from "react";
import { Languages, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { triggerGoogleTranslate, checkGoogleTranslateStatus, initializeGoogleTranslate } from "@/utils/translateHelper";
import { useDropdownPreventShake } from "@/hooks/use-dropdown-prevent-shake";

interface Language {
    code: string;
    name: string;
    nativeName: string;
}

const languages: Language[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
    { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
    { code: "bho", name: "Bhojpuri", nativeName: "भोजपुरी" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
];

const SimpleTranslate = () => {
    const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Prevent page shaking when dropdown is open
    useDropdownPreventShake(isDropdownOpen);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                // Add a longer delay to allow for hover interactions
                setTimeout(() => {
                    setIsDropdownOpen(false);
                }, 300);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Initialize Google Translate and check for stored language
    useEffect(() => {
        // Initialize Google Translate on every page
        console.log('SimpleTranslate: Initializing Google Translate on page:', window.location.pathname);
        console.log('SimpleTranslate: Current URL:', window.location.href);
        
        // Force re-initialization by clearing any existing elements
        const existingElement = document.getElementById('google_translate_element');
        if (existingElement) {
            console.log('SimpleTranslate: Clearing existing translate element');
            existingElement.innerHTML = '';
        } else {
            console.log('SimpleTranslate: No existing translate element found');
        }
        
        console.log('SimpleTranslate: Calling initializeGoogleTranslate()');
        initializeGoogleTranslate();

        // Wait for initialization and then check for stored language
        setTimeout(() => {
            setIsInitialized(true);

            // Priority 1: Check URL parameters (highest priority)
            const urlParams = new URLSearchParams(window.location.search);
            const googtrans = urlParams.get('googtrans');

            if (googtrans) {
                const language = languages.find(lang => lang.code === googtrans);
                if (language) {
                    setCurrentLanguage(language);
                    localStorage.setItem('selectedLanguage', googtrans);
                    console.log('Set current language from URL parameter and auto-translating:', language);
                    
                    // Auto-translate the page
                    setTimeout(() => {
                        triggerGoogleTranslate(googtrans);
                    }, 1000);
                }
            } else {
                // Priority 2: Check localStorage
                const savedLanguage = localStorage.getItem('selectedLanguage');
                if (savedLanguage) {
                    const language = languages.find(lang => lang.code === savedLanguage);
                    if (language) {
                        setCurrentLanguage(language);
                        console.log('Set current language from localStorage:', language);

                        // Apply the saved language to Google Translate and auto-translate
                        setTimeout(() => {
                            const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                            if (selectElement && selectElement.value !== savedLanguage) {
                                console.log('Applying saved language from localStorage and auto-translating:', savedLanguage);
                                selectElement.value = savedLanguage;
                                selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                                
                                // Auto-translate the page
                                setTimeout(() => {
                                    triggerGoogleTranslate(savedLanguage);
                                }, 1000);
                            }
                        }, 500);
                    }
                } else {
                    // Priority 3: Check cookies
                    const cookieLanguage = getCurrentLanguageFromCookie();
                    if (cookieLanguage && cookieLanguage !== 'en') {
                        const language = languages.find(lang => lang.code === cookieLanguage);
                        if (language) {
                            setCurrentLanguage(language);
                            localStorage.setItem('selectedLanguage', cookieLanguage);
                            console.log('Set current language from cookie and auto-translating:', language);
                            
                            // Auto-translate the page
                            setTimeout(() => {
                                triggerGoogleTranslate(cookieLanguage);
                            }, 1000);
                        }
                    }
                }
            }
        }, 2000);
    }, []);

    // Re-initialize translator when page changes (for SPA navigation)
    useEffect(() => {
        const handlePageChange = () => {
            console.log('Page changed, re-initializing translator');
            setTimeout(() => {
                // Clear existing element and re-initialize
                const existingElement = document.getElementById('google_translate_element');
                if (existingElement) {
                    existingElement.innerHTML = '';
                }
                initializeGoogleTranslate();
            }, 100);
        };

        // Listen for popstate events (back/forward navigation)
        window.addEventListener('popstate', handlePageChange);
        
        // Also check periodically if translator is still working
        const checkInterval = setInterval(() => {
            const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            console.log('SimpleTranslate: Periodic check - select element found:', !!selectElement, 'on page:', window.location.pathname);
            
            // Special handling for problematic pages
            const problematicPages = ['/prelaunch-offers', '/contact'];
            const isProblematicPage = problematicPages.includes(window.location.pathname);
            
            if (!selectElement && isInitialized) {
                console.log('Translator select element missing, re-initializing on page:', window.location.pathname);
                // Clear existing element and re-initialize
                const existingElement = document.getElementById('google_translate_element');
                if (existingElement) {
                    existingElement.innerHTML = '';
                }
                
                // For problematic pages, be more aggressive
                if (isProblematicPage) {
                    console.log('Problematic page detected, using aggressive re-initialization');
                    // Force reload the script if needed
                    if (!(window as any).google || !(window as any).google.translate) {
                        const script = document.createElement('script');
                        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
                        script.async = true;
                        document.head.appendChild(script);
                    }
                }
                
                initializeGoogleTranslate();
            }
        }, 2000); // Check more frequently for problematic pages

        return () => {
            window.removeEventListener('popstate', handlePageChange);
            clearInterval(checkInterval);
        };
    }, [isInitialized]);

    // Monitor Google Translate status
    useEffect(() => {
        if (!isInitialized) return;

        const checkInterval = setInterval(() => {
            const status = checkGoogleTranslateStatus();

            // If we have a select element, monitor its value
            if (status.selectElement && status.currentValue) {
                const language = languages.find(lang => lang.code === status.currentValue);
                if (language && language.code !== currentLanguage.code) {
                    setCurrentLanguage(language);
                    console.log('Updated current language from select element and auto-translating:', language);
                    
                    // Auto-translate when language is detected from select element
                    if (language.code !== 'en') {
                        setTimeout(() => {
                            triggerGoogleTranslate(language.code);
                        }, 500);
                    }
                }
            }
        }, 1000);

        return () => clearInterval(checkInterval);
    }, [isInitialized, currentLanguage.code]);

    // Helper function to get current language from cookie
    const getCurrentLanguageFromCookie = (): string | null => {
        const urlParams = new URLSearchParams(window.location.search);
        const googtrans = urlParams.get('googtrans');
        if (googtrans) return googtrans;

        // Check cookies
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('googtrans='));

        if (cookie) {
            const parts = cookie.split('/');
            if (parts.length >= 3) {
                return parts[2];
            }
        }

        return null;
    };

    const handleLanguageChange = (language: Language) => {
        console.log('Language change requested:', language);
        setCurrentLanguage(language);
        setIsTranslating(true); // Start loading state

        // Save to localStorage immediately
        localStorage.setItem('selectedLanguage', language.code);
        console.log('Saved language to localStorage:', language.code);
        
        // Immediately trigger auto-translation
        console.log('Auto-translating page to:', language.code);
        triggerGoogleTranslate(language.code);

        // SPECIAL HANDLING FOR ENGLISH - Force page reload immediately
        if (language.code === 'en') {
            console.log('English selected - forcing immediate page reload for reliable reset');

            // AGGRESSIVE CLEARING before reload
            document.body.classList.remove('translated-ltr', 'translated-rtl');

            // Clear all Google Translate related data
            localStorage.removeItem('googtrans');
            localStorage.removeItem('selectedLanguage');
            sessionStorage.removeItem('googtrans');
            sessionStorage.clear();

            // Clear all cookies aggressively
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

            // Force reload with cache busting
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.delete('googtrans');
            currentUrl.searchParams.delete('_ts');
            currentUrl.searchParams.delete('_gtl');
            currentUrl.searchParams.delete('_cb');
            currentUrl.searchParams.set('_cb', Date.now().toString());
            currentUrl.searchParams.set('_reset', 'true');

            // Use replace instead of href to avoid back button issues
            window.location.replace(currentUrl.toString());
            return; // Exit early for English
        }

        // FORCE IMMEDIATE TRANSLATION: Use multiple aggressive methods
        console.log('Forcing immediate translation with aggressive methods');

        // Method 1: Direct Google Translate API call
        if ((window as any).google && (window as any).google.translate) {
            try {
                const translateElement = (window as any).google.translate.TranslateElement.getInstance();
                if (translateElement && typeof translateElement.selectLanguage === 'function') {
                    console.log('Using Google Translate API selectLanguage method');
                    if (language.code === 'en') {
                        // For English, try to reset to original language
                        translateElement.selectLanguage('en');
                    } else {
                        translateElement.selectLanguage(language.code);
                    }
                }
            } catch (e) {
                console.log('Google Translate API method failed:', e);
            }
        }

        // Method 2: Aggressive select element manipulation
        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectElement) {
            console.log('Using aggressive select element manipulation');

            // Clear any existing state first
            document.body.classList.remove('translated-ltr', 'translated-rtl');

            // Set the value - special handling for English
            if (language.code === 'en') {
                // For English, try different values that might work
                const englishValues = ['en', 'auto', ''];
                for (const value of englishValues) {
                    selectElement.value = value;
                    if (selectElement.value === value) break;
                }
            } else {
                selectElement.value = language.code;
            }

            // Trigger multiple events with different approaches
            const events = ['change', 'input', 'click', 'blur', 'focus', 'mousedown', 'mouseup'];
            events.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true, cancelable: true });
                selectElement.dispatchEvent(event);
            });

            // Also try MouseEvent for click
            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
            selectElement.dispatchEvent(clickEvent);

            // Force focus and blur
            selectElement.focus();
            selectElement.blur();

            // Try to trigger change event multiple times
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                }, i * 100);
            }
        }

        // Method 3: Try to find and click language links (newer Google Translate interface)
        const translateLink = document.querySelector('.goog-te-gadget a[aria-haspopup="true"]') as HTMLElement;
        if (translateLink) {
            console.log('Found Google Translate link interface, attempting to use it');
            translateLink.click();

            setTimeout(() => {
                // Try to find the language option and click it
                const languageOption = document.querySelector(`[data-value="${language.code}"], [value="${language.code}"], a[href*="${language.code}"]`) as HTMLElement;
                if (languageOption) {
                    languageOption.click();
                    console.log('Clicked language option via link interface');
                }
            }, 500);
        }

        // Method 4: Force translation via iframe manipulation
        setTimeout(() => {
            const iframe = document.querySelector('iframe[src*="translate.google.com"]') as HTMLIFrameElement;
            if (iframe) {
                console.log('Found Google Translate iframe, attempting iframe manipulation');
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) {
                        const iframeSelect = iframeDoc.querySelector('select') as HTMLSelectElement;
                        if (iframeSelect) {
                            if (language.code === 'en') {
                                // For English, try different values that might work
                                const englishValues = ['en', 'auto', ''];
                                for (const value of englishValues) {
                                    iframeSelect.value = value;
                                    if (iframeSelect.value === value) break;
                                }
                            } else {
                                iframeSelect.value = language.code;
                            }
                            iframeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                            console.log('Applied translation via iframe');
                        }
                    }
                } catch (e) {
                    console.log('Cannot access iframe content (CORS)');
                }
            }
        }, 1000);

        // Method 5: Additional aggressive methods for English
        if (language.code === 'en') {
            setTimeout(() => {
                console.log('Applying additional English reset methods');

                // Clear all translation classes more aggressively
                document.body.classList.remove('translated-ltr', 'translated-rtl');

                // Try to find all Google Translate elements and reset them
                const allSelects = document.querySelectorAll('select');
                allSelects.forEach(select => {
                    const selectElement = select as HTMLSelectElement;
                    if (selectElement && (selectElement.className.includes('goog-te') || selectElement.id.includes('google_translate'))) {
                        const englishValues = ['en', 'auto', ''];
                        for (const value of englishValues) {
                            selectElement.value = value;
                            if (selectElement.value === value) break;
                        }
                        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });

                // Force a page refresh if still translated
                setTimeout(() => {
                    const isStillTranslated = document.body.classList.contains('translated-ltr') ||
                        document.body.classList.contains('translated-rtl');
                    if (isStillTranslated) {
                        console.log('Still translated after reset, forcing page reload');
                        window.location.reload();
                    }
                }, 1000);
            }, 500);
        }

        // Method 6: Update URL and cookies
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete('googtrans');
        currentUrl.searchParams.delete('_ts');
        currentUrl.searchParams.delete('_gtl');
        currentUrl.searchParams.delete('_cb');

        if (language.code !== 'en') {
            currentUrl.searchParams.set('googtrans', language.code);
        }

        window.history.replaceState({}, '', currentUrl.toString());

        // Set cookies manually - special handling for English
        const domain = window.location.hostname;
        if (language.code !== 'en') {
            document.cookie = `googtrans=/en/${language.code}; path=/; domain=${domain}`;
            document.cookie = `googtrans=/en/${language.code}; path=/; domain=.${domain}`;
        } else {
            // Clear cookies for English - more aggressive clearing
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
        }

        // Method 7: Check if translation worked and force reload if needed
        setTimeout(() => {
            const isTranslated = document.body.classList.contains('translated-ltr') ||
                document.body.classList.contains('translated-rtl');

            if (language.code === 'en') {
                // For English, check if translation classes are removed (meaning we're back to English)
                if (!isTranslated) {
                    console.log('English translation applied successfully - back to original language');
                    setIsTranslating(false); // Stop loading state
                } else {
                    console.log('English translation did not work, forcing page reload');
                    // Force page reload for English
                    const currentUrl = new URL(window.location.href);
                    currentUrl.searchParams.delete('googtrans');
                    currentUrl.searchParams.delete('_ts');
                    currentUrl.searchParams.delete('_gtl');
                    currentUrl.searchParams.delete('_cb');
                    currentUrl.searchParams.set('_cb', Date.now().toString());
                    window.location.href = currentUrl.toString();
                }
            } else {
                // For other languages, check if translation classes are present
                if (isTranslated) {
                    console.log('Translation applied successfully without page reload');
                    setIsTranslating(false); // Stop loading state
                } else {
                    console.log('Translation did not work with any method, forcing page reload');
                    // Force page reload as last resort
                    const currentUrl = new URL(window.location.href);
                    currentUrl.searchParams.delete('googtrans');
                    currentUrl.searchParams.delete('_ts');
                    currentUrl.searchParams.delete('_gtl');
                    currentUrl.searchParams.delete('_cb');
                    currentUrl.searchParams.set('googtrans', language.code);
                    currentUrl.searchParams.set('_cb', Date.now().toString());
                    window.location.href = currentUrl.toString();
                }
            }
        }, 3000); // Wait 3 seconds to see if translation worked
    };

    const handleReinitialize = () => {
        console.log('Manually re-initializing translator on page:', window.location.pathname);
        const existingElement = document.getElementById('google_translate_element');
        if (existingElement) {
            existingElement.innerHTML = '';
        }
        
        // Force reload the Google Translate script if it's not working
        if (!(window as any).google || !(window as any).google.translate) {
            console.log('Google Translate script not loaded, reloading...');
            const script = document.createElement('script');
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.head.appendChild(script);
        }
        
        initializeGoogleTranslate();
    };

    return (
        <div className="relative translator-container" ref={dropdownRef}
             onMouseEnter={() => {
                 console.log('Mouse entered translator area');
                 setIsDropdownOpen(true);
             }}
             onMouseLeave={(e) => {
                 // Only close if mouse is leaving the entire translator area
                 const relatedTarget = e.relatedTarget as HTMLElement;
                 if (!dropdownRef.current?.contains(relatedTarget)) {
                     console.log('Mouse left translator area completely');
                     setTimeout(() => {
                         setIsDropdownOpen(false);
                     }, 200);
                 }
             }}>
            <Button
                variant="outline"
                size="sm"
                className={`translator-button flex items-center space-x-2 bg-background/50 border-border/50 hover:bg-background/80 transition-all duration-200 ${!isInitialized || isTranslating ? 'opacity-50' : ''} ${isDropdownOpen ? 'bg-background/80' : ''}`}
                disabled={!isInitialized || isTranslating}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                    position: 'relative',
                    zIndex: 10001,
                    opacity: 1,
                    visibility: 'visible'
                }}
            >
                {isTranslating ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Languages className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                    {isTranslating ? 'Translating...' : currentLanguage.nativeName}
                </span>
                <span className="sm:hidden">
                    {isTranslating ? '...' : currentLanguage.code.toUpperCase()}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isTranslating ? 'opacity-50' : ''}`} />
            </Button>
            
            {isDropdownOpen && (
                <div className="translator-dropdown w-56 max-h-80 overflow-y-auto"
                     style={{
                         position: 'absolute',
                         zIndex: 9999,
                         top: '100%',
                         left: 0,
                         marginTop: '4px'
                     }}>
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            className={`w-full px-3 py-2 text-left hover:bg-accent/50 flex items-center justify-between ${currentLanguage.code === language.code ? "bg-primary/10 text-primary" : ""}`}
                            onClick={() => {
                                handleLanguageChange(language);
                                setIsDropdownOpen(false);
                            }}
                            disabled={!isInitialized || isTranslating}
                        >
                            <div className="flex flex-col">
                                <span className="font-medium">{language.nativeName}</span>
                                <span className="text-xs text-muted-foreground">{language.name}</span>
                            </div>
                            {currentLanguage.code === language.code && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SimpleTranslate;
