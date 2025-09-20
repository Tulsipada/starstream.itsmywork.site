import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock, Play, Apple } from "lucide-react";
import { Link } from "react-router-dom";
// Using public folder path instead of import

// Custom X (formerly Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  // Get current year dynamically
  const currentYear = new Date().getFullYear();

  // No quick links - keeping footer minimal

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/cinesaga.in/" },
    { name: "X", icon: XIcon, href: "https://x.com/cinesaga_in" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/cinesaga_in/" },
    { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/@cinesaga_in" },
  ];

  const contactInfo = [
    { icon: Phone, text: "+918282979209", label: "Support", description: "Mon-Sat: 10 AM - 8 PM" },
    { icon: Mail, text: "info.cinesaga@gmail.com", label: "Email", description: "General inquiries" },
    { icon: MapPin, text: "Dhakuria, Kolkata", label: "Location", description: "Entertainment Capital" },
  ];

  return (
    <footer className="bg-gradient-to-br from-background via-background/95 to-primary/5 border-t border-border/20 mt-12 sm:mt-16 lg:mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="text-center mb-12">
          {/* Brand Section */}
          <div className="mb-8">
            <div className="mb-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg px-6 py-4 border-2 border-gray-300 shadow-lg inline-block">
                <img
                  src="/assets/logos/cinesaga-logo.jpg"
                  alt="Cinesaga"
                  className="h-10 sm:h-14 w-auto"
                />
              </div>
            </div>
            <p className="text-foreground-muted text-lg max-w-2xl mx-auto leading-relaxed">
              Your ultimate destination for premium entertainment. Discover amazing movies,
              exclusive originals, and immersive viewing experiences.
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
            {contactInfo.map((contact, index) => {
              const IconComponent = contact.icon;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-sm font-medium text-foreground">{contact.text}</div>
                    <div className="text-xs text-foreground-muted">{contact.description}</div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Social Media & App Downloads */}
        <div className="border-t border-border/20 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Social Media */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Follow Us
              </h3>
              <p className="text-foreground-muted text-sm mb-4">
                Stay connected and get the latest updates
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-foreground/5 rounded-full flex items-center justify-center hover:bg-primary/10 transition-all duration-200 group hover:scale-110"
                      aria-label={social.name}
                    >
                      <IconComponent className="w-6 h-6 text-foreground-muted group-hover:text-primary transition-colors duration-200" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* App Downloads */}
            <div className="text-center md:text-right">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Download App
              </h3>
              <p className="text-foreground-muted text-sm mb-4">
                Get the Cinesaga app for the best experience
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                {/* Google Play Button - Coming Soon */}
                <div className="relative group">
                  <div className="flex items-center justify-center bg-gray-400 text-white px-5 py-3 rounded-lg cursor-not-allowed opacity-75 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-gray-200 font-medium">GET IT ON</div>
                        <div className="text-sm font-bold">Google Play</div>
                      </div>
                    </div>
                  </div>
                  {/* Coming Soon Badge */}
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    Coming Soon
                  </div>
                </div>

                {/* App Store Button - Coming Soon */}
                <div className="relative group">
                  <div className="flex items-center justify-center bg-gray-400 text-white px-5 py-3 rounded-lg cursor-not-allowed opacity-75 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Apple className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-gray-200 font-medium">Download on the</div>
                        <div className="text-sm font-bold">App Store</div>
                      </div>
                    </div>
                  </div>
                  {/* Coming Soon Badge */}
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-foreground-muted">
                © {currentYear} Cinesaga. All rights reserved.
              </p>
              <p className="text-xs text-foreground-muted mt-1">
                Developed by <a href="https://tulsipada.in" className="text-primary hover:underline">Tulsipada</a>
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs">
              <Link to="/privacy" className="text-foreground-muted hover:text-primary transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-foreground-muted hover:text-primary transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-foreground-muted hover:text-primary transition-colors duration-200">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;