import { useState } from 'react';
import { Sparkles, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Login() {
    const { checkAuth } = useStore();
    const [isRegister, setIsRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleGoogleLogin = () => {
        const baseUrl = window.location.origin.includes('localhost')
            ? 'http://localhost:5001'
            : window.location.origin;
        window.location.href = `${baseUrl}/api/auth/google`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const baseUrl = window.location.origin.includes('localhost')
            ? 'http://localhost:5001'
            : window.location.origin;

        const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

        try {
            const res = await fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            if (isRegister) {
                // If registration successful, switch to login view
                setIsRegister(false);
                setError(''); // clear any errors
                // Optionally show a success message via a new state or just let the user login
                // For now, let's keep it simple or maybe alert (but alert is ugly).
                // Let's set a temporary success state or just switch tabs.
                // We'll reset form password for security
                setFormData(prev => ({ ...prev, password: '' }));
            } else {
                // Login successful
                await checkAuth();
                // Redirect logic is handled by ProtectedRoute / App.tsx once isAuthenticated is true
                // But to be forced:
                window.location.href = '/';
            }

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                {/* Logo/Title Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="w-12 h-12 text-cyan-400" />
                        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                            LifeOS
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg">Your Personal Daily Tracker</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        {isRegister ? 'Create Account' : 'Welcome Back'}
                    </h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                        {isRegister && (
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-400 transition-all placeholder:text-gray-600"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-400 transition-all placeholder:text-gray-600"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-400 transition-all placeholder:text-gray-600"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    {isRegister ? 'Sign Up' : 'Sign In'}
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#0a0a0a] text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign-In Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                            >
                                {isRegister ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Features List */}
                <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="text-2xl mb-1">📊</p>
                        <p className="text-sm text-gray-400">Track Progress</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="text-2xl mb-1">🎯</p>
                        <p className="text-sm text-gray-400">Set Goals</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="text-2xl mb-1">📈</p>
                        <p className="text-sm text-gray-400">View Analytics</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="text-2xl mb-1">✨</p>
                        <p className="text-sm text-gray-400">Stay Motivated</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
