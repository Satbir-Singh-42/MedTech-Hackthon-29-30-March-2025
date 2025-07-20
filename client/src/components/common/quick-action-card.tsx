import { Link } from "wouter";
import { QuickAction } from "@/types";
import { 
  MessageCircle, Leaf, LineChart, Moon, BookOpen, 
  Heart, Sparkles, Brain, BarChart2, Smile, Music, AlertCircle,
  Calendar, Clock, ArrowRight, TrendingUp, Sun, Coffee, ThumbsUp
} from "lucide-react";

interface QuickActionCardProps {
  action: QuickAction;
}

export default function QuickActionCard({ action }: QuickActionCardProps) {
  // Function to render the specified icon
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case "chat":
        return <MessageCircle className="h-5 w-5" />;
      case "meditation":
        return <Leaf className="h-5 w-5" />;
      case "trends":
        return <LineChart className="h-5 w-5" />;
      case "journal":
        return <BookOpen className="h-5 w-5" />;
      case "sleep":
        return <Moon className="h-5 w-5" />;
      case "mood":
        return <Smile className="h-5 w-5" />;
      case "gratitude":
        return <Heart className="h-5 w-5" />;
      case "mindfulness":
        return <Sparkles className="h-5 w-5" />;
      case "cognitive":
        return <Brain className="h-5 w-5" />;
      case "stats":
        return <BarChart2 className="h-5 w-5" />;
      case "music":
        return <Music className="h-5 w-5" />;
      case "calendar":
        return <Calendar className="h-5 w-5" />;
      case "sos":
        return <AlertCircle className="h-5 w-5" />;
      case "morning":
        return <Sun className="h-5 w-5" />;
      case "habit":
        return <ThumbsUp className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <Link href={action.route}>
      <div 
        className={`${action.bgColor} p-5 rounded-xl border ${action.bgColor.includes('gradient') ? 'border-white/10' : 'border-' + action.textColor.replace('text-', '').replace('-700', '-200')} 
        hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 backdrop-blur-sm`}
      >
        <div className="flex items-center">
          <div className={`${action.iconBgColor} ${action.iconColor} w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-sm`}>
            {renderIcon(action.icon)}
          </div>
          <div>
            <h3 className={`font-bold text-lg ${action.textColor}`}>{action.title}</h3>
            <p className={`text-sm ${action.textColor.replace('-700', '-600')} mt-1`}>{action.description}</p>
          </div>
        </div>
        <div className={`mt-3 flex justify-end ${action.textColor}`}>
          <ArrowRight className="h-4 w-4 opacity-60" />
        </div>
      </div>
    </Link>
  );
}
