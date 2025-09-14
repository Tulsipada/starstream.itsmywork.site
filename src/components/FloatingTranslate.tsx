import { useState, useEffect } from "react";
import { Languages, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoogleTranslate from "./GoogleTranslate";

const FloatingTranslate = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        // Show the floating button after a delay
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isMinimized ? (
                <div className="bg-background/95 backdrop-blur-md border border-border/20 rounded-lg shadow-lg p-4 max-w-xs">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-foreground">Translate Website</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMinimized(true)}
                            className="h-6 w-6 p-0"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                    <p className="text-xs text-foreground-muted mb-3">
                        Choose your preferred language to translate the entire website
                    </p>
                    <GoogleTranslate />
                </div>
            ) : (
                <Button
                    onClick={() => setIsMinimized(false)}
                    className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shadow-lg"
                    size="icon"
                >
                    <Languages className="h-5 w-5" />
                </Button>
            )}
        </div>
    );
};

export default FloatingTranslate;
