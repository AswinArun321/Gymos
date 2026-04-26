import { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const AddMemberModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        plan: '1-month',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // CRITICAL FIX: Changed gym_id to an integer (1) to match your PostgreSQL database
            const dataToSend = {
                ...formData,
                gym_id: 1 
            };

            const response = await axios.post('http://localhost:5000/api/members/add', dataToSend);

            if (response.data.success) {
                console.log("Member saved successfully:", response.data.member);
                onClose(); // Closes the modal on success
            }
        } catch (err) {
            console.error("Failed to add member:", err);
            setError(err.response?.data?.error || "An error occurred while saving.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-5">
                    <h2 className="text-xl font-bold text-slate-800">Add New Member</h2>
                    <button 
                        onClick={onClose} 
                        disabled={isSubmitting}
                        className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-red-500 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="rounded-xl border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-600">Full Name</label>
                        <input 
                            name="name" type="text" required onChange={handleChange} value={formData.name}
                            className="w-full rounded-xl border border-slate-200 p-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                            placeholder="e.g., Rahul Kumar" 
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-600">Email Address</label>
                        <input 
                            name="email" type="email" required onChange={handleChange} value={formData.email}
                            className="w-full rounded-xl border border-slate-200 p-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                            placeholder="rahul@example.com" 
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-600">Phone Number</label>
                        <input 
                            name="phone" type="tel" required onChange={handleChange} value={formData.phone}
                            className="w-full rounded-xl border border-slate-200 p-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                            placeholder="+91 90000 00000" 
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-600">Membership Plan</label>
                        <select 
                            name="plan" onChange={handleChange} value={formData.plan}
                            className="w-full rounded-xl border border-slate-200 p-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                        >
                            <option value="1-month">1 Month Pro (₹1,500)</option>
                            <option value="3-month">3 Months Premium (₹4,000)</option>
                            <option value="6-month">6 Months Elite (₹7,500)</option>
                            <option value="1-year">1 Year VIP (₹12,000)</option>
                        </select>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:scale-95 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemberModal;