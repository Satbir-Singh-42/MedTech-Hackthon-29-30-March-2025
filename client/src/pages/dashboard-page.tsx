import { useState, useEffect, useRef } from "react";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from "recharts";
import Sidebar from "@/components/layout/sidebar";
import MoodSelector from "@/components/mood-tracker/mood-selector";
import QuickActionCard from "@/components/common/quick-action-card";
import SOSModal from "@/components/modals/sos-modal";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { 
  Loader2, Heart, Smile, Sun, Cloud, MessageCircle, 
  Leaf, Bell, Activity, Sparkles, BarChart3, PieChart,
  Calendar, Clock, ArrowRight, TrendingUp, Moon
} from "lucide-react";
import { MoodEntry, QuickAction } from "@/types";

// Helper function to generate sample data for the charts
const generateSampleData = (moodEntries: MoodEntry[] | undefined) => {
  const today = new Date();
  const last7Days = eachDayOfInterval({
    start: subDays(today, 6),
    end: today
  });
  
  // Map mood values to numbers for charting
  const moodValueMap: Record<string, number> = {
    "great": 5,
    "good": 4,
    "okay": 3,
    "sad": 2,
    "terrible": 1
  };
  
  // Create data for charts with default values
  const chartData = last7Days.map(day => {
    const formattedDate = format(day, "MMM dd");
    
    // If we have real mood entries, use them
    if (moodEntries && moodEntries.length > 0) {
      const matchingEntry = moodEntries.find(entry => {
        const entryDate = new Date(entry.timestamp);
        return format(entryDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
      });
      
      if (matchingEntry) {
        return {
          date: formattedDate,
          value: moodValueMap[matchingEntry.mood] || 3,
          mood: matchingEntry.mood,
          notes: matchingEntry.notes
        };
      }
    }
    
    // Default/placeholder values that follow a natural pattern
    // This gives a visualization even when we don't have data yet
    const dayOfWeek = day.getDay();
    let defaultMood = 3; // "okay" as default
    
    // Weekend uplift pattern (common in mood research)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      defaultMood = 4;
    }
    
    // Slight dip mid-week (Wednesday)
    if (dayOfWeek === 3) {
      defaultMood = 2.5;
    }
    
    return {
      date: formattedDate,
      value: defaultMood,
      mood: "no data",
      notes: ""
    };
  });
  
  return chartData;
};

// Custom chart tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const moodEmoji = {
      "great": "😄",
      "good": "🙂",
      "okay": "😐",
      "sad": "😔",
      "terrible": "😢",
      "no data": "❓"
    };
    
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
        <p className="font-medium text-sm text-neutral-600">{label}</p>
        <p className="font-semibold text-base">
          {data.mood !== "no data" ? `${moodEmoji[data.mood as keyof typeof moodEmoji]} ${data.mood}` : "No data yet"}
        </p>
        {data.notes && (
          <p className="text-xs text-neutral-500 mt-1 max-w-[200px] truncate">
            "{data.notes}"
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [progress, setProgress] = useState(30);
  const [streak, setStreak] = useState(2);
  const [_, navigate] = useLocation();
  
  // Animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => setProgress(67), 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Fetch the user's mood entries
  const { data: moodEntries, isLoading: isLoadingMoodEntries } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries"],
  });

  // Generate chart data based on mood entries
  const chartData = generateSampleData(moodEntries);
  
  // Today's greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  // Quick actions data with improved icons
  const quickActions: QuickAction[] = [
    {
      id: "chat",
      title: "Talk with SereneAI",
      description: "Share what's on your mind",
      icon: "chat",
      bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
      textColor: "text-purple-700",
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      route: "/chat"
    },
    {
      id: "meditate",
      title: "Guided Meditation",
      description: "5-minute breathing exercise",
      icon: "meditation",
      bgColor: "bg-gradient-to-br from-teal-50 to-cyan-50",
      textColor: "text-teal-700",
      iconBgColor: "bg-teal-100",
      iconColor: "text-teal-600",
      route: "/meditate"
    },
    {
      id: "journal",
      title: "Daily Journal",
      description: "Record your thoughts",
      icon: "journal",
      bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50",
      textColor: "text-amber-700",
      iconBgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      route: "/journal"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-50">
      <Sidebar onSOSClick={() => setIsSOSModalOpen(true)} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center mb-2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium mr-3">
                {streak} Day Streak
              </span>
              <span className="text-neutral-500 text-sm">{format(new Date(), "EEEE, MMMM d")}</span>
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700">
              {getGreeting()}, {user?.firstName || "Friend"}!
            </h1>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              onClick={() => navigate("/meditate")}
              variant="outline"
              className="border-2 border-purple-200 text-purple-700 font-medium rounded-lg flex items-center"
            >
              <Leaf className="w-4 h-4 mr-2" />
              Meditate
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Mood Tracker Card */}
          <Card className="lg:col-span-2 shadow-md hover:shadow-lg transition-shadow border-purple-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-display font-bold text-xl text-purple-800">
                    Your Mood Journey
                  </CardTitle>
                  <CardDescription className="text-purple-600">
                    Track how you're feeling over time
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Badge variant="outline" className="bg-white/50 border-purple-200 text-purple-700">
                    <Activity className="w-3 h-3 mr-1" /> Last 7 Days
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLoadingMoodEntries ? (
                <div className="h-64 w-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                      <defs>
                        <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6B7280" 
                        tick={{ fontSize: 12 }} 
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#6B7280" 
                        tick={{ fontSize: 12 }} 
                        tickLine={false}
                        domain={[0, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        tickFormatter={(value) => {
                          const labels = ["", "Terrible", "Sad", "Okay", "Good", "Great"];
                          return labels[value] || "";
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8B5CF6" 
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorMood)" 
                        activeDot={{ r: 6, stroke: '#6D28D9', strokeWidth: 2, fill: '#8B5CF6' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-purple-50 to-indigo-50 border-t border-purple-100 flex justify-center items-center">
              <div className="text-sm text-purple-700">
                <span className="font-medium">Tip:</span> Track your mood daily for the most accurate insights
              </div>
            </CardFooter>
          </Card>
          
          {/* Current Mood Card */}
          <Card className="border-purple-100 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-red-50 border-b border-pink-100 pb-3">
              <CardTitle className="font-display font-bold text-xl text-pink-800 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-600" /> How Are You Today?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <MoodSelector />
              
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-neutral-700 mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1 text-purple-500" /> 
                  Your Wellness Progress
                </h3>
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-xs font-medium text-neutral-600">Weekly Check-in Goal</span>
                  <span className="text-xs font-semibold text-purple-700">67%</span>
                </div>
                <Progress value={progress} className="h-2 bg-neutral-200" />
                <p className="mt-3 text-xs text-neutral-600">
                  You've completed 4 of 6 check-ins this week. Keep going!
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-pink-50 to-red-50 border-t border-pink-100">
              <Button 
                variant="ghost" 
                className="text-pink-700 hover:text-pink-900 hover:bg-pink-100 w-full"
                onClick={() => navigate("/journal")}
              >
                <span className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Add Journal Entry
                </span>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Stats and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stats Card */}
          <Card className="md:col-span-1 border-purple-100 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100 pb-3">
              <CardTitle className="font-display font-bold text-xl text-indigo-800 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" /> Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="font-medium text-indigo-800">Streak</span>
                  </div>
                  <span className="font-semibold text-lg text-indigo-900">{streak} days</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <MessageCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="font-medium text-purple-800">Chat Sessions</span>
                  </div>
                  <span className="font-semibold text-lg text-purple-900">12</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-pink-100 p-2 rounded-full mr-3">
                      <Leaf className="h-5 w-5 text-pink-600" />
                    </div>
                    <span className="font-medium text-pink-800">Meditations</span>
                  </div>
                  <span className="font-semibold text-lg text-pink-900">8</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-teal-100 p-2 rounded-full mr-3">
                      <Moon className="h-5 w-5 text-teal-600" />
                    </div>
                    <span className="font-medium text-teal-800">Sleep Score</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-lg text-teal-900">78</span>
                    <span className="text-teal-600 text-xs ml-1">/ 100</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Personalized Recommendations */}
          <Card className="md:col-span-2 border-purple-100 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display font-bold text-xl text-purple-800 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" /> 
                  Recommended For You
                </CardTitle>
                <Badge variant="outline" className="bg-white/50 border-purple-200 text-purple-700">
                  Personalized
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <QuickActionCard key={action.id} action={action} />
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100">
              <div className="text-sm text-purple-700 w-full text-center">
                <span className="font-medium">Updated daily</span> based on your activities and preferences
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Daily Insights */}
        <Card className="mb-8 border-purple-100 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100 pb-3">
            <CardTitle className="font-display font-bold text-xl text-blue-800 flex items-center">
              <Sun className="w-5 h-5 mr-2 text-amber-500" /> Daily Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoadingMoodEntries ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
              </div>
            ) : moodEntries && moodEntries.length > 0 ? (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <Sun className="h-32 w-32 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Mood Pattern Detected</h3>
                <p className="text-blue-700 mb-4 max-w-xl">
                  Your mood seems to improve on weekends. Consider what weekend activities bring you joy and try to incorporate them into your weekdays when possible.
                </p>
                <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                    Suggested Activities
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-blue-700">
                      <div className="h-2 w-2 rounded-full bg-blue-400 mr-2"></div>
                      Short 5-minute meditation breaks during your workday
                    </li>
                    <li className="flex items-center text-blue-700">
                      <div className="h-2 w-2 rounded-full bg-blue-400 mr-2"></div>
                      Walk outside during lunch to get natural sunlight
                    </li>
                    <li className="flex items-center text-blue-700">
                      <div className="h-2 w-2 rounded-full bg-blue-400 mr-2"></div>
                      Schedule a fun social activity mid-week
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <Cloud className="h-32 w-32 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Start Your Journey</h3>
                <p className="text-blue-700 mb-4">
                  Track your moods daily to receive personalized insights about your emotional patterns and helpful recommendations.
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate("/chat")}
                >
                  Begin Tracking
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <SOSModal isOpen={isSOSModalOpen} onClose={() => setIsSOSModalOpen(false)} />
    </div>
  );
}
