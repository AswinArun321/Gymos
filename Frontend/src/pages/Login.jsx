import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BackgroundEffect from '../components/BackgroundEffect';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        const result = await login(email, password);
        
        if (result.success) {
            if (result.role === 'admin') navigate('/admin-dashboard');
            else if (result.role === 'trainer') navigate('/trainer-dashboard');
            else navigate('/member-dashboard');
        } else {
            setError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-slate-50 p-6 font-sans overflow-hidden">
            <BackgroundEffect />

            <div className="z-10 flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-500 hover:shadow-blue-200/50">
                {/* Left Branding Panel */}
                <div className="hidden flex-1 flex-col justify-center bg-gradient-to-br from-blue-700 to-blue-900 p-12 text-white lg:flex">
                    <h1 className="text-5xl font-black tracking-tighter">GymOS</h1>
                    <div className="my-6 h-1 w-16 rounded-full bg-blue-400"></div>
                    <p className="text-lg leading-relaxed text-blue-100">
                        The ultimate platform for fitness revolution.
                    </p>
                </div>

                {/* Right Form Panel */}
                <div className="flex flex-1 flex-col justify-center p-8 md:p-14">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                        <p className="mt-2 text-sm text-gray-500">Log in to manage your fitness empire.</p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-xl border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700 animate-pulse">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="group relative">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors group-focus-within:text-blue-600">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border-b-2 border-gray-200 py-3 text-gray-800 outline-none transition-all focus:border-blue-600 bg-transparent"
                                placeholder="Your Email"
                            />
                        </div>

                        <div className="group relative">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors group-focus-within:text-blue-600">
                                Password
                            </label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border-b-2 border-gray-200 py-3 text-gray-800 outline-none transition-all focus:border-blue-600 bg-transparent"
                                placeholder="Enter Your Password"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full transform rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 active:scale-95 disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Verifying...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account? {' '}
                        <button 
                            onClick={() => navigate('/register')}
                            className="font-bold text-blue-600 hover:underline"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;