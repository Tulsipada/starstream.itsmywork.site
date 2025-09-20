
// Google Translate API utilities

// Attempt to use Google Translate API for language change
export const changeLanguageUsingAPI = (languageCode: string): boolean => {
  
  if (window.google && window.google.translate) {
    
    try {
      if (typeof window.google.translate.TranslateElement.getInstance === 'function') {
        const instance = window.google.translate.TranslateElement.getInstance();
        
        if (instance && typeof instance.selectLanguage === 'function') {
          instance.selectLanguage(languageCode);
          return true;
        } else {
        }
      }
    } catch (e) {
    }
  }
  
  return false;
};

// Create TranslateElement instance directly
export const createTranslateElement = (
  container: string, 
  options: { 
    pageLanguage: string, 
    includedLanguages?: string, 
    layout?: number,
    autoDisplay?: boolean,
    multilanguagePage?: boolean
  }
): boolean => {
  try {
    if (window.google?.translate?.TranslateElement) {
      new window.google.translate.TranslateElement(
        options,
        container
      );
      return true;
    }
  } catch (error) {
    console.error('Error creating TranslateElement:', error);
  }
  
  return false;
};
