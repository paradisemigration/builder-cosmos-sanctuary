import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { EmailService } from "@/lib/emailService";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Globe,
  Sparkles,
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Facebook Icon Component
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// LinkedIn Icon Component
const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function Login() {
  const {
    user,
    login,
    loginWithGoogle,
    loginWithFacebook,
    isAuthenticated,
    isLoading,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      let redirectPath = "/";

      if (user.role === "admin") {
        redirectPath = "/admin";
      } else if (user.role === "business_owner") {
        redirectPath = "/dashboard";
      } else {
        redirectPath = location.state?.from || "/";
      }

      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError("");

    try {
      const success = await login(loginData.email, loginData.password);

      if (success) {
        // Let the useEffect handle the redirect based on user role
      } else {
        setLoginError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      setLoginError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    try {
      console.log("Registration attempt:", registerData);

      const emailSent = await EmailService.sendWelcomeEmail({
        userName: registerData.name,
        userEmail: registerData.email,
        provider: "email",
        isNewUser: true,
      });

      if (emailSent) {
        toast.success(
          `Welcome ${registerData.name}! 🎉 Thank you email sent to ${registerData.email}`,
        );
      } else {
        toast.success("Registration successful!");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      let success = false;
      if (provider === "Google") {
        success = await loginWithGoogle();
      } else if (provider === "Facebook") {
        success = await loginWithFacebook();
      }

      if (success) {
        // Let the useEffect handle the redirect based on user role
      } else {
        toast.error(`Failed to login with ${provider}. Please try again.`);
      }
    } catch (error) {
      toast.error(`Error logging in with ${provider}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-orange-100 relative overflow-hidden">
      {/* Enhanced Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-xl shadow-2xl border-b border-orange-100/50">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-purple-500/5 to-orange-600/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-18">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 group">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-purple-500 to-orange-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>

                  <h1 className="relative text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-orange-500 via-purple-600 to-orange-600 bg-clip-text text-transparent hover:from-orange-600 hover:via-purple-700 hover:to-orange-700 transition-all duration-500 transform group-hover:scale-105">
                    <span className="inline-flex items-center gap-2">
                      <Globe className="w-6 h-6 lg:w-8 lg:h-8 text-orange-500 animate-spin-slow" />
                      Trusted<span className="text-gray-800">Immigration</span>
                      <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-purple-500 animate-pulse" />
                    </span>
                  </h1>
                </div>
              </Link>
            </div>

            <div className="hidden md:flex md:items-center">
              <div className="ml-10 flex items-center space-x-2 lg:space-x-4">
                <Link
                  to="/"
                  className="group relative px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                >
                  <span className="relative z-10">🏠 Home</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </Link>

                <Link
                  to="/browse"
                  className="group relative px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                >
                  <span className="relative z-10">🔍 Browse Services</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </Link>

                <Link
                  to="/add-business"
                  className="group relative px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                >
                  <span className="relative z-10">➕ Add Business</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </Link>

                <Link
                  to="/report"
                  className="group relative px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  <span className="relative z-10">⚠️ Report Scam</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-purple-200/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-orange-200/30 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-orange-200/20 to-purple-200/20 rounded-full blur-2xl animate-float-fast"></div>

        {/* Floating particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/40 rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen pt-20 pb-12">
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 sm:px-6 lg:px-8">
          <div
            className={`max-w-md w-full space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Enhanced Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl mb-6 transform hover:scale-110 transition-all duration-500 shadow-2xl">
                <Shield className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-orange-600 via-purple-600 to-orange-700 bg-clip-text text-transparent mb-4">
                Welcome Back
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Sign in to your account or create a new one to access our
                trusted immigration services
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                {
                  icon: "🛡️",
                  label: "Secure",
                  color: "from-green-400 to-green-600",
                },
                {
                  icon: "⚡",
                  label: "Fast",
                  color: "from-blue-400 to-blue-600",
                },
                {
                  icon: "✅",
                  label: "Trusted",
                  color: "from-purple-400 to-purple-600",
                },
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-xl text-white shadow-lg mb-2 mx-auto transform group-hover:scale-110 transition-all duration-300`}
                  >
                    {item.icon}
                  </div>
                  <p className="text-xs font-medium text-gray-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Demo Credentials Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Demo Credentials
              </h3>
              <div className="text-sm text-blue-800 space-y-2">
                <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                  <strong>Regular User:</strong>
                  <code className="text-xs bg-blue-100 px-2 py-1 rounded">
                    user@demo.com / password123
                  </code>
                </div>
                <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                  <strong>Business Owner:</strong>
                  <code className="text-xs bg-blue-100 px-2 py-1 rounded">
                    business@demo.com / business123
                  </code>
                </div>
                <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                  <strong>Admin:</strong>
                  <code className="text-xs bg-blue-100 px-2 py-1 rounded">
                    admin@demo.com / admin123
                  </code>
                </div>
              </div>
            </div>

            {/* Enhanced Social Login Buttons */}
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-14 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                onClick={() => handleSocialLogin("Google")}
              >
                <GoogleIcon />
                <span className="ml-3 font-semibold">Continue with Google</span>
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Button>

              <Button
                variant="outline"
                className="w-full h-14 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                onClick={() => handleSocialLogin("Facebook")}
              >
                <FacebookIcon />
                <span className="ml-3 font-semibold">
                  Continue with Facebook
                </span>
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Button>

              <Button
                variant="outline"
                className="w-full h-14 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                onClick={() => handleSocialLogin("LinkedIn")}
              >
                <LinkedInIcon />
                <span className="ml-3 font-semibold">
                  Continue with LinkedIn
                </span>
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-gradient-to-r from-orange-200 via-purple-200 to-orange-200" />
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-gradient-to-r from-orange-50 to-purple-50 px-4 py-2 text-gray-600 font-semibold rounded-full">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Enhanced Login/Register Forms */}
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-purple-500/5 to-orange-600/5"></div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full relative"
              >
                <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-orange-100 to-purple-100 border-none h-12">
                  <TabsTrigger
                    value="login"
                    className="font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* Enhanced Login Tab */}
                <TabsContent value="login">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                      Sign In to Your Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {loginError && (
                      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 animate-fadeInUp">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-red-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700 font-medium">
                              {loginError}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="login-email"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Email Address
                        </Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-orange-500 transition-colors duration-300" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            value={loginData.email}
                            onChange={(e) =>
                              setLoginData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-white/50"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="login-password"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Password
                        </Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-500 transition-colors duration-300" />
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={(e) =>
                              setLoginData((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            className="pl-12 pr-12 h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/50"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-purple-100 rounded-lg transition-all duration-300"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-purple-500" />
                            ) : (
                              <Eye className="w-4 h-4 text-purple-500" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="remember"
                            checked={loginData.rememberMe}
                            onCheckedChange={(checked) =>
                              setLoginData((prev) => ({
                                ...prev,
                                rememberMe: checked as boolean,
                              }))
                            }
                            className="border-2 border-orange-300 data-[state=checked]:bg-orange-500"
                          />
                          <Label
                            htmlFor="remember"
                            className="text-sm font-medium text-gray-700"
                          >
                            Remember me
                          </Label>
                        </div>
                        <Link
                          to="/forgot-password"
                          className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-colors duration-300"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Signing In...
                          </div>
                        ) : (
                          <span className="flex items-center gap-2">
                            Sign In
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </TabsContent>

                {/* Enhanced Register Tab */}
                <TabsContent value="register">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                      Create Your Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleRegister} className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="register-name"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Full Name
                        </Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-orange-500 transition-colors duration-300" />
                          <Input
                            id="register-name"
                            type="text"
                            placeholder="Enter your full name"
                            value={registerData.name}
                            onChange={(e) =>
                              setRegisterData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-white/50"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="register-email"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Email Address
                        </Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-500 transition-colors duration-300" />
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="Enter your email"
                            value={registerData.email}
                            onChange={(e) =>
                              setRegisterData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/50"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="register-phone"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Phone Number
                        </Label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-orange-500 transition-colors duration-300" />
                          <Input
                            id="register-phone"
                            type="tel"
                            placeholder="+971-50-XXX-XXXX"
                            value={registerData.phone}
                            onChange={(e) =>
                              setRegisterData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-white/50"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="register-password"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Password
                          </Label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-500 transition-colors duration-300" />
                            <Input
                              id="register-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create password"
                              value={registerData.password}
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className="pl-12 pr-12 h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/50"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-purple-100 rounded-lg transition-all duration-300"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4 text-purple-500" />
                              ) : (
                                <Eye className="w-4 h-4 text-purple-500" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="confirm-password"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Confirm Password
                          </Label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-orange-500 transition-colors duration-300" />
                            <Input
                              id="confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm password"
                              value={registerData.confirmPassword}
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                              className="pl-12 pr-12 h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-white/50"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-orange-100 rounded-lg transition-all duration-300"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4 text-orange-500" />
                              ) : (
                                <Eye className="w-4 h-4 text-orange-500" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                        <Checkbox
                          id="terms"
                          checked={registerData.agreeToTerms}
                          onCheckedChange={(checked) =>
                            setRegisterData((prev) => ({
                              ...prev,
                              agreeToTerms: checked as boolean,
                            }))
                          }
                          className="border-2 border-purple-300 data-[state=checked]:bg-purple-500 mt-1"
                        />
                        <Label
                          htmlFor="terms"
                          className="text-sm leading-relaxed text-gray-700"
                        >
                          I agree to the{" "}
                          <Link
                            to="/terms"
                            className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-300"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="/privacy"
                            className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-300"
                          >
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                        disabled={!registerData.agreeToTerms}
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Create Account
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </Button>
                    </form>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Enhanced Footer */}
            <div className="text-center">
              <div className="p-6 bg-gradient-to-r from-orange-50 to-purple-50 border border-orange-200 rounded-2xl">
                <p className="text-sm text-gray-600 leading-relaxed">
                  By signing in, you agree to our{" "}
                  <Link
                    to="/terms"
                    className="font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-colors duration-300"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-300"
                  >
                    Privacy Policy
                  </Link>
                </p>
                <div className="flex justify-center items-center gap-2 mt-3 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  <span>Your data is encrypted and secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
