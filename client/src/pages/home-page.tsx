import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/landing/navbar";
import HeroSection from "@/components/landing/hero-section";
import FeaturesSection from "@/components/landing/features-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import CTASection from "@/components/landing/cta-section";
import Footer from "@/components/landing/footer";
import LoginModal from "@/components/modals/login-modal";
import SignupModal from "@/components/modals/signup-modal-new";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function HomePage() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  // Demo login functionality
  const demoLoginMutation = useMutation({
    mutationFn: () => apiRequest("/api/auth/login", "POST", {
      username: "demo",
      password: "demo123"
    }),
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const handleDemoLogin = () => {
    demoLoginMutation.mutate();
  };

  const handleGetStarted = () => {
    setIsSignupModalOpen(true);
  };

  // If the user is already logged in, redirect to dashboard
  if (user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Navbar 
        onLoginClick={() => setIsLoginModalOpen(true)}
        onSignupClick={() => setIsSignupModalOpen(true)}
      />
      
      <main className="pt-16">
        <HeroSection onGetStarted={handleGetStarted} onDemoLogin={handleDemoLogin} />
        <section className="py-12">
          <FeaturesSection />
        </section>
        <CTASection onGetStarted={handleGetStarted} />
      </main>
      
      <Footer />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSignupClick={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
      
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)}
        onLoginClick={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </div>
  );
}
