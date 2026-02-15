'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin, clearError } from '@/store/authSlice';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();

    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
        return () => {
            dispatch(clearError());
        };
    }, [isAuthenticated, router, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginAdmin({ username, password }));
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-[400px] border border-slate-100">
                <h1 className="text-3xl font-extrabold text-center mb-8 text-blue-600 tracking-tight">Admin Login</h1>
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center mb-6 border border-red-100">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all bg-slate-50 focus:bg-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="mb-8">
                        <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all bg-slate-50 focus:bg-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5 active:translate-y-0 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
