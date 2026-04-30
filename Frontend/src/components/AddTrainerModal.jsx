import { useState, useContext } from 'react';
import { X, Dumbbell } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddTrainerModal = ({ isOpen, onClose, refreshData }) => {
    const { user } = useContext(AuthContext);
    
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        phone: '', 
        password: '' 
    });
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(''); // Added error state

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(''); // Clear previous errors

        try {
            const response = await axios.post(`http://localhost:5000/api/admin/gyms/${user.gym_id}/trainers`, formData);
            
            if (response.data.success) {
                if (refreshData) refreshData(); 
                onClose();     
            }
        } catch (err) {
            console.error("Failed to add trainer:", err);
            // Show the exact error coming from the backend
            setError(err.response?.data?.error || "An error occurred while saving.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                        <Dumbbell className="text-purple-600" size={20} />
                        <h2 className="text-xl font-bold text-slate-800">Add New Trainer</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        disabled={isProcessing}
                        className="p-2 text-slate-400 hover:bg-slate-200 hover:text-red-500 rounded-full transition-colors disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* The new Error Banner */}
                    {error && (
                        <div className="rounded-xl border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700 mb-4">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                        <input required type="text" placeholder="e.g. John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                        <input required type="email" placeholder="trainer@gymos.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                        <input required type="text" placeholder="+1 (555) 000-0000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                            value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Temporary Password</label>
                        <input required type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isProcessing} 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-200 transition-all mt-4 disabled:bg-purple-400 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? "Adding..." : "Hire Trainer"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTrainerModal;