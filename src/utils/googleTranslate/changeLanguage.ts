
// Language changing utilities

import { setLanguageCookies, changeLanguageUsingDOM, findAndClickLanguageInMenu, changeLanguageUsingIframe } from './domUtils';
import { changeLanguageUsingAPI } from './apiUtils';
import { resetGoogleTranslate } from './resetTranslate';

// Try multiple methods for language changing
export const changeLanguage = (languageCode: string): boolean => {
  console.log(`Attempting to change language to: ${languageCode}`);
  let success = false;
  
  try {
    // Method 1: Direct cookie setting (most reliable)
    setLanguageCookies(languageCode);
    
    // Special case for English - changing to English often means "no translation"
    if (languageCode === 'en') {
      // Reset the Google Translate interface completely
      resetGoogleTranslate();
      
      // Remove translation classes from the body to indicate "no translation"
      document.body.classList.remove('translated-ltr', 'translated-rtl');
      
      // Forcibly reset page with full refresh
      try {
        // Set a session flag for the new page load
        sessionStorage.setItem('forceLanguage', 'en');
        sessionStorage.setItem('forceEnglish', 'true');
        
        // Clear any current translation elements to avoid errors
        document.querySelectorAll('.goog-te-banner-frame, .VIpgJd-ZVi9od-vH1Gmf-hTBxub').forEach(el => {
          try {
            el.remove();
          } catch(e) {
            // Ignore removal errors
          }
        });
        
        console.log("English language change result: success");
        
        // Force a clean reload with URL parameters to ensure clean state
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.set('_gtl', 'en');
        cleanUrl.searchParams.set('_ts', Date.now().toString());
        
        // Use replace to avoid back button issues
        window.location.replace(cleanUrl.toString());
        return true;
      } catch (e) {
        console.error('Error during English refresh:', e);
        // If the refresh fails, continue with other methods
      }
      
      // Patch for the "Cannot read properties of null" error
      try {
        // More aggressive patching for classList error
        const originalGetElementsByClassName = document.getElementsByClassName;
        document.getElementsByClassName = function(className) {
          try {
            return originalGetElementsByClassName.call(document, className);
          } catch (e) {
            console.warn(`Prevented error in getElementsByClassName for ${className}`);
            return document.querySelectorAll('.nonexistent-safe-class'); // Return empty NodeList
          }
        };
        
        // Patch querySelector and querySelectorAll too
        const originalQuerySelector = document.querySelector;
        document.querySelector = function(selector) {
          try {
            return originalQuerySelector.call(document, selector);
          } catch (e) {
            console.warn(`Prevented error in querySelector for ${selector}`);
            return null;
          }
        };
        
        const originalQuerySelectorAll = document.querySelectorAll;
        document.querySelectorAll = function(selector) {
          try {
            return originalQuerySelectorAll.call(document, selector);
          } catch (e) {
            console.warn(`Prevented error in querySelectorAll for ${selector}`);
            return document.querySelectorAll('.nonexistent-safe-class'); // Return empty NodeList
          }
        };
        
        // Patch setAttribute method
        const originalSetAttribute = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(name, value) {
          try {
            originalSetAttribute.call(this, name, value);
          } catch (e) {
            console.warn(`Prevented error in setAttribute for ${name} during English switch`);
          }
        };
        
        // Patch classList methods
        const originalAddClass = DOMTokenList.prototype.add;
        DOMTokenList.prototype.add = function(...tokens) {
          try {
            originalAddClass.apply(this, tokens);
          } catch (e) {
            console.warn(`Prevented error in classList.add during English switch`);
          }
        };
        
        const originalRemoveClass = DOMTokenList.prototype.remove;
        DOMTokenList.prototype.remove = function(...tokens) {
          try {
            originalRemoveClass.apply(this, tokens);
          } catch (e) {
            console.warn(`Prevented error in classList.remove during English switch`);
          }
        };
        
        // Restore original methods after a delay
        setTimeout(() => {
          document.getElementsByClassName = originalGetElementsByClassName;
          document.querySelector = originalQuerySelector;
          document.querySelectorAll = originalQuerySelectorAll;
          Element.prototype.setAttribute = originalSetAttribute;
          DOMTokenList.prototype.add = originalAddClass;
          DOMTokenList.prototype.remove = originalRemoveClass;
        }, 3000);
      } catch (e) {
        console.error("Error while patching DOM methods:", e);
      }

      // Force localStorage
      try {
        localStorage.setItem('googtrans', `/auto/${languageCode}`);
      } catch (e) {
        console.error('Error setting localStorage:', e);
      }
      
      // Remove any translation divs or spans added by Google
      const selectorPrefixes = ['goog-gt-', 'skiptranslate', 'VIpgJd-'];
      selectorPrefixes.forEach(prefix => {
        try {
          const elements = document.querySelectorAll(`[id^="${prefix}"], [class^="${prefix}"]`);
          elements.forEach(el => {
            try {
              // Don't remove the main container
              if (el.id !== 'google_translate_element') {
                el.parentNode?.removeChild(el);
              }
            } catch (e) {
              console.warn(`Error removing element with prefix ${prefix}:`, e);
            }
          });
        } catch (e) {
          console.warn(`Error querying elements with prefix ${prefix}:`, e);
        }
      });
      
      // Force browser to recalculate layout
      try {
        document.documentElement.style.display = 'none';
        setTimeout(() => {
          document.documentElement.style.display = '';
        }, 10);
      } catch (e) {
        console.error('Error forcing layout recalculation:', e);
      }
      
      console.log("English language change result: success");
      return true;
    }
    
    // Method 2: Try DOM manipulation
    const domSuccess = changeLanguageUsingDOM(languageCode);
    if (domSuccess) {
      findAndClickLanguageInMenu(languageCode);
    }
    
    // Method 3: Try API approach if available
    success = changeLanguageUsingAPI(languageCode);
    
    // Method 4: Try iframe approach
    if (!success) {
      success = changeLanguageUsingIframe(languageCode);
    }
    
    // Method 5: Force meta refresh with language parameter
    if (!success && languageCode !== 'en') {
      console.log(`Using force reload for language: ${languageCode}`);
      
      // Set a session storage flag to indicate intent
      sessionStorage.setItem('forceLanguage', languageCode);
      
      // Final fallback - refresh the page with clear cache parameters
      const currentUrl = window.location.href;
      const hasParams = currentUrl.includes('?');
      const separator = hasParams ? '&' : '?';
      const refreshUrl = `${currentUrl}${separator}_gtl=${languageCode}&_ts=${Date.now()}`;
      
      // Use replace to avoid creating a history entry
      window.location.replace(refreshUrl);
      return true;
    }
    
    // For English, consider it successful even if other methods fail
    // because we've already set the cookies and removed translation classes
    if (languageCode === 'en') {
      success = true;
    }
    
    if (!success) {
      console.log('Could not find any Google Translate interface to change language');
    }
    
    return success;
  } catch (e) {
    console.log('Error changing language:', e);
    return false;
  }
};
