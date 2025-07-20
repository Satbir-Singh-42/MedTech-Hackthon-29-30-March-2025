import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface NavbarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export default function Navbar({ onLoginClick, onSignupClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [location] = useLocation();

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'testimonials', 'contact'];
      const navbarHeight = 64;
      const scrollPosition = window.scrollY + navbarHeight + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
      
      // If at the top, clear active section
      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    // Smooth scroll to the target element
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const navbarHeight = 64; // Height of fixed navbar
      const targetPosition = targetElement.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 rounded-lg">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl shadow-md">
              <Heart className="h-6 w-6 text-white fill-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">SereneAI</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                const sectionId = item.href.replace('#', '');
                const isActive = activeSection === sectionId;
                
                return (
                  <a 
                    key={item.href}
                    href={item.href} 
                    className={`transition-colors duration-200 font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 rounded-md px-2 py-1 ${
                      isActive 
                        ? 'text-purple-600 font-semibold' 
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                    onClick={(e) => handleNavLinkClick(e, item.href)}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-medium px-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
              onClick={onLoginClick}
            >
              Login
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-6 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
              onClick={onSignupClick}
            >
              Get Started
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 rounded-md p-1"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            {navItems.map((item) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;
              
              return (
                <a 
                  key={item.href}
                  href={item.href} 
                  className={`block transition-colors duration-200 font-medium text-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 rounded-md px-2 py-1 ${
                    isActive 
                      ? 'text-purple-600 font-semibold' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                  onClick={(e) => handleNavLinkClick(e, item.href)}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 py-3 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                onClick={() => {
                  onLoginClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                Login
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                onClick={() => {
                  onSignupClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}