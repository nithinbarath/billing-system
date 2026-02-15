'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '@/store/productSlice';
import { fetchDenominations } from '@/store/denominationSlice';
import { createInvoice, previewInvoice } from '@/lib/api';
import Sidebar from '@/components/Sidebar';

export default function BillingPage() {
    const dispatch = useDispatch();
    const { items: productsMaster } = useSelector((state) => state.products);
    const { items: denominationsMaster } = useSelector((state) => state.denominations);

    const [view, setView] = useState('input'); // 'input' or 'summary'
    const [customerEmail, setCustomerEmail] = useState('');
    const [billItems, setBillItems] = useState([{ product_id: '', quantity: 1 }]);
    const [cashDenoms, setCashDenoms] = useState({
        500: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0
    });
    const [cashPaid, setCashPaid] = useState(0);
    const [billSummary, setBillSummary] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Live calculations
    const liveItems = billItems.map(item => {
        const product = productsMaster.find(p => p.product_id === item.product_id);
        if (!product) return { ...item, subtotal: 0, tax: 0, total: 0 };
        const subtotal = product.price_per_unit * (parseInt(item.quantity) || 0);
        const tax = (subtotal * product.tax_percentage) / 100;
        return {
            ...item,
            name: product.name,
            price: product.price_per_unit,
            subtotal,
            tax,
            total: subtotal + tax
        };
    });

    const liveTotals = liveItems.reduce((acc, item) => ({
        subtotal: acc.subtotal + item.subtotal,
        tax: acc.tax + item.tax,
        total: acc.total + item.total
    }), { subtotal: 0, tax: 0, total: 0 });

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchDenominations());
    }, [dispatch]);

    useEffect(() => {
        const total = Object.entries(cashDenoms).reduce((acc, [val, count]) => {
            return acc + (parseInt(val) * (parseInt(count) || 0));
        }, 0);
        setCashPaid(total);
    }, [cashDenoms]);

    const addItem = () => {
        setBillItems([...billItems, { product_id: '', quantity: 1 }]);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...billItems];
        newItems[index][field] = value;
        setBillItems(newItems);
    };

    const updateCashDenom = (denom, count) => {
        setCashDenoms({ ...cashDenoms, [denom]: count });
    };

    const calculateBill = async () => {
        if (!customerEmail) return alert("Please enter customer email");

        const previewRequest = {
            customer_email: customerEmail,
            items: billItems.filter(item => item.product_id).map(item => ({
                product_id: item.product_id,
                quantity: parseInt(item.quantity) || 0
            })),
            cash_paid: cashPaid,
            cash_denominations: cashDenoms
        };

        if (previewRequest.items.length === 0) return alert("Please select at least one product");

        try {
            const result = await previewInvoice(previewRequest);
            setBillSummary(result);
            setView('summary');
            // Reset denominations for next time or to keep UI clean
            setCashPaid(0);
            setCashDenoms({ 1: 0, 2: 0, 5: 0, 10: 0, 20: 0, 50: 0, 100: 0, 500: 0 });
        } catch (err) {
            alert(err.message);
        }
    };

    const saveBill = async () => {
        setIsSaving(true);
        try {
            await createInvoice(billSummary);
            alert("Bill saved successfully!");
            setView('input');
            setBillItems([{ product_id: '', quantity: 1 }]);
            setCustomerEmail('');
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (view === 'summary') {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <main className="flex-1 ml-64 bg-slate-50">
                    <div className="p-10 max-w-7xl mx-auto">
                        <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-12">
                            <header className="text-center mb-12">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter ">Billing Summary</h2>
                            </header>

                            <div className="bg-slate-50 p-6 rounded-3xl mb-10 border border-slate-100 flex items-center justify-between">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Customer Email</label>
                                    <span className="text-lg font-black text-slate-800 tracking-tight">{billSummary.customer_email}</span>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 overflow-hidden mb-12">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 ">Bill Product</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Price</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-center">Qty</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Subtotal</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Tax (%)</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Tax Amt.</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {billSummary?.items?.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors ">
                                                <td className="px-8 py-5 font-black text-slate-800 tracking-tight text-sm">{item.product_id}</td>
                                                <td className="px-8 py-5 text-sm font-bold text-slate-600 text-right">₹{item.unit_price.toFixed(2)}</td>
                                                <td className="px-8 py-5 text-sm font-black text-slate-800 text-center">{item.quantity}</td>
                                                <td className="px-8 py-5 text-sm font-bold text-slate-600 text-right">₹{item.purchase_price.toFixed(2)}</td>
                                                <td className="px-8 py-5 text-sm font-bold text-slate-600 text-right">{item.tax_percentage}%</td>
                                                <td className="px-8 py-5 text-sm font-bold text-slate-600 text-right">₹{item.tax_payable.toFixed(2)}</td>
                                                <td className="px-8 py-5 text-sm font-black text-slate-900 text-right tracking-tight">₹{item.total_price.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-2 gap-12 mb-12">
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-400 tracking-[0.3em] mb-4">Balance Denomination</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {[500, 100, 50, 20, 10, 5, 2, 1].map(val => {
                                            const countToGive = billSummary?.change_denominations?.[String(val)] || 0;
                                            const stock = billSummary?.available_stocks?.[String(val)] || 0;
                                            const isActive = countToGive > 0;
                                            return (
                                                <div key={val} className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center ${isActive ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105 z-10' : 'bg-white border-slate-100 text-slate-400 opacity-60'}`}>
                                                    <div className="text-[10px] font-black uppercase mb-1 tracking-widest">₹{val}</div>
                                                    <div className="text-xl font-black ">
                                                        {isActive ? `× ${countToGive}` : '—'}
                                                    </div>
                                                    <div className={`text-[8px] font-black uppercase mt-2 pt-2 border-t w-full text-center tracking-tighter ${isActive ? 'border-blue-500 text-blue-200' : 'border-slate-50 text-slate-300'}`}>
                                                        Stock: {stock}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-[40px] p-8 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-slate-200">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 -mr-16 -mt-16 rounded-full blur-3xl opacity-20"></div>
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center text-xs font-bold text-slate-400 tracking-widest">
                                            <span>Total Price without tax</span>
                                            <span className="text-white">₹{billSummary.total_without_tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-bold text-slate-400 tracking-widest">
                                            <span>Total tax payable</span>
                                            <span className="text-white">₹{billSummary.total_tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-bold text-slate-400 tracking-widest">
                                            <span>Net price of the purchased item</span>
                                            <span className="text-white">₹{billSummary.net_price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-bold text-slate-400 tracking-widest">
                                            <span>Rounded down value of the purchased item net price</span>
                                            <span className="text-white">₹{billSummary.rounded_net_price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-bold text-slate-400 tracking-widest">
                                            <span>Balance payable to the customer</span>
                                            <span className="text-white">₹{billSummary.balance_payable.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-6 justify-end">
                                <button
                                    className="px-10 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all text-xs uppercase tracking-[0.2em]"
                                    onClick={() => setView('input')}
                                >
                                    Back to Billing
                                </button>
                                <button
                                    className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 transform hover:-translate-y-0.5 active:translate-y-0 transition-all text-xs uppercase tracking-[0.2em] disabled:opacity-50"
                                    onClick={saveBill}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 ml-64 bg-slate-50">
                <div className="p-10 max-w-7xl mx-auto">
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-12">
                        <header className="text-center mb-16">
                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter ">Billing</h2>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em] mt-3 mr-[-0.4em]">Point of Sale Interface</p>
                        </header>

                        <form className="space-y-16">
                            <section className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 mb-12">
                                <div className="flex items-center gap-10">
                                    <div className="flex-1 space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1 ">Customer Email</label>
                                        <input
                                            type="email"
                                            placeholder="example@gmail.com"
                                            className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-8 focus:ring-blue-600/5 focus:border-blue-600 transition-all bg-white text-lg font-bold tracking-tight"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                        <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xs">1</span>
                                        Bill Section
                                    </h3>
                                    <button
                                        type="button"
                                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
                                        onClick={addItem}
                                    >
                                        <span className="text-lg">+</span> Add New
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {billItems.map((item, idx) => {
                                        const liveItem = liveItems[idx];
                                        return (
                                            <div key={idx} className="grid grid-cols-[1fr_120px_140px_60px] gap-6 animate-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                                                <div className="space-y-2">
                                                    <select
                                                        value={item.product_id}
                                                        onChange={(e) => updateItem(idx, 'product_id', e.target.value)}
                                                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all bg-white font-bold text-slate-700"
                                                    >
                                                        <option value="">Search & Select product catalogue...</option>
                                                        {productsMaster.map(p => (
                                                            <option key={p.id} value={p.product_id}>{p.product_id} — {p.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                                                            className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all bg-white font-black text-center text-lg "
                                                            min="1"
                                                        />
                                                        <span className="absolute top-1/2 left-4 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase ">Qty</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-center px-4 bg-slate-50 rounded-2xl border border-slate-100 min-w-[140px]">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Price</span>
                                                    <span className="text-sm font-black text-slate-900 tracking-tight">₹{liveItem.total.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    {billItems.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setBillItems(billItems.filter((_, i) => i !== idx))}
                                                            className="w-full h-[62px] flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl border border-red-100 transition-all text-xl"
                                                        >✕</button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            <div className="space-y-12">
                                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-200">
                                    <h3 className="text-xs font-black text-slate-400 tracking-[0.3em] mb-8 flex items-center gap-2">
                                        Price Details
                                    </h3>
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100">
                                            <span className="text-[10px] font-black text-slate-400 tracking-widest">Total Price without tax</span>
                                            <span className="text-xl font-black text-slate-800 tracking-tight">₹{liveTotals.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100">
                                            <span className="text-[10px] font-black text-slate-400 tracking-widest">Tax</span>
                                            <span className="text-xl font-black text-blue-600 tracking-tight">+ ₹{liveTotals.tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-blue-600 p-6 rounded-[24px] text-white shadow-xl shadow-blue-100">
                                            <span className="text-xs font-black tracking-widest opacity-80">Total Price</span>
                                            <span className="text-3xl font-black tracking-tighter">₹{Math.round(liveTotals.total).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-200 shadow-inner">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-10">
                                        <span className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xs">2</span>
                                        Denominations
                                    </h3>

                                    <div className="flex gap-10 items-stretch">
                                        <div className="flex-1 space-y-4">
                                            <div className="grid grid-cols-4 gap-4">
                                                {[500, 100, 50, 20, 10, 5, 2, 1].map((val) => (
                                                    <div key={val} className="bg-white p-4 rounded-2xl border border-slate-200 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-600 transition-all group">
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ">₹{val}</div>
                                                        <input
                                                            type="number"
                                                            value={cashDenoms[val] || ''}
                                                            onChange={(e) => updateCashDenom(val, e.target.value)}
                                                            className="w-full bg-transparent border-none outline-none font-black text-2xl text-slate-800 placeholder:text-slate-100 transition-colors group-focus-within:text-blue-600"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="w-[300px] bg-blue-600 rounded-[32px] p-8 text-white flex flex-col items-center justify-center text-center shadow-2xl shadow-blue-200 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-blue-500 transition-transform duration-500 origin-left"></div>
                                            <div className="z-10 relative">
                                                <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-blue-200 mb-2 ">Total Cash Provided</span>
                                                <div className="text-5xl font-black tracking-tighter drop-shadow-lg">
                                                    ₹{cashPaid.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-6 justify-end pt-10 border-t border-slate-100 mt-12">
                                <button
                                    type="button"
                                    className="px-10 py-5 bg-white hover:bg-red-50 text-red-500 font-bold rounded-2xl transition-all text-xs tracking-[0.2em] border border-slate-200 hover:border-red-100"
                                    onClick={() => {
                                        setBillItems([{ product_id: '', quantity: 1 }]);
                                        setCustomerEmail('');
                                        setCashDenoms({ 1: 0, 2: 0, 5: 0, 10: 0, 20: 0, 50: 0, 100: 0, 500: 0 });
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-16 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-2xl shadow-blue-100 transform hover:-translate-y-1 active:translate-y-0 transition-all text-sm tracking-[0.3em] flex items-center gap-4 "
                                    onClick={calculateBill}
                                >
                                    Generate
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
