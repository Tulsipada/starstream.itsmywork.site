// Simple Google Translate helper functions

export const triggerGoogleTranslate = (languageCode: string): boolean => {
    console.log('Triggering Google Translate for language:', languageCode);

    // Method 1: Try to find and use the Google Translate select element
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
        console.log('Found Google Translate select element, setting language to:', languageCode);
        selectElement.value = languageCode;
        selectElement.dispatchEvent(new Event('change'));

        // Update URL parameter
        const url = new URL(window.location.href);
        url.searchParams.set('googtrans', languageCode);
        window.history.replaceState({}, '', url.toString());

        return true;
    }

    // Method 2: Try to find the newer link-based interface
    const translateLink = document.querySelector('.goog-te-gadget a[aria-haspopup="true"]') as HTMLElement;
    if (translateLink) {
        console.log('Found Google Translate link interface, clicking to open menu');
        translateLink.click();

        // Wait for menu to open and try to find the language option
        setTimeout(() => {
            const languageOption = document.querySelector(`[data-value="${languageCode}"], [value="${languageCode}"]`) as HTMLElement;
            if (languageOption) {
                console.log('Found language option, clicking it');
                languageOption.click();

                // Update URL parameter
                const url = new URL(window.location.href);
                url.searchParams.set('googtrans', languageCode);
                window.history.replaceState({}, '', url.toString());
            } else {
                console.log('Language option not found, falling back to page reload');
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.set('googtrans', languageCode);
                window.location.href = currentUrl.toString();
            }
        }, 500);

        return true;
    }

    // Method 3: Use page reload as fallback
    console.log('No Google Translate interface found, using page reload method');
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('googtrans', languageCode);
    window.location.href = currentUrl.toString();
    return true;
};

export const checkGoogleTranslateStatus = () => {
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    const googleTranslateElement = document.querySelector('#google_translate_element');
    const apiAvailable = !!(window as any).google && !!(window as any).google.translate;

    console.log('Google Translate Status:');
    console.log('- API available:', apiAvailable);
    console.log('- Select element found:', !!selectElement);
    console.log('- Google Translate element found:', !!googleTranslateElement);

    return {
        selectElement: !!selectElement,
        googleTranslateElement: !!googleTranslateElement,
        apiAvailable
    };
};
