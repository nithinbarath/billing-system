'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInvoices, fetchInvoiceDetails, clearCurrentInvoice } from '@/store/invoiceSlice';
import Sidebar from '@/components/Sidebar';
import ModalDialog from '@/components/ModalDialog';

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

    const formatDate = (dateString, includeTime = true) => {
        if (!mounted) return "";
        const date = new Date(dateString);
        if (includeTime) {
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        return date.toLocaleDateString();
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

                <ModalDialog
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title="Invoice Details"
                    size="xl"
                    showFooter={false}
                >
                    {currentInvoice ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Customer Email</label>
                                    <span className="text-lg font-black text-slate-800 tracking-tight">{currentInvoice.customer_email}</span>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Billing Date & Time</label>
                                    <span className="text-lg font-black text-slate-800 tracking-tight">{formatDate(currentInvoice.created_at)}</span>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-100 overflow-hidden bg-white">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Product</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Price</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-center">Qty</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Tax (%)</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {currentInvoice.items.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-black text-slate-800 tracking-tight">{item.product_name}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{item.product_id}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-600 text-right">₹{item.unit_price.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-sm font-black text-slate-800 text-center">{item.quantity}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-600 text-right">{item.tax_percentage}%</td>
                                                <td className="px-6 py-4 text-sm font-black text-blue-600 text-right tracking-tight">₹{item.total_price.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
                                <div className="grid grid-cols-2 gap-8 items-center relative z-10">
                                    <div className="space-y-3 opacity-80">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span>Subtotal</span>
                                            <span>₹{currentInvoice.total_without_tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span>Total Tax</span>
                                            <span>₹{currentInvoice.total_tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span>Net Price</span>
                                            <span>₹{currentInvoice.net_price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="text-right border-l border-slate-800 pl-8">
                                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Total Bill Amount</span>
                                        <div className="text-4xl font-black tracking-tighter">₹{currentInvoice.rounded_net_price.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 -mr-16 -mt-16 rounded-full blur-3xl opacity-20"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </ModalDialog>
            </main>
        </div>
    );
}
