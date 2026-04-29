import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Building2 } from 'lucide-react';
import ManageGymModal from '../../components/ManageGymModal'; // FIXED IMPORT!

const AllGyms = () => {
    const [gyms, setGyms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    
    // Modal State
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [selectedGym, setSelectedGym] = useState(null);

    const fetchGyms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/superadmin/gyms');
            if (response.data.success) {
                setGyms(response.data.gyms);
            }
        } catch (error) {
            console.error("Failed to fetch gyms", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGyms();
    }, []);

    const filteredGyms = gyms.filter(gym => 
        gym.gym_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.owner_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-in fade-in duration-500">
            {/* FIXED COMPONENT NAME AND PROP! */}
            <ManageGymModal 
                isOpen={isManageModalOpen} 
                onClose={() => {
                    setIsManageModalOpen(false);
                    setSelectedGym(null);
                }} 
                gym={selectedGym}
                refreshData={fetchGyms} 
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">All Tenants Directory</h2>
                    <p className="text-slate-500 mt-1">Manage all registered gyms on GymOS.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search size={20} className="text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search by gym or owner name..." 
                    className="w-full bg-transparent outline-none text-slate-700 font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                                <th className="p-5 font-bold">Gym Details</th>
                                <th className="p-5 font-bold">Plan / ID</th>
                                <th className="p-5 font-bold">Join Date</th>
                                <th className="p-5 font-bold">Status</th>
                                <th className="p-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading tenants...</td></tr>
                            ) : filteredGyms.map(gym => (
                                <tr key={gym.gym_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                                                <Building2 size={20} />
                                            </div>
                                            <div>
                                                <span className="block font-bold text-slate-800">{gym.gym_name}</span>
                                                <span className="block text-xs text-slate-500">Owner: {gym.owner_name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="block font-medium text-slate-700">{gym.subscription_plan || 'Standard'}</span>
                                        <span className="block text-xs text-slate-400">ID: #{gym.gym_id}</span>
                                    </td>
                                    <td className="p-5 text-slate-600 font-medium">
                                        {new Date(gym.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            gym.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                                            gym.status === 'Suspended' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {gym.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button 
                                            onClick={() => {
                                                setSelectedGym(gym);
                                                setIsManageModalOpen(true);
                                            }}
                                            className="text-sm font-bold text-blue-600 hover:text-blue-800 px-4 py-2 bg-blue-50 rounded-lg transition-colors"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllGyms;