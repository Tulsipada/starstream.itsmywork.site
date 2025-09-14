// Helper functions for Google Translate integration

export const triggerGoogleTranslate = (languageCode: string) => {
    console.log('Triggering Google Translate for language:', languageCode);

    // Method 1: Try to find and use the Google Translate select element
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
        console.log('Found Google Translate select element');
        selectElement.value = languageCode;
        selectElement.dispatchEvent(new Event('change'));

        // Also update URL parameter
        const url = new URL(window.location.href);
        url.searchParams.set('googtrans', languageCode);
        window.history.replaceState({}, '', url.toString());

        return true;
    }

    // Method 2: Use page reload as fallback
    console.log('Select element not found, using page reload method');
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('googtrans', languageCode);
    window.location.href = currentUrl.toString();
    return true;
};

export const checkGoogleTranslateStatus = () => {
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    const iframe = document.querySelector('iframe.goog-te-menu-frame') as HTMLIFrameElement;
    const googleTranslateElement = document.querySelector('#google_translate_element');

    console.log('Google Translate Status Check:');
    console.log('- Select element found:', !!selectElement);
    console.log('- Iframe found:', !!iframe);
    console.log('- Google Translate element found:', !!googleTranslateElement);
    console.log('- Google Translate API available:', !!(window as any).google && !!(window as any).google.translate);

    if (selectElement) {
        console.log('- Current select value:', selectElement.value);
        console.log('- Available options:', Array.from(selectElement.options).map(opt => ({ value: opt.value, text: opt.text })));
    }

    return {
        selectElement: !!selectElement,
        iframe: !!iframe,
        googleTranslateElement: !!googleTranslateElement,
        apiAvailable: !!(window as any).google && !!(window as any).google.translate
    };
};

