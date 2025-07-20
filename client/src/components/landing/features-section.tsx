import { MessageCircle, Brain, TrendingUp, Shield, Users, Zap, Check } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      id: "ai-chat",
      icon: MessageCircle,
      title: "AI Chat Support",
      description: "24/7 empathetic AI companion with evidence-based CBT conversations.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      id: "mood-tracking",
      icon: TrendingUp,
      title: "Mood Analytics",
      description: "Track emotional patterns with intelligent insights and visual analytics.",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      id: "meditation",
      icon: Brain,
      title: "Meditation",
      description: "Guided mindfulness exercises tailored to your emotional state.",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      id: "professional",
      icon: Users,
      title: "Professional Network",
      description: "Connect with licensed mental health professionals seamlessly.",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600"
    }
  ];

  return (
    <section id="features" className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">
            Core
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}Features
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Professional mental health tools powered by AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={feature.id}
                className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-200"
              >
                <div className={`${feature.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
