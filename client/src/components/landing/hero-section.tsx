import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Sparkles } from "lucide-react";

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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
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
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center min-h-screen pt-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          <div className="text-center lg:text-left space-y-6 lg:space-y-8">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="w-4 h-4 mr-2 text-pink-300" />
              <span className="text-white font-medium text-sm">
                AI-Powered Mental Wellness
              </span>
            </div>
            
            <div className="space-y-4 lg:space-y-6">
              <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight">
                Your
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}Mental Health{" "}
                </span>
                Journey Starts Here
              </h1>
              
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
                Experience compassionate AI support designed to help you navigate life's challenges with personalized guidance, mindfulness practices, and evidence-based mental health tools.
              </p>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 text-white/80">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                <span className="text-sm font-medium">100% Private & Secure</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-400" />
                <span className="text-sm font-medium">Evidence-Based</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                <span className="text-sm font-medium">Expert Approved</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                Begin Your Journey
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                onClick={onDemoLogin}
                variant="outline"
                size="lg"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
              >
                Try Demo
                <Heart className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            {/* Demo hint */}
            <div className="text-center lg:text-left">
              <p className="text-white/60 text-sm">
                Try our demo account to explore all features instantly
              </p>
            </div>
          </div>
          
          <div className="relative flex justify-center lg:justify-end">
            {/* Main illustration container */}
            <div className="relative w-full max-w-lg">
              {/* Floating cards */}
              <div className="absolute -top-8 -left-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 animate-bounce" style={{animationDuration: '3s'}}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Mood: Great</p>
                    <p className="text-white/70 text-xs">Keep it up!</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Meditation</p>
                    <p className="text-white/70 text-xs">5 min session</p>
                  </div>
                </div>
              </div>

              {/* Central illustration */}
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 animate-pulse"></div>
                    <div className="relative">
                      <svg viewBox="0 0 100 100" className="w-16 h-16">
                        <path d="M50 10 C30 10, 10 30, 10 50 C10 70, 30 90, 50 90 C70 90, 90 70, 90 50 C90 30, 70 10, 50 10 M45 35 L45 45 M55 35 L55 45 M35 55 Q50 70, 65 55" 
                              fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">MindfulAI</h3>
                    <p className="text-white/70">Your personal wellness companion</p>
                  </div>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-xs font-medium border border-purple-400/30">
                      AI Chat
                    </span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-200 rounded-full text-xs font-medium border border-pink-400/30">
                      Mood Tracking
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-medium border border-blue-400/30">
                      Meditation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
