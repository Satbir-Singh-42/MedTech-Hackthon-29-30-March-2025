import { MessageCircle, Brain, TrendingUp, Shield, Users, Zap, Check } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      id: "ai-chat",
      icon: MessageCircle,
      title: "AI Chat Support",
      description: "Engage with our empathetic AI companion for CBT-based conversations that adapt to your needs and mood patterns.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      benefits: ["24/7 availability", "Evidence-based responses", "Personalized conversations"]
    },
    {
      id: "meditation",
      icon: Brain,
      title: "Personalized Meditation",
      description: "Access guided meditations and mindfulness exercises tailored to your current emotional state and goals.",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      benefits: ["Custom sessions", "Progress tracking", "Expert guidance"]
    },
    {
      id: "mood-tracking",
      icon: TrendingUp,
      title: "Smart Mood Analytics",
      description: "Track your emotional patterns over time with intelligent insights and visual analytics that help you understand yourself better.",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      benefits: ["Pattern recognition", "Trend analysis", "Actionable insights"]
    },
    {
      id: "privacy",
      icon: Shield,
      title: "Complete Privacy",
      description: "Your mental health data remains completely private with end-to-end encryption and zero data sharing.",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      benefits: ["End-to-end encryption", "No data selling", "Full control"]
    },
    {
      id: "professional",
      icon: Users,
      title: "Professional Network",
      description: "Connect with licensed mental health professionals when you need additional support and guidance.",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      benefits: ["Licensed therapists", "Easy scheduling", "Seamless integration"]
    },
    {
      id: "emergency",
      icon: Zap,
      title: "Crisis Support",
      description: "Immediate access to emergency resources and crisis intervention tools when you need help most.",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      benefits: ["Instant access", "Crisis hotlines", "Emergency contacts"]
    }
  ];

  return (
    <section id="features" className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center bg-purple-100 text-purple-800 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Powerful Features
          </div>
          <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight">
            Everything You Need for
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}Mental Wellness
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed">
            Our comprehensive platform combines cutting-edge AI technology with evidence-based mental health practices, 
            giving you the tools and support you need to thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={feature.id}
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits list */}
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-500">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Decorative gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">Ready to start your mental wellness journey?</p>
          <div className="inline-flex items-center space-x-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white"></div>
              ))}
            </div>
            <span className="text-sm text-gray-500">Join thousands of users improving their mental health</span>
          </div>
        </div>
      </div>
    </section>
  );
}
