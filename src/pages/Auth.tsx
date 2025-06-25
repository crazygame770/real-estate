
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, TrendingUp, Map } from "lucide-react";
import { useTheme } from "next-themes";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the theme toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSuccess = () => {
    toast({
      title: isSignUp ? "Account created successfully!" : "Signed in successfully!",
      description: isSignUp 
        ? "You can now sign in with your credentials."
        : "Welcome back to Athens Housing!",
    });
    if (!isSignUp) {
      navigate("/");
    } else {
      setIsSignUp(false);
    }
  };

  const handleError = (error: Error) => {
    console.error('Auth error:', error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute inset-0 bg-pattern opacity-5 dark:opacity-10"></div>
      
      <div className="container max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Updated logo to match the provided image */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mb-10">
              <div className="bg-[#ea384c] rounded-lg p-3 h-16 w-16 flex items-center justify-center shadow-lg shadow-[#ea384c]/20 transform hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-2xl">AH</span>
              </div>
              <div className="flex items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Athens Housing</h1>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Discover Premium Property <span className="text-primary">Investments</span> in Athens
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Make data-driven investment decisions with our comprehensive property analytics platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-transform hover:translate-y-[-4px] hover:shadow-xl">
                <div className="bg-primary/10 rounded-lg p-3 inline-block mb-4">
                  <LineChart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Market Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">Comprehensive data on price trends and neighborhood growth.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-transform hover:translate-y-[-4px] hover:shadow-xl">
                <div className="bg-primary/10 rounded-lg p-3 inline-block mb-4">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">ROI Forecasting</h3>
                <p className="text-gray-600 dark:text-gray-300">Predictive analytics for investment return optimization.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-transform hover:translate-y-[-4px] hover:shadow-xl">
                <div className="bg-primary/10 rounded-lg p-3 inline-block mb-4">
                  <Map className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Location Intelligence</h3>
                <p className="text-gray-600 dark:text-gray-300">Strategic insights on neighborhood development and valuation.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-transform hover:translate-y-[-4px] hover:shadow-xl">
                <div className="bg-primary/10 rounded-lg p-3 inline-block mb-4">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Premium Listings</h3>
                <p className="text-gray-600 dark:text-gray-300">Curated selection of high-value properties with complete analytics.</p>
              </div>
            </div>
          </div>
          
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            <Card className="rounded-xl overflow-hidden shadow-2xl border-gray-100 dark:border-gray-700">
              <div className="h-3 bg-gradient-to-r from-primary to-primary/70"></div>
              <CardHeader className="px-6 py-8 pb-4">
                <CardTitle className="text-2xl font-bold text-center">
                  {isSignUp ? "Create Your Investor Account" : "Welcome Back, Investor"}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-8 pt-2">
                {isSignUp ? (
                  <SignUpForm onSuccess={handleSuccess} onError={handleError} />
                ) : (
                  <SignInForm onSuccess={handleSuccess} onError={handleError} />
                )}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                  >
                    {isSignUp
                      ? "Already have an account? Sign in"
                      : "New investor? Create your account"}
                  </button>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 text-center">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Trusted by real estate investors across Athens and beyond.
              </div>
              <div className="mt-3">
                <div className="inline-block bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md text-sm font-semibold text-primary">
                  200+ Successful Investments
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
