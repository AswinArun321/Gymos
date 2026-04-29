import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserCircle } from 'lucide-react';

const PlatformUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/superadmin/users');
                if (response.data.success) {
                    setUsers(response.data.users);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.gym_name && u.gym_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Global Users</h2>
                    <p className="text-slate-500 mt-1">Every admin, trainer, and member across all gyms.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search size={20} className="text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search by name, email, or gym name..." 
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
                                <th className="p-5 font-bold">User Profile</th>
                                <th className="p-5 font-bold">Role</th>
                                <th className="p-5 font-bold">Associated Gym</th>
                                <th className="p-5 font-bold">Join Date</th>
                                <th className="p-5 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading all users...</td></tr>
                            ) : filteredUsers.map(u => (
                                <tr key={u.user_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <UserCircle size={24} />
                                            </div>
                                            <div>
                                                <span className="block font-bold text-slate-800">{u.name}</span>
                                                <span className="block text-xs text-slate-500">{u.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                            u.role === 'trainer' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-5 font-medium text-slate-700">
                                        {u.gym_name || 'System Admin'}
                                    </td>
                                    <td className="p-5 text-slate-600 font-medium">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {u.is_active ? 'Active' : 'Locked'}
                                        </span>
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

export default PlatformUsers;