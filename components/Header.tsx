'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  ExternalLink,
  Bell,
  ShieldCheck,
  Sparkles,
  X,
  TrendingUp,
  CreditCard,
  ShieldAlert,
  MapPin,
  PieChart,
  LayoutDashboard,
  ChevronRight,
  CornerDownLeft,
  Bot,
  FileText,
  Database,
  CheckCircle2,
  Layers,
  Building2,
  ArrowRight
} from 'lucide-react';
import { NavView } from './Sidebar';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedPeriod?: string;
  onPeriodChange?: (val: string) => void;
  onSelectView?: (view: NavView) => void;
  onLaunchAiQuery?: (query: string) => void;
  onSelectState?: (stateName: string) => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'View' | 'Metric' | 'State' | 'Sector' | 'Bank Group' | 'AI Query';
  icon: any;
  view: NavView;
  badge?: string;
  action?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  onSelectView,
  onLaunchAiQuery,
  onSelectState,
}) => {
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/YOUR_PROFILE/';
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global search database
  const searchDatabase: SearchItem[] = useMemo(() => [
    // Views
    { id: 'v-dashboard', title: 'Executive Overview Dashboard', subtitle: 'Macro indicators, systemic deposits, gross credit & asset quality', category: 'View', icon: LayoutDashboard, view: 'dashboard' },
    { id: 'v-fin', title: 'Financial Performance & Profitability', subtitle: 'Public vs Private bank groups, Return on Assets (RoA), Margins', category: 'View', icon: TrendingUp, view: 'financial-performance' },
    { id: 'v-credit', title: 'Credit & Loan Deployment Analytics', subtitle: 'Credit-Deposit (CD) ratio distribution & systemic liquidity', category: 'View', icon: CreditCard, view: 'credit-analytics' },
    { id: 'v-asset', title: 'Asset Quality & Risk Surveillance', subtitle: 'Gross NPAs (2.80%), Net NPAs, and Provision Coverage Ratio (PCR)', category: 'View', icon: ShieldAlert, view: 'asset-quality' },
    { id: 'v-geo', title: 'Branch & Geographic Intelligence', subtitle: 'RBI BSR returns across 36 States, Districts & 158,400 Offices', category: 'View', icon: MapPin, view: 'geography' },
    { id: 'v-sector', title: 'Sectoral Deployment Analysis', subtitle: 'Retail loans, Services, Industrial capex & Agriculture deployment', category: 'View', icon: PieChart, view: 'sector-analysis' },
    { id: 'v-ai', title: 'AI Decision Intelligence & Chat', subtitle: 'Audited RBI DBIE intelligence synthesis and conversational assistant', category: 'View', icon: Sparkles, view: 'ai-insights' },
    { id: 'v-report', title: 'Executive Report Generator', subtitle: 'Download comprehensive official Word (.DOCX) report brief', category: 'View', icon: FileText, view: 'report-generator' },
    { id: 'v-dq', title: 'Data Quality & Validation Audit', subtitle: 'ETL completeness (99.59%), consistency score (99.82%) & axiom checks', category: 'View', icon: CheckCircle2, view: 'data-quality' },
    { id: 'v-sources', title: 'Official RBI Data Sources', subtitle: 'Reserve Bank of India DBIE & BSR series documentation', category: 'View', icon: Database, view: 'data-sources' },
    { id: 'v-about', title: 'System Architecture & Blueprint', subtitle: 'Star schema, ETL pipeline, and production-grade engineering', category: 'View', icon: Layers, view: 'about' },

    // KPIs & Metrics
    { id: 'm-cd', title: 'Credit-Deposit (CD) Ratio', subtitle: 'Current: 80.34% • Prudential Benchmark: 70.0% – 75.0%', category: 'Metric', icon: CreditCard, view: 'credit-analytics', badge: '80.34%' },
    { id: 'm-gnpa', title: 'Gross NPA Ratio', subtitle: 'Current: 2.80% • Decadal 12-Year Historic Low (Down from 11.2% in FY18)', category: 'Metric', icon: ShieldAlert, view: 'asset-quality', badge: '2.80%' },
    { id: 'm-dep', title: 'Total System Deposits', subtitle: 'Volume: ₹204.38 Lakh Crore (+11.4% YoY Growth across SCBs)', category: 'Metric', icon: Database, view: 'dashboard', badge: '₹204.38L Cr' },
    { id: 'm-cred', title: 'Gross Bank Advances / Credit', subtitle: 'Volume: ₹164.20 Lakh Crore (+15.3% YoY Growth across SCBs)', category: 'Metric', icon: TrendingUp, view: 'credit-analytics', badge: '₹164.20L Cr' },
    { id: 'm-roa', title: 'Return on Assets (RoA)', subtitle: 'Average: +1.15% • Historic turnaround from -0.30% in FY18', category: 'Metric', icon: TrendingUp, view: 'financial-performance', badge: '+1.15%' },
    { id: 'm-pcr', title: 'Provision Coverage Ratio (PCR)', subtitle: 'Average: 76.40% • Comfortably above 70% regulatory baseline', category: 'Metric', icon: ShieldAlert, view: 'asset-quality', badge: '76.40%' },
    { id: 'm-offices', title: 'Reporting Bank Branches', subtitle: 'Total: 158,400 Commercial Offices (48,200+ Rural & Semi-Urban)', category: 'Metric', icon: MapPin, view: 'geography', badge: '158,400' },

    // Bank Groups
    { id: 'bg-psb', title: 'Public Sector Banks (PSBs)', subtitle: 'Advances: ₹98.40L Cr | Deposits: ₹123.10L Cr | Avg GNPA: 3.20%', category: 'Bank Group', icon: Building2, view: 'financial-performance', badge: '60.2% Share' },
    { id: 'bg-pvt', title: 'Private Sector Banks', subtitle: 'Advances: ₹58.20L Cr | Deposits: ₹68.50L Cr | Avg GNPA: 2.10%', category: 'Bank Group', icon: Building2, view: 'financial-performance', badge: '33.5% Share' },
    { id: 'bg-for', title: 'Foreign Commercial Banks', subtitle: 'Advances: ₹5.40L Cr | Deposits: ₹7.20L Cr | Avg RoA: +1.45%', category: 'Bank Group', icon: Building2, view: 'financial-performance', badge: '3.5% Share' },
    { id: 'bg-rrb', title: 'Regional Rural Banks (RRBs)', subtitle: 'Advances: ₹2.20L Cr | Deposits: ₹5.58L Cr | Focus: Priority Sector', category: 'Bank Group', icon: Building2, view: 'financial-performance', badge: '2.8% Share' },

    // States & Regions
    { id: 'st-mh', title: 'Maharashtra', subtitle: 'Credit: ₹45.20 Lakh Cr (27.5% share) • CD Ratio: 101.4% (Financial Hub)', category: 'State', icon: MapPin, view: 'geography', badge: 'Rank #1' },
    { id: 'st-up', title: 'Uttar Pradesh', subtitle: 'Credit: ₹11.20 Lakh Cr (6.8% share) • High deposit mobilization corridor', category: 'State', icon: MapPin, view: 'geography', badge: 'Rank #2' },
    { id: 'st-tn', title: 'Tamil Nadu', subtitle: 'Credit: ₹10.80 Lakh Cr (6.6% share) • Strong industrial & MSME credit', category: 'State', icon: MapPin, view: 'geography', badge: 'Rank #3' },
    { id: 'st-ka', title: 'Karnataka', subtitle: 'Credit: ₹10.10 Lakh Cr (6.2% share) • Technology, services & agri credit', category: 'State', icon: MapPin, view: 'geography', badge: 'Rank #4' },
    { id: 'st-gj', title: 'Gujarat', subtitle: 'Credit: ₹8.90 Lakh Cr (5.4% share) • Manufacturing & export financing hub', category: 'State', icon: MapPin, view: 'geography', badge: 'Rank #5' },
    { id: 'st-kl', title: 'Kerala', subtitle: 'Strong NRI remittance deposit base • Low default risk', category: 'State', icon: MapPin, view: 'geography', badge: 'CD: 65%' },
    { id: 'st-dl', title: 'Delhi NCT', subtitle: 'Corporate debt treasury & large syndication deployment', category: 'State', icon: MapPin, view: 'geography', badge: 'Metro' },
    { id: 'st-wb', title: 'West Bengal', subtitle: 'Eastern commercial credit and MSME trade financing', category: 'State', icon: MapPin, view: 'geography', badge: 'Eastern Hub' },

    // Sectors
    { id: 'sec-ret', title: 'Retail & Personal Loans', subtitle: '₹54.60 Lakh Cr (33.3% share) • Velocity: +21.40% YoY (Highest)', category: 'Sector', icon: PieChart, view: 'sector-analysis', badge: '+21.4% YoY' },
    { id: 'sec-ser', title: 'Services Sector Credit', subtitle: '₹44.10 Lakh Cr (26.9% share) • Velocity: +18.20% YoY', category: 'Sector', icon: PieChart, view: 'sector-analysis', badge: '+18.2% YoY' },
    { id: 'sec-ind', title: 'Industry & Manufacturing', subtitle: '₹36.80 Lakh Cr (22.4% share) • Velocity: +8.50% YoY capex revival', category: 'Sector', icon: PieChart, view: 'sector-analysis', badge: '+8.5% YoY' },
    { id: 'sec-agr', title: 'Agriculture & Allied Activities', subtitle: '₹20.40 Lakh Cr (12.4% share) • Velocity: +16.80% YoY (PSL Targets)', category: 'Sector', icon: PieChart, view: 'sector-analysis', badge: '+16.8% YoY' },
    { id: 'sec-msme', title: 'MSME & Priority Sector Advances', subtitle: '₹8.30 Lakh Cr (5.0% share) • Working capital lines', category: 'Sector', icon: PieChart, view: 'sector-analysis', badge: 'Priority Sector' },
  ], []);

  // Filtered results based on search query
  const filteredResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      // Default recommended / trending shortcuts
      return searchDatabase.filter(item =>
        ['m-cd', 'm-gnpa', 'st-mh', 'sec-ret', 'v-ai'].includes(item.id)
      );
    }

    return searchDatabase.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubtitle = item.subtitle.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      return matchTitle || matchSubtitle || matchCategory;
    });
  }, [searchTerm, searchDatabase]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global hotkey: Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectItem = (item: SearchItem) => {
    if (onSelectView) {
      onSelectView(item.view);
    }
    if (item.category === 'State' && onSelectState) {
      onSelectState(item.title);
    }
    setIsOpen(false);
  };

  const handleLaunchAi = (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;
    if (onLaunchAiQuery) {
      onLaunchAiQuery(q);
    }
    if (onSelectView) {
      onSelectView('ai-insights');
    }
    setIsOpen(false);
  };

  const handleKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults.length > 0 && !searchTerm.includes('?')) {
        handleSelectItem(filteredResults[0]);
      } else if (searchTerm.trim()) {
        handleLaunchAi(searchTerm);
      }
    }
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-300/90 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      {/* Search Engine Container */}
      <div ref={containerRef} className="relative w-full max-w-md lg:max-w-lg">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search metrics, banks, states, sectors, or ask AI... (Press Ctrl+K)"
            value={searchTerm}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDownInput}
            className="w-full pl-9 pr-16 py-2 text-xs bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-slate-300/90 focus:border-blue-500 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium shadow-2xs"
          />

          {/* Quick Clear or Keyboard Shortcut Pill */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchTerm ? (
              <button
                onClick={() => {
                  onSearchChange('');
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-200/80 border border-slate-300 rounded font-mono select-none">
                Ctrl K
              </span>
            )}
          </div>
        </div>

        {/* Search Results Dropdown Panel */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[460px] flex flex-col">
            {/* Header info */}
            <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-bold">
                {searchTerm.trim() ? `Search results for "${searchTerm}"` : 'Recommended & Quick Telemetry'}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                Press <CornerDownLeft className="w-3 h-3" /> to navigate
              </span>
            </div>

            {/* AI Assistant Instant Query Prompt */}
            {searchTerm.trim().length > 0 && (
              <div className="p-2 border-b border-sky-100 bg-gradient-to-r from-sky-50/80 via-blue-50/50 to-indigo-50/80">
                <button
                  onClick={() => handleLaunchAi(searchTerm)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white text-left transition-all group border border-transparent hover:border-sky-200 hover:shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-sky-950 flex items-center gap-1.5 truncate">
                        <span>Ask AI Banking Intelligence:</span>
                        <span className="text-sky-700 italic truncate">"{searchTerm}"</span>
                      </div>
                      <div className="text-[10px] text-sky-700 font-medium">
                        Instant boardroom synthesis grounded in official RBI DBIE data
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-100 group-hover:bg-sky-600 group-hover:text-white px-2 py-1 rounded-md transition-colors shrink-0">
                    <span>Ask AI</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              </div>
            )}

            {/* Scrollable List of Filtered Items */}
            <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100">
              {filteredResults.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <Search className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                  <div>No matching metrics or views found for "{searchTerm}".</div>
                  <button
                    onClick={() => handleLaunchAi(searchTerm)}
                    className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI Analyst About "{searchTerm}"</span>
                  </button>
                </div>
              ) : (
                filteredResults.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                              {item.title}
                            </span>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {item.category}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {item.badge && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-mono">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Quick Filter Footer Chips */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
                <span className="text-slate-400 font-bold whitespace-nowrap">Filter:</span>
                {['CD Ratio', 'Gross NPA', 'Maharashtra', 'Retail Loans', 'RoA'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      onSearchChange(term);
                      inputRef.current?.focus();
                    }}
                    className="px-2 py-0.5 rounded-full bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-300 font-medium whitespace-nowrap transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                ESC to close
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
        {/* System Source Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50/90 text-emerald-800 border border-emerald-200 text-[11px] font-bold shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>RBI Official DBIE Verified</span>
        </div>

        {/* Notifications Icon */}
        <button
          aria-label="Notifications"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>

        {/* Profile Avatar / LinkedIn Link */}
        <div className="pl-3 border-l border-slate-200">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Krishna Kanta Maiti — View Profile"
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100/80 group transition-all"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden shadow-sm ring-2 ring-blue-500/25 group-hover:ring-blue-600 transition-all bg-slate-100 shrink-0">
              <img
                src="/profile.jpg"
                alt="Krishna Kanta Maiti"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  // Fallback in case of image load issue
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-black text-slate-900 group-hover:text-blue-600 flex items-center gap-1 transition-colors">
                <span>Krishna Kanta Maiti</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="text-[10px] text-slate-500 font-medium">LinkedIn Profile</div>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
};
