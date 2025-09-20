// DOM manipulation utilities for Google Translate

import { TRANSLATE_ELEMENT_ID, SELECTORS } from './constants';

// Create/ensure the Google Translate container exists
export const ensureContainerExists = (): HTMLElement => {
  let container = document.getElementById(TRANSLATE_ELEMENT_ID);
  
  if (!container) {
    container = document.createElement('div');
    container.id = TRANSLATE_ELEMENT_ID;
    container.style.display = 'block';
    container.style.visibility = 'visible';
    document.body.appendChild(container);
  }
  
  return container;
};

// Set cookies for language change with more aggressive approach
export const setLanguageCookies = (languageCode: string): void => {
  const domain = window.location.hostname;
  
  // First, clear any existing cookies to prevent conflicts
  clearTranslationCookies();
  
  // Set a far future expiration for better persistence
  const farFuture = new Date();
  farFuture.setFullYear(farFuture.getFullYear() + 10);
  const expires = `expires=${farFuture.toUTCString()}`;
  const maxAge = 'max-age=315360000'; // 10 years in seconds
  
  // Try different cookie formats and paths
  const cookieFormats = [
    `googtrans=/auto/${languageCode}; path=/; domain=${domain}; ${maxAge}; SameSite=Lax`,
    `googtrans=/auto/${languageCode}; path=/; domain=.${domain}; ${maxAge}; SameSite=Lax`,
    `googtrans=/auto/${languageCode}; path=/; ${maxAge}; SameSite=Lax`,
    `googtrans=/auto/${languageCode}; ${maxAge}; SameSite=Lax`,
    `googto=${languageCode}; path=/; domain=${domain}; ${maxAge}; SameSite=Lax`,
    `googto=${languageCode}; path=/; domain=.${domain}; ${maxAge}; SameSite=Lax`,
    `googto=${languageCode}; path=/; ${maxAge}; SameSite=Lax`
  ];
  
  // Apply all cookie formats
  cookieFormats.forEach(cookieStr => {
    document.cookie = cookieStr;
  });
  
  // For multi-level domains, try setting at the root domain too
  if (domain !== 'localhost' && domain.split('.').length > 2) {
    const parts = domain.split('.');
    const rootDomain = parts.slice(-2).join('.');
    document.cookie = `googtrans=/auto/${languageCode}; path=/; domain=.${rootDomain}; ${maxAge}; SameSite=Lax`;
    document.cookie = `googto=${languageCode}; path=/; domain=.${rootDomain}; ${maxAge}; SameSite=Lax`;
  }
  
  // Also try to set in localStorage for persistent language choice
  try {
    localStorage.setItem('googtrans', `/auto/${languageCode}`);
    localStorage.setItem('googto', languageCode);
  } catch (e) {
    console.error('Error setting localStorage:', e);
  }
  
  
  // Check if cookies were actually set
  setTimeout(() => {
    const currentLang = getCurrentLanguageFromCookie();
    
    if (currentLang !== languageCode) {
      console.warn(`Cookie setting failed! Expected ${languageCode}, got ${currentLang}`);
    }
  }, 100);
};

// Clear translation cookies with more aggressive approach
export const clearTranslationCookies = (): void => {
  const domain = window.location.hostname;
  const expires = 'expires=Thu, 01 Jan 1970 00:00:00 UTC';
  const maxAge = 'max-age=0';
  
  // Array of cookie formats to clear
  const cookieFormats = [
    `googtrans=; ${expires}; path=/; domain=${domain}`,
    `googtrans=; ${expires}; path=/; domain=.${domain}`,
    `googtrans=; ${expires}; path=/`,
    `googtrans=; ${expires}`,
    `googto=; ${expires}; path=/; domain=${domain}`,
    `googto=; ${expires}; path=/; domain=.${domain}`,
    `googto=; ${expires}; path=/`,
    `googto=; ${expires}`,
    `googtrans=; ${maxAge}; path=/; domain=${domain}`,
    `googtrans=; ${maxAge}; path=/; domain=.${domain}`,
    `googtrans=; ${maxAge}; path=/`,
    `googto=; ${maxAge}; path=/; domain=${domain}`,
    `googto=; ${maxAge}; path=/; domain=.${domain}`,
    `googto=; ${maxAge}; path=/`
  ];
  
  // Apply all cookie clearing formats
  cookieFormats.forEach(cookieStr => {
    document.cookie = cookieStr;
  });
  
  // For multi-level domains, try clearing at the root domain too
  if (domain !== 'localhost' && domain.split('.').length > 2) {
    const parts = domain.split('.');
    const rootDomain = parts.slice(-2).join('.');
    document.cookie = `googtrans=; ${expires}; path=/; domain=.${rootDomain}`;
    document.cookie = `googto=; ${expires}; path=/; domain=.${rootDomain}`;
    document.cookie = `googtrans=; ${maxAge}; path=/; domain=.${rootDomain}`;
    document.cookie = `googto=; ${maxAge}; path=/; domain=.${rootDomain}`;
  }
  
  // Also clear localStorage
  try {
    localStorage.removeItem('googtrans');
    localStorage.removeItem('googto');
  } catch (e) {
    console.error('Error clearing localStorage:', e);
  }
  
};

// Get current language from cookie with more reliable detection
export const getCurrentLanguageFromCookie = (): string | null => {
  // Try from cookie first
  const googtrans = document.cookie
    .split('; ')
    .find(row => row.startsWith('googtrans='));
  
  if (googtrans) {
    const parts = googtrans.split('/');
    if (parts.length >= 3) {
      return parts[2];
    }
  }
  
  // Try the newer cookie format
  const googto = document.cookie
    .split('; ')
    .find(row => row.startsWith('googto='));
  
  if (googto) {
    return googto.split('=')[1];
  }
  
  // Try localStorage
  try {
    const localStorageTrans = localStorage.getItem('googtrans');
    if (localStorageTrans) {
      const parts = localStorageTrans.split('/');
      if (parts.length >= 3) {
        return parts[2];
      }
    }
    
    const localStorageTo = localStorage.getItem('googto');
    if (localStorageTo) {
      return localStorageTo;
    }
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  
  // Check URL parameters
  const url = new URL(window.location.href);
  const urlLang = url.searchParams.get('_gtl');
  if (urlLang) {
    return urlLang;
  }
  
  // Default to English if nothing found
  return null;
};

// Check if body has translated classes
export const hasTranslatedClass = (): boolean => {
  return document.body.classList.contains('translated-ltr') || 
         document.body.classList.contains('translated-rtl');
};

// Change language using DOM selection
export const changeLanguageUsingDOM = (languageCode: string): boolean => {
  
  // Try using select dropdown
  const selectElement = document.querySelector(SELECTORS.TRANSLATE_COMBO) as HTMLSelectElement;
  if (selectElement) {
    selectElement.value = languageCode;
    
    // Create and dispatch both change and input events
    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    selectElement.dispatchEvent(new Event('input', { bubbles: true }));
    
    return true;
  }
  
  // Try using new interface links
  const translateLinks = document.querySelectorAll(SELECTORS.TRANSLATE_LINKS);
  
  if (translateLinks.length > 0) {
    // Click to open menu
    const linkElement = translateLinks[0] as HTMLElement;
    linkElement.click();
    
    return true;
  }
  
  return false;
};

// Find and click language in menu - with more aggressive retry mechanism
export const findAndClickLanguageInMenu = (languageCode: string): void => {
  // Check in multiple waves with more attempts to account for menu animation
  const checkIntervals = [100, 300, 600, 900, 1200];
  
  checkIntervals.forEach(interval => {
    setTimeout(() => {
      try {
        // Try data attribute selector
        const dataSelector = SELECTORS.LANGUAGE_DATA.replace('{code}', languageCode);
        const langItems = document.querySelectorAll(dataSelector);
        
        if (langItems.length > 0) {
          (langItems[0] as HTMLElement).click();
          return;
        }
        
        // Try finding by menu items
        const menuItems = document.querySelectorAll(SELECTORS.LANGUAGE_ITEMS);
        
        if (menuItems.length > 0) {
          // Look for the item containing our language code
          for (let i = 0; i < menuItems.length; i++) {
            const itemText = menuItems[i].textContent || '';
            // Match both by language code or language name
            const languages: Record<string, string[]> = {
              'en': ['english', 'en', 'inglés', 'ingles', 'no translation'],
              'es': ['spanish', 'español', 'espanol', 'es', 'castellano'],
              'de': ['german', 'deutsch', 'de', 'alemán', 'aleman'],
              'zh-CN': ['chinese', 'zhongwen', 'zh', 'zh-cn', '中文', 'chino'],
              'ar': ['arabic', 'ar', 'العربية', 'árabe', 'arabe']
            };
            
            const currentLangKeywords = languages[languageCode] || [languageCode];
            
            if (currentLangKeywords.some(keyword => 
              itemText.toLowerCase().includes(keyword.toLowerCase()))) {
              (menuItems[i] as HTMLElement).click();
              return;
            }
          }
        }
      } catch (err) {
        console.error('Error interacting with language menu:', err);
      }
    }, interval);
  });
};

// Find and interact with translate iframe - with improved targeting
export const changeLanguageUsingIframe = (languageCode: string): boolean => {
  const frames = document.querySelectorAll(SELECTORS.TRANSLATE_FRAMES);
  
  if (frames.length > 0) {
    try {
      // Try to access iframe content and interact with it
      const frame = frames[0] as HTMLIFrameElement;
      
      // For security reasons, we might not be able to access frame content directly
      // So we'll simulate clicking on the iframe which might trigger the menu
      frame.focus();
      frame.click();
      
      setTimeout(() => {
        // Now try to find and click language items
        findAndClickLanguageInMenu(languageCode);
      }, 300);
      
      return true;
    } catch (e) {
    }
  }
  
  return false;
};
