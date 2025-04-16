import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Workouts from "./pages/Workouts";
import About from "./pages/About";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import { useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 mt-14">
      {children}
    </main>
  </div>
);

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={
              <ProtectedLayout>
                <Index />
              </ProtectedLayout>
            } />
            <Route path="/workouts" element={
              <ProtectedLayout>
                <Workouts />
              </ProtectedLayout>
            } />
            <Route path="/about" element={
              <ProtectedLayout>
                <About />
              </ProtectedLayout>
            } />
            <Route path="/profile" element={
              <ProtectedLayout>
                <Profile />
              </ProtectedLayout>
            } />
            <Route path="/progress" element={
              <ProtectedLayout>
                <Progress />
              </ProtectedLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
