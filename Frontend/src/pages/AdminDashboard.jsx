import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddMemberModal from '../components/AddMemberModal';
import MembersList from './MembersList';
import TrainersList from './TrainersList';
import BillingPlans from './BillingPlans';
import { 
    LayoutDashboard, Users, Dumbbell, CreditCard, 
    LogOut, TrendingUp, AlertCircle, Plus 
} from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Dashboard Data State
    const [dashboardStats, setDashboardStats] = useState({
        monthlyRevenue: 0,
        totalMembers: 0,
        totalTrainers: 0,
        expiringSoon: 0
    });
    const [recentMembers, setRecentMembers] = useState([]);
    const [isDashboardLoading, setIsDashboardLoading] = useState(true);

    // Fetch live data for the overview tab
    useEffect(() => {
        const fetchDashboardData = async () => {
            // Only fetch if they have a gym_id and are looking at the overview tab
            if (!user?.gym_id || activeTab !== 'overview') return;
            
            setIsDashboardLoading(true);
            try {
                // Fetch both stats and recent members at the same time using Promise.all
                const [statsRes, recentRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/admin/gyms/${user.gym_id}/stats`),
                    axios.get(`http://localhost:5000/api/admin/gyms/${user.gym_id}/recent-registrations`)
                ]);
                
                if (statsRes.data.success) {
                    setDashboardStats(statsRes.data.stats);
                }
                if (recentRes.data.success) {
                    setRecentMembers(recentRes.data.recent);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsDashboardLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, activeTab]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            
            {/* Add Member Modal */}
            <AddMemberModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                // We pass an empty function here for now, but ideally it refreshes the members list!
                refreshData={() => {}} 
            />

            {/* SIDEBAR */}
            <div className="w-64 bg-blue-900 text-white flex flex-col shadow-xl z-20">
                <div className="p-6 flex items-center gap-3 border-b border-blue-800">
                    <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">G</div>
                    <h1 className="text-2xl font-black tracking-tight">GymOS</h1>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            activeTab === 'overview' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                        }`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-semibold">Dashboard</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('members')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            activeTab === 'members' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                        }`}
                    >
                        <Users size={20} />
                        <span className="font-semibold">Members</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('trainers')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            activeTab === 'trainers' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                        }`}
                    >
                        <Dumbbell size={20} />
                        <span className="font-semibold">Trainers</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('billing')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            activeTab === 'billing' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                        }`}
                    >
                        <CreditCard size={20} />
                        <span className="font-semibold">Billing & Plans</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-blue-800">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-blue-200 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-semibold">Logout</span>
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
                
                <header className="bg-white p-8 flex justify-between items-center shadow-sm z-10 border-b border-slate-200">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">
                            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 
                        </h2>
                        <p className="text-slate-500 mt-1">Here is what's happening at your gym today.</p>
                    </div>
                    
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center gap-2 transform active:scale-95"
                    >
                        <Plus size={20} />
                        New Member
                    </button>
                </header>

                <main className="p-8">
                    
                    {/* TAB 1: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="animate-in fade-in duration-500">
                            {/* Stat Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                                    <div className="h-14 w-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                        <TrendingUp size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Monthly Revenue</p>
                                        <h3 className="text-2xl font-bold text-slate-800">
                                            {isDashboardLoading ? '...' : `₹${dashboardStats.monthlyRevenue.toLocaleString()}`}
                                        </h3>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                                    <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                        <Users size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Members</p>
                                        <h3 className="text-2xl font-bold text-slate-800">
                                            {isDashboardLoading ? '...' : dashboardStats.totalMembers}
                                        </h3>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                                    <div className="h-14 w-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                                        <Dumbbell size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Trainers</p>
                                        <h3 className="text-2xl font-bold text-slate-800">
                                            {isDashboardLoading ? '...' : dashboardStats.totalTrainers}
                                        </h3>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                                    <div className="h-14 w-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                                        <AlertCircle size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Expiring Soon</p>
                                        <h3 className="text-2xl font-bold text-slate-800">
                                            {isDashboardLoading ? '...' : dashboardStats.expiringSoon}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity Table */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-slate-800">Recent Registrations</h3>
                                    <button 
                                        onClick={() => setActiveTab('members')}
                                        className="text-blue-600 font-semibold text-sm hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                                                <th className="p-4 font-semibold">Name</th>
                                                <th className="p-4 font-semibold">Join Date</th>
                                                <th className="p-4 font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isDashboardLoading ? (
                                                <tr><td colSpan="3" className="p-6 text-center text-slate-400">Loading data...</td></tr>
                                            ) : recentMembers.length === 0 ? (
                                                <tr><td colSpan="3" className="p-6 text-center text-slate-400">No members registered yet.</td></tr>
                                            ) : (
                                                recentMembers.map(member => (
                                                    <tr key={member.user_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                        <td className="p-4 font-medium text-slate-800">{member.name}</td>
                                                        <td className="p-4 text-slate-600">{new Date(member.created_at).toLocaleDateString()}</td>
                                                        <td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Active</span></td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* OTHER TABS */}
                    {activeTab === 'members' && <MembersList />}
                    {activeTab === 'trainers' && <TrainersList />}
                    {activeTab === 'billing' && <BillingPlans />}

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;