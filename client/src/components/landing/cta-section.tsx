import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onGetStarted: () => void;
}

export default function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="py-16 bg-primary-400">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-6">Begin Your Wellness Journey Today</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
          Join thousands who are taking proactive steps toward better mental health with our AI companion.
        </p>
        <Button
          onClick={onGetStarted}
          className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-neutral-100 transition-colors duration-300 shadow-md text-lg"
        >
          Get Started Free
        </Button>
      </div>
    </section>
  );
}
