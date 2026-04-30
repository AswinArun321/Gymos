import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import axios from 'axios';

const EditUserModal = ({ isOpen, onClose, user, refreshData }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) setFormData({ name: user.name, email: user.email, phone: user.phone });
    }, [user]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${user.user_id}`, formData);
            refreshData();
            onClose();
        } catch (err) {
            alert("Failed to update");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800">Edit Details</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-red-500 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Full Name</label>
                        <input type="text" className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"
                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Email</label>
                        <input type="email" className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"
                            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Phone</label>
                        <input type="text" className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"
                            value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all">
                        <Save size={18} /> {isSaving ? "Saving..." : "Update Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default EditUserModal;