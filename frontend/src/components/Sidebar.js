'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ModalDialog from './ModalDialog';

export default function Sidebar() {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter();

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = async () => {
        await dispatch(logoutAdmin());
        setIsLogoutModalOpen(false);
        router.push('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Billing', path: '/billing', icon: '🧾' },
        { name: 'Products', path: '/products', icon: '📦' },
        { name: 'Denominations', path: '/denominations', icon: '💰' },
        { name: 'History', path: '/history', icon: '📜' }
    ];

    return (
        <div className="w-64 bg-zinc-900 text-white h-screen p-6 flex flex-col fixed left-0 top-0 shadow-2xl z-50">
            <div className="text-2xl font-black mb-10 px-2 tracking-tighter">
                <span className="text-white">Billing System</span>
            </div>
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <span className={`text-xl transition-transform duration-200 group-hover:scale-110 ${isActive ? 'mr-3' : 'mr-3 opacity-70'}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="pt-6 border-t border-slate-800">
                <div
                    className="flex items-center px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200 cursor-pointer group"
                    onClick={handleLogoutClick}
                >
                    <span className="text-xl mr-3 group-hover:scale-110 transition-transform">🚪</span>
                    <span className="font-medium">Logout</span>
                </div>
            </div>

            <ModalDialog
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={confirmLogout}
                title="Confirm Logout"
                message="Are you sure you want to log out of your session?"
                confirmText="Logout"
                cancelText="Stay logged in"
            />
        </div>
    );
}
