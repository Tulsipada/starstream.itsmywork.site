declare global {
    interface Window {
        google: {
            translate: {
                TranslateElement: new (config: any, elementId: string) => void;
                TranslateElement: {
                    InlineLayout: {
                        SIMPLE: number;
                    };
                };
            };
        };
        googleTranslateElementInit: () => void;
    }
}

export { };
