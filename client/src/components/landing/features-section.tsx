export default function FeaturesSection() {
  const features = [
    {
      id: "ai-chat",
      icon: "comments",
      title: "AI Chat Support",
      description: "Engage with our AI companion for CBT-based conversations that adapt to your needs and mood patterns.",
      bgColor: "bg-primary-100",
      iconColor: "text-primary-600"
    },
    {
      id: "meditation",
      icon: "spa",
      title: "Personalized Meditation",
      description: "Access guided meditations and mindfulness exercises tailored to your current emotional state.",
      bgColor: "bg-secondary-100",
      iconColor: "text-secondary-600"
    },
    {
      id: "mood-tracking",
      icon: "chart-line",
      title: "Mood Tracking",
      description: "Track your emotional patterns over time with simple, intuitive mood logging and visual insights.",
      bgColor: "bg-accent-100",
      iconColor: "text-accent-600"
    },
    {
      id: "sos",
      icon: "hand-holding-heart",
      title: "Emergency SOS",
      description: "Quick access to emergency resources and your trusted contacts when you need immediate support.",
      bgColor: "bg-red-100",
      iconColor: "text-red-600"
    },
    {
      id: "privacy",
      icon: "user-shield",
      title: "Privacy-Focused",
      description: "Your data remains secure with end-to-end encryption and user-controlled privacy settings.",
      bgColor: "bg-neutral-200",
      iconColor: "text-neutral-700"
    },
    {
      id: "professional",
      icon: "users",
      title: "Professional Support",
      description: "Connect with licensed mental health professionals when you need additional guidance.",
      bgColor: "bg-primary-100",
      iconColor: "text-primary-600"
    }
  ];

  // Function to render the right icon based on the id
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "comments":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case "spa":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case "chart-line":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        );
      case "hand-holding-heart":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case "user-shield":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case "users":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-neutral-800 mb-4">
            Features Designed for Your Wellbeing
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Our platform combines AI technology with evidence-based mental health practices to support you on your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="bg-neutral-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className={`${feature.bgColor} ${feature.iconColor} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                {renderIcon(feature.icon)}
              </div>
              <h3 className="font-display font-semibold text-xl mb-3">{feature.title}</h3>
              <p className="text-neutral-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
