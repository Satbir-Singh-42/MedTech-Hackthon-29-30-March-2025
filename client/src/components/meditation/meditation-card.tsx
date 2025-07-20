import { useState } from "react";
import { Meditation } from "@/types";
import { 
  PlayCircle, Heart, Clock, 
  Sparkles, User, Music, Headphones, Bookmark
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MeditationCardProps {
  meditation: Meditation;
  onSelect: () => void;
}

export default function MeditationCard({ meditation, onSelect }: MeditationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Randomly assign one positive user review count between 120-450
  const userCount = Math.floor(Math.random() * 330) + 120;
  
  // Generate some tags based on the category and duration
  const getTags = () => {
    const tags = [];
    
    // Add category-based tag
    if (meditation.category === "anxiety") {
      tags.push("Stress Relief");
    } else if (meditation.category === "focus") {
      tags.push("Concentration");
    } else if (meditation.category === "sleep") {
      tags.push("Sleep Aid");
    } else {
      tags.push("Mindfulness");
    }
    
    // Add duration-based tag
    const minutes = parseInt(meditation.duration.split(" ")[0]);
    if (minutes <= 5) {
      tags.push("Quick");
    } else if (minutes <= 10) {
      tags.push("Short");
    } else {
      tags.push("Immersive");
    }
    
    // Add one more random tag
    const randomTags = ["Beginner", "Popular", "Music", "Voice", "Guided", "Staff Pick"];
    tags.push(randomTags[Math.floor(Math.random() * randomTags.length)]);
    
    return tags;
  };
  
  const tags = getTags();
  
  // Toggle favorite status
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  return (
    <div 
      className="relative bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border border-indigo-50 transform hover:-translate-y-1" 
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Main image with overlay */}
        <img 
          src={meditation.imageUrl} 
          alt={meditation.title} 
          className="w-full h-48 object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 via-indigo-900/40 to-indigo-900/20 flex items-end">
          <div className="p-4 text-white">
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white/90"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="font-display font-bold text-xl text-white">{meditation.title}</h3>
            <div className="flex items-center mt-1">
              <Clock className="h-3 w-3 text-white/70 mr-1" />
              <p className="text-sm text-white/90 font-medium">{meditation.duration}</p>
            </div>
          </div>
        </div>
        
        {/* Play button with animation */}
        <div 
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            ${isHovered ? 'opacity-100 scale-110' : 'opacity-80 scale-100'} 
            transition-all duration-300`}
        >
          <div className="relative">
            <div className={`absolute inset-0 bg-white/30 rounded-full animate-ping ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className="relative bg-white/90 backdrop-blur-sm text-indigo-600 rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
              <PlayCircle className="h-8 w-8" />
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <button 
          className={`absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2
            hover:bg-white/50 transition-all duration-300
            ${isFavorite ? 'text-red-500' : 'text-white'}`}
          onClick={handleFavoriteClick}
          aria-label="Toggle favorite"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        
        {/* User count badge */}
        <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
          <User className="h-3 w-3 mr-1" />
          {userCount}
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-5">
        <p className="text-neutral-700 text-sm mb-4 line-clamp-2 leading-relaxed">{meditation.description}</p>
        
        <div className="flex items-center justify-between">
          {/* Instructor with avatar */}
          <div className="flex items-center">
            {meditation.instructor.imageUrl ? (
              <img 
                src={meditation.instructor.imageUrl} 
                alt={meditation.instructor.name}
                className="w-7 h-7 rounded-full object-cover border border-indigo-100"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                <User className="h-3 w-3 text-indigo-600" />
              </div>
            )}
            <div className="ml-2">
              <p className="text-xs font-medium text-neutral-900">{meditation.instructor.name}</p>
              <p className="text-xs text-neutral-500">Instructor</p>
            </div>
          </div>
          
          {/* Audio quality indicator */}
          <div className="flex items-center bg-indigo-50 px-2 py-1 rounded-full">
            <Music className="h-3 w-3 text-indigo-500 mr-1" />
            <span className="text-xs text-indigo-700">HD Audio</span>
          </div>
        </div>
      </div>
      
      {/* Interactive elements - shown on hover */}
      <div 
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-indigo-100/90 to-transparent py-3 px-4 flex justify-center
          transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex space-x-3">
          <button className="bg-white rounded-full p-2 shadow-sm hover:shadow text-indigo-600">
            <Headphones className="h-4 w-4" />
          </button>
          <button 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full px-4 py-2 shadow-md hover:shadow-lg flex items-center font-medium text-sm"
            onClick={onSelect}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Play Now
          </button>
          <button className="bg-white rounded-full p-2 shadow-sm hover:shadow text-indigo-600">
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
