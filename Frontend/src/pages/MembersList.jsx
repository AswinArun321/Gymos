import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Mail, Phone, Calendar, MoreVertical } from 'lucide-react';

const MembersList = () => {
    const { user } = useContext(AuthContext);
    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/admin/gyms/${user.gym_id}/members`);
                if (response.data.success) {
                    setMembers(response.data.members);
                }
            } catch (error) {
                console.error("Failed to fetch members", error);
            } finally {
                setIsLoading(false);
            }
        };

        // THE FIX: Stop loading if user exists but has no gym_id
        if (user && user.gym_id) {
            fetchMembers();
        } else if (user) {
            setIsLoading(false);
        }
    }, [user]);

    // Filter members based on the search bar
    const filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.phone && member.phone.includes(searchQuery))
    );

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Members Directory</h2>
                    <p className="text-slate-500 mt-1">Manage all active and expired members.</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search size={20} className="text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search by name or phone number..." 
                    className="w-full bg-transparent outline-none text-slate-700 font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                                <th className="p-5 font-bold">Member Details</th>
                                <th className="p-5 font-bold">Contact</th>
                                <th className="p-5 font-bold">Join Date</th>
                                <th className="p-5 font-bold">Status</th>
                                <th className="p-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading members...</td></tr>
                            ) : filteredMembers.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">No members found.</td></tr>
                            ) : (
                                filteredMembers.map(member => (
                                    <tr key={member.user_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-slate-800">{member.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1 text-sm text-slate-600">
                                                <span className="flex items-center gap-2"><Phone size={14}/> {member.phone || 'N/A'}</span>
                                                <span className="flex items-center gap-2"><Mail size={14}/> {member.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-slate-600 font-medium">
                                            <div className="flex items-center gap-2"><Calendar size={14}/> {new Date(member.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-5">
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                                Active
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button className="text-slate-400 hover:text-blue-600 transition-colors p-2">
                                                <MoreVertical size={18} />
                                            </button>
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

export default MembersList;