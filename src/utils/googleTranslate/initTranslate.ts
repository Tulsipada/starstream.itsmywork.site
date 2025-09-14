
// Initialize Google Translate

import { ensureContainerExists } from './domUtils';
import { isTranslateScriptLoaded, loadTranslateScript } from './scriptLoader';
import { createTranslateElement } from './apiUtils';
import { DEFAULT_LANGUAGES, TRANSLATE_ELEMENT_ID } from './constants';

// Initialize Google Translate
export const initGoogleTranslate = (): void => {
  console.log('Initializing Google Translate');
  const container = ensureContainerExists();
  
  // Clear any existing content to prevent conflicts
  container.innerHTML = '';
  
  // Check if the script is already loaded
  if (isTranslateScriptLoaded()) {
    console.log('Google Translate script already loaded, initializing directly');
    
    // If script is loaded but not initialized properly, try to initialize again
    if (window.google && window.google.translate) {
      createTranslateElement(
        TRANSLATE_ELEMENT_ID,
        {
          pageLanguage: 'en',
          includedLanguages: DEFAULT_LANGUAGES,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true
        }
      );
    }
  } else {
    // Script not loaded yet, add it
    loadTranslateScript();
  }
};
