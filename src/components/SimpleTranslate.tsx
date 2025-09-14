import { useState, useEffect } from "react";
import { Languages, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { triggerGoogleTranslate, checkGoogleTranslateStatus, initializeGoogleTranslate } from "@/utils/translateHelper";

interface Language {
    code: string;
    name: string;
    nativeName: string;
}

const languages: Language[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
    { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
    { code: "bho", name: "Bhojpuri", nativeName: "भोजपुरी" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
];

const SimpleTranslate = () => {
    const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize Google Translate and check for URL parameters
    useEffect(() => {
        // Initialize Google Translate
        initializeGoogleTranslate();
        
        // Wait for initialization and then check URL parameters
        setTimeout(() => {
            setIsInitialized(true);
            
            // Check for URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const googtrans = urlParams.get('googtrans');
            
            if (googtrans) {
                const language = languages.find(lang => lang.code === googtrans);
                if (language) {
                    setCurrentLanguage(language);
                    console.log('Set current language from URL parameter:', language);
                }
            }
            
            // Also check cookies
            const cookieLanguage = getCurrentLanguageFromCookie();
            if (cookieLanguage && cookieLanguage !== 'en') {
                const language = languages.find(lang => lang.code === cookieLanguage);
                if (language) {
                    setCurrentLanguage(language);
                    console.log('Set current language from cookie:', language);
                }
            }
        }, 2000);
    }, []);

    // Monitor Google Translate status
    useEffect(() => {
        if (!isInitialized) return;
        
        const checkInterval = setInterval(() => {
            const status = checkGoogleTranslateStatus();
            
            // If we have a select element, monitor its value
            if (status.selectElement && status.currentValue) {
                const language = languages.find(lang => lang.code === status.currentValue);
                if (language && language.code !== currentLanguage.code) {
                    setCurrentLanguage(language);
                    console.log('Updated current language from select element:', language);
                }
            }
        }, 1000);
        
        return () => clearInterval(checkInterval);
    }, [isInitialized, currentLanguage.code]);

    // Helper function to get current language from cookie
    const getCurrentLanguageFromCookie = (): string | null => {
        const urlParams = new URLSearchParams(window.location.search);
        const googtrans = urlParams.get('googtrans');
        if (googtrans) return googtrans;
        
        // Check cookies
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('googtrans='));
        
        if (cookie) {
            const parts = cookie.split('/');
            if (parts.length >= 3) {
                return parts[2];
            }
        }
        
        return null;
    };

    const handleLanguageChange = (language: Language) => {
        console.log('Language change requested:', language);
        setCurrentLanguage(language);

        // Always check status before attempting change
        const status = checkGoogleTranslateStatus();
        console.log('Google Translate status:', status);

        // If not initialized yet, wait and try again
        if (!isInitialized || !status.selectElement) {
            console.log('Google Translate not ready, initializing and retrying...');
            initializeGoogleTranslate();
            
            setTimeout(() => {
                triggerGoogleTranslate(language.code);
            }, 2000);
        } else {
            // Try to trigger translation immediately
            console.log('Attempting to trigger translation for:', language.code);
            triggerGoogleTranslate(language.code);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={`flex items-center space-x-2 bg-background/50 border-border/50 hover:bg-background/80 transition-all duration-200 ${!isInitialized ? 'opacity-50' : ''}`}
                    disabled={!isInitialized}
                >
                    <Languages className="w-4 h-4" />
                    <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
                    <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
                    <ChevronDown className="w-3 h-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language)}
                        className={`flex items-center justify-between cursor-pointer hover:bg-accent/50 ${currentLanguage.code === language.code ? "bg-primary/10 text-primary" : ""
                            }`}
                        disabled={!isInitialized}
                    >
                        <div className="flex flex-col">
                            <span className="font-medium">{language.nativeName}</span>
                            <span className="text-xs text-muted-foreground">{language.name}</span>
                        </div>
                        {currentLanguage.code === language.code && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SimpleTranslate;
