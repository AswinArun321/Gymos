import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AddMemberModal from '../components/AddMemberModal';
import { 
    LayoutDashboard, Users, Dumbbell, CreditCard, 
    LogOut, TrendingUp, AlertCircle, Plus 
} from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // State to control if the modal is open or closed
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            
            {/* Modal Component (Hidden by default based on state) */}
            <AddMemberModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />

            {/* SIDEBAR */}
            <div className="w-64 bg-blue-900 text-white flex flex-col shadow-xl z-20">
                <div className="p-6 flex items-center gap-3 border-b border-blue-800">
                    <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">G</div>
                    <h1 className="text-2xl font-black tracking-tight">GymOS</h1>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-800 text-white rounded-xl transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="font-semibold">Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-blue-200 hover:bg-blue-800 hover:text-white rounded-xl transition-colors">
                        <Users size={20} />
                        <span className="font-semibold">Members</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-blue-200 hover:bg-blue-800 hover:text-white rounded-xl transition-colors">
                        <Dumbbell size={20} />
                        <span className="font-semibold">Trainers</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-blue-200 hover:bg-blue-800 hover:text-white rounded-xl transition-colors">
                        <CreditCard size={20} />
                        <span className="font-semibold">Billing & Plans</span>
                    </a>
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
                
                {/* Top Header */}
                <header className="bg-white p-8 flex justify-between items-center shadow-sm z-10 border-b border-slate-200">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">
                            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 👋
                        </h2>
                        <p className="text-slate-500 mt-1">Here is what's happening at your gym today.</p>
                    </div>
                    
                    {/* The Button that triggers the modal */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center gap-2 transform active:scale-95"
                    >
                        <Plus size={20} />
                        New Member
                    </button>
                </header>

                {/* Dashboard Widgets */}
                <main className="p-8">
                    
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                            <div className="h-14 w-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                <TrendingUp size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Monthly Revenue</p>
                                <h3 className="text-2xl font-bold text-slate-800">₹45,200</h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                            <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                <Users size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Active Members</p>
                                <h3 className="text-2xl font-bold text-slate-800">142</h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                            <div className="h-14 w-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                                <Dumbbell size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Trainers</p>
                                <h3 className="text-2xl font-bold text-slate-800">8</h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                            <div className="h-14 w-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                                <AlertCircle size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Expiring Soon</p>
                                <h3 className="text-2xl font-bold text-slate-800">12</h3>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Recent Registrations</h3>
                            <button className="text-blue-600 font-semibold text-sm hover:underline">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                                        <th className="p-4 font-semibold">Name</th>
                                        <th className="p-4 font-semibold">Plan</th>
                                        <th className="p-4 font-semibold">Join Date</th>
                                        <th className="p-4 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-800">Arjun Menon</td>
                                        <td className="p-4 text-slate-600">6 Months Pro</td>
                                        <td className="p-4 text-slate-600">Apr 24, 2026</td>
                                        <td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Active</span></td>
                                    </tr>
                                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-800">Sneha Nair</td>
                                        <td className="p-4 text-slate-600">1 Year Premium</td>
                                        <td className="p-4 text-slate-600">Apr 22, 2026</td>
                                        <td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Active</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;