import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-2xl text-gray-900">MindfulAI</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;
              
              return (
                <a 
                  key={item.href}
                  href={item.href} 
                  className={`transition-colors duration-200 font-medium cursor-pointer ${
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
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-medium px-6"
                onClick={onLoginClick}
              >
                Login
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-6 shadow-md"
                onClick={onSignupClick}
              >
                Get Started
              </Button>
            </div>
          </div>
          <button 
            className="md:hidden text-gray-600"
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
          <div className="px-4 py-6 space-y-6">
            {navItems.map((item) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;
              
              return (
                <a 
                  key={item.href}
                  href={item.href} 
                  className={`block transition-colors duration-200 font-medium text-lg cursor-pointer ${
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
                className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 py-3 font-medium"
                onClick={() => {
                  onLoginClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                Login
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 font-medium"
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
