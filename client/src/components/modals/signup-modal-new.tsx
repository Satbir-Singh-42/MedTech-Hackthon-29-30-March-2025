import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, EyeOff, Zap, ArrowRight, Check, Star } from "lucide-react";
import { insertUserSchema } from "@shared/schema";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const signupSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupModal({ isOpen, onClose, onLoginClick }: SignupModalProps) {
  const { registerMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
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

  const onSubmit = (data: SignupFormValues) => {
    // Remove confirmPassword and terms as they're not part of the schema
    const { confirmPassword, terms, ...userData } = data;
    
    registerMutation.mutate(userData, {
      onSuccess: () => {
        onClose();
        form.reset();
      },
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSwitchToLogin = () => {
    onClose();
    onLoginClick();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-md sm:max-w-lg border-0 p-0 bg-transparent max-h-[90vh] overflow-hidden mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 p-3 sm:p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full mb-2 sm:mb-3">
              <div className="relative">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <Star className="w-2 h-2 text-yellow-300 absolute -top-0.5 -right-0.5" />
              </div>
            </div>
            <DialogTitle className="text-lg sm:text-xl font-bold text-white mb-1">
              Join SereneAI
            </DialogTitle>
            <DialogDescription className="text-pink-100 text-xs sm:text-sm">
              Begin your wellness journey
            </DialogDescription>
          </div>

          {/* Form content */}
          <div className="p-3 sm:p-4 max-h-[70vh] overflow-y-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-xs">First Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Jane" 
                            className="h-8 border border-gray-200 focus:border-purple-500 rounded-md text-sm"
                            {...field} 
                          />
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
                        <FormLabel className="text-gray-700 font-medium text-xs">Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Doe" 
                            className="h-8 border border-gray-200 focus:border-purple-500 rounded-md text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-xs">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Choose username" 
                          className="h-8 border border-gray-200 focus:border-purple-500 rounded-md text-sm"
                          {...field} 
                        />
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
                      <FormLabel className="text-gray-700 font-medium text-xs">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your@email.com" 
                          className="h-8 border border-gray-200 focus:border-purple-500 rounded-md text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-xs">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Password"
                              className="h-8 border border-gray-200 focus:border-purple-500 rounded-md text-sm pr-8"
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 rounded-md"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-xs">Confirm</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              placeholder="Confirm"
                              className="h-8 border border-gray-200 focus:border-purple-500 rounded-md text-sm pr-8"
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 rounded-md"
                              onClick={toggleConfirmPasswordVisibility}
                            >
                              {showConfirmPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md border border-gray-200 p-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 scale-75"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-gray-700 text-xs">
                          I agree to the{" "}
                          <a href="#" className="text-purple-600 hover:text-purple-700 font-medium underline">
                            Terms
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-purple-600 hover:text-purple-700 font-medium underline">
                            Privacy Policy
                          </a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={registerMutation.isPending}
                  className="w-full h-9 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium rounded-md text-sm transition-all duration-200 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      <span className="text-xs">Creating...</span>
                    </>
                  ) : (
                    <span className="text-xs">Create Account</span>
                  )}
                </Button>
              </form>
            </Form>

            {/* Footer */}
            <div className="mt-3 text-center">
              <p className="text-gray-600 text-xs">
                Have an account?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs text-purple-600 hover:text-purple-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 rounded-md"
                  onClick={handleSwitchToLogin}
                >
                  Sign in
                </Button>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}