import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { JournalEntry, Mood } from "@/types";
import { format } from "date-fns";

const journalFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be less than 100 characters" }),
  content: z
    .string()
    .min(5, { message: "Content must be at least 5 characters long" }),
  mood: z.string().optional(),
  tags: z.string().optional(),
});

type JournalFormValues = z.infer<typeof journalFormSchema>;

// For testing purposes, we'll use mock data
const moods: Mood[] = [
  { id: "happy", emoji: "😊", label: "Happy", color: "#FFD700" },
  { id: "calm", emoji: "😌", label: "Calm", color: "#89CFF0" },
  { id: "sad", emoji: "😢", label: "Sad", color: "#6495ED" },
  { id: "angry", emoji: "😠", label: "Angry", color: "#FF6347" },
  { id: "stressed", emoji: "😰", label: "Stressed", color: "#9370DB" },
  { id: "anxious", emoji: "😨", label: "Anxious", color: "#8A2BE2" },
];

// Mock journal entries
const mockJournalEntries: JournalEntry[] = [
  {
    id: "1",
    title: "First day of therapy",
    content:
      "Today I had my first therapy session. It was a bit scary at first, but I felt much better afterwards. The therapist was very understanding and gave me some good advice.",
    createdAt: new Date("2023-03-15T14:30:00"),
    mood: "calm",
    tags: ["therapy", "new-beginnings"],
  },
  {
    id: "2",
    title: "Morning meditation",
    content:
      "I tried the guided meditation from SereneAI this morning. I felt so peaceful afterwards and was able to focus much better during work meetings.",
    createdAt: new Date("2023-03-17T08:15:00"),
    mood: "happy",
    tags: ["meditation", "morning-routine"],
  },
  {
    id: "3",
    title: "Difficult day at work",
    content:
      "Work was really challenging today. I had a disagreement with my colleague and felt very stressed throughout the day. Going to try some breathing exercises tonight.",
    createdAt: new Date("2023-03-20T18:45:00"),
    mood: "stressed",
    tags: ["work", "stress-management"],
  },
];

export default function JournalPage() {
  const { toast } = useToast();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [activeTab, setActiveTab] = useState("view");

  const form = useForm<JournalFormValues>({
    resolver: zodResolver(journalFormSchema),
    defaultValues: {
      title: "",
      content: "",
      mood: "",
      tags: "",
    },
  });

  const onSubmit = (data: JournalFormValues) => {
    const newEntry: JournalEntry = {
      id: uuidv4(),
      title: data.title,
      content: data.content,
      createdAt: new Date(),
      mood: data.mood,
      tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
    };

    setJournalEntries([newEntry, ...journalEntries]);
    form.reset();
    setActiveTab("view");

    toast({
      title: "Journal entry created",
      description: "Your journal entry has been saved successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary-600">My Journal</h1>
        <nav className="flex space-x-4">
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'view' ? 'bg-primary-100 text-primary-600' : 'text-neutral-600 hover:bg-neutral-50'}`}
            onClick={() => setActiveTab('view')}
          >
            All Entries
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'create' ? 'bg-primary-100 text-primary-600' : 'text-neutral-600 hover:bg-neutral-50'}`}
            onClick={() => setActiveTab('create')}
          >
            New Entry
          </button>
        </nav>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tabs list hidden since we're using the custom navbar */}
        <TabsList className="hidden">
          <TabsTrigger value="view">View Entries</TabsTrigger>
          <TabsTrigger value="create">New Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journalEntries.map((entry) => (
              <Card key={entry.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{entry.title}</CardTitle>
                    {entry.mood && (
                      <span className="text-2xl" title={moods.find(m => m.id === entry.mood)?.label || ""}>
                        {moods.find(m => m.id === entry.mood)?.emoji}
                      </span>
                    )}
                  </div>
                  <CardDescription>
                    {format(new Date(entry.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700 line-clamp-3">{entry.content}</p>
                </CardContent>
                <CardFooter className="pt-2 flex flex-wrap gap-2">
                  {entry.tags && entry.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="bg-primary-50 text-primary-600 text-xs px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </CardFooter>
              </Card>
            ))}
          </div>

          {journalEntries.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-neutral-600 mb-2">No journal entries yet</h3>
              <p className="text-neutral-500 mb-6">Start recording your thoughts and feelings</p>
              <Button onClick={() => setActiveTab("create")}>
                Create Your First Entry
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Journal Entry</CardTitle>
              <CardDescription>
                Record your thoughts, feelings, and experiences for reflection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="What's on your mind today?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your thoughts, feelings, or experiences..."
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="mood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How are you feeling?</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a mood" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {moods.map((mood) => (
                                <SelectItem key={mood.id} value={mood.id}>
                                  <div className="flex items-center">
                                    <span className="mr-2">{mood.emoji}</span>
                                    <span>{mood.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. therapy, meditation, work"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Separate tags with commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Save Journal Entry
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}