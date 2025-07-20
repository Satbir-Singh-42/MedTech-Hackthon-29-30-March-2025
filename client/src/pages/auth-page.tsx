import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Redirect if user is already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      email: "",
      terms: false,
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Remove confirmPassword and terms as they're not part of the schema
    const { confirmPassword, terms, ...userData } = data;
    
    registerMutation.mutate(userData, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" 
             style={{animationDuration: '8s', left: '10%', top: '15%'}}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" 
             style={{animationDuration: '12s', right: '5%', top: '10%'}}></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" 
             style={{animationDuration: '10s', left: '15%', bottom: '5%'}}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Features showcase */}
            <div className="text-center lg:text-left space-y-8">
              {/* Logo and title */}
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl mb-4">
                  <svg viewBox="0 0 100 100" className="w-12 h-12">
                    <path d="M50 10 C30 10, 10 30, 10 50 C10 70, 30 90, 50 90 C70 90, 90 70, 90 50 C90 30, 70 10, 50 10 M45 35 L45 45 M55 35 L55 45 M35 55 Q50 70, 65 55" 
                          fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Welcome to
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {" "}SereneAI
                  </span>
                </h1>
                <p className="text-xl text-gray-300 max-w-lg mx-auto lg:mx-0">
                  Your compassionate AI companion for mental wellness, mindfulness, and emotional support.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold">24/7 AI Chat Support</h3>
                    <p className="text-gray-400 text-sm">Compassionate conversations whenever you need them</p>
                  </div>
                </div>

                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold">Smart Mood Tracking</h3>
                    <p className="text-gray-400 text-sm">Understand your emotional patterns over time</p>
                  </div>
                </div>

                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold">Guided Meditation</h3>
                    <p className="text-gray-400 text-sm">Personalized mindfulness practices for your journey</p>
                  </div>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-gray-400 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  100% Private & Secure
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Evidence-Based Approach
                </div>
              </div>
            </div>

            {/* Right side - Auth form */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Get Started</h2>
                  <p className="text-gray-300">Choose how you'd like to continue</p>
                </div>
                <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 p-1 rounded-2xl">
                    <TabsTrigger 
                      value="login"
                      className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-300 rounded-xl py-3 font-medium transition-all duration-200"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger 
                      value="register"
                      className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-300 rounded-xl py-3 font-medium transition-all duration-200"
                    >
                      Register
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium">Username</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your username" 
                                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:bg-white/20 rounded-xl"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium">Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Enter your password"
                                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:bg-white/20 rounded-xl"
                                  {...field} 
                                />
                              </FormControl>
                              <div className="mt-2 text-right">
                                <Button variant="link" className="text-sm text-purple-300 hover:text-purple-200 p-0 h-auto" type="button">
                                  Forgot password?
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg" 
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Logging in...
                            </>
                          ) : (
                            "Login to SereneAI"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={registerForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="johndoe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john.doe@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="terms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                                  checked={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I agree to the Terms of Service and Privacy Policy
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="text-gray-300 text-sm">
                    {activeTab === "login" ? (
                      <>
                        Don't have an account?{" "}
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-sm text-purple-300 hover:text-purple-200 font-medium"
                          onClick={() => setActiveTab("register")}
                        >
                          Create one now
                        </Button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-sm text-purple-300 hover:text-purple-200 font-medium"
                          onClick={() => setActiveTab("login")}
                        >
                          Sign in instead
                        </Button>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
