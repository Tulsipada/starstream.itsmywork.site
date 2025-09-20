import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, User, ArrowLeft, Star, Shield, Zap, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
    const [step, setStep] = useState(1); // 1: Basic Info, 2: OTP Verification
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        authMethod: "email", // "email" or "mobile"
    });
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateBasicInfo = () => {
        if (!formData.firstName || !formData.lastName) {
            toast({
                title: "Validation Error",
                description: "Please enter your first and last name.",
                variant: "destructive",
            });
            return false;
        }

        if (formData.authMethod === "email" && !formData.email) {
            toast({
                title: "Email Required",
                description: "Please enter your email address.",
                variant: "destructive",
            });
            return false;
        }

        if (formData.authMethod === "mobile" && !formData.mobile) {
            toast({
                title: "Mobile Required",
                description: "Please enter your mobile number.",
                variant: "destructive",
            });
            return false;
        }

        if (!agreedToTerms) {
            toast({
                title: "Terms Required",
                description: "Please agree to the Terms of Service and Privacy Policy.",
                variant: "destructive",
            });
            return false;
        }

        return true;
    };

    const validateOTP = () => {
        if (!otp || otp.length !== 6) {
            toast({
                title: "Invalid OTP",
                description: "Please enter a valid 6-digit OTP.",
                variant: "destructive",
            });
            return false;
        }
        return true;
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateBasicInfo()) return;

        setIsLoading(true);

        // Simulate OTP sending
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
            toast({
                title: "OTP Sent!",
                description: `We've sent a 6-digit OTP to your ${formData.authMethod === "email" ? "email" : "mobile number"}.`,
            });
        }, 1500);
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateOTP()) return;

        setIsLoading(true);

        // Simulate OTP verification
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Account Created!",
                description: "Welcome to Cinesaga! Your account has been created successfully.",
            });
            navigate("/");
        }, 1500);
    };

    const handleResendOTP = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "OTP Resent!",
                description: "A new OTP has been sent to your registered contact.",
            });
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.2)_1px,transparent_0)] bg-[length:24px_24px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/20" />
            </div>

            <div className="relative w-full max-w-lg">
                {/* Enhanced Back Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/")}
                    className="absolute -top-16 left-0 text-foreground-muted hover:text-foreground hover:bg-primary/10 transition-all duration-200"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>

                {/* Progress Indicator */}
                <div className="absolute -top-12 left-0 right-0 flex justify-center">
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-primary scale-125' : 'bg-foreground-muted/30'}`} />
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-primary scale-125' : 'bg-foreground-muted/30'}`} />
                    </div>
                </div>

                <Card className="backdrop-blur-xl bg-background/98 border-border/30 shadow-2xl ring-1 ring-primary/10">
                    <CardHeader className="space-y-4 text-center pb-8">
                        {/* Enhanced Logo */}
                        <div className="mx-auto mb-4">
                            <img
                                src="/assets/logos/cinesaga-logo.png"
                                alt="Cinesaga"
                                className="h-12 sm:h-16 w-auto"
                            />
                        </div>

                        {/* Enhanced Title */}
                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                                Join Cinesaga
                            </CardTitle>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                <Star className="w-3 h-3 mr-1" />
                                Premium Streaming
                            </Badge>
                        </div>

                        <CardDescription className="text-foreground-muted text-base">
                            {step === 1
                                ? "Create your account and start your streaming journey"
                                : "Verify your contact to complete registration"
                            }
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        {step === 1 ? (
                            <form onSubmit={handleSendOTP} className="space-y-6">
                                {/* Enhanced Name Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Label htmlFor="firstName" className="text-sm font-semibold text-foreground">
                                            First Name
                                        </Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                type="text"
                                                placeholder="John"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="lastName" className="text-sm font-semibold text-foreground">
                                            Last Name
                                        </Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                type="text"
                                                placeholder="Doe"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Verification Method Selection */}
                                <div className="space-y-4">
                                    <Label className="text-sm font-semibold text-foreground">Verification Method</Label>
                                    <RadioGroup
                                        value={formData.authMethod}
                                        onValueChange={(value) => setFormData({ ...formData, authMethod: value })}
                                        className="grid grid-cols-2 gap-3"
                                    >
                                        <div className="relative">
                                            <RadioGroupItem value="email" id="email-method" className="sr-only" />
                                            <Label
                                                htmlFor="email-method"
                                                className={`flex items-center justify-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.authMethod === "email"
                                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                    : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
                                                    }`}
                                            >
                                                <Mail className={`w-5 h-5 ${formData.authMethod === "email" ? "text-primary" : "text-foreground-muted"}`} />
                                                <span className={`font-medium ${formData.authMethod === "email" ? "text-primary" : "text-foreground"}`}>Email</span>
                                            </Label>
                                        </div>
                                        <div className="relative">
                                            <RadioGroupItem value="mobile" id="mobile-method" className="sr-only" />
                                            <Label
                                                htmlFor="mobile-method"
                                                className={`flex items-center justify-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.authMethod === "mobile"
                                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                    : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
                                                    }`}
                                            >
                                                <Phone className={`w-5 h-5 ${formData.authMethod === "mobile" ? "text-primary" : "text-foreground-muted"}`} />
                                                <span className={`font-medium ${formData.authMethod === "mobile" ? "text-primary" : "text-foreground"}`}>Mobile</span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Enhanced Contact Input */}
                                {formData.authMethod === "email" ? (
                                    <div className="space-y-3">
                                        <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                                            Email Address
                                        </Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="john.doe@example.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Label htmlFor="mobile" className="text-sm font-semibold text-foreground">
                                            Mobile Number
                                        </Label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="mobile"
                                                name="mobile"
                                                type="tel"
                                                placeholder="+918282979209"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                                className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Enhanced Terms Agreement */}
                                <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                                    <Checkbox
                                        id="terms"
                                        checked={agreedToTerms}
                                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                        className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                    <label htmlFor="terms" className="text-sm text-foreground-muted leading-relaxed cursor-pointer">
                                        I agree to the{" "}
                                        <Link to="/terms" className="text-primary hover:underline font-medium">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link to="/privacy" className="text-primary hover:underline font-medium">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>

                                {/* Enhanced Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-primary via-primary to-accent hover:from-primary-dark hover:via-primary-dark hover:to-accent-dark text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                            <span>Sending OTP...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <Zap className="w-4 h-4" />
                                            <span>Send OTP</span>
                                        </div>
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                {/* Enhanced OTP Verification Header */}
                                <div className="text-center space-y-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto shadow-lg ring-2 ring-primary/10">
                                        {formData.authMethod === "email" ? (
                                            <Mail className="w-10 h-10 text-primary" />
                                        ) : (
                                            <Phone className="w-10 h-10 text-primary" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-foreground">Verify Your {formData.authMethod === "email" ? "Email" : "Mobile"}</h3>
                                        <p className="text-sm text-foreground-muted">
                                            We've sent a 6-digit OTP to{" "}
                                            <span className="font-semibold text-primary">
                                                {formData.authMethod === "email" ? formData.email : formData.mobile}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Enhanced OTP Input */}
                                <div className="space-y-3">
                                    <Label htmlFor="otp" className="text-sm font-semibold text-foreground">
                                        Enter OTP
                                    </Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="h-14 text-center text-2xl tracking-[0.5em] font-mono border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                        maxLength={6}
                                        required
                                    />
                                </div>

                                {/* Enhanced Resend Section */}
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                                    <span className="text-sm text-foreground-muted">Didn't receive the code?</span>
                                    <Button
                                        type="button"
                                        variant="link"
                                        onClick={handleResendOTP}
                                        disabled={isLoading}
                                        className="p-0 h-auto text-primary hover:text-primary-dark font-medium"
                                    >
                                        Resend OTP
                                    </Button>
                                </div>

                                {/* Enhanced Action Buttons */}
                                <div className="space-y-3">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-primary via-primary to-accent hover:from-primary-dark hover:via-primary-dark hover:to-accent-dark text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isLoading || otp.length !== 6}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                                <span>Verifying...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <Shield className="w-4 h-4" />
                                                <span>Verify & Create Account</span>
                                            </div>
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(1)}
                                        className="w-full h-12 border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Details
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Enhanced Footer Link */}
                        <Separator className="my-6" />
                        <div className="text-center">
                            <p className="text-sm text-foreground-muted mb-2">Already have an account?</p>
                            <Link
                                to="/signin"
                                className="inline-flex items-center text-primary hover:text-primary-dark hover:underline font-semibold transition-colors duration-200"
                            >
                                Sign in to your account
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SignUp;