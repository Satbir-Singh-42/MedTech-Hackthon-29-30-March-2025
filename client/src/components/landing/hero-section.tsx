import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-800 py-16 md:py-24 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" 
             style={{animationDuration: '8s', left: '10%', top: '15%'}}></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300 rounded-full blur-3xl animate-pulse" 
             style={{animationDuration: '12s', right: '5%', top: '10%'}}></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300 rounded-full blur-3xl animate-pulse" 
             style={{animationDuration: '10s', left: '15%', bottom: '5%'}}></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full mb-4 border border-white/20">
              <span className="text-white font-medium text-sm flex items-center">
                <svg className="w-4 h-4 mr-2 text-pink-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your Personal Mental Wellness Journey
              </span>
            </div>
            
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight mb-4 drop-shadow-sm">
              Your Compassionate AI Companion for Mental Well-being
            </h1>
            
            <p className="text-white text-lg mb-8 max-w-lg font-medium leading-relaxed">
              Discover a supportive AI companion that adapts to your needs, helping you navigate life's challenges with personalized guidance, mindfulness practices, and emotional support.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 text-lg font-bold rounded-xl shadow-lg border-2 border-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Your Journey
                </span>
              </Button>
              
              <Button
                onClick={() => scrollToElement('features')}
                variant="outline"
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Learn More
                </span>
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 backdrop-blur-sm bg-white/10 transform transition-all duration-500 hover:scale-105">
              <svg 
                viewBox="0 0 600 400" 
                className="w-full h-auto max-w-md"
              >
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="1" />
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" />
                  </filter>
                </defs>
                
                {/* Background */}
                <rect width="600" height="400" fill="url(#grad1)" rx="30" ry="30" />
                
                {/* Decorative Elements */}
                <circle cx="150" cy="100" r="60" fill="white" fillOpacity="0.1" />
                <circle cx="450" cy="300" r="80" fill="white" fillOpacity="0.1" />
                <path d="M50,200 C100,100 200,50 300,100 C400,150 500,100 550,200 C500,300 400,350 300,300 C200,250 100,300 50,200" 
                  fill="white" fillOpacity="0.05" />
                
                {/* Mindfulness Figure */}
                <g transform="translate(300, 180)" className="animate-pulse" style={{transformOrigin: 'center', animationDuration: '5s'}}>
                  <circle cx="0" cy="0" r="70" fill="white" fillOpacity="0.2" />
                  <path d="M0,-40 C-30,-20 -40,20 -20,60 C0,100 20,80 40,40 C60,0 30,-20 0,-40" 
                    fill="white" fillOpacity="0.9" />
                  <circle cx="-15" cy="-15" r="5" fill="#4F46E5" />
                  <circle cx="15" cy="-15" r="5" fill="#4F46E5" />
                  <path d="M-20,10 C-10,20 10,20 20,10" stroke="#4F46E5" strokeWidth="3" fill="none" />
                </g>
                
                {/* Text with subtle animation */}
                <g className="animate-pulse" style={{animationDuration: '3s'}}>
                  <text x="300" y="320" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="28" fontWeight="bold" letterSpacing="1">
                    SereneAI
                  </text>
                  <text x="300" y="350" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="16" fontWeight="normal" letterSpacing="2">
                    Your path to inner peace
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
