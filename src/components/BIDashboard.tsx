import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter
} from 'recharts';
import {
  Activity, ShoppingBag, Layers, Users, TrendingUp, Sparkles, Sliders, AlertTriangle,
  RefreshCw, Download, Search, Settings, HelpCircle, Package, ArrowDown, ArrowUp,
  Briefcase, Truck, RotateCcw, Target, Shield, LayoutGrid, DollarSign, Award, Percent
} from 'lucide-react';
import { DashboardType, DashboardData, Product } from '../types';
import { playSoftClick } from '../lib/audio';
import { apiClient } from '../lib/apiClient';

interface BIDashboardProps {
  products: Product[];
  onRefreshProducts: () => void;
  businessRules: any;
  setBusinessRules: any;
  onReplenishStock: (productId: string, qty: number) => Promise<void>;
  isDarkMode?: boolean;
}

// Colors palette for interactive charts
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

const DASHBOARDS_LIST: { type: DashboardType; icon: any; category: string }[] = [
  { type: 'Sales', icon: ShoppingBag, category: 'Commercial' },
  { type: 'Revenue', icon: DollarSign, category: 'Financial' },
  { type: 'Inventory', icon: Package, category: 'Logistics' },
  { type: 'Customer', icon: Users, category: 'Commercial' },
  { type: 'Product', icon: Layers, category: 'Operational' },
  { type: 'Advertisement', icon: Target, category: 'Marketing' },
  { type: 'Marketing', icon: Percent, category: 'Marketing' },
  { type: 'Finance', icon: Briefcase, category: 'Financial' },
  { type: 'Supplier', icon: Shield, category: 'Logistics' },
  { type: 'Warehouse', icon: Activity, category: 'Logistics' },
  { type: 'Order', icon: Sliders, category: 'Operational' },
  { type: 'Delivery', icon: Truck, category: 'Logistics' },
  { type: 'Returns', icon: RotateCcw, category: 'Operational' },
  { type: 'Discounts', icon: Award, category: 'Marketing' },
  { type: 'Customer Interest', icon: Users, category: 'Commercial' },
  { type: 'Product Demand', icon: TrendingUp, category: 'Operational' },
  { type: 'Stock Movement', icon: RefreshCw, category: 'Logistics' },
  { type: 'Executive', icon: Briefcase, category: 'Financial' },
  { type: 'Business Intelligence', icon: Sparkles, category: 'Commercial' },
  { type: 'KPI', icon: LayoutGrid, category: 'Operational' },
];

export default function BIDashboard({
  products,
  onRefreshProducts,
  businessRules,
  setBusinessRules,
  onReplenishStock,
  isDarkMode = true
}: BIDashboardProps) {
  const [selectedDashboard, setSelectedDashboard] = useState<DashboardType>('Sales');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('Monthly');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Search & Sorting state inside tables
  const [tableSearch, setTableSearch] = useState<string>('');
  const [sortField, setSortField] = useState<string>('');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Local state for active analytical data
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [simulating, setSimulating] = useState<boolean>(false);

  // Live Inventory Sourced Editor States
  const [skuSearch, setSkuSearch] = useState<string>('');
  const [editedSkuFields, setEditedSkuFields] = useState<Record<string, Partial<Product>>>({});
  const [savingSkuId, setSavingSkuId] = useState<string | null>(null);

  const handleFieldBlur = (productId: string, fieldName: string, value: any) => {
    setEditedSkuFields(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [fieldName]: value
      }
    }));
  };

  const handleSaveSkuChanges = async (productId: string) => {
    const edits = editedSkuFields[productId];
    if (!edits) return; // No edits made

    setSavingSkuId(productId);
    try {
      const data = await apiClient.editProduct(productId, edits);
      if (data.success) {
        onRefreshProducts(); // refresh products in parent
        setRefreshTrigger(prev => prev + 1); // refresh charts
        playSoftClick();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSkuId(null);
    }
  };

  // Admin config controls visible on side
  const [adminPriceCurve, setAdminPriceCurve] = useState<'standard' | 'aggressive' | 'linear'>('standard');
  const [adminSafetyLimit, setAdminSafetyLimit] = useState<number>(10);
  const [replenishId, setReplenishId] = useState<string>('prod-1');
  const [replenishQty, setReplenishQty] = useState<number>(50);

  // Synchronize dashboard analytics from backend
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getDashboardData(selectedDashboard, categoryFilter, timeRange, refreshTrigger);
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDashboard, categoryFilter, timeRange, refreshTrigger]);

  // Simulate real-time transaction updates (rippling through entire database)
  const triggerSimulationRun = () => {
    setSimulating(true);
    setTimeout(async () => {
      setRefreshTrigger(prev => prev + 1);
      // Randomly modify a couple product stocks to simulate dynamic demand/sales
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      if (randomProduct && randomProduct.currentStock > 2) {
        try {
          await apiClient.reduceStock(randomProduct.id, Math.floor(1 + Math.random() * 3));
        } catch (e) {
          console.error(e);
        }
      }
      onRefreshProducts();
      setSimulating(false);
    }, 1000);
  };

  // Sourcing brand parameters update
  const handleUpdateRules = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiClient.updateStoreConfig({
        priceCurve: adminPriceCurve,
        safetyStockLimit: adminSafetyLimit
      });
      if (data.success) {
        setBusinessRules(data.businessRules);
        onRefreshProducts();
        setRefreshTrigger(p => p + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Stock replenish manual bypass
  const handleReplenishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onReplenishStock(replenishId, replenishQty);
    setRefreshTrigger(p => p + 1);
  };

  // Simulate CSV/JSON Data Export
  const handleExportData = () => {
    if (!dashboardData) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dashboardData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `Flipkart_BI_${selectedDashboard}_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Dynamic Lucide-React Icon Resolver
  const getIcon = (name: string) => {
    switch (name) {
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-blue-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'CreditCard': return <Activity className="w-5 h-5 text-violet-400" />;
      case 'Users': return <Users className="w-5 h-5 text-sky-400" />;
      case 'DollarSign': return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case 'Activity': return <Activity className="w-5 h-5 text-amber-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-blue-400" />;
      case 'Package': return <Package className="w-5 h-5 text-blue-400" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />;
      case 'Shuffle': return <RefreshCw className="w-5 h-5 text-indigo-400" />;
      default: return <Activity className="w-5 h-5 text-blue-400" />;
    }
  };

  // Helper to filter/sort table rows
  const getProcessedTableRows = () => {
    if (!dashboardData) return [];
    let rows = [...dashboardData.table.rows];

    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      rows = rows.filter(row =>
        Object.values(row).some(val => String(val).toLowerCase().includes(q))
      );
    }

    if (sortField) {
      rows.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return rows;
  };

  const processedRows = getProcessedTableRows();

  return (
    <div className="bg-transparent min-h-screen text-slate-100 pb-16 font-sans flex flex-col lg:flex-row gap-6 p-4 md:p-6 relative z-10">
      {/* 1. Left Sidebar: 20 Dashboard Selectors */}
      <aside className="lg:w-72 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex flex-col gap-4 flex-shrink-0 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-black tracking-wider uppercase text-white">BI CONTROL RAIL</h2>
            <p className="text-[10px] font-bold text-slate-400">20 Real-time Enterprise Boards</p>
          </div>
        </div>

        {/* Categories Grouped Selector list */}
        <div className="flex-1 overflow-y-auto max-h-[480px] lg:max-h-none space-y-4 pr-1 scrollbar-thin">
          {['Commercial', 'Financial', 'Marketing', 'Logistics', 'Operational'].map(cat => (
            <div key={cat} className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-300 tracking-widest px-2">{cat}</span>
              <div className="space-y-0.5">
                {DASHBOARDS_LIST.filter(d => d.category === cat).map(d => {
                  const IconComp = d.icon;
                  const isActive = selectedDashboard === d.type;
                  return (
                    <button
                      key={d.type}
                      onClick={() => { setSelectedDashboard(d.type); playSoftClick(); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-white/15 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{d.type} Dashboard</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. Main Analytics Canvas Container */}
      <div className="flex-1 space-y-6">
        {/* Top Control Bar (Filters, Trigger Refresh, Export) */}
        <header className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-500/15 text-indigo-300 text-xs font-bold border border-indigo-400/20 px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(99,102,241,0.1)]">
              {selectedDashboard} Analytics Canvas
            </span>
            <div className="text-xs text-slate-400 font-bold hidden sm:inline">
              Data Refresh Rate: <span className="text-slate-200">12ms • Deterministic Simulation</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Sourcing Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#131a35]/60 border border-white/10 text-slate-200 rounded px-3 py-1.5 text-xs font-bold outline-none cursor-pointer focus:border-indigo-500 backdrop-blur-md"
            >
              <option className="bg-[#0f172a]" value="">All Categories</option>
              {products.map(p => p.category).filter((v, i, a) => a.indexOf(v) === i).map(cat => (
                <option className="bg-[#0f172a]" key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Time period filter */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-[#131a35]/60 border border-white/10 text-slate-200 rounded px-3 py-1.5 text-xs font-bold outline-none cursor-pointer focus:border-indigo-500 backdrop-blur-md"
            >
              <option className="bg-[#0f172a]" value="Today">Today (Real-time)</option>
              <option className="bg-[#0f172a]" value="Weekly">Weekly (SLA Block)</option>
              <option className="bg-[#0f172a]" value="Monthly">Monthly (Current Fiscal)</option>
              <option className="bg-[#0f172a]" value="Annual">Annual (FY 2026-27)</option>
            </select>

            {/* Simulated Live Transaction button */}
            <button
              onClick={triggerSimulationRun}
              disabled={simulating}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 disabled:bg-white/5 border border-emerald-500/20 text-emerald-300 font-bold px-4 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
              <span>{simulating ? "Transacting..." : "Simulate Sales"}</span>
            </button>

            {/* Export */}
            <button
              onClick={handleExportData}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Report</span>
            </button>
          </div>
        </header>

        {/* 3. Interactive KPI Metrics Row */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          dashboardData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardData.kpis.map((kpi, index) => {
                const isPositive = kpi.isPositive;
                return (
                  <div key={index} className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3 shadow-lg hover:shadow-indigo-500/5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-indigo-300 tracking-wider block">{kpi.title}</span>
                      <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">{kpi.value}</h3>
                      <div className="flex items-center gap-1 text-[10px] font-bold">
                        {isPositive ? (
                          <ArrowUp className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-rose-400" />
                        )}
                        <span className={isPositive ? 'text-emerald-400' : 'text-slate-400'}>{kpi.change}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      {getIcon(kpi.icon)}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* 4. Interactive Plotly-style charts (Using Recharts) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {loading ? (
            [1, 2].map(idx => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl h-80 animate-pulse" />
            ))
          ) : (
            dashboardData?.charts.map((chart, cIdx) => (
              <div key={cIdx} className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-400" /> {chart.title}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded uppercase">{chart.type} graph</span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {chart.type === 'line' ? (
                      <LineChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255, 255, 255, 0.12)', borderRadius: 12, fontSize: 11, backdropFilter: 'blur(8px)' }} />
                        <Legend wrapperStyle={{ fontSize: 10, color: '#cbd5e1' }} />
                        {chart.keys.map((k, i) => (
                          <Line key={k} type="monotone" dataKey={k} stroke={COLORS[i % COLORS.length]} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                        ))}
                      </LineChart>
                    ) : chart.type === 'area' ? (
                      <AreaChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255, 255, 255, 0.12)', borderRadius: 12, fontSize: 11, backdropFilter: 'blur(8px)' }} />
                        <Legend wrapperStyle={{ fontSize: 10, color: '#cbd5e1' }} />
                        {chart.keys.map((k, i) => (
                          <Area key={k} type="monotone" dataKey={k} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.15} strokeWidth={2} />
                        ))}
                      </AreaChart>
                    ) : chart.type === 'pie' || chart.type === 'donut' ? (
                      <PieChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <Pie
                          data={chart.data}
                          cx="50%"
                          cy="50%"
                          innerRadius={chart.type === 'donut' ? 45 : 0}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey={chart.keys[0]}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          labelLine={false}
                          style={{ fontSize: 9, fill: '#cbd5e1', fontWeight: 'bold' }}
                        >
                          {chart.data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255, 255, 255, 0.12)', borderRadius: 12, fontSize: 11, backdropFilter: 'blur(8px)' }} />
                      </PieChart>
                    ) : chart.type === 'scatter' ? (
                      <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="number" dataKey={chart.keys[0]} name={chart.keys[0]} stroke="#94a3b8" fontSize={10} />
                        <YAxis type="number" dataKey={chart.keys[1]} name={chart.keys[1]} stroke="#94a3b8" fontSize={10} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255, 255, 255, 0.12)', borderRadius: 12, fontSize: 11, backdropFilter: 'blur(8px)' }} />
                        <Legend wrapperStyle={{ fontSize: 10, color: '#cbd5e1' }} />
                        <Scatter name="Suppliers Sourcing" data={chart.data} fill="#6366f1" />
                      </ScatterChart>
                    ) : (
                      /* BAR / HISTOGRAM / FUNNEL SIMULATOR GRAPH */
                      <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255, 255, 255, 0.12)', borderRadius: 12, fontSize: 11, backdropFilter: 'blur(8px)' }} />
                        <Legend wrapperStyle={{ fontSize: 10, color: '#cbd5e1' }} />
                        {chart.keys.map((k, i) => (
                          <Bar key={k} dataKey={k} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} barSize={25} />
                        ))}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            ))
          )}
        </div>

        {/* LIVE INVENTORY SOURCED MANAGER */}
        <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <h4 className="text-sm font-black uppercase text-indigo-300 tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Sourced Inventory Editor
              </h4>
              <p className="text-[10px] text-slate-400 font-bold">Modify product parameters and see dynamic pricing recalculate on the fly</p>
            </div>
            {/* Search filter for SKU */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-xs w-full md:w-64 backdrop-blur-sm">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by SKU Name or Brand..."
                value={skuSearch}
                onChange={(e) => setSkuSearch(e.target.value)}
                className="bg-transparent text-slate-200 outline-none w-full text-xs placeholder-slate-500 font-semibold"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10 max-h-[380px] overflow-y-auto scrollbar-thin">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0b0f19] text-slate-300 font-bold border-b border-white/10 uppercase text-[9px] tracking-wider sticky top-0 z-10">
                  <th className="py-2.5 px-3">Product SKU Name</th>
                  <th className="py-2.5 px-3 w-28">Brand</th>
                  <th className="py-2.5 px-3 w-24">MRP (₹)</th>
                  <th className="py-2.5 px-3 w-20">Discount (%)</th>
                  <th className="py-2.5 px-3 w-24">Current Stock</th>
                  <th className="py-2.5 px-3 w-32">Status Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-semibold bg-white/2">
                {products
                  .filter(p => !skuSearch || p.name.toLowerCase().includes(skuSearch.toLowerCase()) || p.brand.toLowerCase().includes(skuSearch.toLowerCase()))
                  .map(p => {
                    const isSaving = savingSkuId === p.id;
                    const isLow = p.currentStock <= businessRules.safetyStockLimit;
                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 text-[11px] font-extrabold text-white">
                          <input
                            type="text"
                            defaultValue={p.name}
                            onBlur={(e) => handleFieldBlur(p.id, 'name', e.target.value)}
                            className="bg-transparent border border-transparent hover:border-white/10 focus:border-indigo-500 focus:bg-slate-900 rounded px-1.5 py-0.5 w-full outline-none text-[11px] font-extrabold text-white transition-all"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            defaultValue={p.brand}
                            onBlur={(e) => handleFieldBlur(p.id, 'brand', e.target.value)}
                            className="bg-transparent border border-transparent hover:border-white/10 focus:border-indigo-500 focus:bg-slate-900 rounded px-1.5 py-0.5 w-full outline-none transition-all"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            defaultValue={p.mrp}
                            onBlur={(e) => handleFieldBlur(p.id, 'mrp', Number(e.target.value))}
                            className="bg-transparent border border-transparent hover:border-white/10 focus:border-indigo-500 focus:bg-slate-900 rounded px-1.5 py-0.5 w-full outline-none font-bold text-slate-300 text-right transition-all"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            defaultValue={p.discount}
                            onBlur={(e) => handleFieldBlur(p.id, 'discount', Number(e.target.value))}
                            className="bg-transparent border border-transparent hover:border-white/10 focus:border-indigo-500 focus:bg-slate-900 rounded px-1.5 py-0.5 w-full outline-none font-bold text-amber-300 text-right transition-all"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              defaultValue={p.currentStock}
                              onBlur={(e) => handleFieldBlur(p.id, 'currentStock', Number(e.target.value))}
                              className={`bg-transparent border border-transparent hover:border-white/10 focus:border-indigo-500 focus:bg-slate-900 rounded px-1.5 py-0.5 w-16 outline-none font-black text-right transition-all ${
                                isLow ? 'text-amber-400' : 'text-emerald-400'
                              }`}
                            />
                            {isLow && (
                              <span className="text-[8px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-1 rounded font-black uppercase animate-pulse">Low</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <button
                            type="button"
                            onClick={() => handleSaveSkuChanges(p.id)}
                            disabled={isSaving}
                            className="bg-indigo-600/30 hover:bg-indigo-600/50 disabled:bg-slate-800 text-indigo-200 border border-indigo-500/30 font-black px-2.5 py-1 rounded text-[10px] transition-all uppercase cursor-pointer flex items-center gap-1"
                          >
                            {isSaving ? "Saving..." : "💾 Update"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Data Analytics Table with Search and Sort */}
        {dashboardData && (
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">
                Raw Audit Logs / Table Records
              </h4>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-xs w-full md:w-64 backdrop-blur-sm">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search table rows..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="bg-transparent text-slate-200 outline-none w-full text-xs placeholder-slate-500 font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 text-slate-300 font-semibold border-b border-white/10 uppercase text-[10px] tracking-wider">
                    {dashboardData.table.headers.map(header => (
                      <th
                        key={header}
                        onClick={() => {
                          setSortField(header);
                          setSortAsc(sortField === header ? !sortAsc : true);
                        }}
                        className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>{header}</span>
                          {sortField === header && (
                            <span>{sortAsc ? '▲' : '▼'}</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                  {processedRows.length === 0 ? (
                    <tr>
                      <td colSpan={dashboardData.table.headers.length} className="text-center py-8 text-slate-500">
                        No matching table records found.
                      </td>
                    </tr>
                  ) : (
                    processedRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                        {dashboardData.table.headers.map(header => (
                          <td key={header} className="py-3.5 px-4 text-slate-300">
                            {header === 'Status' || header === 'Replenish Status' ? (
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                row[header] === 'Delivered' || row[header] === 'Sufficient' || row[header] === 'Reconciled' || row[header] === 'Audited' || row[header] === 'High Inventory'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                                {row[header]}
                              </span>
                            ) : (
                              row[header]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 3. Right Sidebar: Admin Operations Hub & Stock replenishment */}
      <aside className="lg:w-80 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex flex-col gap-5 flex-shrink-0 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Settings className="w-5 h-5 text-indigo-400 animate-spin-slow" />
          <div>
            <h2 className="text-sm font-black tracking-wider uppercase text-white">OPERATIONS HUB</h2>
            <p className="text-[10px] font-bold text-slate-400">Admin Bypass Parameter controls</p>
          </div>
        </div>

        {/* Form 1: Sourcing and pricing rules */}
        <form onSubmit={handleUpdateRules} className="space-y-4 bg-white/5 border border-white/10 p-4 rounded-xl shadow-inner">
          <span className="text-[10px] font-extrabold uppercase text-indigo-300 tracking-wider block">Sourcing pricing settings</span>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 block uppercase">Dynamic Pricing curve</label>
            <select
              value={adminPriceCurve}
              onChange={(e) => setAdminPriceCurve(e.target.value as any)}
              className="bg-[#131a35]/60 border border-white/10 text-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold outline-none w-full cursor-pointer focus:border-indigo-500"
            >
              <option className="bg-[#0f172a]" value="standard">Standard Curve (Optimal)</option>
              <option className="bg-[#0f172a]" value="linear">Linear Curve (Moderate)</option>
              <option className="bg-[#0f172a]" value="aggressive">Aggressive curve (Maximum revenue)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 block uppercase">Safety stock Reorder limit</label>
            <input
              type="number"
              value={adminSafetyLimit}
              onChange={(e) => setAdminSafetyLimit(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-[#131a35]/60 border border-white/10 text-slate-200 rounded px-2.5 py-1.5 text-xs font-bold outline-none w-full focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 font-bold py-2 rounded-xl text-xs transition-all uppercase cursor-pointer"
          >
            Deploy Price Configuration
          </button>
        </form>

        {/* Form 2: Manual bypass replenish */}
        <form onSubmit={handleReplenishSubmit} className="space-y-4 bg-white/5 border border-white/10 p-4 rounded-xl shadow-inner">
          <span className="text-[10px] font-extrabold uppercase text-indigo-300 tracking-wider block">Stock warehouse replenishment</span>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 block uppercase">Select SKU product</label>
            <select
              value={replenishId}
              onChange={(e) => setReplenishId(e.target.value)}
              className="bg-[#131a35]/60 border border-white/10 text-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold outline-none w-full cursor-pointer focus:border-indigo-500"
            >
              {products.map(p => (
                <option className="bg-[#0f172a]" key={p.id} value={p.id}>
                  {p.brand} - {p.name.slice(0, 20)}... ({p.currentStock} left)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 block uppercase">Replenish Volume units</label>
            <input
              type="number"
              value={replenishQty}
              onChange={(e) => setReplenishQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-[#131a35]/60 border border-white/10 text-slate-200 rounded px-2.5 py-1.5 text-xs font-bold outline-none w-full focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 font-bold py-2 rounded-xl text-xs transition-all uppercase cursor-pointer"
          >
            Replenish Warehouse Stock
          </button>
        </form>

        {/* Stock warning notifications list */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2 flex-1 max-h-60 overflow-y-auto">
          <span className="text-[10px] font-extrabold uppercase text-indigo-300 tracking-wider block">Fulfillment Alerts log</span>
          <div className="space-y-1.5">
            {products.filter(p => p.currentStock <= businessRules.safetyStockLimit).map(p => (
              <div key={p.id} className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 p-2 rounded text-[10px] text-rose-200 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 animate-pulse" />
                <div>
                  <span className="font-extrabold">{p.name.slice(0, 16)}...</span> crossed safety stock threshold! Sourcing replenishment recommended.
                </div>
              </div>
            ))}
            {products.filter(p => p.currentStock > businessRules.safetyStockLimit).length === products.length && (
              <div className="text-center py-6 text-slate-500 text-xs font-bold">
                All SKU inventory stocks are in sufficient SLA levels.
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
