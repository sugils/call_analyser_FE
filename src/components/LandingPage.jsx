import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Phone,
  Sparkles,
  BarChart3,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

const LandingPage = ({ setCurrentPage }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { login } = useUser();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  // Animation states
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    login({
      email: formData.email,
      name: formData.email.split('@')[0]
    });
    
    setCurrentPage('dashboard');
    setIsLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    login({
      email: formData.email,
      name: formData.name
    });
    
    setCurrentPage('dashboard');
    setIsLoading(false);
  };

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Monitor call performance in real-time"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description: "Get intelligent feedback and recommendations"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level security for your data"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Processing",
      description: "Process hours of audio in seconds"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Call Center Manager",
      company: "TechCorp",
      content: "VoiceAI transformed our call quality monitoring. We've seen a 40% improvement in customer satisfaction.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Customer Service Director",
      company: "GlobalSupport",
      content: "The AI insights are incredibly accurate. Our agents love the personalized feedback.",
      rating: 5
    }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
          isDarkMode 
            ? 'bg-white/10 text-white hover:bg-white/20' 
            : 'bg-black/10 text-gray-800 hover:bg-black/20'
        }`}
      >
        {isDarkMode ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0">
            <div className={`absolute top-20 left-20 w-32 h-32 rounded-full blur-3xl transition-all duration-1000 ${
              animationStep === 0 ? 'opacity-70' : 'opacity-30'
            } ${isDarkMode ? 'bg-blue-500/30' : 'bg-blue-400/40'}`}></div>
            <div className={`absolute bottom-32 right-16 w-40 h-40 rounded-full blur-3xl transition-all duration-1000 ${
              animationStep === 1 ? 'opacity-70' : 'opacity-30'
            } ${isDarkMode ? 'bg-purple-500/30' : 'bg-purple-400/40'}`}></div>
            <div className={`absolute top-1/2 left-1/3 w-24 h-24 rounded-full blur-2xl transition-all duration-1000 ${
              animationStep === 2 ? 'opacity-70' : 'opacity-30'
            } ${isDarkMode ? 'bg-pink-500/30' : 'bg-pink-400/40'}`}></div>
          </div>

          <div className="relative z-10 text-center lg:text-left max-w-lg">
            {/* Logo and Icon */}
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-600 to-purple-700' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              } shadow-2xl transform hover:scale-105 transition-transform duration-300`}>
                <Headphones className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className={`text-3xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Voice<span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">AI</span>
                </h1>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Smart Call Analytics
                </p>
              </div>
            </div>

            {/* Main Heading */}
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 leading-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Transform Your
              <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Call Analytics
              </span>
            </h2>

            <p className={`text-lg lg:text-xl mb-8 leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Harness the power of AI to analyze call quality, improve agent performance, 
              and enhance customer satisfaction with real-time insights.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-white/5 border border-white/10' 
                      : 'bg-white/60 border border-white/40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400' 
                      : 'bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className={`font-semibold text-sm mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className={`p-4 rounded-xl backdrop-blur-md ${
              isDarkMode 
                ? 'bg-white/5 border border-white/10' 
                : 'bg-white/60 border border-white/40'
            }`}>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className={`text-sm italic mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                "{testimonials[0].content}"
              </p>
              <p className={`text-xs font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {testimonials[0].name}, {testimonials[0].role}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            {/* Form Container with Flip Animation */}
            <div 
              className="relative w-full h-[600px]" 
              style={{ perspective: '1000px' }}
            >
              <div 
                className={`absolute w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Login Card */}
                <div 
                  className={`absolute w-full h-full backface-hidden ${
                    isDarkMode 
                      ? 'bg-white/10 backdrop-blur-xl border border-white/20' 
                      : 'bg-white/80 backdrop-blur-xl border border-white/40'
                  } rounded-3xl shadow-2xl p-8`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-center mb-8">
                    <h3 className={`text-3xl font-bold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Welcome Back
                    </h3>
                    <p className={`${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Sign in to your account
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <input 
                          type="email" 
                          name="email"
                          placeholder="Email address" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={`w-full pl-12 pr-4 py-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDarkMode 
                              ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' 
                              : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>
                      <div className="relative">
                        <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          name="password"
                          placeholder="Password" 
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className={`w-full pl-12 pr-12 py-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDarkMode 
                              ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' 
                              : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)} 
                          className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                            isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                          } transition-colors`}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="text-center space-y-4">
                      <a href="#" className={`text-sm hover:underline transition-colors ${
                        isDarkMode 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-blue-600 hover:text-blue-700'
                      }`}>
                        Forgot your password?
                      </a>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Don't have an account?{' '}
                        <button 
                          type="button"
                          onClick={() => setIsFlipped(true)} 
                          className={`font-semibold hover:underline transition-colors ${
                            isDarkMode 
                              ? 'text-purple-400 hover:text-purple-300' 
                              : 'text-purple-600 hover:text-purple-700'
                          }`}
                        >
                          Sign up
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Signup Card (Back) */}
                <div 
                  className={`absolute w-full h-full backface-hidden rotate-y-180 ${
                    isDarkMode 
                      ? 'bg-white/10 backdrop-blur-xl border border-white/20' 
                      : 'bg-white/80 backdrop-blur-xl border border-white/40'
                  } rounded-3xl shadow-2xl p-8`}
                  style={{ 
                    backfaceVisibility: 'hidden', 
                    transform: 'rotateY(180deg)' 
                  }}
                >
                  <div className="text-center mb-8">
                    <h3 className={`text-3xl font-bold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Join VoiceAI
                    </h3>
                    <p className={`${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Start your analytics journey
                    </p>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <input 
                          type="text" 
                          name="name"
                          placeholder="Full name" 
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className={`w-full pl-12 pr-4 py-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            isDarkMode 
                              ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' 
                              : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>
                      <div className="relative">
                        <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <input 
                          type="email" 
                          name="email"
                          placeholder="Email address" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={`w-full pl-12 pr-4 py-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            isDarkMode 
                              ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' 
                              : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>
                      <div className="relative">
                        <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <input 
                          type="password" 
                          name="password"
                          placeholder="Password" 
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className={`w-full pl-12 pr-4 py-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            isDarkMode 
                              ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' 
                              : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>
                      <div className="relative">
                        <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <input 
                          type="password" 
                          name="confirmPassword"
                          placeholder="Confirm password" 
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className={`w-full pl-12 pr-4 py-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            isDarkMode 
                              ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' 
                              : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="text-center">
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Already have an account?{' '}
                        <button 
                          type="button"
                          onClick={() => setIsFlipped(false)} 
                          className={`font-semibold hover:underline transition-colors ${
                            isDarkMode 
                              ? 'text-blue-400 hover:text-blue-300' 
                              : 'text-blue-600 hover:text-blue-700'
                          }`}
                        >
                          Sign in
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats/Trust Indicators */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 ${
        isDarkMode 
          ? 'bg-gradient-to-t from-slate-900/80 to-transparent' 
          : 'bg-gradient-to-t from-white/80 to-transparent'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                10K+
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Hours Analyzed
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                500+
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Companies Trust Us
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                98%
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Accuracy Rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;