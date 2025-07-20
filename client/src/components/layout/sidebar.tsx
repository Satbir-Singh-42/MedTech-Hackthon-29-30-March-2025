import { useState } from "react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from "lucide-react";

interface SidebarProps {
  onSOSClick: () => void;
}

export default function Sidebar({ onSOSClick }: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "columns" },
    { path: "/chat", label: "AI Chat", icon: "comments" },
    { path: "/meditate", label: "Meditate", icon: "spa" },
    { path: "/journal", label: "Journal", icon: "book" },
    { path: "/collaborators", label: "Collaborators", icon: "user-md" },
    { path: "/settings", label: "Settings", icon: "cog" },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside className="bg-white shadow-md w-full md:w-64 md:min-h-screen md:fixed md:top-0 md:left-0 z-40">
      {/* Logo & User */}
      <div className="p-4 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <a className="flex items-center space-x-2">
              <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 p-2.5 rounded-2xl shadow-lg">
                <Brain className="h-5 w-5 text-white" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-2.5 w-2.5 text-pink-300" />
                </div>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">SereneAI</span>
            </a>
          </Link>
          <button 
            className="md:hidden text-neutral-600 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        <div className="mt-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
            <span>
              {user?.firstName?.charAt(0) || ""}
              {user?.lastName?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <p className="font-medium text-neutral-800">
              {user?.firstName} {user?.lastName || "User"}
            </p>
            <p className="text-sm text-neutral-500">Free Plan</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className={cn(
        "md:block transition-all duration-300 ease-in-out",
        isMobileMenuOpen 
          ? "block max-h-screen opacity-100" 
          : "hidden md:block max-h-0 md:max-h-screen opacity-0 md:opacity-100"
      )}>
        <div className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a 
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 touch-manipulation",
                      location === item.path 
                        ? "bg-purple-50 text-purple-600 border-l-4 border-purple-600" 
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-purple-600"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icon === "columns" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}
                      {item.icon === "comments" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
                      {item.icon === "spa" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />}
                      {item.icon === "book" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                      {item.icon === "user-md" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                      {item.icon === "cog" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />}
                      {item.icon === "cog" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
                    </svg>
                    <span className="text-sm font-medium">{item.label}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>

          {/* SOS Button */}
          <div className="mt-8">
            <Button 
              variant="destructive" 
              className="w-full py-3 flex items-center justify-center space-x-2"
              onClick={onSOSClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>SOS Emergency</span>
            </Button>
          </div>

          {/* Logout */}
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <Button 
              variant="ghost" 
              className="w-full py-3 text-neutral-600 flex items-center justify-center space-x-2"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
