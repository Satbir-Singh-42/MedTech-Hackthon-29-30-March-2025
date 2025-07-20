import { Button } from "@/components/ui/button";
import { Professional } from "@/types";
import { Calendar, User } from "lucide-react";

interface ProfessionalCardProps {
  professional: Professional;
}

export default function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1;
          
          // Full star
          if (starValue <= Math.floor(rating)) {
            return (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          }
          
          // Half star
          else if (starValue - 0.5 <= rating) {
            return (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-400" viewBox="0 0 20 20">
                <defs>
                  <linearGradient id={`halfstar-${i}`}>
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="none" />
                  </linearGradient>
                </defs>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="currentColor" fillOpacity="0.4" />
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipPath="inset(0 50% 0 0)" fill="currentColor" />
              </svg>
            );
          }
          
          // Empty star
          else {
            return (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start">
          {professional.imageUrl ? (
            <img 
              src={professional.imageUrl} 
              alt={professional.name} 
              className="w-16 h-16 rounded-full object-cover mr-4" 
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
              {professional.name.split(' ')[0][0]}{professional.name.split(' ')[1]?.[0]}
            </div>
          )}
          <div>
            <h3 className="font-display font-semibold text-lg text-neutral-800">{professional.name}</h3>
            <p className="text-neutral-600 text-sm">{professional.title}</p>
            <div className="flex items-center mt-1">
              {renderStars(professional.rating)}
              <span className="text-xs text-neutral-500 ml-1">
                {professional.rating.toFixed(1)} ({professional.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-neutral-600 mb-4">{professional.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {professional.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-primary-50 text-primary-600 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
  {/* Schedule Button */}
  <Button className="flex-1 flex items-center justify-center">
    <Calendar className="mr-2 h-4 w-4" />
    Schedule
  </Button>

  {/* User Button with Email Functionality */}
  <Button
    variant="outline"
    size="icon"
    onClick={() => {
      const email = "example@outlook.com";
      const subject = "Hello from React";
      const body = "I wanted to reach out regarding...";
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }}
  >
    <User className="h-4 w-4" />
  </Button>
</div>
        </div>
      </div>
    </div>
  );
}
