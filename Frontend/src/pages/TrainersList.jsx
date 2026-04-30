import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Plus, Mail, Phone, Calendar, MoreVertical } from 'lucide-react';
import AddTrainerModal from '../components/AddTrainerModal'; // Import the new modal

const TrainersList = () => {
    const { user } = useContext(AuthContext);
    const [trainers, setTrainers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

    const fetchTrainers = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/gyms/${user.gym_id}/trainers`);
            if (response.data.success) {
                setTrainers(response.data.trainers);
            }
        } catch (error) {
            console.error("Failed to fetch trainers", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // THE FIX: If user exists but has no gym_id yet, stop loading to prevent infinite spinner
        if (user && user.gym_id) {
            fetchTrainers();
        } else if (user) {
            setIsLoading(false); 
        }
    }, [user]);

    const filteredTrainers = trainers.filter(trainer => 
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trainer.phone && trainer.phone.includes(searchQuery))
    );

    return (
        <div className="animate-in fade-in duration-500">
            
            {/* Wire up the Modal */}
            <AddTrainerModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                refreshData={fetchTrainers} 
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Trainers Directory</h2>
                    <p className="text-slate-500 mt-1">Manage your coaching staff and their schedules.</p>
                </div>
                {/* Button opens the modal */}
                <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-200 flex items-center gap-2">
                    <Plus size={20} />
                    Add Trainer
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search size={20} className="text-slate-400" />
                <input type="text" placeholder="Search trainers by name or phone..." className="w-full bg-transparent outline-none text-slate-700 font-medium"
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            {/* Trainers Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                                <th className="p-5 font-bold">Trainer Profile</th>
                                <th className="p-5 font-bold">Contact Info</th>
                                <th className="p-5 font-bold">Specialty</th>
                                <th className="p-5 font-bold">Hired Date</th>
                                <th className="p-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading trainers...</td></tr>
                            ) : filteredTrainers.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">No trainers found. Click "Add Trainer" to hire someone!</td></tr>
                            ) : (
                                filteredTrainers.map(trainer => (
                                    <tr key={trainer.user_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                                                    {trainer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-slate-800">{trainer.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1 text-sm text-slate-600">
                                                <span className="flex items-center gap-2"><Phone size={14}/> {trainer.phone || 'N/A'}</span>
                                                <span className="flex items-center gap-2"><Mail size={14}/> {trainer.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">Coach</span>
                                        </td>
                                        <td className="p-5 text-slate-600 font-medium">
                                            <div className="flex items-center gap-2"><Calendar size={14}/> {new Date(trainer.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button className="text-slate-400 hover:text-purple-600 transition-colors p-2"><MoreVertical size={18} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TrainersList;