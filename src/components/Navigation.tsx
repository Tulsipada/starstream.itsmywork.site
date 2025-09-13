import { Search, User, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Navigation = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside or on a link
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('nav')) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            <a href="/" className="logo-glow text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
              Cinesaga
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className="nav-link">Home</a>
              <a href="/movies" className="nav-link">Movies</a>
              <a href="/originals" className="nav-link">Originals</a>
              <a href="/watchlist" className="nav-link">Watchlist</a>
              <a href="/watch-history" className="nav-link">History</a>
              <a href="/contact" className="nav-link">Contact</a>
            </div>
          </div>

          {/* Search and Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Bar */}
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'w-60 sm:w-80' : 'w-48 sm:w-64'} hidden sm:block`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
              <Input
                type="text"
                placeholder="Search movies, shows..."
                className="search-input pl-10 pr-4 py-2 rounded-full border-0 focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>

            {/* Mobile Search Button */}
            <Button variant="ghost" size="icon" className="sm:hidden w-8 h-8">
              <Search className="w-4 h-4" />
            </Button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="/signin">Sign In</a>
              </Button>
              <Button size="sm" asChild>
                <a href="/signup">Sign Up</a>
              </Button>
            </div>

            {/* Mobile Profile Button */}
            <Button variant="ghost" size="icon" className="sm:hidden w-8 h-8">
              <User className="w-4 h-4" />
            </Button>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-8 h-8"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-md">
            <div className="container mx-auto px-3 sm:px-4 py-4">
              <div className="flex flex-col space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search movies, shows..."
                    className="search-input pl-10 pr-4 py-2 rounded-full border-0 focus:ring-2 focus:ring-primary/50 transition-all duration-200 w-full"
                  />
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex flex-col space-y-3">
                  <a href="/" className="nav-link text-base py-2" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
                  <a href="/movies" className="nav-link text-base py-2" onClick={() => setIsMobileMenuOpen(false)}>Movies</a>
                  <a href="/originals" className="nav-link text-base py-2" onClick={() => setIsMobileMenuOpen(false)}>Originals</a>
                  <a href="/watchlist" className="nav-link text-base py-2" onClick={() => setIsMobileMenuOpen(false)}>Watchlist</a>
                  <a href="/watch-history" className="nav-link text-base py-2" onClick={() => setIsMobileMenuOpen(false)}>History</a>
                  <a href="/contact" className="nav-link text-base py-2" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col space-y-2 pt-4 border-t border-border/20">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/signin" onClick={() => setIsMobileMenuOpen(false)}>Sign In</a>
                  </Button>
                  <Button className="w-full" asChild>
                    <a href="/signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;