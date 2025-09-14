
// Reset Google Translate functionality

import { clearTranslationCookies } from './domUtils';
import { createTranslateElement } from './apiUtils';
import { TRANSLATE_ELEMENT_ID, DEFAULT_LANGUAGES } from './constants';

// Reset Google Translate to clear previous state
export const resetGoogleTranslate = (): void => {
  console.log('Resetting Google Translate');
  
  try {
    // First clear any translation cookies - this is the most important step
    clearTranslationCookies();
    
    // Safely remove translation classes from the body
    try {
      document.body.classList.remove('translated-ltr', 'translated-rtl');
    } catch (e) {
      console.error('Error removing body classes:', e);
    }
    
    // Clear style attribute from body - this often contains translation-related styles
    try {
      document.body.removeAttribute('style');
    } catch (e) {
      console.error('Error removing body style:', e);
    }
    
    // Try to find and remove the Google Translate elements
    try {
      const iframes = document.querySelectorAll('iframe.goog-te-menu-frame, iframe.VIpgJd-ZVi9od-xl07Ob-OEVmcd, iframe.skiptranslate');
      if (iframes.length > 0) {
        console.log(`Found ${iframes.length} translate iframes, removing them`);
        iframes.forEach(iframe => {
          try {
            iframe.remove();
          } catch (e) {
            console.error('Error removing iframe:', e);
          }
        });
      }
    } catch (e) {
      console.error('Error removing iframes:', e);
    }
    
    // Find and remove the Google Translate banner if present
    try {
      const banners = document.querySelectorAll('.goog-te-banner-frame, .VIpgJd-yAWNEb-L7lbkb, .skiptranslate');
      banners.forEach(banner => {
        try {
          banner.remove();
        } catch (e) {
          console.error('Error removing banner:', e);
        }
      });
    } catch (e) {
      console.error('Error removing banners:', e);
    }
    
    // Clear localStorage
    try {
      localStorage.removeItem('googtrans');
      localStorage.removeItem('googto');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
    
    // Reset any inline translations
    if (document.querySelector('.goog-te-combo, .VIpgJd-ZVi9od-xl07Ob-lTBxed')) {
      try {
        // Try using the getInstance method if available
        if (window.google?.translate?.TranslateElement?.getInstance) {
          const instance = window.google.translate.TranslateElement.getInstance();
          if (instance) {
            if (typeof instance.restore === 'function') {
              try {
                instance.restore();
                console.log("Called TranslateElement.restore()");
              } catch (e) {
                console.error('Error using TranslateElement restore function:', e);
              }
            }
            
            if (typeof instance.reset === 'function') {
              try {
                instance.reset();
                console.log("Called TranslateElement.reset()");
              } catch (e) {
                console.error('Error using TranslateElement reset function:', e);
              }
            }
          }
        }
      } catch (e) {
        console.error('Error using TranslateElement functions:', e);
      }
    }
    
    // Fix for classList errors - patch the methods temporarily
    try {
      // Patch classList methods
      const originalAddClass = DOMTokenList.prototype.add;
      DOMTokenList.prototype.add = function(...tokens) {
        try {
          originalAddClass.apply(this, tokens);
        } catch (e) {
          console.warn('Prevented error in classList.add');
        }
      };
      
      const originalRemoveClass = DOMTokenList.prototype.remove;
      DOMTokenList.prototype.remove = function(...tokens) {
        try {
          originalRemoveClass.apply(this, tokens);
        } catch (e) {
          console.warn('Prevented error in classList.remove');
        }
      };
      
      // Restore original methods after a delay
      setTimeout(() => {
        DOMTokenList.prototype.add = originalAddClass;
        DOMTokenList.prototype.remove = originalRemoveClass;
      }, 2000);
    } catch (e) {
      console.error('Error patching classList methods:', e);
    }
    
    // Remove any translation divs or spans added by Google - more comprehensive
    try {
      const prefixes = ['goog-gt-', 'goog-te-', 'skiptranslate', 'VIpgJd-', 'google_translate_'];
      prefixes.forEach(prefix => {
        try {
          const elements = document.querySelectorAll(`[id^="${prefix}"], [class^="${prefix}"]`);
          elements.forEach(el => {
            if (el.id !== TRANSLATE_ELEMENT_ID && el.id !== 'google_translate_element') {
              try {
                el.remove();
              } catch (e) {
                console.warn(`Error removing element with prefix ${prefix}:`, e);
              }
            }
          });
        } catch (e) {
          console.warn(`Error querying elements with prefix ${prefix}:`, e);
        }
      });
    } catch (e) {
      console.error('Error removing translation elements:', e);
    }
    
    // Clean up any translation attributes
    try {
      document.querySelectorAll('[lang]').forEach(el => {
        if (el.getAttribute('lang')?.includes('translated')) {
          try {
            el.removeAttribute('lang');
          } catch (e) {
            console.warn('Error removing lang attribute:', e);
          }
        }
      });
    } catch (e) {
      console.error('Error cleaning translation attributes:', e);
    }
    
    // Fix for the "Cannot read properties of null" error when switching to English
    // Ensure the Google Translate script doesn't try to modify removed elements
    const patchSetAttribute = () => {
      try {
        const originalSetAttribute = Element.prototype.setAttribute;
        
        // Patch the setAttribute method to catch errors when Google script tries to access null elements
        Element.prototype.setAttribute = function(name, value) {
          try {
            originalSetAttribute.call(this, name, value);
          } catch (e) {
            console.warn(`Prevented error in setAttribute for ${name}:`, e);
          }
        };
        
        // Restore the original after a short delay (after Google script has run)
        setTimeout(() => {
          Element.prototype.setAttribute = originalSetAttribute;
        }, 2000);
      } catch (e) {
        console.error('Error patching setAttribute:', e);
      }
    };
    
    // Apply the patch
    patchSetAttribute();
    
    // Recreate the translate element with a completely clean slate
    try {
      const container = document.getElementById(TRANSLATE_ELEMENT_ID);
      if (container) {
        container.innerHTML = '';
        
        // Reinitialize after a small delay
        setTimeout(() => {
          if (window.google && window.google.translate && window.google.translate.TranslateElement) {
            createTranslateElement(
              TRANSLATE_ELEMENT_ID,
              {
                pageLanguage: 'en', // Force English as the base page language
                includedLanguages: DEFAULT_LANGUAGES,
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
                multilanguagePage: true
              }
            );
            console.log("Recreated TranslateElement");
          }
        }, 300);
      }
    } catch (e) {
      console.error('Error recreating translate element:', e);
    }
    
    // Force all elements to be visible
    try {
      const translateElements = document.querySelector('#google_translate_element');
      if (translateElements) {
        translateElements.setAttribute('style', 'display: block !important; visibility: visible !important;');
      }
    } catch (e) {
      console.error('Error making elements visible:', e);
    }
    
    // Remove any query parameters related to translation
    try {
      if (window.location.search.includes('_gtl=') || window.location.search.includes('googtrans=')) {
        const url = new URL(window.location.href);
        url.searchParams.delete('_gtl');
        url.searchParams.delete('googtrans');
        url.searchParams.delete('_ts');
        window.history.replaceState({}, document.title, url.toString());
      }
    } catch (e) {
      console.error('Error cleaning URL:', e);
    }
  } catch (e) {
    console.error('Error resetting Google Translate:', e);
  }
};
