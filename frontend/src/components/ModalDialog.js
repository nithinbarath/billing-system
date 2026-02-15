'use client';

import React from 'react';

export default function ModalDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger",
    size = "md", // sm, md, lg, xl
    children,
    showFooter = true
}) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    const typeClasses = {
        danger: "bg-red-600 hover:bg-red-700 shadow-red-100 text-white",
        primary: "bg-blue-600 hover:bg-blue-700 shadow-blue-100 text-white",
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`bg-white rounded-[40px] shadow-2xl border border-slate-100 w-full ${sizeClasses[size]} relative z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-hidden`}>
                {/* Header */}
                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center bg-white hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-xl transition-all shadow-sm border border-slate-200 hover:border-red-100"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-10 overflow-y-auto">
                    {message && <p className="text-slate-500 font-medium leading-relaxed mb-6">{message}</p>}
                    {children}
                </div>

                {/* Footer */}
                {showFooter && (
                    <div className="px-10 py-6 border-t border-slate-100 flex gap-4 justify-end bg-slate-50/50">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all text-xs uppercase tracking-widest border border-slate-200"
                        >
                            {cancelText}
                        </button>
                        {onConfirm && (
                            <button
                                onClick={onConfirm}
                                className={`px-8 py-3 font-black rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-xs uppercase tracking-widest ${typeClasses[type]}`}
                            >
                                {confirmText}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
