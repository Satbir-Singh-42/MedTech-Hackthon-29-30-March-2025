import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export default function Navbar({ onLoginClick, onSignupClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md py-4 border-b-2 border-primary">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <span className="bg-purple-600 text-white p-2.5 rounded-full shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </span>
          <span className="font-display font-bold text-2xl text-contrast-high">SereneAI</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a 
              key={item.href}
              href={item.href} 
              className="text-contrast-high hover:text-primary transition-colors duration-300 font-medium text-base"
              onClick={handleNavLinkClick}
            >
              {item.label}
            </a>
          ))}
          <Button 
            variant="outline" 
            className="border-2 border-primary text-primary hover:bg-blue-50 font-semibold"
            onClick={onLoginClick}
          >
            Login
          </Button>
          <Button 
            className="btn-contrast shadow-md"
            onClick={onSignupClick}
          >
            Sign Up
          </Button>
        </div>
        <button 
          className="md:hidden text-blue-800"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                    </svg>
                  </div>
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden bg-white absolute w-full z-50 shadow-lg transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {navItems.map((item) => (
            <a 
              key={item.href}
              href={item.href} 
              className="text-contrast-high hover:text-primary transition-colors duration-300 py-2 text-lg font-medium"
              onClick={handleNavLinkClick}
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-col space-y-3 pt-3 border-t-2 border-neutral-100">
            <Button 
              variant="outline" 
              className="w-full border-2 border-primary text-primary hover:bg-blue-50 py-6 font-semibold text-lg"
              onClick={() => {
                onLoginClick();
                setIsMobileMenuOpen(false);
              }}
            >
              Login
            </Button>
            <Button 
              className="w-full btn-contrast py-6 text-lg font-semibold"
              onClick={() => {
                onSignupClick();
                setIsMobileMenuOpen(false);
              }}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
