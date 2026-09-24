'use client';

import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  ShieldAlert,
  MapPin,
  PieChart,
  Sparkles,
  Bot,
  FileText,
  CheckCircle2,
  Database,
  Info,
  Building2,
  Layers
} from 'lucide-react';

export type NavView =
  | 'dashboard'
  | 'financial-performance'
  | 'credit-analytics'
  | 'asset-quality'
  | 'geography'
  | 'sector-analysis'
  | 'ai-insights'
  | 'report-generator'
  | 'data-quality'
  | 'data-sources'
  | 'about';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-600 to-cyan-600', dot: 'bg-blue-400' },
    { id: 'financial-performance', label: 'Financial Performance', icon: TrendingUp, color: 'from-teal-600 to-emerald-600', dot: 'bg-teal-400' },
    { id: 'credit-analytics', label: 'Credit & Loan Analytics', icon: CreditCard, color: 'from-indigo-600 to-blue-600', dot: 'bg-indigo-400' },
    { id: 'asset-quality', label: 'Asset Quality & Risk', icon: ShieldAlert, color: 'from-rose-600 to-red-600', dot: 'bg-rose-400' },
    { id: 'geography', label: 'Branch & Geography', icon: MapPin, color: 'from-emerald-600 to-teal-600', dot: 'bg-emerald-400' },
    { id: 'sector-analysis', label: 'Sector Analysis', icon: PieChart, color: 'from-purple-600 to-violet-600', dot: 'bg-purple-400' },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles, color: 'from-violet-600 to-purple-600', dot: 'bg-violet-400' },
    { id: 'report-generator', label: 'Report Generator', icon: FileText, color: 'from-blue-700 to-indigo-700', dot: 'bg-blue-400' },
    { id: 'data-quality', label: 'Data Quality & Audit', icon: CheckCircle2, color: 'from-amber-600 to-orange-600', dot: 'bg-amber-400' },
    { id: 'data-sources', label: 'Data Sources (RBI)', icon: Database, color: 'from-cyan-700 to-teal-700', dot: 'bg-cyan-400' },
    { id: 'about', label: 'Project Architecture', icon: Layers, color: 'from-indigo-600 to-slate-800', dot: 'bg-indigo-400' },
  ];

  return (
    <aside className="w-64 bg-fintech-navy text-white flex flex-col flex-shrink-0 h-screen sticky top-0 select-none z-30 border-r border-slate-800/80 shadow-fintech-lg">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/70 bg-gradient-to-b from-fintech-navy to-[#0b1d36]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md ring-2 ring-white/10">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tight text-white leading-snug flex items-center gap-1.5">
              <span>FinIntellect</span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-500/30 text-cyan-300 border border-cyan-400/40">
                RBI
              </span>
            </h1>
            <p className="text-[10px] text-cyan-200/80 font-semibold tracking-wide">
              Banking Decision Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Analytics
        </div>
        {navItems.slice(0, 6).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id as NavView)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 group ${
                isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-sm ring-1 ring-white/20`
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {isActive && (
                <span className={`w-1.5 h-1.5 rounded-full ${item.dot} shadow-sm ring-2 ring-white/40`} />
              )}
            </button>
          );
        })}

        <div className="pt-4 px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          AI & Decision Support
        </div>
        {navItems.slice(6, 9).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id as NavView)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 group ${
                isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-sm ring-1 ring-white/20`
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {isActive && (
                <span className={`w-1.5 h-1.5 rounded-full ${item.dot} shadow-sm ring-2 ring-white/40`} />
              )}
            </button>
          );
        })}

        <div className="pt-4 px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Governance & System
        </div>
        {navItems.slice(9).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id as NavView)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 group ${
                isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-sm ring-1 ring-white/20`
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {isActive && (
                <span className={`w-1.5 h-1.5 rounded-full ${item.dot} shadow-sm ring-2 ring-white/40`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/70 bg-[#09182d] text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            RBI DBIE Sync
          </span>
          <span className="font-mono text-[10px] text-cyan-400/80 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
