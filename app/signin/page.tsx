'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SurfBackground from '../../src/components/SurfBackgroundNoSSR';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple mock authentication for now
    if (formData.email && formData.password) {
      // Store simple auth state in localStorage
      localStorage.setItem('surfApp_user', JSON.stringify({
        email: formData.email,
        name: formData.email.split('@')[0],
        signedInAt: new Date().toISOString()
      }));
      
      // Redirect to home
      router.push('/');
    } else {
      setError('Please enter both email and password');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <SurfBackground 
      videoUrl="/SurfBackground.mp4"
      videoPoster="/surf-background2.png"
    >
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Sign In Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-[30px] p-6 border border-white/20 shadow-lg">
            {/* Header inside card */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-white/70">Sign in to your surf account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
                  placeholder="surfer@example.com"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-100 text-sm">{error}</p>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-white/70 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/signup')}
                  className="text-white font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-4">
              <button
                onClick={() => router.push('/')}
                className="text-white/60 hover:text-white/80 text-sm transition-colors"
              >
                ← Back to Surf Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </SurfBackground>
  );
} 