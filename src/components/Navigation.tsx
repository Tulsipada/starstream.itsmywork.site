import { Search, User, Menu, X, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GoogleTranslate from "./GoogleTranslate";
import SimpleTranslate from "./SimpleTranslate";
import { useAuth } from "@/contexts/AuthContext";
import { useLogout } from "@/hooks/useLogout";
// Using public folder path instead of import
import { useDropdownPreventShake } from "@/hooks/use-dropdown-prevent-shake";

const Navigation = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { handleLogout } = useLogout();

  // Prevent page shaking when mobile menu is open
  useDropdownPreventShake(isMobileMenuOpen);

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
            <Link to="/" className="flex items-center">
              <img
                src="/assets/logos/cinesaga-logo.png"
                alt="Cinesaga"
                className="h-12 sm:h-16 lg:h-20 w-auto"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/movies" className="nav-link">Movies</Link>
              <Link to="/prelaunch-offers" className="nav-link">Pre-Launch</Link>
              <Link to="/watchlist" className="nav-link">Watchlist</Link>
              <Link to="/watch-history" className="nav-link">History</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
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

            {/* Google Translate - Initially visible for proper initialization */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none', visibility: 'hidden' }}>
              <GoogleTranslate />
            </div>

            {/* Custom Language Selector */}
            <div className="hidden sm:block">
              <SimpleTranslate />
            </div>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-foreground-muted">
                    Welcome, {user?.profile?.firstName || user?.email?.split('@')[0] || 'User'}
                  </span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/profile">
                      <Settings className="w-4 h-4 mr-1" />
                      Profile
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/signin">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
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
                  <Link to="/" className="nav-link text-base py-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                  <Link to="/movies" className="nav-link text-base py-2" onClick={() => setIsMobileMenuOpen(false)}>Movies</Link>
                  <Link to="/prelaunch-offers" className="nav-link text-base py-2" onClick={() => setIsMobileMenuOpen(false)}>Pre-Launch Offers</Link>
                  <Link to="/watchlist" className="nav-link text-base py-2" onClick={() => setIsMobileMenuOpen(false)}>Watchlist</Link>
                  <Link to="/watch-history" className="nav-link text-base py-2" onClick={() => setIsMobileMenuOpen(false)}>History</Link>
                  <Link to="/contact" className="nav-link text-base py-2" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                </div>

                {/* Mobile Google Translate - Initially visible for proper initialization */}
                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none', visibility: 'hidden' }}>
                  <GoogleTranslate />
                </div>

                {/* Mobile Language Selector */}
                <div className="pt-4 border-t border-border/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Language</span>
                  </div>
                  <SimpleTranslate />
                </div>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col space-y-2 pt-4 border-t border-border/20">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="text-center py-2">
                        <span className="text-sm text-foreground-muted">
                          Welcome, {user?.profile?.firstName || user?.email?.split('@')[0] || 'User'}
                        </span>
                      </div>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                          <Settings className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                      </Button>
                    </>
                  )}
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