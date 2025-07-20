import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  onGetStarted: () => void;
}

export default function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="py-12 bg-gradient-to-br from-purple-600 to-pink-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center">
          <h2 className="font-bold text-3xl md:text-4xl text-white mb-4 leading-tight">
            Ready to Get Started?
          </h2>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Join professionals using our AI-powered mental health platform.
          </p>
          
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-3 font-semibold rounded-full shadow-lg transition-all duration-300"
          >
            Start Today
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
