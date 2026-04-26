import { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import axios from 'axios';

const ManageGymModal = ({ isOpen, onClose, gym, refreshData }) => {
    if (!isOpen || !gym) return null;

    const [isProcessing, setIsProcessing] = useState(false);

    const toggleStatus = async () => {
        setIsProcessing(true);
        const newStatus = gym.status === 'Suspended' ? 'Active' : 'Suspended';
        try {
            await axios.put(`http://localhost:5000/api/superadmin/gyms/${gym.gym_id}/status`, { status: newStatus });
            refreshData(); // Reload the dashboard numbers
            onClose();     // Close modal
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you absolutely sure you want to delete ${gym.gym_name}? This will erase all their members and data.`)) return;
        
        setIsProcessing(true);
        try {
            await axios.delete(`http://localhost:5000/api/superadmin/gyms/${gym.gym_id}`);
            refreshData();
            onClose();
        } catch (error) {
            console.error("Failed to delete gym", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-5">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Manage Tenant</h2>
                        <p className="text-sm text-slate-500">Gym ID: #{gym.gym_id}</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-red-500 transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h3 className="text-2xl font-black text-slate-800">{gym.gym_name}</h3>
                        <p className="text-slate-600 font-medium">Owner: {gym.owner_name}</p>
                        <p className="text-sm text-slate-500 mt-2">Registered: {new Date(gym.created_at).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                        <span className="font-semibold text-slate-700">Current Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${gym.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {gym.status || 'Active'}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
                    <button 
                        onClick={toggleStatus}
                        disabled={isProcessing}
                        className={`w-full flex justify-center items-center gap-2 py-3 rounded-xl font-bold transition-all ${
                            gym.status === 'Suspended' 
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                            : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-200'
                        }`}
                    >
                        {gym.status === 'Suspended' ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
                        {gym.status === 'Suspended' ? 'Restore Access' : 'Suspend Account'}
                    </button>

                    <button 
                        onClick={handleDelete}
                        disabled={isProcessing}
                        className="w-full flex justify-center items-center gap-2 py-3 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all"
                    >
                        <Trash2 size={20} />
                        Permanently Delete Gym
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ManageGymModal;