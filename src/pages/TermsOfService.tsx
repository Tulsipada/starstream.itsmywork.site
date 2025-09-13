import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Scale, AlertTriangle, Shield, CreditCard, Users, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const TermsOfService = () => {
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
                                <h1 className="text-xl font-bold">Terms of Service</h1>
                            </div>
                            <Link to="/" className="text-lg font-bold text-primary">
                                Cinesaga
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <Card className="backdrop-blur-md bg-background/95 border-border/20 shadow-xl">
                        <CardHeader className="text-center pb-8">
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                                Terms of Service
                            </CardTitle>
                            <p className="text-foreground-muted mt-2">
                                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-8">
                            <div className="prose prose-gray max-w-none">
                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                        <Scale className="w-6 h-6 mr-2 text-primary" />
                                        Acceptance of Terms
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed">
                                            By accessing or using Cinesaga ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                                        </p>
                                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                                            <p className="text-sm text-foreground-muted">
                                                <strong>Important:</strong> These terms constitute a legally binding agreement between you and Cinesaga. Please read them carefully.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                        <Users className="w-6 h-6 mr-2 text-primary" />
                                        Account Terms
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Account Creation</h3>
                                            <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                                <li>You must be at least 18 years old to create an account</li>
                                                <li>You must provide accurate and complete information</li>
                                                <li>You are responsible for maintaining account security</li>
                                                <li>One account per person; multiple accounts are prohibited</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Account Responsibilities</h3>
                                            <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                                <li>Keep your login credentials confidential</li>
                                                <li>Notify us immediately of any unauthorized access</li>
                                                <li>You are responsible for all activities under your account</li>
                                                <li>Update your information when it changes</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                        <Globe className="w-6 h-6 mr-2 text-primary" />
                                        Service Usage
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Permitted Use</h3>
                                            <p className="text-foreground-muted leading-relaxed mb-3">
                                                You may use Cinesaga for personal, non-commercial purposes to:
                                            </p>
                                            <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                                <li>Stream movies, TV shows, and other content</li>
                                                <li>Create and manage watchlists</li>
                                                <li>Rate and review content</li>
                                                <li>Access features available to your subscription tier</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Prohibited Activities</h3>
                                            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                                                <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">You may NOT:</p>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
                                                    <li>Share your account credentials with others</li>
                                                    <li>Attempt to circumvent security measures</li>
                                                    <li>Download, copy, or distribute content illegally</li>
                                                    <li>Use automated tools to access the service</li>
                                                    <li>Reverse engineer or modify the platform</li>
                                                    <li>Use the service for commercial purposes without permission</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                        <CreditCard className="w-6 h-6 mr-2 text-primary" />
                                        Billing & Payments
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Subscription Plans</h3>
                                            <p className="text-foreground-muted leading-relaxed">
                                                Cinesaga offers various subscription plans with different features and pricing. All prices are in USD and subject to applicable taxes.
                                            </p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-medium">Payment Terms</h3>
                                                <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                                    <li>Billing occurs at the beginning of each subscription period</li>
                                                    <li>All fees are non-refundable except as required by law</li>
                                                    <li>Prices may change with 30 days' notice</li>
                                                    <li>Failed payments may result in service suspension</li>
                                                </ul>
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-medium">Cancellation</h3>
                                                <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                                    <li>You may cancel your subscription at any time</li>
                                                    <li>Cancellation takes effect at the end of the current billing period</li>
                                                    <li>No refunds for partial subscription periods</li>
                                                    <li>Access continues until the end of the paid period</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                        <Shield className="w-6 h-6 mr-2 text-primary" />
                                        Content & Intellectual Property
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Content Rights</h3>
                                            <p className="text-foreground-muted leading-relaxed">
                                                All content available on Cinesaga, including movies, TV shows, graphics, logos, and software, is protected by copyright and other intellectual property laws.
                                            </p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-medium">Your Rights</h3>
                                                <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                                    <li>Stream content for personal use only</li>
                                                    <li>Create personal watchlists and ratings</li>
                                                    <li>Access content according to your subscription</li>
                                                    <li>Use features as intended by the platform</li>
                                                </ul>
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-medium">Restrictions</h3>
                                                <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                                    <li>No downloading or copying of content</li>
                                                    <li>No sharing of account access</li>
                                                    <li>No commercial use of content</li>
                                                    <li>No reverse engineering of the platform</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                        <AlertTriangle className="w-6 h-6 mr-2 text-primary" />
                                        Disclaimers & Limitations
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Service Availability</h3>
                                            <p className="text-foreground-muted leading-relaxed">
                                                While we strive to provide continuous service, Cinesaga is provided "as is" and we do not guarantee uninterrupted access. We may temporarily suspend service for maintenance, updates, or technical issues.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Limitation of Liability</h3>
                                            <p className="text-foreground-muted leading-relaxed">
                                                To the maximum extent permitted by law, Cinesaga shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising from your use of the service.
                                            </p>
                                        </div>

                                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                                <strong>Important:</strong> Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability, so the above limitations may not apply to you.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Termination</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Termination by You</h3>
                                            <p className="text-foreground-muted leading-relaxed">
                                                You may terminate your account at any time by contacting our support team or using the account cancellation feature in your account settings.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Termination by Us</h3>
                                            <p className="text-foreground-muted leading-relaxed">
                                                We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Effect of Termination</h3>
                                            <p className="text-foreground-muted leading-relaxed">
                                                Upon termination, your right to use the service will cease immediately. We may delete your account and data, and we are not obligated to provide any refunds or compensation.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed">
                                            These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be resolved in the courts of California.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed">
                                            We reserve the right to modify these Terms at any time. We will notify you of any material changes by:
                                        </p>
                                        <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                            <li>Posting the updated Terms on our website</li>
                                            <li>Sending you an email notification</li>
                                            <li>Displaying a notice in our service</li>
                                        </ul>
                                        <p className="text-foreground-muted leading-relaxed mt-4">
                                            Your continued use of the Service after any changes constitutes acceptance of the updated Terms.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed">
                                            If you have any questions about these Terms of Service, please contact us:
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-foreground-muted">Email:</span>
                                                    <span className="text-foreground">info.cinesaga@gmail.com</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-foreground-muted">Phone:</span>
                                                    <span className="text-foreground">+918282979209</span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-foreground-muted">Address:</span>
                                                    <span className="text-foreground">Dhakuria, Kolkata</span>
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

export default TermsOfService;
