'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInvoices, fetchInvoiceDetails, clearCurrentInvoice } from '@/store/invoiceSlice';
import Sidebar from '@/components/Sidebar';

export default function HistoryPage() {
    const dispatch = useDispatch();
    const { items: invoices, currentInvoice, loading } = useSelector((state) => state.invoices);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        dispatch(fetchInvoices());
    }, [dispatch]);

    const viewDetails = (id) => {
        dispatch(fetchInvoiceDetails(id));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        dispatch(clearCurrentInvoice());
    };

    const formatDate = (dateString) => {
        if (!mounted) return "";
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 ml-64 bg-slate-50">
                <div className="p-10 max-w-7xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Billing History</h1>
                        <p className="text-slate-500 mt-2 text-lg font-medium">View customer invoices</p>
                    </header>

                    {loading && !isModalOpen ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-slate-200 shadow-sm">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading records...</div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 ">Bill Date</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 ">Customer Email</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 ">Items Count</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 ">Net Amount</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 ">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {invoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-8 py-6 text-sm font-bold text-slate-400 tracking-tight">
                                                {formatDate(inv.created_at)}
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-slate-700 tracking-tight">
                                                {inv.customer_email}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                                    {inv.items?.length || 0} items
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-lg font-black text-blue-600 tracking-tighter">
                                                    ₹{inv.rounded_net_price.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <button
                                                    className="px-6 py-2 bg-white text-blue-600 hover:bg-blue-600 hover:text-white border-2 border-blue-50 hover:border-blue-600 rounded-xl font-bold text-xs transition-all uppercase tracking-widest shadow-sm hover:shadow-lg shadow-blue-100"
                                                    onClick={() => viewDetails(inv.id)}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {invoices.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-sm ">
                                                No billing history found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {isModalOpen && currentInvoice && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={closeModal}>
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl border border-white transform transition-all animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-blue-600 text-white rounded-2xl text-2xl shadow-lg shadow-blue-200">🧾</div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Invoice Details</h2>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                                        #{currentInvoice.id} • {mounted ? new Date(currentInvoice.created_at).toLocaleString() : ''}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="w-12 h-12 flex items-center justify-center bg-white hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-2xl transition-all shadow-sm border border-slate-100 hover:border-red-100 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto">
                            <div className="bg-slate-50 p-6 rounded-3xl mb-10 border border-slate-100">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Customer</label>
                                <span className="text-xl font-black text-slate-800 tracking-tight">{currentInvoice.customer_email}</span>
                            </div>

                            <div className="rounded-3xl border border-slate-200 overflow-hidden mb-8">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 ">Bill Product</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Unit Price</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-center">Qty</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Tax (%)</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {currentInvoice.items.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors ">
                                                <td className="px-8 py-5">
                                                    <div className="text-sm font-black text-slate-800 tracking-tight">{item.product_name}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{item.product_id}</div>
                                                </td>
                                                <td className="px-8 py-5 text-sm font-bold text-slate-600 text-right">₹{item.unit_price.toFixed(2)}</td>
                                                <td className="px-8 py-5 text-sm font-black text-slate-800 text-center">{item.quantity}</td>
                                                <td className="px-8 py-5 text-sm font-bold text-slate-600 text-right">₹{item.tax_payable.toFixed(2)}</td>
                                                <td className="px-8 py-5 text-sm font-black text-slate-900 text-right tracking-tight">₹{item.total_price.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-12 p-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] text-white flex justify-between items-center shadow-2xl shadow-slate-200">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Price without tax:</span>
                                        <span className="text-xl font-bold tracking-tight">₹{currentInvoice.total_without_tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total tax payable:</span>
                                        <span className="text-xl font-bold tracking-tight">₹{currentInvoice.total_tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Rounded down value of the purchased item net price:</span>
                                        <span className="text-xl font-bold tracking-tight">₹{currentInvoice.rounded_net_price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
