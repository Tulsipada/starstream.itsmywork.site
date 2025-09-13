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
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <Card className="backdrop-blur-md bg-background/95 border-border/20 shadow-xl">
                        <CardHeader className="text-center pb-8">
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Shield className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                                Privacy Policy
                            </CardTitle>
                            <p className="text-foreground-muted mt-2">
                                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-8">
                            <div className="prose prose-gray max-w-none">
                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                        <Eye className="w-6 h-6 mr-2 text-primary" />
                                        Information We Collect
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                                            <p className="text-foreground-muted leading-relaxed">
                                                When you create an account with Cinesaga, we collect information such as:
                                            </p>
                                            <ul className="list-disc list-inside mt-2 space-y-1 text-foreground-muted">
                                                <li>Name (first and last name)</li>
                                                <li>Email address or mobile phone number</li>
                                                <li>Account preferences and settings</li>
                                                <li>Payment information (processed securely through third-party providers)</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Usage Information</h3>
                                            <p className="text-foreground-muted leading-relaxed">
                                                We automatically collect certain information about your use of our service:
                                            </p>
                                            <ul className="list-disc list-inside mt-2 space-y-1 text-foreground-muted">
                                                <li>Content you watch, search for, and interact with</li>
                                                <li>Device information (type, operating system, browser)</li>
                                                <li>IP address and location data</li>
                                                <li>Usage patterns and preferences</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                        <Database className="w-6 h-6 mr-2 text-primary" />
                                        How We Use Your Information
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-medium">Service Delivery</h3>
                                                <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                                    <li>Provide access to streaming content</li>
                                                    <li>Personalize your viewing experience</li>
                                                    <li>Process payments and subscriptions</li>
                                                    <li>Send important service updates</li>
                                                </ul>
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-medium">Improvement & Analytics</h3>
                                                <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                                    <li>Analyze usage patterns to improve our service</li>
                                                    <li>Develop new features and content</li>
                                                    <li>Conduct research and analytics</li>
                                                    <li>Prevent fraud and ensure security</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                        <Lock className="w-6 h-6 mr-2 text-primary" />
                                        Data Security & Protection
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed">
                                            We implement industry-standard security measures to protect your personal information:
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-medium">Technical Safeguards</h3>
                                                <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                                    <li>End-to-end encryption for sensitive data</li>
                                                    <li>Secure data transmission (HTTPS/TLS)</li>
                                                    <li>Regular security audits and updates</li>
                                                    <li>Access controls and authentication</li>
                                                </ul>
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-medium">Operational Safeguards</h3>
                                                <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                                    <li>Limited access to personal data</li>
                                                    <li>Employee training on data protection</li>
                                                    <li>Incident response procedures</li>
                                                    <li>Regular backup and recovery testing</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed">
                                            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-foreground-muted">
                                            <li><strong>Service Providers:</strong> Trusted partners who help us operate our service (payment processors, cloud storage, analytics)</li>
                                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                                            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                                            <li><strong>Consent:</strong> When you explicitly consent to sharing your information</li>
                                        </ul>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Your Rights & Choices</h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed">
                                            You have the following rights regarding your personal information:
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-medium">Access & Control</h3>
                                                <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                                    <li>View and update your account information</li>
                                                    <li>Download your data</li>
                                                    <li>Delete your account</li>
                                                    <li>Opt-out of marketing communications</li>
                                                </ul>
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-medium">Privacy Settings</h3>
                                                <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                                    <li>Control data collection preferences</li>
                                                    <li>Manage viewing history</li>
                                                    <li>Adjust recommendation settings</li>
                                                    <li>Set parental controls</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Cookies & Tracking</h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed">
                                            We use cookies and similar technologies to enhance your experience:
                                        </p>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="p-4 bg-primary/5 rounded-lg">
                                                <h3 className="font-medium mb-2">Essential Cookies</h3>
                                                <p className="text-sm text-foreground-muted">Required for basic site functionality and security</p>
                                            </div>
                                            <div className="p-4 bg-primary/5 rounded-lg">
                                                <h3 className="font-medium mb-2">Analytics Cookies</h3>
                                                <p className="text-sm text-foreground-muted">Help us understand how you use our service</p>
                                            </div>
                                            <div className="p-4 bg-primary/5 rounded-lg">
                                                <h3 className="font-medium mb-2">Preference Cookies</h3>
                                                <p className="text-sm text-foreground-muted">Remember your settings and preferences</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed">
                                            Cinesaga is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed">
                                            We may update this Privacy Policy from time to time. We will notify you of any material changes by:
                                        </p>
                                        <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                                            <li>Posting the updated policy on our website</li>
                                            <li>Sending you an email notification</li>
                                            <li>Displaying a notice in our service</li>
                                        </ul>
                                        <p className="text-foreground-muted leading-relaxed mt-4">
                                            Your continued use of our service after any changes constitutes acceptance of the updated policy.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                                    <div className="space-y-4">
                                        <p className="text-foreground-muted leading-relaxed">
                                            If you have any questions about this Privacy Policy or our data practices, please contact us:
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <Mail className="w-5 h-5 text-primary" />
                                                    <span className="text-foreground-muted">info.cinesaga@gmail.com</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Phone className="w-5 h-5 text-primary" />
                                                    <span className="text-foreground-muted">+918282979209</span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <Calendar className="w-5 h-5 text-primary" />
                                                    <span className="text-foreground-muted">Monday - Friday, 9 AM - 6 PM EST</span>
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
