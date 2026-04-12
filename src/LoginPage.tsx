import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    ArrowLeft,
    Mail,
    Lock,
    Zap,
    Github,
    Twitter,
    Sun,
    Moon,
    AlertCircle,
    Loader2
} from 'lucide-react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from './lib/firebase';

export const LoginPage = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (err: any) {
            console.error(err);
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        setLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (err: any) {
            console.error(err);
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address first.");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to send reset email");

            setSuccess("Professional reset email sent! Check your inbox.");
        } catch (err: any) {
            console.warn("Server reset failed, falling back to standard reset:", err);
            try {
                await sendPasswordResetEmail(auth, email);
                setSuccess("Standard reset email sent as fallback.");
            } catch (fallbackErr: any) {
                setError(fallbackErr.message.replace('Firebase: ', ''));
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white flex flex-col selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black">
            <nav className="p-6 flex justify-between items-center z-10 border-b border-black/5 dark:border-white/5">
                <a
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        window.history.pushState({}, '', '/');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                >
                    <ArrowLeft size={20} />
                    <span className="text-xl font-bold tracking-tighter">SnyderAI</span>
                </a>
                <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                    aria-label="Toggle theme"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </nav>

            <div className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
                {/* Background Accents */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/5 dark:bg-white/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl opacity-50" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl p-8 md:p-10 rounded-[32px] border border-black/10 dark:border-white/10 shadow-2xl relative z-10"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-serif italic mb-3 tracking-tighter">
                            {isLogin ? 'Welcome back' : 'Create account'}
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 font-light text-sm">
                            {isLogin ? 'Enter your credentials to access your account.' : 'Join the future of agentic AI today.'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-medium"
                            >
                                <AlertCircle size={14} />
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500 text-xs font-medium"
                            >
                                <Zap size={14} />
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleAuth} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-mono uppercase tracking-[0.2em] opacity-60 mb-2">Email Address</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-black/20 dark:focus:border-white/20 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-light"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] opacity-60">Password</label>
                                {isLogin && (
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="text-[10px] font-mono uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity"
                                    >
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-black/20 dark:focus:border-white/20 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-light tracking-widest"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-6 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-medium hover:opacity-90 transition-opacity flex justify-center items-center gap-2 shadow-xl shadow-black/10 dark:shadow-white/10 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? 'Sign In' : 'Create Account')}
                            {!loading && <Zap size={16} />}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-black/10 dark:border-white/10">
                        <p className="text-center text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 mb-6">Or continue with</p>
                        <div className="flex gap-4">
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="flex-1 py-4 border border-black/10 dark:border-white/10 rounded-2xl flex justify-center items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" /> Google
                            </button>
                            <button
                                disabled={loading}
                                className="flex-1 py-4 border border-black/10 dark:border-white/10 rounded-2xl flex justify-center items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium disabled:opacity-50 grayscale opacity-50 cursor-not-allowed"
                            >
                                <Github size={18} /> GitHub
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm font-light text-neutral-500 dark:text-neutral-400">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-black dark:text-white font-medium hover:underline underline-offset-4 transition-all"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

