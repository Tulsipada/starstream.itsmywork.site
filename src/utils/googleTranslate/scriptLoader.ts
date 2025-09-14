
// Script loading utilities for Google Translate

import { MAX_SCRIPT_LOAD_ATTEMPTS, DEFAULT_LANGUAGES, LAYOUT_TYPES, TRANSLATE_ELEMENT_ID } from './constants';

// Script loading state
let isScriptLoading = false;
let isScriptLoaded = false;
let scriptLoadAttempts = 0;

// Add Google Translate script to page
export const loadTranslateScript = (): void => {
  if (isScriptLoading || scriptLoadAttempts >= MAX_SCRIPT_LOAD_ATTEMPTS) {
    console.log(`Script ${isScriptLoading ? 'already loading' : 'max attempts reached'}, skipping load`);
    return;
  }
  
  console.log('Loading Google Translate script');
  isScriptLoading = true;
  scriptLoadAttempts++;
  
  // Define callback function
  window.googleTranslateElementInit = () => {
    console.log('Google Translate callback triggered');
    isScriptLoading = false;
    isScriptLoaded = true;
    
    try {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        console.log('Creating TranslateElement');
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: DEFAULT_LANGUAGES,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          },
          TRANSLATE_ELEMENT_ID
        );
      }
    } catch (error) {
      console.error('Error in Google Translate initialization callback:', error);
    }
  };
  
  // Add script with cache-busting
  const timestamp = new Date().getTime();
  const script = document.createElement('script');
  script.src = `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&_=${timestamp}`;
  script.async = true;
  document.body.appendChild(script);
  console.log('Google Translate script added to DOM');
  
  // Set timeout for script loading
  setTimeout(() => {
    if (isScriptLoading) {
      console.log('Script loading timeout reached, resetting status');
      isScriptLoading = false;
    }
  }, 10000);
};

// Check if script is already loaded in the page
export const isTranslateScriptLoaded = (): boolean => {
  const scriptLoaded = Array.from(document.getElementsByTagName('script'))
    .some(script => script.src && script.src.includes('translate_a/element.js'));
  
  if (scriptLoaded) {
    isScriptLoaded = true;
  }
  
  return scriptLoaded;
};

// Reset script loading state
export const resetScriptLoadingState = (): void => {
  isScriptLoading = false;
  scriptLoadAttempts = 0;
};

// Get script loading state
export const getScriptLoadingState = (): { isLoading: boolean, isLoaded: boolean, attempts: number } => {
  return { 
    isLoading: isScriptLoading, 
    isLoaded: isScriptLoaded, 
    attempts: scriptLoadAttempts 
  };
};
