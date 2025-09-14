
// Check Google Translate state

import { SELECTORS } from './constants';

// Check if Google Translate is fully initialized
export const isGoogleTranslateInitialized = (): boolean => {
  // Check for the combo box which indicates successful initialization
  const hasComboBox = !!document.querySelector(SELECTORS.TRANSLATE_COMBO);
  // Check for the newer interface
  const hasNewInterface = !!document.querySelector(SELECTORS.TRANSLATE_LINKS);
  
  const result = hasComboBox || hasNewInterface;
  console.log(`Checking for Google Translate initialization: ${result ? 'Found' : 'Not found'}`);
  return result;
};

// Check if page is currently translated
export const isPageCurrentlyTranslated = (): boolean => {
  return document.body.classList.contains('translated-ltr') || 
         document.body.classList.contains('translated-rtl');
};

// Check which language is currently active
export const getCurrentTranslateLanguage = (): string | null => {
  // Try from cookie first
  const googtrans = document.cookie
    .split('; ')
    .find(row => row.startsWith('googtrans='));
  
  if (googtrans) {
    const langCode = googtrans.split('/')[2];
    if (langCode) {
      return langCode;
    }
  }
  
  // Try from dropdown if cookie wasn't found
  const selectElement = document.querySelector(SELECTORS.TRANSLATE_COMBO) as HTMLSelectElement;
  if (selectElement && selectElement.value) {
    return selectElement.value;
  }
  
  // Default to null if nothing found
  return null;
};
