import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Room from "./pages/Room";
import AuthPage from "./pages/AuthPage";
import { Loader2 } from "lucide-react";

// Protected Route Wrapper
const ProtectedRoute = ({ component: Component }: { component: any }) => {
  const { token, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!token) {
    setLocation("/auth");
    return null;
  }

  return <Component />;
};

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={() => <ProtectedRoute component={Home} />} />
      <Route path={"/room/:roomId"}>
        {() => <ProtectedRoute component={Room} />}
      </Route>
      <Route path={"/auth"} component={AuthPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
