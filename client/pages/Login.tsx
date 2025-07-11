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
  ArrowRight,
  CheckCircle,
  Shield,
  Globe,
  Users,
  Building,
  Star,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Navigation } from "@/components/Navigation";
import { DebugPageInfo } from "@/components/DebugPageInfo";

// Social Icons
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

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
  const [activeTab, setActiveTab] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loginError, setLoginError] = useState("");

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError("");

    try {
      const success = await login(loginData.email, loginData.password);
      if (!success) {
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
      const emailSent = await EmailService.sendWelcomeEmail({
        userName: registerData.name,
        userEmail: registerData.email,
        provider: "email",
        isNewUser: true,
      });

      if (emailSent) {
        toast.success(
          `Welcome ${registerData.name}! 🎉 Email sent to ${registerData.email}`,
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

      if (!success) {
        toast.error(`Failed to login with ${provider}. Please try again.`);
      }
    } catch (error) {
      toast.error(`Error logging in with ${provider}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />

      <div className="relative min-h-screen pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Side - Brand & Features */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Trusted by 125,000+ Users
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Welcome to
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    VisaConsult India
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Connect with India's most trusted visa consultants and
                  immigration experts. Get your visa approved faster with our
                  verified professionals.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3 mx-auto">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">8,500+</div>
                  <div className="text-sm text-gray-600">
                    Verified Consultants
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3 mx-auto">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">125K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-3 mx-auto">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">4.8/5</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Why Choose Us?
                </h3>
                <div className="space-y-3">
                  {[
                    "Verified and licensed consultants",
                    "Real reviews from actual customers",
                    "Compare services and pricing",
                    "Free consultation booking",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">
                    Popular Destinations
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "USA",
                    "Canada",
                    "UK",
                    "Australia",
                    "Germany",
                    "New Zealand",
                  ].map((country) => (
                    <span
                      key={country}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="lg:pl-8">
              <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
                <div className="p-8">
                  {/* Demo Credentials */}
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Demo Credentials
                    </h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>User:</span>
                        <code className="text-xs bg-blue-100 px-2 py-1 rounded">
                          user@demo.com / password123
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span>Business:</span>
                        <code className="text-xs bg-blue-100 px-2 py-1 rounded">
                          business@demo.com / business123
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span>Admin:</span>
                        <code className="text-xs bg-blue-100 px-2 py-1 rounded">
                          admin@demo.com / admin123
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="space-y-3 mb-6">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-2 hover:bg-gray-50 transition-all duration-200"
                      onClick={() => handleSocialLogin("Google")}
                    >
                      <GoogleIcon />
                      <span className="ml-3 font-medium">
                        Continue with Google
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full h-12 border-2 hover:bg-gray-50 transition-all duration-200"
                      onClick={() => handleSocialLogin("Facebook")}
                    >
                      <FacebookIcon />
                      <span className="ml-3 font-medium">
                        Continue with Facebook
                      </span>
                    </Button>
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-gray-500">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login" className="font-medium">
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger value="register" className="font-medium">
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    {/* Login Tab */}
                    <TabsContent value="login" className="space-y-6">
                      {loginError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">{loginError}</p>
                        </div>
                      )}

                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <Label
                            htmlFor="login-email"
                            className="text-sm font-medium text-gray-700"
                          >
                            Email Address
                          </Label>
                          <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                              className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor="login-password"
                            className="text-sm font-medium text-gray-700"
                          >
                            Password
                          </Label>
                          <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                              className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="remember"
                              checked={loginData.rememberMe}
                              onCheckedChange={(checked) =>
                                setLoginData((prev) => ({
                                  ...prev,
                                  rememberMe: checked as boolean,
                                }))
                              }
                            />
                            <Label
                              htmlFor="remember"
                              className="text-sm text-gray-600"
                            >
                              Remember me
                            </Label>
                          </div>
                          <Link
                            to="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Forgot password?
                          </Link>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Signing In...
                            </div>
                          ) : (
                            <span className="flex items-center gap-2">
                              Sign In
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    {/* Register Tab */}
                    <TabsContent value="register" className="space-y-6">
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                          <Label
                            htmlFor="register-name"
                            className="text-sm font-medium text-gray-700"
                          >
                            Full Name
                          </Label>
                          <div className="relative mt-1">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                              className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor="register-email"
                            className="text-sm font-medium text-gray-700"
                          >
                            Email Address
                          </Label>
                          <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                              className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor="register-phone"
                            className="text-sm font-medium text-gray-700"
                          >
                            Phone Number
                          </Label>
                          <div className="relative mt-1">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              id="register-phone"
                              type="tel"
                              placeholder="+91 XXXXX XXXXX"
                              value={registerData.phone}
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  phone: e.target.value,
                                }))
                              }
                              className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="register-password"
                              className="text-sm font-medium text-gray-700"
                            >
                              Password
                            </Label>
                            <div className="relative mt-1">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <Input
                                id="register-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={registerData.password}
                                onChange={(e) =>
                                  setRegisterData((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                  }))
                                }
                                className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label
                              htmlFor="confirm-password"
                              className="text-sm font-medium text-gray-700"
                            >
                              Confirm
                            </Label>
                            <div className="relative mt-1">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <Input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm"
                                value={registerData.confirmPassword}
                                onChange={(e) =>
                                  setRegisterData((prev) => ({
                                    ...prev,
                                    confirmPassword: e.target.value,
                                  }))
                                }
                                className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="terms"
                            checked={registerData.agreeToTerms}
                            onCheckedChange={(checked) =>
                              setRegisterData((prev) => ({
                                ...prev,
                                agreeToTerms: checked as boolean,
                              }))
                            }
                            className="mt-1"
                          />
                          <Label
                            htmlFor="terms"
                            className="text-sm text-gray-600 leading-relaxed"
                          >
                            I agree to the{" "}
                            <Link
                              to="/terms"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                              to="/privacy"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Privacy Policy
                            </Link>
                          </Label>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                          disabled={!registerData.agreeToTerms}
                        >
                          <span className="flex items-center gap-2">
                            Create Account
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                      By continuing, you agree to our Terms and Privacy Policy
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <DebugPageInfo />
    </div>
  );
}
