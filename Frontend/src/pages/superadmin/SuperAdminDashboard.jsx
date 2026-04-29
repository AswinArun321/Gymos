import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Activity, Building2, Users, IndianRupee, LogOut, ShieldAlert } from 'lucide-react';
import ManageGymModal from '../../components/ManageGymModal';
import AllGyms from './AllGyms'; 
import PlatformUsers from './PlatformUsers';

const SuperAdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Tab State for Sidebar Navigation
    const [activeTab, setActiveTab] = useState('overview');
    
    // State to hold our real database numbers
    const [stats, setStats] = useState({
        totalGyms: 0,
        totalMembers: 0,
        recentGyms: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [selectedGym, setSelectedGym] = useState(null);

    // 1. Pulled fetchStats OUTSIDE useEffect so we can pass it to the modal
    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/superadmin/platform-stats');
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. useEffect just calls the function now
    useEffect(() => {
        fetchStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
            
            {/* 3. Insert the Modal component right here */}
            <ManageGymModal 
                isOpen={isManageModalOpen} 
                onClose={() => setIsManageModalOpen(false)} 
                gym={selectedGym}
                refreshData={fetchStats}
            />

            {/* PLATFORM SIDEBAR */}
            <div className="w-64 bg-slate-950 text-white flex flex-col shadow-2xl z-20">
                <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                    <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-950">
                        <ShieldAlert size={20} />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white">GymOS</h1>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            activeTab === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <Activity size={20} />
                        <span className="font-semibold">Platform Overview</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('gyms')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            activeTab === 'gyms' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <Building2 size={20} />
                        <span className="font-semibold">All Gyms (Tenants)</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            activeTab === 'users' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <Users size={20} />
                        <span className="font-semibold">Platform Users</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                        <LogOut size={20} />
                        <span className="font-semibold">Logout</span>
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="bg-white p-8 flex justify-between items-center shadow-sm z-10 border-b border-slate-200">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">
                            System Status: <span className="text-emerald-500">All Systems Nominal</span>
                        </h2>
                        <p className="text-slate-500 mt-1">Welcome back, {user?.name}. Here is the overall platform performance.</p>
                    </div>
                </header>

                <main className="p-8">
                    {/* TAB 1: OVERVIEW */}
                    {activeTab === 'overview' && (
                        isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                            </div>
                        ) : (
                            <>
                                {/* SaaS Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total MRR</p>
                                            <IndianRupee size={20} className="text-emerald-500" />
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800">
                                            ₹{(stats.totalGyms * 1999).toLocaleString('en-IN')}
                                        </h3>
                                        <p className="text-sm text-slate-400 font-medium mt-2">Based on ₹1,999/mo plan</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Gyms</p>
                                            <Building2 size={20} className="text-blue-500" />
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800">{stats.totalGyms}</h3>
                                        <p className="text-sm text-emerald-600 font-semibold mt-2">Registered Tenants</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total End Users</p>
                                            <Users size={20} className="text-purple-500" />
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800">{stats.totalMembers}</h3>
                                        <p className="text-sm text-slate-500 font-semibold mt-2">Members across all gyms</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">API Health</p>
                                            <Activity size={20} className="text-emerald-500" />
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800">99.9%</h3>
                                        <p className="text-sm text-emerald-600 font-semibold mt-2">All services operational</p>
                                    </div>
                                </div>

                                {/* Tenants Table */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-slate-800">Recent Registrations</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                                    <th className="p-4 font-semibold">Gym ID</th>
                                                    <th className="p-4 font-semibold">Gym Name</th>
                                                    <th className="p-4 font-semibold">Owner</th>
                                                    <th className="p-4 font-semibold">Join Date</th>
                                                    <th className="p-4 font-semibold">Status</th>
                                                    <th className="p-4 font-semibold">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.recentGyms.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" className="p-8 text-center text-slate-500">No gyms registered yet.</td>
                                                    </tr>
                                                ) : (
                                                    stats.recentGyms.map(gym => (
                                                        <tr key={gym.gym_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                            <td className="p-4 font-medium text-slate-500">#{gym.gym_id}</td>
                                                            <td className="p-4 font-bold text-slate-800">{gym.gym_name}</td>
                                                            <td className="p-4 text-slate-600">{gym.owner_name}</td>
                                                            <td className="p-4 text-slate-600">{new Date(gym.created_at).toLocaleDateString()}</td>
                                                            <td className="p-4">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${gym.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                                    {gym.status || 'Active'}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <button 
                                                                    onClick={() => {
                                                                        setSelectedGym(gym);
                                                                        setIsManageModalOpen(true);
                                                                    }}
                                                                    className="text-blue-600 font-semibold text-sm hover:underline"
                                                                >
                                                                    Manage
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )
                    )}

                    {/* TAB 2: ALL GYMS */}
                    {activeTab === 'gyms' && <AllGyms />}

                    {/* TAB 3: PLATFORM USERS */}
                    {activeTab === 'users' && <PlatformUsers />}
                </main>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;