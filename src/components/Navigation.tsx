import { Search, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navigation = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <a href="/" className="logo-glow text-2xl font-bold tracking-tight">
              MyStar
            </a>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className="nav-link">Home</a>
              <a href="/" className="nav-link">Movies</a>
              <a href="/" className="nav-link">Originals</a>
              <a href="/" className="nav-link">Sports</a>
              <a href="/" className="nav-link">TV Shows</a>
            </div>
          </div>

          {/* Search and Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'w-80' : 'w-64'} hidden sm:block`}>
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
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {/* Profile Button */}
            <Button variant="ghost" size="icon" className="relative">
              <User className="w-5 h-5" />
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;