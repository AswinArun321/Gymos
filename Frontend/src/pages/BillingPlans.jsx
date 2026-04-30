import { useState } from 'react';
import { CreditCard, Plus, CheckCircle2, MoreVertical, Download } from 'lucide-react';

const BillingPlans = () => {
    // Realistic placeholder data so you can see the UI immediately!
    const [plans] = useState([
        { id: 1, name: 'Basic Monthly', price: '1,999', interval: 'month', activeMembers: 84 },
        { id: 2, name: 'Pro 6-Months', price: '10,500', interval: '6 months', activeMembers: 45 },
        { id: 3, name: 'Premium Annual', price: '18,000', interval: 'year', activeMembers: 13 },
    ]);

    const [transactions] = useState([
        { id: 'TXN-9823', member: 'Arjun Menon', amount: '10,500', plan: 'Pro 6-Months', date: 'Today, 10:42 AM', status: 'Paid' },
        { id: 'TXN-9822', member: 'Sneha Nair', amount: '18,000', plan: 'Premium Annual', date: 'Yesterday', status: 'Paid' },
        { id: 'TXN-9821', member: 'Rahul Kumar', amount: '1,999', plan: 'Basic Monthly', date: 'Apr 24, 2026', status: 'Failed' },
    ]);

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Billing & Plans</h2>
                    <p className="text-slate-500 mt-1">Manage membership tiers and track revenue.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center gap-2">
                    <Plus size={20} />
                    Create Plan
                </button>
            </div>

            {/* SECTION 1: Active Membership Plans */}
            <h3 className="text-lg font-bold text-slate-800 mb-4">Active Membership Tiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 pointer-events-none"></div>
                        
                        <h4 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h4>
                        <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-3xl font-black text-blue-600">₹{plan.price}</span>
                            <span className="text-sm font-medium text-slate-400">/{plan.interval}</span>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle2 size={16} className="text-emerald-500" /> Full Gym Access
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle2 size={16} className="text-emerald-500" /> Locker Room
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-sm font-semibold text-slate-500">{plan.activeMembers} Active</span>
                            <button className="text-blue-600 font-bold text-sm hover:underline">Edit Plan</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* SECTION 2: Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                                <th className="p-5 font-bold">Transaction ID</th>
                                <th className="p-5 font-bold">Member</th>
                                <th className="p-5 font-bold">Amount / Plan</th>
                                <th className="p-5 font-bold">Date</th>
                                <th className="p-5 font-bold">Status</th>
                                <th className="p-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(txn => (
                                <tr key={txn.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="p-5 text-sm font-medium text-slate-500">{txn.id}</td>
                                    <td className="p-5 font-bold text-slate-800">{txn.member}</td>
                                    <td className="p-5">
                                        <div className="font-bold text-slate-700">₹{txn.amount}</div>
                                        <div className="text-xs text-slate-500">{txn.plan}</div>
                                    </td>
                                    <td className="p-5 text-slate-600 font-medium">{txn.date}</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            txn.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button className="text-slate-400 hover:text-blue-600 transition-colors p-2">
                                            <MoreVertical size={18} />
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

export default BillingPlans;