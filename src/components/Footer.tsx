import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Blog", href: "#" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Device Support", href: "#" },
      { name: "Accessibility", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Content Guidelines", href: "#" },
    ],
    account: [
      { name: "Manage Account", href: "#" },
      { name: "Parental Controls", href: "#" },
      { name: "Download App", href: "#" },
      { name: "Gift Cards", href: "#" },
    ],
  };

  return (
    <footer className="bg-background-secondary border-t border-border/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-foreground font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-foreground-muted hover:text-primary transition-colors duration-200"
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
                    className="text-foreground-muted hover:text-primary transition-colors duration-200"
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
                    className="text-foreground-muted hover:text-primary transition-colors duration-200"
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
                    className="text-foreground-muted hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="border-t border-border/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo and Copyright */}
            <div className="mb-4 md:mb-0">
              <div className="logo-glow text-xl font-bold mb-2">MyStar</div>
              <p className="text-foreground-muted text-sm">
                © 2024 MyStar. All rights reserved.
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-foreground-muted hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-background-tertiary"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-foreground-muted hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-background-tertiary"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-foreground-muted hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-background-tertiary"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-foreground-muted hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-background-tertiary"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;