import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LogIn, Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await login(formData.email, formData.password);
      
      toast.success("Login successful!", {
        description: "Welcome back to BlogApp",
      });
      
      navigate("/");
    } catch (error) {
      toast.error("Login failed", {
        description: "Please check your credentials and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md">
        {/* Header with enhanced animations */}
        <div className="text-center mb-8 animate-fadeInDown">
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-float shadow-2xl">
              <LogIn className="w-10 h-10 text-white animate-bounce-gentle" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-75 animate-pulse-glow"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-3 animate-scaleIn stagger-1">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg animate-fadeInUp stagger-2">
            Sign in to your BlogApp account
          </p>
        </div>

        {/* Login Form with enhanced animations */}
        <Card className="glass border border-white/20 dark:border-gray-800/50 shadow-2xl hover-lift animate-slideInLeft card-hover">
          <CardHeader className="text-center pb-2 animate-fadeInUp stagger-3">
            <CardTitle className="text-2xl font-semibold gradient-text">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field with enhanced animations */}
              <div className="space-y-2 animate-fadeInUp stagger-4">
                 <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Email Address
                </Label>
                 <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-blue-500 group-focus-within:text-blue-500 transition-all duration-300" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="pl-10 bg-white/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md input-focus"
                    required
                  />
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field with enhanced animations */}
              <div className="space-y-2 animate-fadeInUp stagger-5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-500" />
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-blue-500 group-focus-within:text-blue-500 transition-all duration-300" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-white/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md input-focus"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 hover:scale-110"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Remember Me and Forgot Password with animation */}
              <div className="flex items-center justify-between animate-fadeInUp stagger-6">
                <div className="flex items-center space-x-2 group">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, rememberMe: checked === true }))
                    }
                    className="transition-all duration-300 hover:scale-110"
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                   className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 hover:scale-105 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button with enhanced animation */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-fadeInUp stagger-7 hover:scale-105 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-rotate mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Sign Up Link with animation */}
            <div className="mt-6 text-center animate-fadeInUp stagger-8">
               <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-all duration-300 hover:underline hover:scale-105 inline-block"
                >
                  Sign up here
                </Link>
              </p>
            </div>

           <div className="mt-6 p-4 glass rounded-lg border border-blue-200/50 dark:border-blue-800/50 animate-scaleIn stagger-9 hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 animate-wiggle" />
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Demo Credentials</p>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Email: demo@blogapp.com</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Password: demo123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
