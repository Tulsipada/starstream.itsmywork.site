import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Shield, Eye, Database, Lock, Mail, Phone, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
            </div>

            <div className="relative">
                {/* Header */}
                <div className="bg-background/95 backdrop-blur-md border-b border-border/20 sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(-1)}
                                    className="text-foreground-muted hover:text-foreground"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                                <div className="h-6 w-px bg-border" />
                                <h1 className="text-xl font-bold">Privacy Policy</h1>
                            </div>
                            <Link to="/" className="text-lg font-bold text-primary">
                                Cinesaga
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-4xl">
                    <Card className="backdrop-blur-md bg-background/95 border-border/20 shadow-xl">
                        <CardHeader className="text-center pb-6 sm:pb-8">
                            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                                Privacy Policy
                            </CardTitle>
                            <p className="text-foreground-muted mt-2 text-sm sm:text-base">
                                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-6 sm:space-y-8">
                            <div className="prose prose-gray max-w-none">
                                {/* Effective Date */}
                                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-6">
                                    <p className="text-sm text-foreground-muted">
                                        <strong>Effective Date:</strong> 5th July 2025
                                    </p>
                                    <p className="text-sm text-foreground-muted">
                                        <strong>Last Updated:</strong> 5th July 2025
                                    </p>
                                </div>

                                {/* Introduction */}
                                <section>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed text-sm sm:text-base">
                                            Cinesaga ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and share your personal information when you use our platform (website and mobile app).
                                        </p>
                                        <p className="text-foreground-muted leading-relaxed text-sm sm:text-base">
                                            By accessing or using Cinesaga, you agree to this Privacy Policy. If you do not agree, please do not use the Platform.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 1. Information We Collect */}
                                <section>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center">
                                        <Eye className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary" />
                                        1. Information We Collect
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed text-sm sm:text-base">
                                            We may collect the following categories of personal data:
                                        </p>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-medium mb-2">a) Information You Provide Directly</h3>
                                            <ul className="list-disc list-inside mt-2 space-y-1 text-foreground-muted text-sm sm:text-base ml-4">
                                                <li>Name</li>
                                                <li>Email address</li>
                                                <li>Phone number</li>
                                                <li>Payment information (processed securely via payment gateways)</li>
                                                <li>Account credentials (username, password)</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-medium mb-2">b) Information Collected Automatically</h3>
                                            <ul className="list-disc list-inside mt-2 space-y-1 text-foreground-muted text-sm sm:text-base ml-4">
                                                <li>IP address</li>
                                                <li>Device type, OS, and browser details</li>
                                                <li>Access logs and usage patterns</li>
                                                <li>Location (based on IP or device permissions)</li>
                                                <li>Viewing preferences and watch history</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-medium mb-2">c) Cookies and Tracking Technologies</h3>
                                            <p className="text-foreground-muted leading-relaxed text-sm sm:text-base mb-2">
                                                We use cookies and similar tools to:
                                            </p>
                                            <ul className="list-disc list-inside mt-2 space-y-1 text-foreground-muted text-sm sm:text-base ml-4">
                                                <li>Authenticate users</li>
                                                <li>Remember preferences</li>
                                                <li>Analyze traffic and usage behavior</li>
                                                <li>Personalize content</li>
                                            </ul>
                                            <p className="text-foreground-muted leading-relaxed text-sm sm:text-base mt-2">
                                                You can control cookie preferences via your browser settings. Disabling cookies may affect your experience on our platform.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 2. How We Use Your Information */}
                                <section>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center">
                                        <Database className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary" />
                                        2. How We Use Your Information
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed text-sm sm:text-base">
                                            We use the collected information to:
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-foreground-muted text-sm sm:text-base ml-4">
                                            <li>Create and manage user accounts</li>
                                            <li>Provide access to content and features</li>
                                            <li>Process payments and subscriptions</li>
                                            <li>Improve platform performance and user experience</li>
                                            <li>Offer personalized recommendations</li>
                                            <li>Communicate important updates and promotional offers (you may opt out anytime)</li>
                                            <li>Prevent fraud and ensure platform security</li>
                                        </ul>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 3. Data Storage and Security */}
                                <section>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center">
                                        <Lock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary" />
                                        3. Data Storage and Security
                                    </h2>
                                    <div className="space-y-4">
                                        <ul className="list-disc list-inside space-y-2 text-foreground-muted text-sm sm:text-base ml-4">
                                            <li>All data is stored on secure servers with encryption and restricted access.</li>
                                            <li>We implement industry-standard practices (e.g., SSL encryption, firewalls) to protect your personal data.</li>
                                            <li>Passwords and payment data are never stored in plain text.</li>
                                        </ul>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 4. Sharing of Information */}
                                <section>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                                        4. Sharing of Information
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed text-sm sm:text-base">
                                            We do not sell your personal data to third parties.
                                        </p>
                                        <p className="text-foreground-muted leading-relaxed text-sm sm:text-base">
                                            We may share limited data with:
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-foreground-muted text-sm sm:text-base ml-4">
                                            <li>Trusted third-party service providers (e.g., payment gateways, analytics tools) under strict data protection agreements.</li>
                                            <li>Legal or regulatory authorities when required to comply with applicable laws or in response to valid legal requests.</li>
                                        </ul>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 5. Your Rights and Choices */}
                                <section>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                                        5. Your Rights and Choices
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed text-sm sm:text-base">
                                            You have the right to:
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-foreground-muted text-sm sm:text-base ml-4">
                                            <li>Access, update, or delete your account information</li>
                                            <li>Withdraw consent for marketing emails</li>
                                            <li>Request data deletion (subject to regulatory and legal retention requirements)</li>
                                        </ul>
                                        <p className="text-foreground-muted leading-relaxed text-sm sm:text-base">
                                            To exercise these rights, contact us at:
                                        </p>
                                        <div className="flex items-center space-x-3 mt-2">
                                            <span className="text-foreground-muted">📧</span>
                                            <span className="text-foreground">info.cinesaga@gmail.com</span>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 6. Children's Privacy */}
                                <section>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                                        6. Children's Privacy
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed text-sm sm:text-base">
                                            Our platform is not intended for users under the age of 18. We do not knowingly collect data from minors. If you believe a child has provided personal data, contact us and we will delete it promptly.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 7. Updates to This Policy */}
                                <section>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                                        7. Updates to This Policy
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed text-sm sm:text-base">
                                            We may update this Privacy Policy from time to time. Changes will be reflected on this page with the "Last Updated" date. Continued use of the platform implies acceptance of the revised terms.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 8. Contact Us */}
                                <section>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                                        8. Contact Us
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed text-sm sm:text-base">
                                            For questions, concerns, or complaints regarding this Privacy Policy, contact:
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-foreground-muted">📧 Email:</span>
                                                    <span className="text-foreground">info.cinesaga@gmail.com</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-foreground-muted">📞 Phone:</span>
                                                    <span className="text-foreground">+91 82829 79209</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;

