'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDenominations, updateDenominationCount } from '@/store/denominationSlice';
import Sidebar from '@/components/Sidebar';

export default function DenominationsPage() {
    const dispatch = useDispatch();
    const { items: denominations, loading } = useSelector((state) => state.denominations);
    const [editingId, setEditingId] = useState(null);
    const [newCount, setNewCount] = useState(0);

    useEffect(() => {
        dispatch(fetchDenominations());
    }, [dispatch]);

    const handleEdit = (denom) => {
        setEditingId(denom.id);
        setNewCount(denom.count);
    };

    const handleSave = async (id) => {
        try {
            await dispatch(updateDenominationCount({ id, count: parseInt(newCount) })).unwrap();
            setEditingId(null);
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 ml-64 bg-slate-50">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Manage Cash Denominations</h2>
                </header>

                <div className="p-10 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {denominations.map(denom => (
                            <div key={denom.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden">

                                <div className="z-10 w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center text-3xl mb-4">
                                    💰
                                </div>

                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1 z-10">Denomination</h3>
                                <div className="text-2xl font-black text-slate-900 mb-6 z-10 flex items-center">
                                    <span className="text-blue-600 mr-1">₹</span>
                                    {denom.denomination}
                                </div>

                                {editingId === denom.id ? (
                                    <div className="z-10 w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        <div className="text-sm font-bold text-slate-500 mb-2">New Count</div>
                                        <input
                                            type="number"
                                            value={newCount}
                                            onChange={(e) => setNewCount(e.target.value)}
                                            className="w-full px-4 py-3 rounded-2xl border border-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all bg-blue-50/30 text-center text-xl font-black text-blue-600 mb-4"
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all text-xs uppercase tracking-widest"
                                                onClick={() => handleSave(denom.id)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl transition-all text-xs"
                                                onClick={() => setEditingId(null)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="z-10 w-full">
                                        <div className="text-sm font-bold text-slate-500 mb-2">Available Count</div>
                                        <div className="text-4xl font-black mb-6 tracking-tighter transition-colors">
                                            {denom.count}
                                        </div>
                                        <button
                                            className="w-full py-3 bg-slate-50 hover:bg-blue-600 text-slate-600 hover:text-white font-bold rounded-2xl transition-all border border-slate-200 hover:border-blue-600 text-xs uppercase tracking-widest leading-none outline-none"
                                            onClick={() => handleEdit(denom)}
                                        >
                                            Update Inventory
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
