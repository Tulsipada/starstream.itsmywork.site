import { useState, useEffect } from "react";
import { Languages, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { triggerGoogleTranslate, checkGoogleTranslateStatus } from "@/utils/translateHelper";

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

    // Check for URL parameters on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const googtrans = urlParams.get('googtrans');
        if (googtrans) {
            const language = languages.find(lang => lang.code === googtrans);
            if (language) {
                setCurrentLanguage(language);
                console.log('Set current language from URL parameter:', language);
            }
        }
    }, []);

    const handleLanguageChange = (language: Language) => {
        console.log('Language change requested:', language);
        setCurrentLanguage(language);

        // Check Google Translate status first
        const status = checkGoogleTranslateStatus();
        console.log('Google Translate status:', status);

        // Try to trigger Google Translate
        const success = triggerGoogleTranslate(language.code);

        if (!success) {
            console.log('Google Translate not available, using page reload method');
            // Use page reload method as fallback
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('googtrans', language.code);
            window.location.href = currentUrl.toString();
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 bg-background/50 border-border/50 hover:bg-background/80 transition-all duration-200"
                >
                    <Languages className="w-4 h-4" />
                    <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
                    <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
                    <ChevronDown className="w-3 h-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language)}
                        className={`flex items-center justify-between cursor-pointer ${currentLanguage.code === language.code ? "bg-primary/10 text-primary" : ""
                            }`}
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
