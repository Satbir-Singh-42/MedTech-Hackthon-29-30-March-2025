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
  DialogDescription
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
import { Loader2, Eye, EyeOff, Zap, ArrowRight, Star } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick: () => void;
}

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginModal({ isOpen, onClose, onSignupClick }: LoginModalProps) {
  const { loginMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        onClose();
        form.reset();
      },
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSwitchToSignup = () => {
    onClose();
    onSignupClick();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-sm sm:max-w-md border-0 p-0 bg-transparent max-h-[90vh] overflow-hidden mx-auto">
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
              Welcome Back
            </DialogTitle>
            <DialogDescription className="text-purple-100 text-xs sm:text-sm">
              Continue your wellness journey
            </DialogDescription>
          </div>

          {/* Form content */}
          <div className="p-3 sm:p-4 max-h-[60vh] overflow-y-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-xs sm:text-sm">Username or Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Username or email" 
                          className="h-9 sm:h-10 border border-gray-200 focus:border-purple-500 rounded-md text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-xs sm:text-sm">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password"
                            className="h-9 sm:h-10 border border-gray-200 focus:border-purple-500 rounded-md text-sm pr-9"
                            {...field} 
                          />
                          <button 
                            type="button"
                            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 rounded-md"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={loginMutation.isPending}
                  className="w-full h-9 sm:h-10 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-800 text-white font-medium rounded-md text-sm transition-all duration-200 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      <span className="text-xs sm:text-sm">Logging in...</span>
                    </>
                  ) : (
                    <span className="text-xs sm:text-sm">Login</span>
                  )}
                </Button>
              </form>
            </Form>

            {/* Footer */}
            <div className="mt-3 sm:mt-4 text-center">
              <p className="text-gray-600 text-xs">
                Don't have an account?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs text-violet-600 hover:text-violet-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 rounded-md"
                  onClick={handleSwitchToSignup}
                >
                  Create one
                </Button>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
