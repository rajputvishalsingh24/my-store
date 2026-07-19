import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, Sparkles, BarChart2, Settings, ShieldCheck, HelpCircle,
  TrendingUp, RefreshCw, Layers
} from 'lucide-react';
import { Product, CartItem } from './types';
import Storefront from './components/Storefront';
import BIDashboard from './components/BIDashboard';
import { apiClient } from './lib/apiClient';

export default function App() {
  const [activeMode, setActiveMode] = useState<'storefront' | 'dashboard'>('storefront');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [businessRules, setBusinessRules] = useState<any>({});
  const [geminiActive, setGeminiActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  // Synchronize store config and products catalog using the unified apiClient (Offline/Live auto-switching)
  const fetchStoreDetails = async () => {
    try {
      const isLive = await apiClient.detectMode();
      setIsOfflineMode(!isLive);

      const infoData = await apiClient.getStoreInfo();
      setBusinessRules(infoData.businessRules);
      setGeminiActive(infoData.geminiConfigured);

      const prodData = await apiClient.getProducts();
      setProducts(prodData);
    } catch (err) {
      console.error("Failed to load details from API Client:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreDetails();
  }, []);

  // Sync products list when needed
  const handleRefreshProducts = async () => {
    try {
      const prodData = await apiClient.getProducts();
      setProducts(prodData);
    } catch (err) {
      console.error(err);
    }
  };

  // Add items to cart
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  // Sourcing brand compare logic
  const handleAddToCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      if (prev.length >= 3) {
        // limit reached
        return [prev[1], prev[2], product];
      }
      return [...prev, product];
    });
  };

  // Admin stocks replenish bypass action
  const handleReplenishStock = async (productId: string, qty: number) => {
    try {
      const res = await apiClient.replenishStock(productId, qty);
      if (res.success) {
        await handleRefreshProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0f172a] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white min-h-screen flex flex-col items-center justify-center gap-4 font-sans relative overflow-hidden">
        {/* Spotlights */}
        <div className="absolute top-[-100px] left-[30%] w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-100px] right-[20%] w-[300px] h-[300px] bg-purple-500/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-4 relative z-10 text-center max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center text-xl font-bold">⚡</div>
          <div className="space-y-1">
            <h2 className="text-sm font-black uppercase tracking-wider text-white">MY STORE BI NETWORK</h2>
            <p className="text-[10px] text-slate-400">Connecting telemetry node... Loading 20 functional dashboards</p>
          </div>
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-indigo-500 animate-[pulse_1.5s_infinite]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans relative overflow-x-hidden transition-all duration-300 ${
      isDarkMode 
        ? 'bg-[#0f172a] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-200' 
        : 'bg-[#f8fafc] bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 text-slate-800'
    }`}>
      {/* Decorative Spotlights */}
      <div className="absolute top-[-100px] left-[50%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Dynamic Upper Floating Mode Switcher Control Bar */}
      <div className={`border-b backdrop-blur-md px-4 py-3 sticky top-0 z-50 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 text-white' 
          : 'bg-white/85 border-slate-200 text-slate-800 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-bold">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-indigo-400' : 'bg-indigo-600'}`} />
            <span className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Mode Switcher Hub:</span>
            <span className={`uppercase tracking-widest px-2.5 py-0.5 rounded-md border text-[10px] font-bold shadow-[0_0_15px_rgba(99,102,241,0.15)] ${
              isDarkMode 
                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-400/20' 
                : 'bg-indigo-50 text-indigo-600 border-indigo-200'
            }`}>
              {activeMode === 'storefront' ? 'Consumer Storefront' : 'Business Intelligence Dashboards'}
            </span>
            <div className="flex items-center gap-1.5 ml-0 md:ml-2">
              {isOfflineMode ? (
                <span className="bg-amber-500/15 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md text-[10px] tracking-wide flex items-center gap-1 font-extrabold uppercase">
                  🌐 Static Offline Mode (products.json)
                </span>
              ) : (
                <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[10px] tracking-wide flex items-center gap-1 font-extrabold uppercase">
                  🟢 Live Express Sync Active
                </span>
              )}
              <button
                onClick={async () => {
                  apiClient.setForceOffline(!isOfflineMode);
                  const forceVal = !isOfflineMode;
                  setIsOfflineMode(forceVal);
                  // Refresh catalog and config with the new mode
                  const infoData = await apiClient.getStoreInfo();
                  setBusinessRules(infoData.businessRules);
                  setGeminiActive(infoData.geminiConfigured);
                  const prodData = await apiClient.getProducts();
                  setProducts(prodData);
                }}
                className={`text-[9px] px-1.5 py-0.5 rounded border cursor-pointer transition-colors font-bold uppercase ${
                  isDarkMode 
                    ? 'border-white/10 hover:bg-white/10 text-slate-300' 
                    : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
                title="Toggle offline/online data source simulation"
              >
                🔄 Toggle Engine
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveMode('storefront')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeMode === 'storefront'
                  ? isDarkMode
                    ? 'bg-indigo-500/20 text-white border border-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.25)] font-bold'
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold shadow-sm'
                  : isDarkMode
                    ? 'bg-white/5 text-slate-400 hover:text-white border border-white/5 hover:bg-white/10'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-200/70'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <span>🛒 MY STORE Storefront</span>
            </button>

            <button
              onClick={() => setActiveMode('dashboard')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeMode === 'dashboard'
                  ? isDarkMode
                    ? 'bg-indigo-500/20 text-white border border-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.25)] font-bold'
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold shadow-sm'
                  : isDarkMode
                    ? 'bg-white/5 text-slate-400 hover:text-white border border-white/5 hover:bg-white/10'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-200/70'
              }`}
            >
              <BarChart2 className={`w-4 h-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <span>📊 20 BI Dashboards & Admin Controls</span>
            </button>

            <div className={`w-px h-6 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />

            <button
              id="theme-toggle-btn"
              onClick={() => setIsDarkMode(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer text-[11px] font-bold ${
                isDarkMode
                  ? 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/20'
                  : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-900'
              }`}
            >
              <span>{isDarkMode ? '☀️ Day Mode' : '🌙 Night Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Core Router View */}
      <div className="flex-1 relative z-10 max-w-7xl w-full mx-auto p-0">
        <AnimatePresence mode="wait">
          {activeMode === 'storefront' ? (
            <motion.div
              key="storefront"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Storefront
                products={products}
                onRefreshProducts={handleRefreshProducts}
                onAddToCart={handleAddToCart}
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                setWishlist={setWishlist}
                onCompare={handleAddToCompare}
                compareList={compareList}
                setCompareList={setCompareList}
                businessRules={businessRules}
                geminiActive={geminiActive}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <BIDashboard
                products={products}
                onRefreshProducts={handleRefreshProducts}
                businessRules={businessRules}
                setBusinessRules={setBusinessRules}
                onReplenishStock={handleReplenishStock}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persistent Tiny Technical Disclaimer (Anti-Telemetry-Clutter compliant, clean & professional footer) */}
      <footer className={`border-t backdrop-blur-md py-4 px-4 text-center text-[10px] font-medium uppercase tracking-wider relative z-20 transition-colors duration-300 ${
        isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
      }`}>
        <span>© 2026 MY STORE Enterprise Systems Ltd • 100+ Premium Smartphones • Built with React & Frosted Glass</span>
      </footer>
    </div>
  );
}
