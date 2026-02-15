'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminMe } from '@/store/authSlice';
import { fetchDashboardStats } from '@/store/dashboardSlice';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    const { admin, loading: authLoading } = useSelector((state) => state.auth);
    const { stats, loading: statsLoading, error: statsError } = useSelector((state) => state.dashboard);

    useEffect(() => {
        setMounted(true);
        dispatch(fetchAdminMe()).unwrap().catch(() => {
            router.push('/login');
        });

        // Initial fetch
        dispatch(fetchDashboardStats());

        // Setup polling every 30 seconds
        const pollInterval = setInterval(() => {
            dispatch(fetchDashboardStats());
        }, 30000);

        return () => clearInterval(pollInterval);
    }, [dispatch, router]);

    const formatDate = (dateString) => {
        if (!mounted) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const loading = authLoading || (statsLoading && !stats);

    if (loading && !stats) return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Dashboard...</div>
        </div>
    );

    if (statsError) return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="text-red-500 font-bold uppercase tracking-widest text-xs">Error: {statsError}</div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 ml-64 bg-slate-50">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrator</span>
                            <span className="text-sm font-bold text-slate-700">{admin?.username}</span>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                            {admin?.username?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Main Statistics</h1>
                        <p className="text-slate-500 mt-2 font-medium">Real-time performance overview of your billing system.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Invoices</h3>
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl text-xl group-hover:scale-110 transition-transform">🧾</div>
                            </div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter">{stats?.total_invoices || 0}</div>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-green-500/5 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</h3>
                                <div className="p-2.5 bg-green-50 text-green-600 rounded-xl text-xl group-hover:scale-110 transition-transform">💰</div>
                            </div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter">₹{stats?.revenue?.toLocaleString() || 0}</div>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Products</h3>
                                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl text-xl group-hover:scale-110 transition-transform">📦</div>
                            </div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter">{stats?.total_products || 0}</div>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Low Stock</h3>
                                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl text-xl group-hover:scale-110 transition-transform">⚠️</div>
                            </div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter">{stats?.low_stock_count || 0}</div>
                        </div>
                    </div>

                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Invoices</h2>
                        <button
                            onClick={() => router.push('/history')}
                            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                        >
                            View All History →
                        </button>
                    </div>

                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Customer Email</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Date & Time</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stats?.recent_invoices?.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5 text-sm font-bold text-slate-400">#{inv.id}</td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-700">{inv.customer_email}</td>
                                        <td className="px-8 py-5 text-sm font-medium text-slate-500">{formatDate(inv.created_at)}</td>
                                        <td className="px-8 py-5 text-sm font-black text-blue-600 text-right">₹{inv.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                                {(!stats?.recent_invoices || stats.recent_invoices.length === 0) && (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                            No recent invoices found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
