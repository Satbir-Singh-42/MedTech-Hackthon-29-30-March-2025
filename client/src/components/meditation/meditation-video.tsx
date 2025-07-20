import { useState } from "react";
import { Meditation } from "@/types";
import { 
  PlayCircle, PauseCircle, Volume2, VolumeX, Maximize, 
  Sparkles, User, Heart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MeditationVideoProps {
  meditation: Meditation;
}

export default function MeditationVideo({ meditation }: MeditationVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md group bg-black">
      {/* Video with thumbnail overlay when not playing */}
      <div className="relative aspect-video overflow-hidden">
        {meditation.youtubeUrl ? (
          <iframe
            width="100%"
            height="100%"
            src={meditation.youtubeUrl}
            title={meditation.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          ></iframe>
        ) : meditation.videoUrl ? (
          <>
            <img 
              src={meditation.imageUrl} 
              alt={meditation.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
            />
            <video 
              src={meditation.videoUrl}
              poster={meditation.imageUrl}
              className={`absolute inset-0 w-full h-full object-cover ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
              loop
              muted={isMuted}
              playsInline
              autoPlay={isPlaying}
            />
          </>
        ) : (
          <img 
            src={meditation.imageUrl} 
            alt={meditation.title}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex items-end">
          <div className="p-4 text-white">
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 mb-2">
              {meditation.category === "anxiety" ? "Stress Relief" : 
              meditation.category === "focus" ? "Concentration" :
              meditation.category === "sleep" ? "Sleep Aid" : "Mindfulness"}
            </Badge>
            <h3 className="font-display font-bold text-lg text-white">{meditation.title}</h3>
            <div className="flex items-center mt-1">
              <PlayCircle className="h-3 w-3 text-white/70 mr-1" />
              <p className="text-sm text-white/90">{meditation.duration}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video details */}
      <div className="p-4 bg-gradient-to-b from-neutral-800 to-black">
        <div className="flex items-center justify-between">
          {/* Instructor */}
          <div className="flex items-center">
            {meditation.instructor.imageUrl ? (
              <img 
                src={meditation.instructor.imageUrl} 
                alt={meditation.instructor.name}
                className="w-8 h-8 rounded-full object-cover border border-neutral-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="ml-2">
              <p className="text-sm font-medium text-white">{meditation.instructor.name}</p>
              <p className="text-xs text-neutral-400">Meditation Guide</p>
            </div>
          </div>
          
          {/* Session info */}
          <div className="bg-neutral-700/50 px-2 py-1 rounded text-xs text-white flex items-center">
            <Sparkles className="h-3 w-3 mr-1 text-indigo-400" />
            Premium
          </div>
        </div>
      </div>
    </div>
  );
}
