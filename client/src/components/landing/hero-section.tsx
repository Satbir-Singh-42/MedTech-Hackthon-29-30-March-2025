import { Button } from "@/components/ui/button";
import { Zap, Shield, Users, Star } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
  onDemoLogin: () => void;
}

export default function HeroSection({ onGetStarted, onDemoLogin }: HeroSectionProps) {
  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden py-16 lg:py-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" 
             style={{animationDuration: '8s', left: '10%', top: '15%'}}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" 
             style={{animationDuration: '12s', right: '5%', top: '10%'}}></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" 
             style={{animationDuration: '10s', left: '15%', bottom: '5%'}}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <div className="relative mr-2">
                <Zap className="w-4 h-4 text-violet-300" />
                <Star className="w-2 h-2 text-yellow-300 absolute -top-0.5 -right-0.5" />
              </div>
              <span className="text-white font-medium text-sm">
                SereneAI - Professional Mental Wellness
              </span>
            </div>
            
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-6">
              Professional
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Mental Wellness{" "}
              </span>
              Platform
            </h1>
            
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              AI-powered mental health support with mood tracking, meditation, and professional collaboration tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-800 text-white px-8 py-3 font-semibold rounded-full shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                Get Started
                <Star className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                onClick={onDemoLogin}
                variant="outline"
                size="lg"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                title="Username: demo | Password: demo123"
              >
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
