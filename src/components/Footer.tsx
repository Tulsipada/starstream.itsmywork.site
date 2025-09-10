import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  // Get current year dynamically
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" },
      { name: "Investor Relations", href: "/investors" },
      { name: "Newsletter", href: "/newsletter" },
    ],
    content: [
      { name: "Movies", href: "/movies" },
      { name: "TV Shows", href: "/tv-shows" },
      { name: "Originals", href: "/originals" },
      { name: "Documentaries", href: "/documentaries" },
      { name: "Kids", href: "/kids" },
      { name: "New Releases", href: "/new-releases" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Device Support", href: "/devices" },
      { name: "Accessibility", href: "/accessibility" },
      { name: "Technical Support", href: "/tech-support" },
      { name: "Community", href: "/community" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Content Guidelines", href: "/guidelines" },
      { name: "DMCA", href: "/dmca" },
      { name: "Compliance", href: "/compliance" },
    ],
    account: [
      { name: "Manage Account", href: "/account" },
      { name: "Parental Controls", href: "/parental" },
      { name: "Download App", href: "/download" },
      { name: "Gift Cards", href: "/gift-cards" },
      { name: "Subscription", href: "/subscription" },
      { name: "Billing", href: "/billing" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/tulsipada" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/tulsipada" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/tulsipada" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/tulsipada" },
  ];

  const contactInfo = [
    { icon: Mail, text: "contact@tulsipada.in", href: "mailto:contact@tulsipada.in" },
    { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: MapPin, text: "San Francisco, CA", href: "#" },
  ];

  return (
    <footer className="bg-background-secondary border-t border-border/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="text-foreground font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-foreground-muted hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Content</h3>
            <ul className="space-y-2">
              {footerLinks.content.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-foreground-muted hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-foreground-muted hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-foreground-muted hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-foreground-muted hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-border/20 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div>
              <h3 className="text-foreground font-semibold mb-4">Contact Us</h3>
              <div className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <contact.icon className="w-4 h-4 text-primary" />
                    <a
                      href={contact.href}
                      className="text-foreground-muted hover:text-primary transition-colors duration-200 text-sm"
                    >
                      {contact.text}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h3 className="text-foreground font-semibold mb-4">Stay Updated</h3>
              <p className="text-foreground-muted text-sm mb-4">
                Subscribe to our newsletter for the latest updates and exclusive content.
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-background-tertiary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-foreground font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground-muted hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-background-tertiary"
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo and Copyright */}
            <div className="mb-4 md:mb-0">
              <div className="logo-glow text-xl font-bold mb-2">StarStream</div>
              <p className="text-foreground-muted text-sm">
                © {currentYear} StarStream. All rights reserved. | Developed by <a href="https://tulsipada.in" className="text-primary hover:underline">Tulsipada</a>
              </p>
            </div>

            {/* Additional Links */}
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="/privacy" className="text-foreground-muted hover:text-primary transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/terms" className="text-foreground-muted hover:text-primary transition-colors duration-200">
                Terms of Service
              </a>
              <a href="/cookies" className="text-foreground-muted hover:text-primary transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;