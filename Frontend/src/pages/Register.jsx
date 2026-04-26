import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackgroundEffect from '../components/BackgroundEffect';
import { Eye, EyeOff } from 'lucide-react';

// 1. We build the animated input right here at the top of the file!
const AnimatedPasswordInput = ({ name, placeholder, value, onChange }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative group">
            <input 
                name={name} 
                type={show ? "text" : "password"} 
                value={value}
                onChange={onChange} 
                required 
                className="w-full border-b-2 border-gray-200 py-2 pr-12 outline-none transition-all duration-300 focus:border-blue-600 bg-transparent text-gray-800" 
                placeholder={placeholder} 
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 transition-all duration-300 ease-out focus:outline-none hover:bg-slate-100 active:scale-90 ${
                    show ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-700'
                }`}
            >
                <div className="relative h-5 w-5">
                    <Eye 
                        size={20} 
                        className={`absolute inset-0 transition-all duration-300 transform ${
                            show ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-45'
                        }`} 
                    />
                    <EyeOff 
                        size={20} 
                        className={`absolute inset-0 transition-all duration-300 transform ${
                            !show ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-45'
                        }`} 
                    />
                </div>
            </button>
        </div>
    );
};

// 2. Your main Register component
const Register = () => {
    const [formData, setFormData] = useState({
        gym_name: '',
        owner_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '', 
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

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsSubmitting(true);

        try {
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
        <div className="relative flex min-h-screen items-center justify-center bg-transparent p-6 font-sans overflow-hidden">
            
            <BackgroundEffect />

            <div className="z-10 flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-500 hover:shadow-blue-200/50 border border-white/20">
                
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
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 group-focus-within:text-blue-600 transition-colors">Gym Name</label>
                            <input name="gym_name" type="text" onChange={handleChange} required className="w-full border-b-2 border-gray-200 py-2 outline-none transition-all focus:border-blue-600 bg-transparent" placeholder="Gym Name" />
                        </div>
                        <div className="group col-span-2 md:col-span-1">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 group-focus-within:text-blue-600 transition-colors">Owner Name</label>
                            <input name="owner_name" type="text" onChange={handleChange} required className="w-full border-b-2 border-gray-200 py-2 outline-none transition-all focus:border-blue-600 bg-transparent" placeholder="Owner's Name" />
                        </div>
                        <div className="group col-span-2">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 group-focus-within:text-blue-600 transition-colors">Email Address</label>
                            <input name="email" type="email" onChange={handleChange} required className="w-full border-b-2 border-gray-200 py-2 outline-none transition-all focus:border-blue-600 bg-transparent" placeholder="Your Email" />
                        </div>
                        <div className="group col-span-2">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 group-focus-within:text-blue-600 transition-colors">Phone</label>
                            <input name="phone" type="text" onChange={handleChange} required className="w-full border-b-2 border-gray-200 py-2 outline-none transition-all focus:border-blue-600 bg-transparent" placeholder="+91 90000 00000" />
                        </div>
                        
                        {/* We use your new animated component here! */}
                        <div className="group col-span-2 md:col-span-1">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 group-focus-within:text-blue-600 transition-colors">Password</label>
                            <AnimatedPasswordInput 
                                name="password" 
                                placeholder="••••••••" 
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="group col-span-2 md:col-span-1">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 group-focus-within:text-blue-600 transition-colors">Confirm Password</label>
                            <AnimatedPasswordInput 
                                name="confirmPassword" 
                                placeholder="••••••••" 
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
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