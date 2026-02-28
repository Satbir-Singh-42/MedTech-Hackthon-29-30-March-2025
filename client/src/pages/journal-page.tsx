import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mood } from "@/types";
import { format } from "date-fns";
import Sidebar from "@/components/layout/sidebar";
import SOSModal from "@/components/modals/sos-modal";
import { Loader2 } from "lucide-react";

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

// Type for journal entries from the API
interface JournalEntryAPI {
  id: number;
  userId: number;
  title: string;
  content: string;
  mood: string | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string | null;
}

export default function JournalPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("view");
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);

  // Fetch journal entries from the API
  const { data: journalEntries = [], isLoading } = useQuery<JournalEntryAPI[]>({
    queryKey: ["/api/journal"],
  });

  // Create journal entry mutation
  const createEntryMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      mood?: string;
      tags?: string[];
    }) => {
      const res = await apiRequest("POST", "/api/journal", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      form.reset();
      setActiveTab("view");
      toast({
        title: "Journal entry created",
        description: "Your journal entry has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete journal entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/journal/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      toast({
        title: "Entry deleted",
        description: "Your journal entry has been removed.",
      });
    },
  });

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
    createEntryMutation.mutate({
      title: data.title,
      content: data.content,
      mood: data.mood || undefined,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : undefined,
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-50">
      <Sidebar onSOSClick={() => setIsSOSModalOpen(true)} />

      <main className="flex-1 md:ml-64 p-3 md:p-6 lg:p-8 pb-safe mobile-scroll">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-600">
            My Journal
          </h1>
          <nav className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              className={`px-4 py-2 rounded-lg transition-colors touch-manipulation text-responsive-sm ${activeTab === "view" ? "bg-purple-100 text-purple-600" : "text-neutral-600 hover:bg-neutral-50"}`}
              onClick={() => setActiveTab("view")}>
              All Entries
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors touch-manipulation text-responsive-sm ${activeTab === "create" ? "bg-purple-100 text-purple-600" : "text-neutral-600 hover:bg-neutral-50"}`}
              onClick={() => setActiveTab("create")}>
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

          <TabsContent value="view" className="space-y-4 md:space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {journalEntries.map((entry) => (
                  <Card
                    key={entry.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 touch-manipulation">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg md:text-xl leading-tight flex-1 min-w-0">
                          {entry.title}
                        </CardTitle>
                        {entry.mood && (
                          <span
                            className="text-xl md:text-2xl flex-shrink-0"
                            title={
                              moods.find((m) => m.id === entry.mood)?.label ||
                              ""
                            }>
                            {moods.find((m) => m.id === entry.mood)?.emoji}
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-xs md:text-sm">
                        {format(
                          new Date(entry.createdAt),
                          "MMM d, yyyy 'at' h:mm a",
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-neutral-700 line-clamp-3 text-sm md:text-base leading-relaxed">
                        {entry.content}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-2 flex flex-wrap gap-1 md:gap-2 p-4 justify-between">
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        {entry.tags &&
                          entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteEntryMutation.mutate(entry.id)}
                        disabled={deleteEntryMutation.isPending}>
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && journalEntries.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-neutral-600 mb-2">
                  No journal entries yet
                </h3>
                <p className="text-neutral-500 mb-6">
                  Start recording your thoughts and feelings
                </p>
                <Button onClick={() => setActiveTab("create")}>
                  Create Your First Entry
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="create">
            <Card className="touch-manipulation">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  Create a New Journal Entry
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Record your thoughts, feelings, and experiences for
                  reflection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What's on your mind today?"
                              {...field}
                            />
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
                              defaultValue={field.value}>
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

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createEntryMutation.isPending}>
                      {createEntryMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Journal Entry"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <SOSModal
          isOpen={isSOSModalOpen}
          onClose={() => setIsSOSModalOpen(false)}
        />
      </main>
    </div>
  );
}
