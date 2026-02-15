'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, removeProduct, editProduct } from '@/store/productSlice';
import Sidebar from '@/components/Sidebar';

export default function ProductsPage() {
    const dispatch = useDispatch();
    const { items: products, loading } = useSelector((state) => state.products);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        product_id: '',
        name: '',
        available_stocks: 0,
        price_per_unit: 0,
        tax_percentage: 0
    });

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'name' || name === 'product_id' ? value : parseFloat(value)
        }));
    };

    const handleEdit = (product) => {
        setIsEditing(true);
        setCurrentId(product.id);
        setFormData({
            product_id: product.product_id,
            name: product.name,
            available_stocks: product.available_stocks,
            price_per_unit: product.price_per_unit,
            tax_percentage: product.tax_percentage
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setShowModal(false);
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            product_id: '',
            name: '',
            available_stocks: 0,
            price_per_unit: 0,
            tax_percentage: 0
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await dispatch(editProduct({ id: currentId, data: formData })).unwrap();
            } else {
                await dispatch(addProduct(formData)).unwrap();
            }
            resetForm();
        } catch (err) {
            alert(err);
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            dispatch(removeProduct(id));
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 ml-64 bg-slate-50">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Manage Products</h2>
                    <button
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 text-sm"
                        onClick={() => setShowModal(true)}
                    >
                        <span className="text-lg">+</span> Add Product
                    </button>
                </header>

                <div className="p-10 max-w-7xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Product ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Name</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Stock</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Price</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Tax %</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-8 py-5 text-sm font-bold text-slate-400 group-hover:text-blue-500 transition-colors">{product.product_id}</td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-700">{product.name}</td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold">
                                                {product.available_stocks}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-700">₹{product.price_per_unit.toFixed(2)}</td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-700">{product.tax_percentage}%</td>
                                        <td className="px-8 py-5">
                                            <div className="flex gap-3">
                                                <button
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100"
                                                    onClick={() => handleEdit(product)}
                                                    title="Edit Product"
                                                >
                                                    <span className="text-lg">✏️</span>
                                                </button>
                                                <button
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                                                    onClick={() => handleDelete(product.id)}
                                                    title="Delete Product"
                                                >
                                                    <span className="text-lg">🗑️</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {products.length === 0 && (
                            <div className="p-20 text-center">
                                <span className="text-5xl block mb-4">📦</span>
                                <h3 className="text-xl font-bold text-slate-800">No products found</h3>
                                <p className="text-slate-500">Add your first product to get started.</p>
                            </div>
                        )}
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-white transform transition-all animate-in fade-in zoom-in duration-200">
                            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                {isEditing ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Product ID</label>
                                    <input
                                        name="product_id"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all bg-slate-50 disabled:opacity-50"
                                        value={formData.product_id}
                                        onChange={handleChange}
                                        placeholder="e.g. PRD001"
                                        required
                                        disabled={isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Product Name</label>
                                    <input
                                        name="name"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all bg-slate-50"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Stock</label>
                                        <input
                                            type="number"
                                            name="available_stocks"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all bg-slate-50"
                                            value={formData.available_stocks}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Price (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="price_per_unit"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all bg-slate-50"
                                            value={formData.price_per_unit}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Tax Percentage (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="tax_percentage"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all bg-slate-50"
                                        value={formData.tax_percentage}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex gap-4 mt-10">
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transform hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest"
                                    >
                                        {isEditing ? 'Update Product' : 'Save Product'}
                                    </button>
                                    <button
                                        type="button"
                                        className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all text-sm uppercase tracking-widest"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
