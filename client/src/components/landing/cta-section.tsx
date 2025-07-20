import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onGetStarted: () => void;
}

export default function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 max-w-5xl">
        <div className="space-y-8 lg:space-y-12">
          <div className="space-y-6">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              Begin Your Wellness Journey Today
            </h2>
            <p className="text-white/90 max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl leading-relaxed">
              Join thousands who are taking proactive steps toward better mental health with our AI companion. 
              Start your transformation today with personalized support that's available 24/7.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={onGetStarted}
              className="px-10 py-5 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-50 transition-all duration-300 shadow-xl text-lg lg:text-xl transform hover:scale-105 hover:shadow-2xl"
            >
              Get Started Free
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
            
            <div className="flex items-center text-white/80 text-sm lg:text-base">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No credit card required
            </div>
          </div>
          
          {/* Features list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mt-12 lg:mt-16">
            <div className="flex items-center justify-center text-white/90">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <span className="font-medium">24/7 AI Support</span>
            </div>
            <div className="flex items-center justify-center text-white/90">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
              <span className="font-medium">Private & Secure</span>
            </div>
            <div className="flex items-center justify-center text-white/90">
              <div className="w-3 h-3 bg-pink-400 rounded-full mr-3"></div>
              <span className="font-medium">Expert Approved</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
