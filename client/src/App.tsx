import { Switch, Route, useRoute } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import ChatPage from "@/pages/chat-page";
import MeditatePage from "@/pages/meditate-page";
import JournalPage from "@/pages/journal-page";
import CollaboratorsPage from "@/pages/collaborators-page";
import SettingsPage from "@/pages/settings-page";
import { ProtectedRoute } from "./lib/protected-route";

// Component to inject Botpress script for authenticated routes
function BotpressScript() {
  const { user } = useAuth();
  const [isHomePage] = useRoute("/");
  const [isAuthPage] = useRoute("/auth");
  
  useEffect(() => {
    // Only inject the script for authenticated users and not on home/auth pages
    if (user && !isHomePage && !isAuthPage) {
      // Remove any existing scripts to avoid duplicates
      const existingInjectScript = document.getElementById('botpress-inject-script');
      const existingContentScript = document.getElementById('botpress-content-script');
      
      if (existingInjectScript) {
        existingInjectScript.remove();
      }
      
      if (existingContentScript) {
        existingContentScript.remove();
      }
      
      // Create and inject the Botpress scripts
      const injectScript = document.createElement('script');
      injectScript.src = "https://cdn.botpress.cloud/webchat/v2.3/inject.js";
      injectScript.id = "botpress-inject-script";
      document.body.appendChild(injectScript);
      
      const contentScript = document.createElement('script');
      contentScript.src = "https://files.bpcontent.cloud/2025/03/29/10/20250329102306-6BV2I5JN.js";
      contentScript.id = "botpress-content-script";
      document.body.appendChild(contentScript);
      
      // Clean up function to remove scripts on unmount or when user logs out
      return () => {
        if (document.getElementById('botpress-inject-script')) {
          document.getElementById('botpress-inject-script')?.remove();
        }
        if (document.getElementById('botpress-content-script')) {
          document.getElementById('botpress-content-script')?.remove();
        }
      };
    }
  }, [user, isHomePage, isAuthPage]);
  
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/chat" component={ChatPage} />
      <ProtectedRoute path="/meditate" component={MeditatePage} />
      <ProtectedRoute path="/journal" component={JournalPage} />
      <ProtectedRoute path="/collaborators" component={CollaboratorsPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <BotpressScript />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
