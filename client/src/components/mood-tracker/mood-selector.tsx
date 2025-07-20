import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Mood } from "@/types";

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Sample moods
  const moods: Mood[] = [
    { id: "great", emoji: "😄", label: "Great" },
    { id: "good", emoji: "🙂", label: "Good" },
    { id: "okay", emoji: "😐", label: "Okay" },
    { id: "down", emoji: "😔", label: "Down" },
    { id: "stressed", emoji: "😰", label: "Stressed" },
  ];

  const moodEntryMutation = useMutation({
    mutationFn: async (data: { mood: string; notes?: string }) => {
      const res = await apiRequest("POST", "/api/mood-entries", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
      setSelectedMood(null);
      setNotes("");
      setShowNotes(false);
      toast({
        title: "Mood tracked!",
        description: "Your mood has been recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error tracking mood",
        description: "There was a problem recording your mood. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleMoodSelection = (moodId: string) => {
    setSelectedMood(moodId);
    setShowNotes(true);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      moodEntryMutation.mutate({
        mood: selectedMood,
        notes: notes.trim() !== "" ? notes : undefined,
      });
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelection(mood.id)}
            className={`mood-btn px-4 py-2 rounded-lg border transition-colors duration-300 flex items-center ${
              selectedMood === mood.id
                ? "border-primary-300 bg-primary-50"
                : "border-neutral-200 hover:border-primary-300 hover:bg-primary-50"
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="ml-2">{mood.label}</span>
          </button>
        ))}
      </div>

      {showNotes && (
        <div className="mt-4 space-y-4">
          <Textarea
            placeholder="Add some notes about how you're feeling (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none"
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowNotes(false);
                setSelectedMood(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={moodEntryMutation.isPending}>
              {moodEntryMutation.isPending ? "Saving..." : "Save Mood"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
