import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackgroundEffect from '../components/BackgroundEffect';

const Register = () => {
    const [formData, setFormData] = useState({
        gym_name: '',
        owner_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '', // New field
        role: 'admin'
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Validation: Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        // Validation: Password length check (best practice)
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Note: We don't send confirmPassword to the backend
            const { confirmPassword, ...dataToSend } = formData;
            
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                ...dataToSend,
                gym_id: 1 
            });

            if (response.status === 201) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Try again.');
            setIsSubmitting(false);
        }
    };

    return (
        /* CRITICAL: bg-transparent, relative, and overflow-hidden for the particle effect */
        <div className="relative flex min-h-screen items-center justify-center bg-transparent p-6 font-sans overflow-hidden">
            
            {/* Background Animation */}
            <BackgroundEffect />

            {/* z-10 added to keep the card above the particles */}
            <div className="z-10 flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-500 hover:shadow-blue-200/50 border border-white/20">
                
                {/* Left Branding Panel */}
                <div className="hidden flex-1 flex-col justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white lg:flex">
                    <h1 className="text-5xl font-black tracking-tighter text-white">Join GymOS</h1>
                    <p className="mt-6 text-lg text-blue-100">
                        Start managing your gym with the most advanced SaaS platform.
                    </p>
                    <div className="mt-10 space-y-6">
                        <div className="flex items-start gap-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold">1</span>
                            <p className="text-sm text-blue-50">Register your gym and create your workspace.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold">2</span>
                            <p className="text-sm text-blue-50">Setup membership plans and GST billing.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold">3</span>
                            <p className="text-sm text-blue-50">Onboard trainers and start tracking growth.</p>
                        </div>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="flex flex-[1.2] flex-col justify-center p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-500 mb-8">Launch your digital gym in minutes.</p>

                    {error && (
                        <div className="mb-6 rounded-xl border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700 animate-pulse">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="group col-span-2 md:col-span-1">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 group-focus-within:text-blue-600">Gym Name</label>
                            <input name="gym_name" type="text" onChange={handleChange} required className="w-full border-b-2 border-gray-200 py-2 outline-none transition-all focus:border-blue-600 bg-transparent" placeholder="Gym Name" />
                        </div>
                        <div className="group col-span-2 md:col-span-1">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 group-focus-within:text-blue-600">Owner Name</label>
                            <input name="owner_name" type="text" onChange={handleChange} required className="w-full border-b-2 border-gray-200 py-2 outline-none transition-all focus:border-blue-600 bg-transparent" placeholder="Owner's Name" />
                        </div>
                        <div className="group col-span-2">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 group-focus-within:text-blue-600">Email Address</label>
                            <input name="email" type="email" onChange={handleChange} required className="w-full border-b-2 border-gray-200 py-2 outline-none transition-all focus:border-blue-600 bg-transparent" placeholder="Your Email" />
                        </div>
                        <div className="group col-span-2">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 group-focus-within:text-blue-600">Phone</label>
                            <input name="phone" type="text" onChange={handleChange} required className="w-full border-b-2 border-gray-200 py-2 outline-none transition-all focus:border-blue-600 bg-transparent" placeholder="+91 90000 00000" />
                        </div>
                        
                        {/* Password Section */}
                        <div className="group col-span-2 md:col-span-1">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 group-focus-within:text-blue-600">Password</label>
                            <input name="password" type="password" onChange={handleChange} required className="w-full border-b-2 border-gray-200 py-2 outline-none transition-all focus:border-blue-600 bg-transparent" placeholder="••••••••" />
                        </div>
                        <div className="group col-span-2 md:col-span-1">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 group-focus-within:text-blue-600">Confirm Password</label>
                            <input name="confirmPassword" type="password" onChange={handleChange} required className="w-full border-b-2 border-gray-200 py-2 outline-none transition-all focus:border-blue-600 bg-transparent" placeholder="••••••••" />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="col-span-2 mt-4 transform rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 active:scale-95 disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Creating Workspace...' : 'Get Started Now'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Already have an account? {' '}
                        <button onClick={() => navigate('/login')} className="font-bold text-blue-600 hover:underline">Log In</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;