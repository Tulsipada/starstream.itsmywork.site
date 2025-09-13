import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const ContactUs = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            category: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send the data to a backend
        console.log("Contact form submitted:", formData);
        setIsSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: "",
                email: "",
                subject: "",
                category: "",
                message: ""
            });
        }, 3000);
    };

    const contactInfo = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: "Support",
            details: "+918282979209",
            description: "Mon-Sat: 10 AM - 8 PM"
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email Us",
            details: "info.cinesaga@gmail.com",
            description: "General inquiries"
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: "Visit Us",
            details: "Dhakuria, Kolkata",
            description: "Entertainment Capital"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Business Hours",
            details: "Monday - Saturday",
            description: "10:00 AM - 8:00 PM"
        }
    ];

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
                                <h1 className="text-xl font-bold">Contact Us</h1>
                            </div>
                            <Link to="/" className="text-lg font-bold text-primary">
                                Cinesaga
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="space-y-6 sm:space-y-8">
                            {/* Hero Section */}
                            <div className="text-center py-6 sm:py-8">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Get in Touch</h2>
                                <p className="text-foreground-muted text-base sm:text-lg max-w-2xl mx-auto px-4">
                                    We'd love to hear from you! Whether you have questions, feedback, or need support,
                                    our team is here to help.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                {/* Contact Information */}
                                <div className="space-y-4 sm:space-y-6">
                                    <Card className="backdrop-blur-md bg-background/95 border-border/20">
                                        <CardHeader>
                                            <CardTitle>Contact Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 sm:space-y-6">
                                            {contactInfo.map((info, index) => (
                                                <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                                                        {info.icon}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold text-base sm:text-lg">{info.title}</h3>
                                                        <p className="text-primary font-medium text-sm sm:text-base break-all">{info.details}</p>
                                                        <p className="text-foreground-muted text-xs sm:text-sm">{info.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* FAQ Section */}
                                    <Card className="backdrop-blur-md bg-background/95 border-border/20">
                                        <CardHeader>
                                            <CardTitle>Frequently Asked Questions</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3 sm:space-y-4">
                                            <div>
                                                <h4 className="font-semibold mb-2 text-sm sm:text-base">How do I cancel my subscription?</h4>
                                                <p className="text-foreground-muted text-xs sm:text-sm">
                                                    You can cancel your subscription anytime from your account settings or by contacting our support team.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2 text-sm sm:text-base">Is there a free trial available?</h4>
                                                <p className="text-foreground-muted text-xs sm:text-sm">
                                                    Yes! We offer a 7-day free trial for new users. No credit card required.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2 text-sm sm:text-base">Can I download content for offline viewing?</h4>
                                                <p className="text-foreground-muted text-xs sm:text-sm">
                                                    Yes, you can download select content for offline viewing on our mobile apps.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Contact Form */}
                                <div>
                                    <Card className="backdrop-blur-md bg-background/95 border-border/20">
                                        <CardHeader>
                                            <CardTitle>Send us a Message</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {isSubmitted ? (
                                                <div className="text-center py-8">
                                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                                                    <p className="text-foreground-muted">
                                                        Thank you for contacting us. We'll get back to you soon.
                                                    </p>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div>
                                                            <label htmlFor="name" className="block text-sm font-medium mb-2">
                                                                Full Name *
                                                            </label>
                                                            <Input
                                                                id="name"
                                                                name="name"
                                                                value={formData.name}
                                                                onChange={handleInputChange}
                                                                placeholder="Enter your full name"
                                                                className="h-10 sm:h-11"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                                                Email Address *
                                                            </label>
                                                            <Input
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                value={formData.email}
                                                                onChange={handleInputChange}
                                                                placeholder="Enter your email"
                                                                className="h-10 sm:h-11"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                                            Subject *
                                                        </label>
                                                        <Input
                                                            id="subject"
                                                            name="subject"
                                                            value={formData.subject}
                                                            onChange={handleInputChange}
                                                            placeholder="What's this about?"
                                                            className="h-10 sm:h-11"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="category" className="block text-sm font-medium mb-2">
                                                            Category
                                                        </label>
                                                        <Select value={formData.category} onValueChange={handleSelectChange}>
                                                            <SelectTrigger className="h-10 sm:h-11">
                                                                <SelectValue placeholder="Select a category" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="general">General Inquiry</SelectItem>
                                                                <SelectItem value="technical">Technical Support</SelectItem>
                                                                <SelectItem value="billing">Billing Question</SelectItem>
                                                                <SelectItem value="feedback">Feedback</SelectItem>
                                                                <SelectItem value="partnership">Partnership</SelectItem>
                                                                <SelectItem value="other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                                                            Message *
                                                        </label>
                                                        <Textarea
                                                            id="message"
                                                            name="message"
                                                            value={formData.message}
                                                            onChange={handleInputChange}
                                                            placeholder="Tell us how we can help you..."
                                                            rows={4}
                                                            className="min-h-[100px] sm:min-h-[120px]"
                                                            required
                                                        />
                                                    </div>

                                                    <Button type="submit" className="w-full h-10 sm:h-11" size="lg">
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Send Message
                                                    </Button>
                                                </form>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <Card className="backdrop-blur-md bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                                <CardContent className="p-6 sm:p-8 text-center">
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Need Immediate Help?</h3>
                                    <p className="text-foreground-muted mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                                        For urgent technical issues or account problems, please call our support hotline
                                        or use our live chat feature available 24/7.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                                        <Button size="lg" variant="outline" asChild className="h-10 sm:h-11 text-sm sm:text-base">
                                            <a href="tel:+918282979209">
                                                <Phone className="w-4 h-4 mr-2" />
                                                Call Support
                                            </a>
                                        </Button>
                                        <Button size="lg" asChild className="h-10 sm:h-11 text-sm sm:text-base">
                                            <Link to="/">
                                                <Mail className="w-4 h-4 mr-2" />
                                                Live Chat
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactUs;
