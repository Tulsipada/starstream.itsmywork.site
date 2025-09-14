import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft, Star, Zap, Shield, Download, Tv, Globe } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PreLaunchOffers = () => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const plans = [
        {
            id: "1-month",
            name: "1 Month Plan",
            originalPrice: 149,
            discountedPrice: 149,
            savings: 0,
            duration: "1 month",
            description: "Perfect for trying out Cinesaga",
            features: [
                "Unlimited streaming",
                "All languages included",
                "No ads ever",
                "HD & 4K quality",
                "Download offline"
            ],
            accessDescription: "Subscribers will get access from the day of pre-launch subscription till the main launch, and from the main launch for the next 30 days.",
            popular: false
        },
        {
            id: "3-month",
            name: "3 Months Plan",
            originalPrice: 447,
            discountedPrice: 299,
            savings: 148,
            duration: "3 months",
            description: "Great value for regular viewers",
            features: [
                "Unlimited streaming",
                "All languages included",
                "No ads ever",
                "HD & 4K quality",
                "Download offline"
            ],
            accessDescription: "Subscribers will get access from the day of pre-launch subscription till the main launch, and from the main launch for the next 90 days.",
            popular: false
        },
        {
            id: "6-month",
            name: "6 Months Plan",
            originalPrice: 894,
            discountedPrice: 499,
            savings: 395,
            duration: "6 months",
            description: "Best for movie enthusiasts",
            features: [
                "Unlimited streaming",
                "All languages included",
                "No ads ever",
                "HD & 4K quality",
                "Download offline"
            ],
            accessDescription: "Subscribers will get access from the day of pre-launch subscription till the main launch, and from the main launch for the next 180 days.",
            popular: false
        },
        {
            id: "1-year",
            name: "1 Year Plan",
            originalPrice: 1788,
            discountedPrice: 799,
            savings: 989,
            duration: "1 year",
            description: "Ultimate entertainment package",
            features: [
                "Unlimited streaming",
                "All languages included",
                "No ads ever",
                "HD & 4K quality",
                "Download offline"
            ],
            accessDescription: "Subscribers will get access from the day of pre-launch subscription till the main launch, and from the main launch for the next 365 days.",
            popular: true
        }
    ];

    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId);
        // Here you would typically redirect to payment or show a modal
        console.log(`Selected plan: ${planId}`);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Main Content */}
            <div className="pt-16 sm:pt-20 pb-12 sm:pb-16">
                {/* Hero Section */}
                <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Limited Time Pre-Launch Offer</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                            Pre-Launch
                            <span className="text-primary block">Offers</span>
                        </h1>

                        <p className="text-base sm:text-xl text-foreground-muted mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                            Get exclusive early access to Cinesaga with our special pre-launch pricing.
                            Start your entertainment journey today and enjoy premium content at unbeatable prices.
                        </p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
                            <div className="flex flex-col items-center space-y-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Tv className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium">HD & 4K</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium">All Languages</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium">No Ads</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Download className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium">Offline</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Plans */}
                <div className="container mx-auto px-3 sm:px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
                        {plans.map((plan) => (
                            <Card
                                key={plan.id}
                                className={`relative transition-all duration-300 hover:scale-105 hover:shadow-xl ${plan.popular
                                    ? 'border-primary shadow-lg ring-2 ring-primary/20'
                                    : 'border-border hover:border-primary/50'
                                    } ${selectedPlan === plan.id ? 'ring-2 ring-primary' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-primary text-primary-foreground px-4 py-1">
                                            <Star className="w-3 h-3 mr-1" />
                                            MOST POPULAR
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="text-center pb-3 sm:pb-4">
                                    <CardTitle className="text-lg sm:text-xl font-bold">{plan.name}</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">{plan.description}</CardDescription>

                                    <div className="mt-3 sm:mt-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            {plan.savings > 0 && (
                                                <span className="text-xs sm:text-sm text-foreground-muted line-through">
                                                    ₹{plan.originalPrice}
                                                </span>
                                            )}
                                            <span className="text-2xl sm:text-3xl font-bold text-primary">
                                                ₹{plan.discountedPrice}
                                            </span>
                                        </div>

                                        {plan.savings > 0 && (
                                            <div className="mt-2">
                                                <Badge variant="secondary" className="text-xs">
                                                    Save ₹{plan.savings}
                                                </Badge>
                                            </div>
                                        )}

                                        <p className="text-xs sm:text-sm text-foreground-muted mt-2">
                                            {plan.duration}
                                        </p>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3 sm:space-y-4">
                                    <ul className="space-y-2 sm:space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center space-x-2 sm:space-x-3">
                                                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                                                <span className="text-xs sm:text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="pt-3 sm:pt-4 border-t border-border/20">
                                        <p className="text-xs text-foreground-muted leading-relaxed">
                                            {plan.accessDescription}
                                        </p>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-3 sm:pt-4">
                                    <Button
                                        className={`w-full h-10 sm:h-11 text-sm sm:text-base ${plan.popular
                                            ? 'bg-primary hover:bg-primary-dark'
                                            : 'bg-foreground hover:bg-foreground/90'
                                            }`}
                                        onClick={() => handleSelectPlan(plan.id)}
                                    >
                                        {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Additional Info */}
                <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
                            Why Choose Cinesaga?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            <div className="space-y-3">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold">Early Access</h3>
                                <p className="text-foreground-muted text-xs sm:text-sm">
                                    Be among the first to experience our premium content library
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold">Secure & Reliable</h3>
                                <p className="text-foreground-muted text-xs sm:text-sm">
                                    Your subscription is protected with industry-standard security
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <Star className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold">Premium Quality</h3>
                                <p className="text-foreground-muted text-xs sm:text-sm">
                                    Enjoy the best streaming experience with HD and 4K content
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PreLaunchOffers;
