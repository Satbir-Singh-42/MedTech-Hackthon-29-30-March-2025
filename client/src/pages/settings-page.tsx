import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Sidebar from "@/components/layout/sidebar";
import SOSModal from "@/components/modals/sos-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  bio: z.string().max(500, {
    message: "Bio must not be longer than 500 characters.",
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Default values for the form
  const defaultValues: Partial<ProfileFormValues> = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    bio: "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar onSOSClick={() => setIsSOSModalOpen(true)} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-neutral-800 mb-2">Account Settings</h1>
          <p className="text-neutral-600">Manage your profile, privacy, and application preferences.</p>
        </div>

        {/* Settings Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-neutral-100">
              <TabsList className="bg-transparent border-b-0 h-auto">
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 data-[state=active]:shadow-none px-6 py-3 rounded-none border-b-2 border-transparent"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 data-[state=active]:shadow-none px-6 py-3 rounded-none border-b-2 border-transparent"
                >
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="privacy" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 data-[state=active]:shadow-none px-6 py-3 rounded-none border-b-2 border-transparent"
                >
                  Privacy
                </TabsTrigger>
                <TabsTrigger 
                  value="emergency" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 data-[state=active]:shadow-none px-6 py-3 rounded-none border-b-2 border-transparent"
                >
                  Emergency Contacts
                </TabsTrigger>
                <TabsTrigger 
                  value="subscription" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 data-[state=active]:shadow-none px-6 py-3 rounded-none border-b-2 border-transparent"
                >
                  Subscription
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="p-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                  <h2 className="font-display font-semibold text-lg text-neutral-800 mb-2">Your Profile</h2>
                  <p className="text-neutral-600 text-sm">Update your personal information and how others see you on the platform.</p>
                </div>
                <div className="md:w-2/3">
                  <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-start">
                    <div className="relative mb-4 sm:mb-0 sm:mr-6">
                      <div className="w-24 h-24 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                        <span className="text-2xl text-neutral-600">
                          {user?.firstName?.charAt(0) || ""}
                          {user?.lastName?.charAt(0) || ""}
                        </span>
                      </div>
                      <button className="absolute bottom-0 right-0 bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-primary-600 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-display font-semibold text-neutral-800 mb-1">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-neutral-600 text-sm mb-3">Free Plan</p>
                      <Button variant="outline" className="bg-primary-50 text-primary-600 border-primary-100 hover:bg-primary-100">
                        Upgrade to Premium
                      </Button>
                    </div>
                  </div>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About Me</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us a bit about yourself..." 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              This will be displayed on your profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        <Button type="button" variant="outline" className="mr-3">
                          Cancel
                        </Button>
                        <Button type="submit">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="p-6">
                <h2 className="font-display font-semibold text-lg text-neutral-800 mb-4">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-neutral-800">Daily Mood Reminders</h3>
                      <p className="text-sm text-neutral-600">Receive a daily reminder to log your mood</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-neutral-800">Meditation Recommendations</h3>
                      <p className="text-sm text-neutral-600">Suggestions based on your mood patterns</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-neutral-800">Weekly Progress Reports</h3>
                      <p className="text-sm text-neutral-600">Receive insights about your weekly mood trends</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-neutral-800">Professional Recommendations</h3>
                      <p className="text-sm text-neutral-600">Updates about new therapists in your area</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy">
              <div className="p-6">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                    <h2 className="font-display font-semibold text-lg text-neutral-800 mb-2">Data & Privacy</h2>
                    <p className="text-neutral-600 text-sm">Manage your data and control how it's used.</p>
                  </div>
                  <div className="md:w-2/3">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-neutral-800 mb-1">Download Your Data</h3>
                          <p className="text-sm text-neutral-600">Get a copy of all your data stored in our system.</p>
                        </div>
                        <Button variant="outline">
                          Request Data
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-neutral-800 mb-1">Delete Account</h3>
                          <p className="text-sm text-neutral-600">Permanently remove your account and all associated data.</p>
                        </div>
                        <Button variant="destructive">
                          Delete Account
                        </Button>
                      </div>

                      <div className="p-4 border border-primary-100 bg-primary-50 rounded-lg">
                        <div className="flex items-start">
                          <div className="mr-3 text-primary-500 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-primary-700 mb-1">Privacy Protection</h3>
                            <p className="text-sm text-primary-600">Your data is encrypted and securely stored. We never share your personal information with third parties without your explicit consent.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="emergency">
              <div className="p-6">
                <h2 className="font-display font-semibold text-lg text-neutral-800 mb-4">Emergency Contacts</h2>
                
                <div className="bg-neutral-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-neutral-600">Add trusted contacts who can be notified in case of emergency. They will receive an alert with your location if you use the SOS feature.</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  {/* Emergency contact form */}
                  <div className="bg-white border border-neutral-200 rounded-lg p-4">
                    <h3 className="font-medium text-neutral-800 mb-4">Add New Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Contact Name</label>
                        <Input placeholder="Jane Doe" id="contact-name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Relationship</label>
                        <Input placeholder="Friend, Family, etc." id="relationship" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
                        <Input placeholder="+1 (555) 123-4567" id="phone-number" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                        <Input placeholder="contact@example.com" id="contact-email" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => {
                          // In a real implementation, this would save to a database
                          // For now, we'll just show a toast message
                          const name = (document.getElementById('contact-name') as HTMLInputElement)?.value;
                          const relationship = (document.getElementById('relationship') as HTMLInputElement)?.value;
                          const phone = (document.getElementById('phone-number') as HTMLInputElement)?.value;
                          const email = (document.getElementById('contact-email') as HTMLInputElement)?.value;
                          
                          if (!name) {
                            toast({
                              title: "Missing information",
                              description: "Please provide at least a contact name",
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          toast({
                            title: "Contact added",
                            description: `Rs.{name} has been added to your emergency contacts.`,
                          });
                          
                          // Clear the form
                          (document.getElementById('contact-name') as HTMLInputElement).value = '';
                          (document.getElementById('relationship') as HTMLInputElement).value = '';
                          (document.getElementById('phone-number') as HTMLInputElement).value = '';
                          (document.getElementById('contact-email') as HTMLInputElement).value = '';
                        }}
                      >
                        Add Contact
                      </Button>
                    </div>
                  </div>
                  
                  {/* Added contacts list */}
                  <div className="bg-white border border-neutral-200 rounded-lg p-4">
                    <h3 className="font-medium text-neutral-800 mb-4">Current Emergency Contacts</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-neutral-800">Sarah Johnson</h4>
                          <div className="flex text-sm text-neutral-600 gap-x-4">
                            <span>Sister</span>
                            <span>+1 (555) 987-6543</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-neutral-800">Dr. Michael Chen</h4>
                          <div className="flex text-sm text-neutral-600 gap-x-4">
                            <span>Therapist</span>
                            <span>+1 (555) 123-4567</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscription">
              <div className="p-6">
                <h2 className="font-display font-semibold text-lg text-neutral-800 mb-4">Your Subscription</h2>
                
                <div className="bg-primary-50 border border-primary-100 rounded-lg p-6 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="inline-block bg-white px-3 py-1 rounded-full text-xs font-medium text-primary-600 mb-2">
                        Current Plan
                      </div>
                      <h3 className="text-xl font-bold text-primary-700 mb-1">Free Plan</h3>
                      <p className="text-sm text-primary-600">Basic access to mental wellness tools</p>
                    </div>
                    <Button variant="default">
                      Upgrade to Premium
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Free Plan */}
                  <div className="border border-neutral-200 rounded-lg p-6">
                    <div className="bg-neutral-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">Free Plan</h3>
                    <p className="text-sm text-neutral-600 mb-4">Basic access to mental wellness tools</p>
                    <p className="text-xl font-bold text-neutral-800 mb-6">Rs.0<span className="text-sm font-normal text-neutral-500">/month</span></p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Basic AI chat support
                      </li>
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Mood tracking
                      </li>
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        5 meditation sessions/month
                      </li>
                    </ul>
                    <Button className="w-full" variant="outline">
                      Current Plan
                    </Button>
                  </div>
                  
                  {/* Premium Plan */}
                  <div className="border-2 border-primary-400 rounded-lg p-6 relative">
                    <div className="absolute top-0 right-0 bg-primary-400 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-medium">
                      Popular
                    </div>
                    <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">Premium Plan</h3>
                    <p className="text-sm text-neutral-600 mb-4">Full access to all features and content</p>
                    <p className="text-xl font-bold text-neutral-800 mb-6">Rs.99.99<span className="text-sm font-normal text-neutral-500">/month</span></p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Advanced AI chat (unlimited)
                      </li>
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Detailed mood analytics
                      </li>
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Unlimited meditation content
                      </li>
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Priority professional matching
                      </li>
                    </ul>
                    <Button className="w-full">
                      Upgrade Now
                    </Button>
                  </div>
                  
                  {/* Family Plan */}
                  <div className="border border-neutral-200 rounded-lg p-6">
                    <div className="bg-accent-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">Family Plan</h3>
                    <p className="text-sm text-neutral-600 mb-4">Premium benefits for up to 5 people</p>
                    <p className="text-xl font-bold text-neutral-800 mb-6">Rs.24.99<span className="text-sm font-normal text-neutral-500">/month</span></p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        All Premium features for 5 users
                      </li>
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Family activity dashboard
                      </li>
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Shared meditation sessions
                      </li>
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Family wellness insights
                      </li>
                    </ul>
                    <Button className="w-full" variant="outline">
                      Choose Plan
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <SOSModal isOpen={isSOSModalOpen} onClose={() => setIsSOSModalOpen(false)} />
    </div>
  );
}
