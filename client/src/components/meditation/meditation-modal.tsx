import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Meditation } from "@/types";
import { X, Play, Clock, Headphones, Heart } from "lucide-react";

interface MeditationModalProps {
  meditation: Meditation;
  isOpen: boolean;
  onClose: () => void;
}

export default function MeditationModal({ meditation, isOpen, onClose }: MeditationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-black text-white overflow-hidden rounded-xl">
        <div className="absolute top-2 right-2 z-10">
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors duration-300 bg-black/30 rounded-full p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-black">
          <div className="aspect-w-16 aspect-h-9 bg-neutral-900 relative">
            {/* Video Player Placeholder */}
            <img
              src={meditation.imageUrl}
              alt={meditation.title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                <Play className="h-8 w-8 text-white fill-white" />
              </button>
            </div>
          </div>
          
          <div className="p-6 bg-neutral-900">
            <h2 className="font-display font-semibold text-2xl mb-2">{meditation.title}</h2>
            <div className="flex items-center mb-4">
              <p className="text-white/70 mr-4 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {meditation.duration}
              </p>
              <p className="text-white/70 flex items-center">
                <Headphones className="h-4 w-4 mr-1" />
                Guided
              </p>
              <button className="ml-auto text-white/70 hover:text-white transition-colors duration-300">
                <Heart className="h-5 w-5" />
              </button>
            </div>
            <p className="text-white/80 mb-4">{meditation.description}</p>
            <div className="flex items-center">
              {meditation.instructor.imageUrl ? (
                <img 
                  src={meditation.instructor.imageUrl} 
                  alt={meditation.instructor.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-600">
                  {meditation.instructor.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <span className="ml-2 text-white/90">{meditation.instructor.name}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
