
// Constants for Google Translate functionality

// Script loading settings
export const MAX_SCRIPT_LOAD_ATTEMPTS = 3;

// Default languages
export const DEFAULT_LANGUAGES = 'en,hi,gu,pa,mr,bn,or,as,bho,ta,te,ml,kn';

// Element ID for Google Translate container
export const TRANSLATE_ELEMENT_ID = 'google_translate_element';

// Layout options
export const LAYOUT_TYPES = {
  SIMPLE: 0,
  HORIZONTAL: 1,
  VERTICAL: 2
};

// Common selectors
export const SELECTORS = {
  TRANSLATE_COMBO: '.goog-te-combo',
  TRANSLATE_LINKS: '.VIpgJd-ZVi9od-xl07Ob-lTBxed, .goog-te-gadget-link',
  TRANSLATE_FRAMES: 'iframe.goog-te-menu-frame',
  LANGUAGE_ITEMS: '.goog-te-menu2-item, .VIpgJd-ZVi9od-vH1Gmf-ibnC6b',
  LANGUAGE_DATA: '[data-language-code="{code}"]',
  BODY_TRANSLATED: 'translated-ltr, translated-rtl'
};

// Supported languages with native names
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
];
