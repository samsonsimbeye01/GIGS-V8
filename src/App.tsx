import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { LocationProvider } from "@/contexts/LocationContext";
import PolicyCompliantMainApp from "./components/PolicyCompliantMainApp";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Legal from "./pages/Legal";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <LocationProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<PolicyCompliantMainApp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-primary mb-4">Linka</h1>
                      <p className="text-xl text-muted-foreground mb-4">Google Play Policy Compliant Gig Platform for Africa</p>
                      <p className="text-lg font-semibold text-secondary">Page Not Found</p>
                      <Button 
                        onClick={() => window.location.href = '/'}
                        className="mt-4"
                      >
                        Return to Linka
                      </Button>
                    </div>
                  </div>
                } />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </LocationProvider>
    </ThemeProvider>
  );
};

export default App;