import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import SOSModal from "@/components/modals/sos-modal";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Trash2, UserPlus, Shield, Bell, CreditCard, Users } from "lucide-react";

// -- Schemas ---------------------------------------------------------------

const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});

type ContactFormValues = z.infer<typeof contactSchema>;

// -- Component -------------------------------------------------------------

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // -- Profile form --------------------------------------------------------

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: (user as any)?.phone || "",
      bio: (user as any)?.bio || "",
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await apiRequest("PATCH", "/api/profile", data);
      return res.json();
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["/api/user"], updated);
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    },
  });

  // -- Emergency contacts --------------------------------------------------

  const { data: contacts = [], isLoading: contactsLoading } = useQuery<any[]>({
    queryKey: ["/api/emergency-contacts"],
  });

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", relationship: "", phone: "", email: "" },
  });

  const addContactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const res = await apiRequest("POST", "/api/emergency-contacts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-contacts"] });
      contactForm.reset();
      toast({ title: "Contact added", description: "Emergency contact saved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add contact.", variant: "destructive" });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/emergency-contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-contacts"] });
      toast({ title: "Contact removed" });
    },
  });

  // -- Tab styling ---------------------------------------------------------

  const tabClass =
    "data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 data-[state=active]:shadow-none px-4 py-3 rounded-none border-b-2 border-transparent text-sm";

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar onSOSClick={() => setIsSOSModalOpen(true)} />

      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="font-bold text-2xl text-neutral-800 mb-1">Account Settings</h1>
          <p className="text-neutral-600 text-sm">
            Manage your profile, contacts &amp; preferences.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-neutral-100 overflow-x-auto">
              <TabsList className="bg-transparent border-b-0 h-auto">
                <TabsTrigger value="profile" className={tabClass}>
                  <Shield className="h-4 w-4 mr-1.5" /> Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className={tabClass}>
                  <Bell className="h-4 w-4 mr-1.5" /> Notifications
                </TabsTrigger>
                <TabsTrigger value="emergency" className={tabClass}>
                  <Users className="h-4 w-4 mr-1.5" /> Emergency
                </TabsTrigger>
                <TabsTrigger value="subscription" className={tabClass}>
                  <CreditCard className="h-4 w-4 mr-1.5" /> Plan
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Profile Tab */}
            <TabsContent value="profile" className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <h2 className="font-semibold text-lg text-neutral-800 mb-2">Your Profile</h2>
                  <p className="text-neutral-600 text-sm">
                    Update personal info visible on your account.
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-700">
                      {user?.firstName?.charAt(0) || ""}
                      {user?.lastName?.charAt(0) || ""}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 capitalize">
                        {(user as any)?.accountType || "free"} plan
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit((data) => profileMutation.mutate(data))}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl><Input type="email" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About Me</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="A short bio..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>Max 500 characters.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => profileForm.reset()}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={profileMutation.isPending}>
                          {profileMutation.isPending && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="p-6">
              <h2 className="font-semibold text-lg text-neutral-800 mb-4">Notification Preferences</h2>
              <div className="space-y-5 max-w-lg">
                {[
                  { title: "Daily Mood Reminders", desc: "Receive a daily reminder to log your mood", defaultOn: true },
                  { title: "Meditation Recommendations", desc: "Suggestions based on your mood patterns", defaultOn: true },
                  { title: "Weekly Progress Reports", desc: "Insights about your weekly mood trends", defaultOn: true },
                  { title: "Professional Recommendations", desc: "Updates about new therapists", defaultOn: false },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-neutral-800">{item.title}</h3>
                      <p className="text-sm text-neutral-500">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Emergency Contacts Tab */}
            <TabsContent value="emergency" className="p-6">
              <h2 className="font-semibold text-lg text-neutral-800 mb-2">Emergency Contacts</h2>
              <p className="text-sm text-neutral-500 mb-6">
                People who can be reached if you use the SOS feature.
              </p>

              <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-neutral-800 mb-3 flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Add Contact
                </h3>
                <form
                  onSubmit={contactForm.handleSubmit((data) => addContactMutation.mutate(data))}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <Input placeholder="Name *" {...contactForm.register("name")} />
                  <Input placeholder="Relationship" {...contactForm.register("relationship")} />
                  <Input placeholder="Phone" {...contactForm.register("phone")} />
                  <Input placeholder="Email" type="email" {...contactForm.register("email")} />
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" size="sm" disabled={addContactMutation.isPending}>
                      {addContactMutation.isPending && (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      )}
                      Add
                    </Button>
                  </div>
                </form>
              </div>

              {contactsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                </div>
              ) : contacts.length === 0 ? (
                <p className="text-center text-neutral-400 py-8">No emergency contacts yet.</p>
              ) : (
                <div className="space-y-3">
                  {contacts.map((c: any) => (
                    <div
                      key={c.id}
                      className="flex justify-between items-center p-3 bg-white border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-neutral-800">{c.name}</h4>
                        <div className="flex gap-4 text-sm text-neutral-500">
                          {c.relationship && <span>{c.relationship}</span>}
                          {c.phone && <span>{c.phone}</span>}
                          {c.email && <span>{c.email}</span>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteContactMutation.mutate(c.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="p-6">
              <h2 className="font-semibold text-lg text-neutral-800 mb-4">Your Plan</h2>

              <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="inline-block bg-white px-3 py-1 rounded-full text-xs font-medium text-purple-600 mb-2">
                    Current
                  </span>
                  <h3 className="text-xl font-bold text-purple-700 mb-1 capitalize">
                    {(user as any)?.accountType || "free"} Plan
                  </h3>
                  <p className="text-sm text-purple-600">Basic access to mental wellness tools</p>
                </div>
                <Button>Upgrade to Premium</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Free",
                    price: "\u20B90",
                    features: ["Basic AI chat support", "Mood tracking", "5 meditation sessions/month"],
                    current: true,
                  },
                  {
                    name: "Premium",
                    price: "\u20B999.99",
                    features: [
                      "Unlimited AI chat",
                      "Detailed mood analytics",
                      "Unlimited meditation",
                      "Priority professional matching",
                    ],
                    popular: true,
                  },
                  {
                    name: "Family",
                    price: "\u20B9249.99",
                    features: [
                      "All Premium for 5 users",
                      "Family activity dashboard",
                      "Shared meditation sessions",
                      "Family wellness insights",
                    ],
                  },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`border rounded-lg p-6 relative ${
                      plan.popular ? "border-2 border-purple-400" : "border-neutral-200"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-medium">
                        Popular
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-neutral-800 mb-1">{plan.name}</h3>
                    <p className="text-xl font-bold text-neutral-800 mb-4">
                      {plan.price}
                      <span className="text-sm font-normal text-neutral-500">/month</span>
                    </p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center text-sm">
                          <svg
                            className="h-4 w-4 text-green-500 mr-2 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.current ? "outline" : "default"}>
                      {plan.current ? "Current Plan" : "Choose Plan"}
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <SOSModal isOpen={isSOSModalOpen} onClose={() => setIsSOSModalOpen(false)} />
    </div>
  );
}
