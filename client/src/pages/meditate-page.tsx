import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  Moon, Sun, Brain, Heart, Target, Sparkles, PlayCircle, 
  Clock, Star, Award, Bookmark, PlayIcon, Leaf, Music,
  Waves, Wind, CloudRain, RefreshCw, PlusCircle, Video, Film
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import SOSModal from "@/components/modals/sos-modal";
import MeditationCard from "@/components/meditation/meditation-card";
import MeditationModal from "@/components/meditation/meditation-modal";
import MeditationVideo from "@/components/meditation/meditation-video";
import { Meditation, MeditationCategory } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function MeditatePage() {
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [dailyStreak, setDailyStreak] = useState(2);
  const [breathMode, setBreathMode] = useState(false);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [breathCount, setBreathCount] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Animation for quote fading
  const [fadeIn, setFadeIn] = useState(true);
  
  // Time of day based greeting and recommendation
  const getTimeBasedRecommendation = () => {
    const hour = new Date().getHours();
    if (hour < 10) return "morning";
    if (hour < 17) return "day";
    if (hour < 22) return "evening";
    return "night";
  };
  
  const timeOfDay = getTimeBasedRecommendation();
  
  // Animate the progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(78);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Breathing exercise logic
  useEffect(() => {
    if (breathMode) {
      const breathingCycle = setInterval(() => {
        setBreathPhase(prev => {
          if (prev === "inhale") {
            return "hold";
          } else if (prev === "hold") {
            return "exhale";
          } else {
            setBreathCount(prev => prev + 1);
            return "inhale";
          }
        });
      }, breathPhase === "hold" ? 2000 : 4000);
      
      return () => clearInterval(breathingCycle);
    }
  }, [breathMode, breathPhase]);
  
  // Quotes to rotate
  const mindfulnessQuotes = [
    {
      text: "Breathing in, I calm my body. Breathing out, I smile.",
      author: "Thich Nhat Hanh"
    },
    {
      text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
      author: "Thich Nhat Hanh"
    },
    {
      text: "Your calm mind is the ultimate weapon against your challenges.",
      author: "Bryant McGill"
    },
    {
      text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.",
      author: "Hermann Hesse"
    }
  ];
  
  // Rotate quotes periodically
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setQuoteIndex(prev => (prev + 1) % mindfulnessQuotes.length);
        setFadeIn(true);
      }, 1000);
    }, 12000);
    
    return () => clearInterval(quoteInterval);
  }, []);
  
  // Sample meditation data with more humanized descriptions
  const recommendedMeditations: Meditation[] = [
    {
      id: "1",
      title: "Calm in the Storm",
      duration: "5 minutes",
      imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "When work feels overwhelming, this gentle breathing practice creates a calm center within you. Perfect for quick breaks during a hectic day.",
      instructor: {
        name: "Sarah J.",
        imageUrl: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      category: "anxiety"
    },
    {
      id: "2",
      title: "Morning Light",
      duration: "10 minutes",
      imageUrl: "https://images.unsplash.com/photo-1529693662653-9d480530a697?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Begin your day with intention and clarity. This practice helps you set a positive tone and stay grounded as you face whatever comes your way.",
      instructor: {
        name: "Mark W.",
        imageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      category: "focus"
    },
    {
      id: "3",
      title: "Drifting to Sleep",
      duration: "15 minutes",
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "When your mind is racing at bedtime, this gentle meditation helps release the day's tension and prepares your body and mind for restful sleep.",
      instructor: {
        name: "Amy C.",
        imageUrl: "https://randomuser.me/api/portraits/women/68.jpg"
      },
      category: "sleep"
    }
  ];
  
  // Time-specific recommendation
  const getTimeSpecificContent = () => {
    switch(timeOfDay) {
      case "morning":
        return {
          title: "Morning Light",
          desc: "Start your day with calm intention",
          icon: <Sun className="h-5 w-5" />,
          meditation: recommendedMeditations[1],
          background: "from-amber-50 to-yellow-50 border-amber-100"
        };
      case "day":
        return {
          title: "Midday Reset",
          desc: "Take a break and recenter yourself",
          icon: <Sparkles className="h-5 w-5" />,
          meditation: recommendedMeditations[0],
          background: "from-blue-50 to-indigo-50 border-blue-100"
        };
      case "evening":
        return {
          title: "Evening Unwind",
          desc: "Release the tension of your day",
          icon: <Waves className="h-5 w-5" />,
          meditation: recommendedMeditations[2],
          background: "from-indigo-50 to-purple-50 border-indigo-100"
        };
      case "night":
        return {
          title: "Bedtime Peace",
          desc: "Prepare your mind for deep sleep",
          icon: <Moon className="h-5 w-5" />,
          meditation: recommendedMeditations[2],
          background: "from-purple-50 to-indigo-50 border-purple-100"
        };
    }
  };
  
  const timeContent = getTimeSpecificContent();

  // Categories with more personality
  const categories: MeditationCategory[] = [
    {
      id: "anxiety",
      name: "Anxiety Relief",
      icon: "brain",
      sessionCount: 12,
      bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
      iconColor: "text-purple-600"
    },
    {
      id: "sleep",
      name: "Better Sleep",
      icon: "moon",
      sessionCount: 8,
      bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50",
      iconColor: "text-indigo-600"
    },
    {
      id: "focus",
      name: "Focus & Clarity",
      icon: "bullseye",
      sessionCount: 10,
      bgColor: "bg-gradient-to-br from-blue-50 to-teal-50",
      iconColor: "text-blue-600"
    },
    {
      id: "mindfulness",
      name: "Mindfulness",
      icon: "heart",
      sessionCount: 15,
      bgColor: "bg-gradient-to-br from-teal-50 to-green-50",
      iconColor: "text-teal-600"
    }
  ];

  // Recent sessions with more personal details
  const recentSessions = [
    {
      id: "1",
      title: "Calm in the Storm",
      duration: "5 mins",
      completedAt: "Today, 9:15 AM",
      icon: "leaf",
      iconBg: "bg-gradient-to-br from-purple-100 to-indigo-100",
      iconColor: "text-purple-600",
      impact: "Felt 60% calmer afterward"
    },
    {
      id: "3",
      title: "Drifting to Sleep",
      duration: "15 mins",
      completedAt: "Yesterday, 10:30 PM",
      icon: "moon",
      iconBg: "bg-gradient-to-br from-indigo-100 to-blue-100",
      iconColor: "text-indigo-600",
      impact: "Fell asleep in 5 minutes"
    }
  ];
  
  // Mood options for personalization
  const moodOptions = [
    { emoji: "😌", label: "Calm", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { emoji: "😊", label: "Happy", color: "bg-green-100 text-green-700 border-green-200" },
    { emoji: "😔", label: "Sad", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    { emoji: "😓", label: "Stressed", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { emoji: "😴", label: "Tired", color: "bg-purple-100 text-purple-700 border-purple-200" },
    { emoji: "🤔", label: "Anxious", color: "bg-red-100 text-red-700 border-red-200" },
  ];
  
  // Sound nature options
  const natureOptions = [
    { icon: <CloudRain className="h-4 w-4" />, label: "Rain" },
    { icon: <Wind className="h-4 w-4" />, label: "Wind" },
    { icon: <Waves className="h-4 w-4" />, label: "Ocean" },
    { icon: <Music className="h-4 w-4" />, label: "Birds" },
  ];
  
  // Feature meditation videos with videoUrl
  const meditationVideos: Meditation[] = [
    {
      id: "v1",
      title: "Mountain Serenity",
      duration: "8 minutes",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Transport yourself to a peaceful mountain vista with this guided meditation. Feel the cool breeze and hear the distant sounds of nature.",
      instructor: {
        name: "Daniel K.",
        imageUrl: "https://randomuser.me/api/portraits/men/36.jpg"
      },
      category: "mindfulness",
      videoUrl: "https://player.vimeo.com/external/370467553.sd.mp4?s=90cb1bdd5ddb580924f0dde6fa0c88a75a1be67d&profile_id=164" // Sample video URL
    },
    {
      id: "v2",
      title: "Ocean Waves Mindfulness",
      duration: "12 minutes",
      imageUrl: "https://images.unsplash.com/photo-1494791368093-85217fbbf8de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Let the rhythm of gentle ocean waves guide your breathing and calm your mind. Perfect for stress relief and anxiety reduction.",
      instructor: {
        name: "Emma L.",
        imageUrl: "https://randomuser.me/api/portraits/women/22.jpg"
      },
      category: "anxiety",
      videoUrl: "https://player.vimeo.com/external/308161550.sd.mp4?s=c62d3da536a943e14c54469242556de499b5e2c8&profile_id=164" // Sample video URL
    },
    {
      id: "v3",
      title: "Evening Calm Down",
      duration: "15 minutes",
      imageUrl: "https://images.unsplash.com/photo-1505322022379-7c3353ee6291?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "End your day with this gentle meditation designed to release tension and prepare your mind and body for restful sleep.",
      instructor: {
        name: "Michael R.",
        imageUrl: "https://randomuser.me/api/portraits/men/59.jpg"
      },
      category: "sleep",
      videoUrl: "https://player.vimeo.com/external/368320203.sd.mp4?s=38d79f446abc64d8b8d0d3b3b34c73fb53c23b2d&profile_id=164" // Sample video URL
    }
  ];

  // Render icon based on name
  const renderCategoryIcon = (iconName: string) => {
    switch(iconName) {
      case "brain":
        return <Brain className="h-5 w-5" />;
      case "moon":
        return <Moon className="h-5 w-5" />;
      case "bullseye":
        return <Target className="h-5 w-5" />;
      case "heart":
        return <Heart className="h-5 w-5" />;
      case "leaf":
        return <Leaf className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-indigo-50/50 to-white">
      <Sidebar onSOSClick={() => setIsSOSModalOpen(true)} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {/* Page Header with Personal Touch */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-600 border-indigo-200 font-normal">
                {dailyStreak} Day Streak 🔥
              </Badge>
              <h1 className="font-display font-bold text-3xl text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700 mb-2">
                Your Meditation Space
              </h1>
              <p className="text-neutral-600 max-w-xl">
                A few minutes of mindfulness can transform your entire day. What would feel good right now?
              </p>
            </div>
            
            {/* Progress Card */}
            <Card className="bg-white border-indigo-100 shadow-sm p-3 flex items-center gap-4 w-full md:w-auto">
              <div className="rounded-full bg-indigo-100 p-2">
                <Award className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-neutral-700">March Progress</h3>
                <div className="flex items-center justify-between">
                  <Progress value={progress} className="h-2 w-24 md:w-32 bg-neutral-100" />
                  <span className="text-xs text-indigo-600 font-medium">{progress}%</span>
                </div>
                <span className="text-xs text-neutral-500">7 of 9 weekly sessions</span>
              </div>
            </Card>
          </div>
          
          {/* Quick Mood Selector */}
          <div className="mb-8">
            <p className="text-sm text-neutral-600 mb-3">How are you feeling today?</p>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map(mood => (
                <button 
                  key={mood.label}
                  onClick={() => setCurrentMood(mood.label)}
                  className={`
                    px-4 py-2 rounded-full border text-sm font-medium transition-all
                    ${currentMood === mood.label ? mood.color : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'}
                  `}
                >
                  <span className="mr-2">{mood.emoji}</span>
                  {mood.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quick Breath Exercise */}
          {!breathMode ? (
            <Card className="mb-8 p-1 border-indigo-100 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-5">
                    <Wind className="h-40 w-40 text-indigo-600" />
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-indigo-800 mb-3 flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-indigo-600" />
                        Quick Breathing Session
                      </h3>
                      <p className="text-indigo-700 mb-4 max-w-md">
                        Feeling {currentMood?.toLowerCase() || 'stressed'}? Try this 1-minute breathing exercise to quickly recenter yourself.
                      </p>
                      <Button 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        onClick={() => setBreathMode(true)}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Start Breathing
                      </Button>
                    </div>
                    
                    <div className="h-24 w-24 rounded-full bg-indigo-100 border-4 border-white shadow-lg flex items-center justify-center">
                      <Waves className="h-12 w-12 text-indigo-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8 p-1 border-indigo-100 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100 relative overflow-hidden">
                  <div 
                    className={`
                      absolute inset-0 rounded-lg transition-all duration-1000 ease-in-out 
                      ${breathPhase === 'inhale' ? 'bg-indigo-50/70 scale-100' : 
                        breathPhase === 'hold' ? 'bg-indigo-100/70 scale-105' : 
                        'bg-indigo-50/40 scale-95'}
                    `}
                  ></div>
                  
                  <div className="relative flex flex-col items-center justify-center py-8">
                    <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                      {breathPhase === 'inhale' ? 'Breathe In...' : 
                       breathPhase === 'hold' ? 'Hold...' : 
                       'Breathe Out...'}
                    </h3>
                    
                    <div 
                      className={`
                        h-36 w-36 rounded-full flex items-center justify-center
                        transition-all duration-4000 ease-in-out
                        ${breathPhase === 'inhale' ? 'bg-indigo-100 scale-110' : 
                          breathPhase === 'hold' ? 'bg-indigo-200 scale-115' : 
                          'bg-indigo-50 scale-100'}
                      `}
                    >
                      <div 
                        className={`
                          h-24 w-24 rounded-full flex items-center justify-center
                          transition-all duration-4000 ease-in-out
                          ${breathPhase === 'inhale' ? 'bg-indigo-200 scale-110' : 
                            breathPhase === 'hold' ? 'bg-indigo-300 scale-115' : 
                            'bg-indigo-100 scale-100'}
                        `}
                      >
                        <div 
                          className={`
                            text-3xl font-bold text-indigo-700
                            transition-all duration-1000 ease-in-out
                            ${breathPhase === 'inhale' ? 'scale-125' : 
                              breathPhase === 'hold' ? 'scale-130' : 
                              'scale-100'}
                          `}
                        >
                          {breathCount + 1}
                        </div>
                      </div>
                    </div>
                    
                    <p className="mt-6 text-indigo-600">
                      {breathCount}/4 breaths
                    </p>
                    
                    {breathCount >= 4 && (
                      <Button
                        variant="outline"
                        className="mt-4 border-indigo-200 text-indigo-700"
                        onClick={() => {
                          setBreathMode(false);
                          setBreathCount(0);
                          setBreathPhase("inhale");
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Finish
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Inspirational Quote */}
        <div 
          className={`mb-8 text-center p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 shadow-sm transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
        >
          <p className="text-lg text-indigo-700 italic font-serif">"{mindfulnessQuotes[quoteIndex].text}"</p>
          <p className="text-sm text-indigo-500 mt-2">— {mindfulnessQuotes[quoteIndex].author}</p>
        </div>

        {/* Perfect for Right Now Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl text-indigo-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-600" /> 
              Perfect for {timeContent?.title}
            </h2>
            <Badge variant="outline" className={`bg-gradient-to-r ${timeContent?.background}`}>
              {format(new Date(), 'h:mm a')}
            </Badge>
          </div>
          
          <Card className={`bg-gradient-to-r ${timeContent?.background} p-1 border-0 shadow-md overflow-hidden mb-8`}>
            <CardContent className="p-0">
              <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {timeContent?.icon}
                    <h3 className="font-semibold text-lg text-indigo-800">{timeContent?.title}</h3>
                  </div>
                  <p className="text-indigo-700 mb-4">{timeContent?.desc}</p>
                  <Button 
                    className="bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200"
                    onClick={() => setSelectedMeditation(timeContent?.meditation!)}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                </div>
                <div className="rounded-full bg-white p-4 shadow-lg">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center">
                    <PlayIcon className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="font-display font-semibold text-xl text-indigo-800 flex items-center mb-4">
                <Star className="w-5 h-5 mr-2 text-amber-500" /> 
                Just For You
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {recommendedMeditations.slice(0, 2).map((meditation) => (
                  <MeditationCard 
                    key={meditation.id} 
                    meditation={meditation} 
                    onSelect={() => setSelectedMeditation(meditation)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="font-display font-semibold text-xl text-indigo-800 flex items-center mb-4">
                <Target className="w-5 h-5 mr-2 text-indigo-600" /> 
                Focus Collection
              </h2>
              <Card className="border-indigo-100 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center mb-5">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                      <Target className="h-7 w-7 text-indigo-600" />
                    </div>
                    <div className="ml-5">
                      <h3 className="font-semibold text-neutral-800">Deep Work Focus</h3>
                      <p className="text-sm text-neutral-600">3 sessions • 33 minutes total</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { title: "Pre-work Centering", duration: "8 min", completed: true },
                      { title: "Focus Booster", duration: "15 min", completed: false },
                      { title: "Mental Reset", duration: "10 min", completed: false }
                    ].map((session, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-indigo-50 bg-indigo-50/50">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${session.completed ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {session.completed ? <Award className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-800">{session.title}</p>
                            <p className="text-xs text-neutral-500">{session.duration}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-indigo-600 hover:text-indigo-800">
                          {session.completed ? "Replay" : "Start"}
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    Start Collection
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Categories with Better Styling */}
        <div className="mb-10">
          <h2 className="font-display font-semibold text-xl text-indigo-800 flex items-center mb-6">
            <Bookmark className="w-5 h-5 mr-2 text-indigo-600" /> 
            Explore Collections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="border-indigo-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105">
                <CardContent className="p-0">
                  <div className={`${category.bgColor} p-6 text-center`}>
                    <div className={`w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm ${category.iconColor} shadow-sm flex items-center justify-center mx-auto mb-4`}>
                      {renderCategoryIcon(category.icon)}
                    </div>
                    <h3 className="font-semibold text-neutral-800 mb-1">{category.name}</h3>
                    <p className="text-xs text-neutral-600 mb-3">{category.sessionCount} sessions</p>
                    <Button variant="outline" size="sm" className="bg-white/50 border-indigo-200 text-indigo-700 backdrop-blur-sm hover:bg-white">
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Nature Sounds Section */}
        <div className="mb-10">
          <h2 className="font-display font-semibold text-xl text-indigo-800 flex items-center mb-6">
            <Waves className="w-5 h-5 mr-2 text-cyan-600" /> 
            Nature Sounds
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {natureOptions.map((option, index) => (
              <Card key={index} className="border-cyan-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-b from-cyan-50 to-blue-50 p-6 text-center`}>
                    <div className="w-12 h-12 rounded-full bg-white/80 text-cyan-600 shadow-sm flex items-center justify-center mx-auto mb-3">
                      {option.icon}
                    </div>
                    <h3 className="font-semibold text-neutral-800">{option.label}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Sessions with Better UX */}
        <div className="mb-8">
          <h2 className="font-display font-semibold text-xl text-indigo-800 flex items-center mb-6">
            <RefreshCw className="w-5 h-5 mr-2 text-indigo-600" /> 
            Your Recent Practice
          </h2>
          <Card className="border-indigo-100 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              {recentSessions.map((session, index) => (
                <div key={session.id} className={`flex items-center justify-between py-4 ${index !== recentSessions.length - 1 ? 'border-b border-indigo-100' : ''}`}>
                  <div className="flex items-center">
                    <div className={`${session.iconBg} ${session.iconColor} w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow-sm`}>
                      {session.icon === "leaf" ? <Leaf className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-800">{session.title}</div>
                      <div className="text-xs text-neutral-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {session.completedAt}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 mr-4">
                      {session.impact}
                    </Badge>
                    <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200">
                      <PlayIcon className="h-3 w-3 mr-1" />
                      Replay
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="mt-5 flex justify-center">
                <Button variant="outline" className="border-2 border-dashed border-indigo-200 text-indigo-600">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  View Practice History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Video Meditation Section */}
        <div className="mb-10">
          <h2 className="font-display font-semibold text-xl text-indigo-800 flex items-center mb-6">
            <Film className="w-5 h-5 mr-2 text-indigo-600" /> 
            Guided Video Meditations
          </h2>
          <p className="text-neutral-600 mb-6 max-w-4xl">
            Experience our immersive video meditations with visual guidance to deepen your practice.
            These videos help you visualize tranquil scenes while following guided breathing exercises.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {meditationVideos.map((video) => (
              <MeditationVideo key={video.id} meditation={video} />
            ))}
          </div>
        </div>
      </main>

      <SOSModal isOpen={isSOSModalOpen} onClose={() => setIsSOSModalOpen(false)} />
      
      {selectedMeditation && (
        <MeditationModal 
          meditation={selectedMeditation} 
          isOpen={!!selectedMeditation} 
          onClose={() => setSelectedMeditation(null)} 
        />
      )}
      
      {/* Add CSS for animations */}
      <style>{`
        @keyframes breathe-in {
          from { transform: scale(1); opacity: 0.5; }
          to { transform: scale(1.2); opacity: 1; }
        }
        
        @keyframes breathe-out {
          from { transform: scale(1.2); opacity: 1; }
          to { transform: scale(1); opacity: 0.5; }
        }
        
        .animate-breathe-in {
          animation: breathe-in 4s ease-in-out;
        }
        
        .animate-breathe-out {
          animation: breathe-out 4s ease-in-out;
        }
        
        .duration-4000 {
          transition-duration: 4000ms;
        }
      `}</style>
    </div>
  );
}
