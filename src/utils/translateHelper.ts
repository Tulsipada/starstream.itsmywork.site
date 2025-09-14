// Enhanced Google Translate helper functions

export const triggerGoogleTranslate = (languageCode: string): boolean => {
    console.log('Triggering Google Translate for language:', languageCode);

    // Special handling for English (reset translation)
    if (languageCode === 'en') {
        console.log('Resetting to English - clearing all translations');

        // Clear all translation cookies
        const domain = window.location.hostname;
        const cookiesToClear = [
            `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`,
            `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`,
            `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`,
            `googto=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`,
            `googto=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`,
            `googto=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
        ];

        cookiesToClear.forEach(cookie => {
            document.cookie = cookie;
        });

        // Remove translation classes
        document.body.classList.remove('translated-ltr', 'translated-rtl');

        // Update URL to remove googtrans parameter
        const url = new URL(window.location.href);
        url.searchParams.delete('googtrans');
        url.searchParams.delete('_ts');
        url.searchParams.delete('_gtl');
        window.history.replaceState({}, '', url.toString());

        console.log('English reset completed without page reload');
        return true;
    }

    // Method 1: Try the select dropdown (most reliable)
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
        console.log('Found Google Translate select element, setting language to:', languageCode);

        // Set the value
        selectElement.value = languageCode;

        // Trigger multiple events to ensure it works
        const events = ['change', 'input', 'click', 'blur'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true });
            selectElement.dispatchEvent(event);
        });

        // Also try triggering with MouseEvent for click
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        selectElement.dispatchEvent(clickEvent);

        // Try to trigger the Google Translate API directly
        setTimeout(() => {
            if ((window as any).google && (window as any).google.translate) {
                try {
                    // Try to get the TranslateElement instance
                    const translateElement = (window as any).google.translate.TranslateElement.getInstance();
                    if (translateElement && typeof translateElement.selectLanguage === 'function') {
                        console.log('Using Google Translate API selectLanguage method');
                        translateElement.selectLanguage(languageCode);
                    }
                } catch (e) {
                    console.log('Google Translate API method failed, using fallback');
                }
            }
        }, 100);

        // Set cookies manually as backup
        setLanguageCookies(languageCode);

        // Update URL immediately
        updateLanguageURL(languageCode);

        // Wait a bit and check if translation started
        setTimeout(() => {
            const isTranslated = document.body.classList.contains('translated-ltr') ||
                document.body.classList.contains('translated-rtl');

            if (!isTranslated) {
                console.log('Translation did not start automatically, trying alternative method');

                // Try multiple approaches to trigger translation
                const triggerTranslation = () => {
                    // Method 1: Click and focus the select element
                    selectElement.click();
                    selectElement.focus();
                    selectElement.blur();

                    // Method 2: Try to trigger via Google Translate API
                    if ((window as any).google && (window as any).google.translate) {
                        try {
                            const translateElement = (window as any).google.translate.TranslateElement.getInstance();
                            if (translateElement && typeof translateElement.selectLanguage === 'function') {
                                console.log('Using Google Translate API selectLanguage method as fallback');
                                translateElement.selectLanguage(languageCode);
                            }
                        } catch (e) {
                            console.log('Google Translate API method failed in fallback');
                        }
                    }

                    // Method 3: Try to force translation by manipulating the iframe
                    const iframe = document.querySelector('iframe[src*="translate.google.com"]') as HTMLIFrameElement;
                    if (iframe) {
                        console.log('Found Google Translate iframe, trying to trigger translation');
                        try {
                            // Try to access the iframe content and trigger translation
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                            if (iframeDoc) {
                                const iframeSelect = iframeDoc.querySelector('select') as HTMLSelectElement;
                                if (iframeSelect) {
                                    iframeSelect.value = languageCode;
                                    iframeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                            }
                        } catch (e) {
                            console.log('Cannot access iframe content (CORS)');
                        }
                    }
                };

                // Try immediately
                triggerTranslation();

                // Try again after a short delay
                setTimeout(triggerTranslation, 500);

                // Try one more time after another delay
                setTimeout(triggerTranslation, 1000);

                // Final check - if still not translated, log the issue but don't reload
                setTimeout(() => {
                    const stillNotTranslated = !document.body.classList.contains('translated-ltr') &&
                        !document.body.classList.contains('translated-rtl');

                    if (stillNotTranslated) {
                        console.log('Translation may not have started automatically, but URL has been updated');
                        console.log('User can manually refresh if needed, or try selecting the language again');
                    }
                }, 2000);
            }
        }, 1000); // Reduced from 1500ms to 1000ms for faster response

        return true;
    }

    // Method 2: Try finding translate links/buttons
    const translateButtons = document.querySelectorAll('.goog-te-gadget a, .VIpgJd-ZVi9od-xl07Ob-lTBxed');
    if (translateButtons.length > 0) {
        console.log('Found Google Translate button interface');

        // Click the main translate button to open menu
        (translateButtons[0] as HTMLElement).click();

        // Wait for menu and try to find language option
        setTimeout(() => {
            findAndClickLanguageOption(languageCode);
        }, 300);

        return true;
    }

    // Method 3: Direct cookie setting + reload
    console.log('No Google Translate interface found, using direct cookie + reload method');
    setLanguageCookies(languageCode);
    updateLanguageURL(languageCode);
    return true;
};

// Helper function to set language cookies properly
const setLanguageCookies = (languageCode: string): void => {
    const domain = window.location.hostname;
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    const cookieOptions = [
        `googtrans=/auto/${languageCode}; expires=${expires.toUTCString()}; path=/; domain=${domain}; SameSite=Lax`,
        `googtrans=/auto/${languageCode}; expires=${expires.toUTCString()}; path=/; domain=.${domain}; SameSite=Lax`,
        `googtrans=/auto/${languageCode}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`,
        `googto=${languageCode}; expires=${expires.toUTCString()}; path=/; domain=${domain}; SameSite=Lax`,
        `googto=${languageCode}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
    ];

    cookieOptions.forEach(cookie => {
        document.cookie = cookie;
    });

    // Also set in localStorage
    try {
        localStorage.setItem('googtrans', `/auto/${languageCode}`);
        localStorage.setItem('preferredLanguage', languageCode);
    } catch (e) {
        console.error('Error setting localStorage:', e);
    }

    console.log(`Set language cookies for: ${languageCode}`);
};

// Helper function to find and click language option in menu
const findAndClickLanguageOption = (languageCode: string): void => {
    const attempts = [100, 300, 600, 1000];

    attempts.forEach(delay => {
        setTimeout(() => {
            // Try different selectors for language options
            const selectors = [
                `[data-value="${languageCode}"]`,
                `[value="${languageCode}"]`,
                `.goog-te-menu2-item[data-value="${languageCode}"]`,
                `.goog-te-menu2-item:contains("${getLanguageName(languageCode)}")`,
                `option[value="${languageCode}"]`
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector) as HTMLElement;
                if (element) {
                    console.log(`Found language option with selector: ${selector}`);
                    element.click();
                    setLanguageCookies(languageCode);
                    return;
                }
            }

            // If still not found, try text-based search
            const menuItems = document.querySelectorAll('.goog-te-menu2-item, .VIpgJd-ZVi9od-vH1Gmf-ibnC6b');
            for (const item of menuItems) {
                const text = item.textContent?.toLowerCase() || '';
                const langName = getLanguageName(languageCode).toLowerCase();

                if (text.includes(langName) || text.includes(languageCode)) {
                    console.log(`Found language option by text: ${text}`);
                    (item as HTMLElement).click();
                    setLanguageCookies(languageCode);
                    return;
                }
            }
        }, delay);
    });
};

// Helper function to get language name
const getLanguageName = (code: string): string => {
    const languages: { [key: string]: string } = {
        'en': 'English',
        'hi': 'Hindi',
        'gu': 'Gujarati',
        'pa': 'Punjabi',
        'mr': 'Marathi',
        'bn': 'Bengali',
        'or': 'Odia',
        'as': 'Assamese',
        'bho': 'Bhojpuri',
        'ta': 'Tamil',
        'te': 'Telugu',
        'ml': 'Malayalam',
        'kn': 'Kannada'
    };

    return languages[code] || code;
};

// Helper function to update URL without reload
const updateLanguageURL = (languageCode: string): void => {
    const currentUrl = new URL(window.location.href);

    // Clear existing translation parameters
    currentUrl.searchParams.delete('googtrans');
    currentUrl.searchParams.delete('_gtl');
    currentUrl.searchParams.delete('_ts'); // Remove timestamp parameter

    // Add new language parameter (only if not English)
    if (languageCode !== 'en') {
        currentUrl.searchParams.set('googtrans', languageCode);
    }

    console.log(`Updating URL with language: ${languageCode}`);
    // Use replaceState to update URL without triggering page reload
    window.history.replaceState({}, '', currentUrl.toString());
};

// Enhanced status check
export const checkGoogleTranslateStatus = () => {
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    const googleTranslateElement = document.querySelector('#google_translate_element');
    const apiAvailable = !!(window as any).google && !!(window as any).google.translate;
    const hasTranslateLinks = document.querySelectorAll('.goog-te-gadget a').length > 0;
    const isPageTranslated = document.body.classList.contains('translated-ltr') ||
        document.body.classList.contains('translated-rtl');

    console.log('Google Translate Status:');
    console.log('- API available:', apiAvailable);
    console.log('- Select element found:', !!selectElement);
    console.log('- Google Translate element found:', !!googleTranslateElement);
    console.log('- Translate links found:', hasTranslateLinks);
    console.log('- Page currently translated:', isPageTranslated);

    if (selectElement) {
        console.log('- Current select value:', selectElement.value);
        console.log('- Select options count:', selectElement.options.length);
    }

    return {
        selectElement: !!selectElement,
        googleTranslateElement: !!googleTranslateElement,
        apiAvailable,
        hasTranslateLinks,
        isPageTranslated,
        currentValue: selectElement?.value || null
    };
};

// Initialize Google Translate with better error handling
export const initializeGoogleTranslate = (): void => {
    console.log('Initializing Google Translate on page:', window.location.pathname);

    // Ensure the container exists
    let container = document.getElementById('google_translate_element');
    if (!container) {
        console.log('Creating new google_translate_element container');
        container = document.createElement('div');
        container.id = 'google_translate_element';
        document.body.appendChild(container);
    } else {
        console.log('Using existing google_translate_element container');
    }

    // Wait for Google Translate API
    const waitForAPI = () => {
        console.log('Checking for Google Translate API on page:', window.location.pathname);
        console.log('Google object exists:', !!(window as any).google);
        console.log('Google translate exists:', !!(window as any).google?.translate);
        
        if ((window as any).google && (window as any).google.translate) {
            console.log('Google Translate API ready, creating element on page:', window.location.pathname);

            try {
                new (window as any).google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi,gu,pa,mr,bn,or,as,bho,ta,te,ml,kn',
                    layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                    multilanguagePage: true,
                    gaTrack: false,
                    gaId: null
                }, 'google_translate_element');

                console.log('Google Translate element created successfully');

                // Check for URL parameters and apply language
                setTimeout(() => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const googtrans = urlParams.get('googtrans');

                    if (googtrans && googtrans !== 'en') {
                        console.log('Applying language from URL parameter:', googtrans);
                        triggerGoogleTranslate(googtrans);
                    }
                }, 1000);

            } catch (error) {
                console.error('Error creating Google Translate element:', error);
            }
        } else {
            console.log('Google Translate API not ready on page:', window.location.pathname, 'retrying...');
            setTimeout(waitForAPI, 100);
        }
    };

    waitForAPI();
};