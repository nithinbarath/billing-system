import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10">
      <main className="max-w-3xl w-full text-center space-y-12 animate-in fade-in zoom-in duration-700">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center text-white text-5xl shadow-2xl shadow-blue-200">
            ⚡
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter ">Billing</h1>
          <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">
            Next-generation billing and inventory management system powered by Tailwind CSS.
          </p>
        </div>

        <div className="flex gap-6 justify-center">
          <a
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-2xl shadow-blue-100 transition-all flex items-center gap-3 text-xs uppercase tracking-widest"
            href="/login"
          >
            Enter Login Page
          </a>
          <a
            className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-2xl border border-slate-200 transition-all text-xs uppercase tracking-widest"
            href="/dashboard"
          >
            Go to Dashboard Page
          </a>
        </div>

        <footer className="pt-20 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
          &copy; 2026 BillSystem • All Rights Reserved
        </footer>
      </main>
    </div>
  );
}
