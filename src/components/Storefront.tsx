import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ShoppingCart, Heart, RefreshCw, Star, Shield, Truck,
  HelpCircle, ChevronRight, Check, Sparkles, ShoppingBag, X, AlertTriangle,
  FileText, Download, User, ArrowLeftRight, Trash2, ArrowRight, Minus, Plus, MessageSquare, Phone
} from 'lucide-react';
import { Product, CartItem, OrderSummary, Coupon } from '../types';
import { CATEGORIES } from '../data/mockData';
import { playSoftClick, playCrackers } from '../lib/audio';

interface StorefrontProps {
  products: Product[];
  onRefreshProducts: () => void;
  onAddToCart: (p: Product, qty: number) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlist: Product[];
  setWishlist: React.Dispatch<React.SetStateAction<Product[]>>;
  onCompare: (p: Product) => void;
  compareList: Product[];
  setCompareList: React.Dispatch<React.SetStateAction<Product[]>>;
  businessRules: any;
  geminiActive: boolean;
  isDarkMode?: boolean;
}

export default function Storefront({
  products,
  onRefreshProducts,
  onAddToCart,
  cart,
  setCart,
  wishlist,
  setWishlist,
  onCompare,
  compareList,
  setCompareList,
  businessRules,
  geminiActive,
  isDarkMode = true
}: StorefrontProps) {
  // Navigation & Categorization
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAutoSuggest, setShowAutoSuggest] = useState<boolean>(false);
  const [autoSuggestList, setAutoSuggestList] = useState<Product[]>([]);

  // AI Search Assistant State
  const [useAISearch, setUseAISearch] = useState<boolean>(false);
  const [aiSearchQuery, setAiSearchQuery] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiSource, setAiSource] = useState<string>('');

  // Selected Product Details
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQty, setProductQty] = useState<number>(1);
  const [postalCode, setPostalCode] = useState<string>('560001');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string>('');

  // Cart & Checkout
  const [showCartModal, setShowCartModal] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');

  // Customer Shipping Details
  const [customerName, setCustomerName] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [invoice, setInvoice] = useState<OrderSummary | null>(null);

  // Simulated Payment State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState<string>('4321 8765 2345 9012');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('333');

  // Interactive Chatbot State
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: 'bot', text: "Hello! Welcome to **MY STORE**! I am your 24/7 AI support assistant. Feel free to ask me anything about our smartphones, laptops, active coupons, or dynamic prices. For direct human support, dial our hotline at **+919569303799**." }
  ]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Celebratory Balloons & Flash Sale Popup
  const [showBalloons, setShowBalloons] = useState<boolean>(false);
  const [showFlashSalePopup, setShowFlashSalePopup] = useState<boolean>(false);

  // Live Customer Review form state
  const [newReviewName, setNewReviewName] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  // Active Banners State (Cycles Promo Ads)
  const [activeAdIndex, setActiveAdIndex] = useState<number>(0);
  const promoAds = [
    { title: "Grand Electronics Festival", desc: "Save up to 40% on Smartphones & Laptops", bg: "bg-gradient-to-r from-blue-700 to-indigo-800", image: "📱" },
    { title: "Sony Noise Cancellation Launch", desc: "Get up to 13% Early-Bird Pricing", bg: "bg-gradient-to-r from-purple-800 to-rose-700", image: "🎧" },
    { title: "Super Gaming Clearance Deals", desc: "PlayStation 5 Pro & OLED Monitors in stock", bg: "bg-gradient-to-r from-emerald-800 to-teal-700", image: "🎮" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAdIndex(prev => (prev + 1) % promoAds.length);
    }, 6000);
    
    // Automatically trigger flash sale message popup to capture engagement
    const flashTimer = setTimeout(() => {
      setShowFlashSalePopup(true);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(flashTimer);
    };
  }, []);

  // Delivery Estimate Simulation
  useEffect(() => {
    if (selectedProduct) {
      const days = selectedProduct.deliveryDays || 3;
      const d = new Date();
      d.setDate(d.getDate() + days);
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
      setDeliveryEstimate(d.toLocaleDateString('en-US', options));
    }
  }, [selectedProduct, postalCode]);

  // Handle Search Input Changes (Auto-suggestions)
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim().length > 1) {
      const q = val.toLowerCase();
      const matches = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
      setAutoSuggestList(matches.slice(0, 5));
      setShowAutoSuggest(true);
    } else {
      setShowAutoSuggest(false);
    }
  };

  // Run AI Search
  const triggerAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiSearchQuery.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    try {
      const res = await fetch('/api/search/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiSearchQuery })
      });
      const data = await res.json();
      setAiResponse(data.response);
      setAiSource(data.source);
    } catch (err) {
      console.error(err);
      setAiResponse("Failed to connect to AI server. Please check your network connection.");
    } finally {
      setAiLoading(false);
    }
  };

  // Cart operations
  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Coupons
  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase().trim();
    if (!code) return;

    if (code === 'ELECTRO10') {
      setAppliedCoupon({ code: 'ELECTRO10', discountPercent: 10, minAmount: 1000 });
    } else if (code === 'SUPERMEGA') {
      setAppliedCoupon({ code: 'SUPERMEGA', discountPercent: 15, minAmount: 5000 });
    } else if (code === 'FESTIVE25') {
      setAppliedCoupon({ code: 'FESTIVE25', discountPercent: 25, minAmount: 15000 });
    } else {
      setCouponError('Invalid coupon code!');
      setAppliedCoupon(null);
    }
  };

  // Dynamic Prices & Checkout Calculations
  const getCartTotals = () => {
    let subtotal = 0;
    let bulkSaved = 0;

    cart.forEach(item => {
      const itemSubtotal = item.product.price * item.quantity;
      subtotal += itemSubtotal;

      // Bulk discount logic (PDF page 9: min quantity = 10)
      if (item.quantity >= 10) {
        let percent = 0;
        if (item.quantity <= 20) percent = 5;
        else if (item.quantity <= 50) percent = 10;
        else if (item.quantity <= 100) percent = 15;
        else percent = 20;

        bulkSaved += Math.round((item.product.price * percent) / 100) * item.quantity;
      }
    });

    let couponDiscount = 0;
    if (appliedCoupon && subtotal >= appliedCoupon.minAmount) {
      couponDiscount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    }

    const taxableAmount = subtotal - couponDiscount - bulkSaved;
    const gstRate = businessRules?.taxRatePercent || 18;
    const gstAmount = Math.round((taxableAmount * gstRate) / 100);

    const freeLimit = businessRules?.shippingFreeLimit || 2000;
    const flatRate = businessRules?.shippingFlatRate || 150;
    const shipping = taxableAmount >= freeLimit ? 0 : flatRate;

    const total = taxableAmount + gstAmount + shipping;

    return { subtotal, bulkSaved, couponDiscount, gstAmount, shipping, total };
  };

  // Transition to Simulated Payment Gateway
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setCheckoutStep('payment');
  };

  // Process sandbox payment and place actual order with backend
  const handlePaymentComplete = async (success: boolean) => {
    if (!success) {
      alert("Simulated payment failed or was declined. Please try again or choose another method.");
      return;
    }

    setPaymentProcessing(true);
    // Simulate minor payment processing delay for premium feel
    setTimeout(async () => {
      try {
        const payload = {
          items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity })),
          couponCode: appliedCoupon?.code,
          customerName: customerName.trim() || 'Valued Buyer',
          shippingAddress: shippingAddress.trim() || 'No Address, Sourced Hub'
        };

        const res = await fetch('/api/cart/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          const isBulk = cart.some(item => item.quantity >= 10);
          if (isBulk) {
            playCrackers();
          } else {
            playSoftClick();
          }
          setInvoice(data.invoice);
          setCart([]);
          setAppliedCoupon(null);
          setCouponCode('');
          setCheckoutStep('success');
          setShowBalloons(true); // Trigger celebratory balloons popup!
          onRefreshProducts(); // updates dynamic prices based on stock depletion
        }
      } catch (err) {
        console.error("Simulation order placement error:", err);
      } finally {
        setPaymentProcessing(false);
      }
    }, 1500);
  };

  // Chatbot message dispatcher
  const handleSendChatMessage = async (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg = { role: 'user', text: query };
    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: chatMessages.slice(-8)
        })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setChatMessages(prev => [...prev, {
        role: 'bot',
        text: "I apologize, I am experiencing server connectivity issues. You can speak to our dedicated support representatives directly at **+919569303799**!"
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  // Filter products by category, search
  const filteredProducts = products.filter(p => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totals = getCartTotals();

  return (
    <div className="bg-transparent min-h-screen text-slate-100 pb-16 font-sans relative z-10">
      {/* Dynamic Styled Glass Navbar */}
      <header className={`backdrop-blur-md sticky top-0 z-40 border-b shadow-lg transition-all duration-300 ${
        isDarkMode 
          ? 'bg-[#0f172a]/85 border-white/10 text-white' 
          : 'bg-white/90 border-slate-200 text-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black italic tracking-wider flex items-center gap-1">
              MY STORE <span className="text-indigo-500 font-extrabold text-sm not-italic mt-1 uppercase">Electronics Hub</span>
            </span>
            <div className="hidden lg:flex items-center gap-1.5 bg-indigo-500/15 text-indigo-300 border border-indigo-400/20 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.1)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DYNAMIC PRICING ENGINE ACTIVE</span>
            </div>
          </div>

          {/* Search & AI toggle */}
          <div className="flex-1 max-w-2xl w-full relative">
            <div className={`flex items-center border rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-[#131a35]/60 border-white/10 text-white' 
                : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}>
              <input
                type="text"
                placeholder={useAISearch ? "Ask anything: 'Compare top laptops' or 'Smartphones with high ratings'..." : "Search for smartphones, laptops, smart TVs..."}
                value={useAISearch ? aiSearchQuery : searchQuery}
                onChange={(e) => useAISearch ? setAiSearchQuery(e.target.value) : handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && useAISearch) triggerAISearch(e);
                }}
                className={`w-full px-4 py-2.5 outline-none text-sm font-medium bg-transparent ${
                  isDarkMode ? 'placeholder-slate-500 text-white' : 'placeholder-slate-400 text-slate-800'
                }`}
              />
              {useAISearch ? (
                <button
                  onClick={triggerAISearch}
                  disabled={aiLoading}
                  className="bg-indigo-500/25 hover:bg-indigo-500/40 text-indigo-200 font-bold px-5 py-2.5 border-l border-white/10 transition-colors text-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {aiLoading ? "Thinking..." : <><Sparkles className="w-4 h-4 text-indigo-400" /> Ask AI</>}
                </button>
              ) : (
                <div className={`px-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Search className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* AutoSuggest Dropdown (Retail store mode) */}
            {!useAISearch && showAutoSuggest && autoSuggestList.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-[#0f172a]/95 backdrop-blur-xl shadow-2xl rounded-b-xl border border-white/10 text-white z-50 overflow-hidden">
                {autoSuggestList.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedProduct(item);
                      setShowAutoSuggest(false);
                      setSearchQuery('');
                    }}
                    className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center justify-between border-b border-white/5 text-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-8 h-8 rounded object-cover border border-white/10" />
                      <div>
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.brand} • {item.category}</div>
                      </div>
                    </div>
                    <div className="font-extrabold text-indigo-300">₹{item.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Navigation */}
          <div className="flex items-center gap-4">
            {/* AI Assistant Mode Switcher */}
            <button
              onClick={() => {
                setUseAISearch(!useAISearch);
                setAiResponse('');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                useAISearch
                  ? 'bg-indigo-500/25 text-indigo-200 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                  : isDarkMode
                    ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{useAISearch ? "AI Search: ON" : "Use AI Search"}</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                if (wishlist.length > 0) {
                  setSelectedCategory('');
                  setSearchQuery('');
                  setSelectedProduct(null);
                }
              }}
              className={`relative hover:opacity-85 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-white/5 border-white/10 text-slate-300'
                  : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="text-xs font-bold hidden sm:inline">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart button */}
            <button
              onClick={() => {
                setCheckoutStep('cart');
                setShowCartModal(true);
              }}
              className={`relative hover:opacity-85 flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold border shadow-sm transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-indigo-500/20 text-white border-indigo-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              <span className="text-xs">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Sub-Header: Carousel Categories */}
      <div className="bg-white/5 border-b border-white/10 py-3 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => {
              setSelectedCategory('');
              setSelectedProduct(null);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer border ${
              selectedCategory === ''
                ? 'bg-white/15 text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border-transparent'
            }`}
          >
            All Products
          </button>
          {CATEGORIES.slice(0, 10).map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedProduct(null);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-white/15 text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Comparison Tray Float */}
        {compareList.length > 0 && (
          <div className="bg-[#0f172a]/80 backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl fixed bottom-6 right-6 left-6 md:left-auto md:w-96 z-40 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-indigo-300">
                <ArrowLeftRight className="w-4 h-4" /> Compare Tray ({compareList.length}/3)
              </span>
              <button onClick={() => setCompareList([])} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 mb-3">
              {compareList.map(p => (
                <div key={p.id} className="bg-white/5 p-2 rounded-xl flex-1 text-center relative border border-white/10">
                  <img src={p.image} alt="" className="w-10 h-10 object-cover mx-auto rounded-lg mb-1 border border-white/10" />
                  <div className="text-[10px] font-semibold line-clamp-1 text-slate-300">{p.name}</div>
                  <button
                    onClick={() => setCompareList(prev => prev.filter(item => item.id !== p.id))}
                    className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const dummyProduct = { id: 'comparison-panel' } as any;
                setSelectedProduct(dummyProduct);
              }}
              className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 text-xs font-bold py-2 rounded-xl transition-all text-center cursor-pointer uppercase"
            >
              Compare Specifications
            </button>
          </div>
        )}

        {/* AI response panel */}
        {useAISearch && (aiLoading || aiResponse) && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 backdrop-blur-md rounded-2xl mb-8 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span className="font-extrabold text-white tracking-tight">Gemini AI Shopping Insights</span>
              </div>
              <span className="text-xs font-bold text-indigo-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                Powered by {aiSource || 'Gemini 2.5 Flash'}
              </span>
            </div>
            {aiLoading ? (
              <div className="flex items-center gap-3 py-6 justify-center">
                <div className="w-6 h-6 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-semibold text-slate-300">Analyzing catalog specifications, reviews, and demand indices...</span>
              </div>
            ) : (
              <div className="prose text-slate-100 text-sm leading-relaxed max-w-none whitespace-pre-line font-medium">
                {aiResponse}
              </div>
            )}
          </div>
        )}

        {/* HERO BANNER SLIDER */}
        {!selectedProduct && !selectedCategory && !searchQuery && (
          <div className={`rounded-2xl p-6 md:p-10 text-white mb-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 bg-opacity-20 backdrop-blur-md relative overflow-hidden ${promoAds[activeAdIndex].bg}`}>
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply z-0 pointer-events-none" />
            <div className="flex-1 space-y-4 relative z-10">
              <span className="bg-indigo-500/30 text-indigo-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-400/20">Featured Promotion</span>
              <h2 className="text-3xl md:text-4xl font-black leading-none tracking-tight">{promoAds[activeAdIndex].title}</h2>
              <p className="text-slate-200 text-sm md:text-base font-semibold">{promoAds[activeAdIndex].desc}</p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedCategory('Smartphones')}
                  className="bg-white/15 hover:bg-white/20 border border-white/25 text-white font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-md text-sm cursor-pointer"
                >
                  Shop Now
                </button>
                <span className="text-xs text-slate-300 font-semibold">• Live automatic pricing shifts active</span>
              </div>
            </div>
            <div className="text-7xl md:text-8xl select-none filter drop-shadow-lg pr-4 animate-pulse relative z-10">
              {promoAds[activeAdIndex].image}
            </div>
          </div>
        )}

        {/* MAIN VIEWS SCHEDULER */}
        {selectedProduct ? (
          /* COMPARISON PANEL OR DETAILED PRODUCT VIEW */
          selectedProduct.id === 'comparison-panel' ? (
            /* COMPARISON VIEW PANEL */
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <button
                  onClick={() => { setSelectedProduct(null); playSoftClick(); }}
                  className="text-sm font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeftRight className="w-4 h-4 text-indigo-400" /> Back to Store
                </button>
                <h3 className="text-xl font-black text-white">Electronics Product Comparison</h3>
                <button
                  onClick={() => { setCompareList([]); playSoftClick(); }}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
                {/* Headers column */}
                <div className="hidden md:block pt-48 space-y-8 font-bold text-slate-400 text-xs text-right pr-4">
                  <div>BRAND</div>
                  <div>PRICE</div>
                  <div>MRP</div>
                  <div>STOCK STATUS</div>
                  <div>RECOMMEND SCORE</div>
                  <div>SELLER</div>
                  <div>WARRANTY</div>
                  {/* Common specs keys list */}
                  <div>DISPLAY SPEC</div>
                  <div>PROCESSOR / CPU</div>
                  <div>BATTERY / WEIGHT</div>
                </div>

                {compareList.map(p => {
                  const isLow = p.currentStock < businessRules.safetyStockLimit;
                  return (
                    <div key={p.id} className="border border-white/10 rounded-2xl p-4 space-y-5 text-center relative hover:border-white/20 transition-all bg-white/5 backdrop-blur-md">
                      <button
                        onClick={() => { setCompareList(prev => prev.filter(item => item.id !== p.id)); playSoftClick(); }}
                        className="absolute top-2 right-2 bg-white/10 text-slate-300 rounded-full p-1 hover:bg-white/20 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <img src={p.image} alt="" className="w-24 h-24 object-cover mx-auto rounded-xl shadow-md border border-white/10" />
                      <div className="font-extrabold text-sm line-clamp-2 h-10 text-white">{p.name}</div>

                      <div className="border-t border-white/10 pt-3 md:pt-0 md:border-0 space-y-3 md:space-y-8 text-sm">
                        <div className="flex justify-between md:justify-center items-center gap-1 text-slate-300">
                          <span className="md:hidden font-bold text-xs text-slate-400">BRAND:</span>
                          <span className="font-bold">{p.brand}</span>
                        </div>
                        <div className="flex justify-between md:justify-center items-center gap-1">
                          <span className="md:hidden font-bold text-xs text-slate-400">PRICE:</span>
                          <span className="font-black text-indigo-300 text-base">₹{p.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between md:justify-center items-center gap-1">
                          <span className="md:hidden font-bold text-xs text-slate-400">MRP:</span>
                          <span className="text-slate-400 line-through">₹{p.mrp.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between md:justify-center items-center gap-1">
                          <span className="md:hidden font-bold text-xs text-slate-400">STOCK:</span>
                          <span className={`font-bold text-xs ${isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {p.currentStock === 0 ? 'Out of Stock' : `${p.currentStock} units`}
                          </span>
                        </div>
                        <div className="flex justify-between md:justify-center items-center gap-1">
                          <span className="md:hidden font-bold text-xs text-slate-400">RATING:</span>
                          <span className="font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded text-xs">⭐ {p.ratings} ({p.reviewsCount.toLocaleString()})</span>
                        </div>
                        <div className="flex justify-between md:justify-center items-center gap-1 text-slate-300 text-xs">
                          <span className="md:hidden font-bold text-xs text-slate-400">SELLER:</span>
                          <span>{p.seller}</span>
                        </div>
                        <div className="flex justify-between md:justify-center items-center gap-1 text-slate-300 text-xs">
                          <span className="md:hidden font-bold text-xs text-slate-400">WARRANTY:</span>
                          <span>{p.warranty}</span>
                        </div>

                        {/* Specs */}
                        <div className="flex justify-between md:justify-center items-center gap-1 text-slate-300 text-xs">
                          <span className="md:hidden font-bold text-xs text-slate-400">DISPLAY:</span>
                          <span>{p.specifications.Display || p.specifications['Screen Size'] || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between md:justify-center items-center gap-1 text-slate-300 text-xs">
                          <span className="md:hidden font-bold text-xs text-slate-400">PROCESSOR:</span>
                          <span>{p.specifications.Processor || p.specifications['Panel Type'] || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between md:justify-center items-center gap-1 text-slate-300 text-xs">
                          <span className="md:hidden font-bold text-xs text-slate-400">WEIGHT/BATTERY:</span>
                          <span>{p.specifications.Battery || p.specifications.Weight || 'N/A'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onAddToCart(p, 1);
                          onRefreshProducts();
                          playSoftClick();
                        }}
                        disabled={p.currentStock === 0}
                        className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 disabled:bg-white/5 text-indigo-200 disabled:text-slate-500 font-bold py-2 rounded-xl transition-all text-xs border border-indigo-500/30 cursor-pointer uppercase"
                      >
                        {p.currentStock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* SINGLE PRODUCT DETAILS VIEW */
            <div className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl">
              {/* Back breadcrumb */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-sm font-bold text-slate-300 hover:text-white flex items-center gap-1 mb-6 border-b border-white/10 pb-3 cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4 text-indigo-400" /> Back to Storefront
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Images Column */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="border border-white/10 rounded-2xl p-4 bg-white/5 relative group">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-80 object-cover rounded-xl shadow-md transition-transform group-hover:scale-105 border border-white/10"
                    />
                    {/* Discount badge */}
                    {selectedProduct.discount > 0 && (
                      <span className="absolute top-4 left-4 bg-rose-500 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {selectedProduct.discount}% OFF
                      </span>
                    )}
                  </div>
                  {/* Action row */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        onAddToCart(selectedProduct, productQty);
                        onRefreshProducts();
                        setShowCartModal(true);
                      }}
                      disabled={selectedProduct.currentStock === 0}
                      className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 disabled:bg-white/5 disabled:border-transparent text-indigo-300 disabled:text-slate-500 font-black py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-1.5 uppercase cursor-pointer"
                    >
                      <ShoppingCart className="w-4.5 h-4.5" /> Buy Now
                    </button>
                    <button
                      onClick={() => {
                        onAddToCart(selectedProduct, productQty);
                        onRefreshProducts();
                      }}
                      disabled={selectedProduct.currentStock === 0}
                      className="flex-1 bg-white/10 hover:bg-white/15 border border-white/20 disabled:bg-white/5 disabled:border-transparent text-white disabled:text-slate-500 font-extrabold py-3 rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 uppercase cursor-pointer"
                    >
                      <ShoppingBag className="w-4.5 h-4.5 text-indigo-300" /> Add to Cart
                    </button>
                  </div>
                </div>

                {/* Details Column */}
                <div className="lg:col-span-7 space-y-6 text-white">
                  <div>
                    <span className="text-xs font-bold text-indigo-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                      {selectedProduct.category}
                    </span>
                    <h2 className="text-2xl font-black text-white mt-2.5 leading-tight tracking-tight">{selectedProduct.name}</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Brand: {selectedProduct.brand} | Sourced by {selectedProduct.seller}</p>
                  </div>

                  {/* Ratings */}
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 w-fit">
                    <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-black px-2 py-0.5 rounded flex items-center gap-0.5">
                      {selectedProduct.ratings} <Star className="w-3 h-3 fill-emerald-300 text-emerald-300" />
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      {selectedProduct.reviewsCount.toLocaleString()} Ratings & reviews
                    </span>
                  </div>

                  {/* Live Dynamic Pricing details */}
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl space-y-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black text-indigo-300">₹{selectedProduct.price.toLocaleString()}</span>
                      <span className="text-sm text-slate-400 line-through">₹{selectedProduct.mrp.toLocaleString()}</span>
                      <span className="text-xs font-extrabold text-emerald-400">
                        {selectedProduct.discount}% discount + inventory adjustments
                      </span>
                    </div>

                    {/* Stock Status Indicator */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${selectedProduct.currentStock === 0 ? 'bg-rose-500 animate-ping' : selectedProduct.currentStock < businessRules.safetyStockLimit ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                        <span className={selectedProduct.currentStock === 0 ? 'text-rose-400' : selectedProduct.currentStock < businessRules.safetyStockLimit ? 'text-amber-400' : 'text-emerald-400'}>
                          {selectedProduct.currentStock === 0 ? 'Out of Stock' : selectedProduct.currentStock < businessRules.safetyStockLimit ? `Low stock alert: Only ${selectedProduct.currentStock} remaining!` : `Sufficient inventory (${selectedProduct.currentStock} units)`}
                        </span>
                      </div>
                      {selectedProduct.currentStock > 0 && (
                        <span className="text-slate-400">Demand: {selectedProduct.demandScore}/100 • Supply: {selectedProduct.supplyScore}/100</span>
                      )}
                    </div>
                  </div>

                  {/* Bulk Discount Slab display */}
                  <div className="border border-white/10 rounded-xl p-4 space-y-2.5 bg-white/5">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Volume-Based Bulk Discounts Slab</h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                        <div className="font-bold text-slate-300">10-20 qty</div>
                        <div className="font-extrabold text-indigo-300">5% OFF</div>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                        <div className="font-bold text-slate-300">21-50 qty</div>
                        <div className="font-extrabold text-indigo-300">10% OFF</div>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                        <div className="font-bold text-slate-300">51-100 qty</div>
                        <div className="font-extrabold text-indigo-300">15% OFF</div>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                        <div className="font-bold text-slate-300">100+ qty</div>
                        <div className="font-extrabold text-indigo-300">20% OFF</div>
                      </div>
                    </div>
                  </div>

                  {/* Quantity selector */}
                  {selectedProduct.currentStock > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400">Select Quantity:</span>
                      <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-white/5">
                        <button
                          onClick={() => setProductQty(prev => Math.max(1, prev - 1))}
                          className="px-3 py-1.5 hover:bg-white/10 text-slate-300 font-bold transition-all cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 py-1 font-bold text-sm text-white">{productQty}</span>
                        <button
                          onClick={() => setProductQty(prev => Math.min(selectedProduct.currentStock, prev + 1))}
                          className="px-3 py-1.5 hover:bg-white/10 text-slate-300 font-bold transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {productQty >= 10 ? (
                        <div className="text-xs text-emerald-400 font-extrabold flex items-center gap-1.5 animate-pulse">
                          🎉 Bulk deal active! Unit: ₹{Math.round(selectedProduct.price * (1 - (productQty <= 20 ? 0.05 : productQty <= 50 ? 0.10 : productQty <= 100 ? 0.15 : 0.20))).toLocaleString()} (Saved ₹{(Math.round(selectedProduct.price * (productQty <= 20 ? 0.05 : productQty <= 50 ? 0.10 : productQty <= 100 ? 0.15 : 0.20)) * productQty).toLocaleString()} total!)
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 font-bold">
                          Add <span className="text-indigo-400 font-black">{10 - productQty}</span> more unit{10 - productQty > 1 ? 's' : ''} to unlock <span className="text-emerald-400 font-black">5% Bulk Discount</span>!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Product Description</h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-semibold">{selectedProduct.description}</p>
                  </div>

                  {/* Pin code delivery check */}
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Truck className="w-4 h-4 text-indigo-400" />
                      <span>Delivery Estimation Check</span>
                    </div>
                    <div className="flex gap-2 max-w-xs">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit PIN"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                        className="border border-white/10 bg-[#131a35]/60 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500 flex-1 font-bold placeholder-slate-500"
                      />
                      <button className="bg-indigo-500/25 hover:bg-indigo-500/45 border border-indigo-500/40 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer">Check</button>
                    </div>
                    {postalCode.length === 6 && (
                      <div className="text-xs text-slate-300 font-semibold">
                        Delivery guaranteed by <span className="font-bold text-indigo-300">{deliveryEstimate}</span> | Free shipping over ₹2,000.
                      </div>
                    )}
                  </div>

                  {/* Core specifications */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Product Technical Specifications</h4>
                    <div className="border border-white/10 rounded-xl overflow-hidden text-xs bg-white/5">
                      {Object.entries(selectedProduct.specifications).map(([key, value], i) => (
                        <div key={key} className={`flex py-2.5 px-4 ${i % 2 === 0 ? 'bg-white/5' : 'bg-transparent'} border-b border-white/10 last:border-0`}>
                          <span className="font-bold text-slate-400 w-32">{key}</span>
                          <span className="font-semibold text-slate-200 flex-1">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sourcing security */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-5 text-xs text-slate-400">
                    <div className="flex items-center gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <Shield className="w-5 h-5 text-indigo-400" />
                      <div>
                        <div className="font-bold text-slate-200">Genuine Sourcing Guarantee</div>
                        <div>100% authentic product directly from manufacturer.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <RefreshCw className="w-5 h-5 text-indigo-400" />
                      <div>
                        <div className="font-bold text-slate-200">7 Days Return Policy</div>
                        <div>Easy, no-hassle returns if specifications mismatch.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CUSTOMER REVIEWS SECTION */}
              <div className="mt-12 border-t border-white/10 pt-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Customer Reviews & Feedback</h3>
                    <p className="text-xs text-slate-400">Read verified buyer ratings and submit your own feedback live</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 w-fit">
                    <span className="text-xl font-black text-amber-400">⭐ {selectedProduct.ratings}</span>
                    <span className="text-xs text-slate-300">Based on {selectedProduct.reviewsCount?.toLocaleString() || 0} ratings</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Reviews List Column */}
                  <div className="lg:col-span-7 space-y-4 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin">
                    {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                      selectedProduct.reviews.map((r, i) => (
                        <div key={r.id || i} className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-xs text-indigo-300">{r.userName}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{r.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-3.5 h-3.5 ${
                                  idx < r.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed font-medium">"{r.comment}"</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500 text-xs font-semibold italic">
                        No reviews yet. Be the first to share your experience with this device!
                      </div>
                    )}
                  </div>

                  {/* Add Review Form Column */}
                  <div className="lg:col-span-5 bg-white/5 p-5 rounded-2xl border border-white/10 space-y-4 h-fit">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 border-b border-white/5 pb-2">Add Your Live Review</h4>
                    
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newReviewName.trim() || !newReviewComment.trim()) return;
                      setSubmittingReview(true);
                      try {
                        const res = await fetch(`/api/products/${selectedProduct.id}/review`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            userName: newReviewName,
                            rating: newReviewRating,
                            comment: newReviewComment
                          })
                        });
                        const data = await res.json();
                        if (data.success) {
                          setSelectedProduct(data.product);
                          setNewReviewName('');
                          setNewReviewRating(5);
                          setNewReviewComment('');
                          onRefreshProducts();
                          playSoftClick();
                        }
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setSubmittingReview(false);
                      }
                    }} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Priyan Singh"
                          value={newReviewName}
                          onChange={(e) => setNewReviewName(e.target.value)}
                          className="bg-[#131a35]/60 border border-white/10 text-slate-100 rounded-xl px-3 py-2 text-xs outline-none w-full font-semibold focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block">Your Rating</label>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, idx) => {
                            const val = idx + 1;
                            const active = val <= newReviewRating;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setNewReviewRating(val);
                                  playSoftClick();
                                }}
                                className="p-1 hover:scale-110 transition-transform cursor-pointer"
                              >
                                <Star className={`w-5 h-5 ${active ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Your Review Comments</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Write your honest comments about this electronics product..."
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="bg-[#131a35]/60 border border-white/10 text-slate-100 rounded-xl px-3 py-2 text-xs outline-none w-full font-semibold focus:border-indigo-500 placeholder-slate-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="w-full bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-200 border border-indigo-500/30 font-black py-2.5 rounded-xl text-xs transition-all uppercase cursor-pointer"
                      >
                        {submittingReview ? "Submitting Live Review..." : "✓ Submit Live Review"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* SIMILAR PRODUCTS SUGGESTIONS */}
              <div className="mt-12 border-t border-white/10 pt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-white">Similar Products You Might Like</h3>
                  <p className="text-xs text-slate-400">Discover handpicked high-performance options from the same {selectedProduct.category} category</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {products
                    .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
                    .slice(0, 4)
                    .map(simProd => {
                      const discountPrice = simProd.price;
                      return (
                        <div
                          key={simProd.id}
                          onClick={() => {
                            setSelectedProduct(simProd);
                            setProductQty(1);
                            playSoftClick();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-white/5 border border-white/10 hover:border-white/20 p-4 rounded-xl cursor-pointer hover:scale-[1.02] transition-all space-y-3 group text-left"
                        >
                          <img
                            src={simProd.image}
                            alt=""
                            className="w-full h-32 object-cover rounded-lg border border-white/10"
                          />
                          <div>
                            <div className="text-[9px] font-bold text-indigo-400 tracking-widest uppercase">{simProd.brand}</div>
                            <h4 className="font-extrabold text-xs text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                              {simProd.name}
                            </h4>
                          </div>
                          <div className="flex items-center justify-between text-xs font-semibold pt-1">
                            <span className="text-indigo-300 font-extrabold">₹{discountPrice.toLocaleString()}</span>
                            <span className="bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              ⭐ {simProd.ratings}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  {products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).length === 0 && (
                    <div className="col-span-full text-center py-6 text-slate-500 text-xs font-semibold italic">
                      No other devices found in this category. Browse other electronics in our collection!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          /* PRODUCT CATALOG GRID */
          <div className="space-y-6">
            {/* Title / Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xl font-black text-white">
                {selectedCategory ? `${selectedCategory} Collection` : 'Featured Electronic Products'}
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                Showing {filteredProducts.length} items
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(p => {
                const inWishlist = wishlist.some(item => item.id === p.id);
                const isLow = p.currentStock < businessRules.safetyStockLimit;
                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl border overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative group flex flex-col justify-between ${
                      isDarkMode
                        ? 'bg-white/5 border-white/10 text-white'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    {/* Upper actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                      <button
                        onClick={() => handleToggleWishlist(p)}
                        className="bg-[#0f172a]/80 backdrop-blur-md text-slate-300 hover:text-rose-400 p-2 rounded-full border border-white/10 shadow-md transition-colors cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                      <button
                        onClick={() => onCompare(p)}
                        className="bg-[#0f172a]/80 backdrop-blur-md text-slate-300 hover:text-indigo-400 p-2 rounded-full border border-white/10 shadow-md transition-colors cursor-pointer"
                      >
                        <ArrowLeftRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image */}
                    <div
                      className={`cursor-pointer overflow-hidden relative aspect-square p-4 border-b ${
                        isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'
                      }`}
                      onClick={() => {
                        setSelectedProduct(p);
                        setProductQty(1);
                      }}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 border border-white/10 shadow-sm"
                      />
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">{p.brand}</div>
                        <h4
                          onClick={() => {
                            setSelectedProduct(p);
                            setProductQty(1);
                          }}
                          className={`font-extrabold text-sm line-clamp-2 h-10 hover:text-indigo-400 cursor-pointer transition-colors ${
                            isDarkMode ? 'text-slate-100' : 'text-slate-800'
                          }`}
                        >
                          {p.name}
                        </h4>
                      </div>

                      {/* Rating block */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          {p.ratings} <Star className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">({p.reviewsCount.toLocaleString()})</span>
                      </div>

                      {/* Pricing block */}
                      <div className={`flex items-baseline gap-2 pt-1 border-t mt-2 ${
                        isDarkMode ? 'border-white/10' : 'border-slate-100'
                      }`}>
                        <span className={`font-black text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{p.price.toLocaleString()}</span>
                        <span className="text-xs text-slate-400 line-through">₹{p.mrp.toLocaleString()}</span>
                        <span className="text-[10px] font-extrabold text-emerald-500">{p.discount}% OFF</span>
                      </div>

                      {/* Demand / Stock Status */}
                      <div className={`flex items-center justify-between text-[11px] font-semibold mt-1 p-2 rounded-xl border ${
                        isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}>
                        <span className={p.currentStock === 0 ? 'text-rose-500' : isLow ? 'text-amber-500 animate-pulse' : 'text-emerald-600 font-bold'}>
                          {p.currentStock === 0 ? '🚫 Out of Stock' : isLow ? `⚠️ Only ${p.currentStock} left!` : `✅ In Stock`}
                        </span>
                        <span className="text-slate-400 text-[10px]">Demand: {p.demandScore}</span>
                      </div>

                      {/* Bulk Order Discount Display */}
                      <div className={`mt-2 pt-2 border-t border-dashed ${
                        isDarkMode ? 'border-white/10' : 'border-slate-200'
                      }`}>
                        <div className="flex items-center gap-1 text-[10px] font-black text-indigo-500">
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          <span>BULK DEAL SLABS (UP TO 20% OFF)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[9px] font-bold text-slate-500 mt-1">
                          <div className={`px-1.5 py-0.5 rounded border text-center ${
                            isDarkMode ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100'
                          }`}>
                            10-20 pcs: <span className="text-emerald-600 font-extrabold">5% OFF</span>
                          </div>
                          <div className={`px-1.5 py-0.5 rounded border text-center ${
                            isDarkMode ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100'
                          }`}>
                            21-50 pcs: <span className="text-emerald-600 font-extrabold">10% OFF</span>
                          </div>
                          <div className={`px-1.5 py-0.5 rounded border text-center ${
                            isDarkMode ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100'
                          }`}>
                            51-100 pcs: <span className="text-emerald-600 font-extrabold">15% OFF</span>
                          </div>
                          <div className={`px-1.5 py-0.5 rounded border text-center ${
                            isDarkMode ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100'
                          }`}>
                            100+ pcs: <span className="text-emerald-600 font-extrabold">20% OFF</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions split bar */}
                    <div className="grid grid-cols-2 border-t divide-x divide-white/10 border-white/10 overflow-hidden rounded-b-2xl">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setProductQty(1);
                          playSoftClick();
                        }}
                        className={`font-black py-3 text-[11px] tracking-wider transition-all uppercase cursor-pointer text-center flex items-center justify-center gap-1 hover:brightness-125 ${
                          isDarkMode
                            ? 'bg-slate-800/80 text-indigo-300 hover:bg-slate-800'
                            : 'bg-slate-100 text-indigo-600 hover:bg-slate-200'
                        }`}
                      >
                        👁️ View Detail
                      </button>
                      <button
                        onClick={() => {
                          onAddToCart(p, 1);
                          onRefreshProducts();
                          playSoftClick();
                        }}
                        disabled={p.currentStock === 0}
                        className={`font-black py-3 text-[11px] tracking-wider transition-all uppercase cursor-pointer text-center flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-125 ${
                          isDarkMode
                            ? 'bg-indigo-600/30 text-indigo-200 hover:bg-indigo-600/50'
                            : 'bg-indigo-500 text-white hover:bg-indigo-600'
                        }`}
                      >
                        {p.currentStock === 0 ? "Out of Stock" : "🛒 Buy / Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* SHOPPING CART / CHECKOUT DRAWER MODAL */}
      {showCartModal && (
        <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm flex justify-end z-50 animate-fade-in">
          <div className="bg-[#0f172a]/95 backdrop-blur-xl w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative border-l border-white/10">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 text-white">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-400" />
                <span className="font-extrabold tracking-wide uppercase text-sm">Shopping Cart Checkout</span>
              </div>
              <button onClick={() => setShowCartModal(false)} className="text-slate-300 hover:text-white p-1 cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main scroll content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-white">
              {checkoutStep === 'cart' && (
                cart.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingCart className="w-12 h-12 text-slate-500 mx-auto" />
                    <p className="font-bold text-slate-400">Your shopping cart is currently empty.</p>
                  </div>
                ) : (
                  /* ITEMS LIST */
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 border-b border-white/10 pb-2">
                      <span>PRODUCT ITEM</span>
                      <span>TOTAL PRICE</span>
                    </div>

                    {cart.map(item => {
                      const itemTotal = item.product.price * item.quantity;
                      return (
                        <div key={item.product.id} className="flex gap-3 justify-between items-start border-b border-white/5 pb-3">
                          <img src={item.product.image} alt="" className="w-12 h-12 object-cover rounded border border-white/10" />
                          <div className="flex-1 space-y-1">
                            <h5 className="font-extrabold text-xs text-white line-clamp-1">{item.product.name}</h5>
                            <div className="text-[10px] text-slate-400">UnitPrice: ₹{item.product.price.toLocaleString()}</div>
                            {/* Qty edit */}
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => updateCartQty(item.product.id, -1)}
                                className="border border-white/10 bg-white/5 text-slate-300 rounded p-0.5 hover:bg-white/10 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold px-1 text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQty(item.product.id, 1)}
                                className="border border-white/10 bg-white/5 text-slate-300 rounded p-0.5 hover:bg-white/10 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-rose-400 hover:text-rose-500 ml-4 p-0.5 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-xs text-white">₹{itemTotal.toLocaleString()}</div>
                            {item.quantity >= 10 && (
                              <div className="text-[9px] text-emerald-400 font-extrabold">Volume Discount Active</div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Coupons box */}
                    <div className="border border-white/10 bg-white/5 p-4 rounded-2xl space-y-3">
                      <h4 className="text-xs font-black uppercase text-slate-400">Available Checkout Coupons</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="ELECTRO10, FESTIVE25..."
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="border border-white/10 bg-[#131a35]/60 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500 flex-1 font-bold placeholder-slate-500"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-indigo-500/25 hover:bg-indigo-500/40 border border-indigo-500/35 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer uppercase"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-[10px] text-rose-400 font-bold">{couponError}</p>}
                      {appliedCoupon && (
                        <div className="flex items-center justify-between bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 p-2.5 rounded-xl text-xs font-bold">
                          <span>Applied: {appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)</span>
                          <button onClick={() => setAppliedCoupon(null)} className="text-emerald-300 cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}

              {checkoutStep === 'shipping' && (
                /* SHIPPING FORM */
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 border-b border-white/10 pb-2">Fulfillment Details</h4>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">Customer Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="border border-white/10 bg-[#131a35]/60 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 w-full font-bold placeholder-slate-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">Delivery Shipping Address</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Plot No. 45, Sector 5, HSR Layout, Bengaluru, Karnataka - 560102"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="border border-white/10 bg-[#131a35]/60 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 w-full font-bold placeholder-slate-500"
                    />
                  </div>

                  <div className="border border-indigo-500/20 p-3 bg-indigo-500/10 rounded-2xl text-xs text-slate-300 space-y-1">
                    <div className="font-bold text-indigo-300">Payment Simulation Notice</div>
                    <div>Order is processed in sandbox mode. Immediate order placement will deplete the active inventory stock and trigger dynamic pricing recalculations in real-time.</div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/30 font-black py-3 rounded-xl text-sm transition-all shadow-md uppercase tracking-wide mt-2 cursor-pointer"
                  >
                    Proceed to Payment Gateway
                  </button>
                </form>
              )}

              {checkoutStep === 'payment' && (
                <div className="space-y-4 text-white">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('shipping')}
                      className="text-xs text-indigo-400 hover:underline font-bold cursor-pointer"
                    >
                      ← Back
                    </button>
                    <h4 className="text-xs font-black uppercase text-slate-400 flex-1">Secure Payment Gateway</h4>
                  </div>

                  <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/20 text-center space-y-1.5">
                    <div className="text-xs font-bold text-indigo-300">TOTAL PAYABLE AMOUNT</div>
                    <div className="text-2xl font-black text-indigo-400">₹{totals.total.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">Processed securely under MY STORE sandbox environment</div>
                  </div>

                  {/* Payment Methods Toggle */}
                  <div className="grid grid-cols-2 gap-2 border border-white/5 p-1 rounded-xl bg-white/5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-2 text-xs font-extrabold rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'upi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      UPI (QR Scan)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 text-xs font-extrabold rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'card' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Credit / Debit Card
                    </button>
                  </div>

                  {/* Method Content */}
                  {paymentMethod === 'upi' ? (
                    <div className="space-y-4 text-center">
                      <p className="text-xs text-slate-300 font-bold">Scan QR code using any UPI App (GPay/PhonePe/Paytm)</p>
                      
                      <div className="bg-white p-3 rounded-2xl w-36 h-36 mx-auto flex items-center justify-center border-4 border-indigo-500/30 shadow-md">
                        <div className="relative">
                          <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=mystore@sbi%26pn=MY%20STORE%26am=1%26cu=INR"
                            alt="Simulated UPI QR"
                            referrerPolicy="no-referrer"
                            className="w-28 h-28 object-contain"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-indigo-600 text-white font-black text-[8px] px-1 py-0.5 rounded shadow">
                              MY STORE
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 max-w-xs mx-auto">
                        <button
                          type="button"
                          onClick={() => handlePaymentComplete(true)}
                          disabled={paymentProcessing}
                          className="w-full bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/30 font-black py-2.5 rounded-xl text-xs uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {paymentProcessing ? "Processing Sandbox Gateway..." : "✓ Simulate Payment Success"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePaymentComplete(false)}
                          disabled={paymentProcessing}
                          className="w-full border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 font-bold py-1.5 rounded-xl text-[10px] uppercase cursor-pointer"
                        >
                          Simulate Payment Failure
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="border border-white/10 bg-[#131a35]/60 rounded-xl px-3 py-2 text-xs text-white outline-none w-full font-bold"
                          placeholder="XXXX XXXX XXXX XXXX"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="border border-white/10 bg-[#131a35]/60 rounded-xl px-3 py-2 text-xs text-white outline-none w-full font-bold text-center"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400">CVV Code</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="border border-white/10 bg-[#131a35]/60 rounded-xl px-3 py-2 text-xs text-white outline-none w-full font-bold text-center"
                            placeholder="XXX"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handlePaymentComplete(true)}
                          disabled={paymentProcessing}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                        >
                          {paymentProcessing ? "Contacting Payment Gateway..." : `Pay ₹${totals.total.toLocaleString()} Securely`}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="text-center text-[9px] text-slate-500 font-semibold pt-1">
                    🔒 Sandbox Terminal. No money is moved.
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && invoice && (
                /* INVOICE SUCCESS POPUP */
                <div className="space-y-6">
                  <div className="text-center space-y-2 py-4">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-300 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-black text-white">Payment Success!</h4>
                    <p className="text-xs text-slate-400 font-bold">Your order has been logged into the BI Database.</p>
                  </div>

                  {/* Printable Invoice Container */}
                  <div className="border border-white/10 p-4 rounded-xl bg-white/5 font-mono text-[10px] text-slate-300 space-y-3 shadow-sm">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <div>
                        <span className="font-bold block text-[11px] text-indigo-400">MY STORE TAX INVOICE</span>
                        <span>TAX INVOICE - DIGITAL RECEIPT</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-white">{invoice.id}</span>
                        <span>{new Date(invoice.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div>
                      <div className="font-bold uppercase text-slate-500 text-[9px] mb-1">Delivered To:</div>
                      <div className="font-extrabold text-white">{invoice.customerName}</div>
                      <div className="line-clamp-2 text-slate-400">{invoice.shippingAddress}</div>
                    </div>

                    <div className="border-t border-b border-white/10 py-2 space-y-1.5">
                      {invoice.items.map(it => (
                        <div key={it.productId} className="flex justify-between">
                          <span className="line-clamp-1 w-44 text-slate-300">{it.name} x{it.quantity}</span>
                          <span className="text-white">₹{it.total.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 text-right">
                      <div className="flex justify-between font-bold text-slate-400">
                        <span>SUBTOTAL:</span>
                        <span className="text-slate-300">₹{invoice.subtotal.toLocaleString()}</span>
                      </div>
                      {invoice.discountAmount > 0 && (
                        <div className="flex justify-between text-rose-400">
                          <span>COUPON DISCOUNT ({invoice.couponApplied}):</span>
                          <span>-₹{invoice.discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      {invoice.bulkDiscountAmount > 0 && (
                        <div className="flex justify-between text-rose-400">
                          <span>BULK TIER SAVINGS:</span>
                          <span>-₹{invoice.bulkDiscountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-slate-400">
                        <span>GST TAX (18% Avg):</span>
                        <span className="text-slate-300">₹{invoice.gstAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>SHIPPING CHARGE:</span>
                        <span className="text-emerald-400">{invoice.shippingCharge === 0 ? 'FREE' : `₹${invoice.shippingCharge}`}</span>
                      </div>
                      <div className="flex justify-between font-black text-white border-t border-white/10 pt-1.5 text-[11px]">
                        <span>NET TOTAL AMOUNT PAID:</span>
                        <span className="text-indigo-300">₹{invoice.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="flex-1 border border-white/10 hover:bg-white/5 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 text-white cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-indigo-400" /> Save PDF / Print
                    </button>
                    <button
                      onClick={() => {
                        setShowCartModal(false);
                      }}
                      className="flex-1 bg-indigo-500/25 hover:bg-indigo-500/40 border border-indigo-500/35 text-white font-black py-2.5 rounded-xl text-xs uppercase cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary (Sticky) */}
            {checkoutStep !== 'success' && cart.length > 0 && (
              <div className="p-4 border-t border-white/10 bg-[#0f172a]/95 backdrop-blur-xl space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400 font-bold">
                    <span>Store Subtotal</span>
                    <span className="text-white">₹{totals.subtotal.toLocaleString()}</span>
                  </div>
                  {totals.bulkSaved > 0 && (
                    <div className="flex justify-between text-emerald-400 font-extrabold">
                      <span>Bulk Slabs Discount Saved</span>
                      <span>-₹{totals.bulkSaved.toLocaleString()}</span>
                    </div>
                  )}
                  {totals.couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-extrabold">
                      <span>Coupon Saved</span>
                      <span>-₹{totals.couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400 font-bold">
                    <span>Tax addition (GST 18%)</span>
                    <span className="text-white">₹{totals.gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-bold">
                    <span>Shipping Charges</span>
                    <span className="text-emerald-400">{totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-white text-sm border-t border-white/10 pt-2">
                    <span>Estimated Total</span>
                    <span className="text-indigo-300">₹{totals.total.toLocaleString()}</span>
                  </div>
                </div>

                {checkoutStep === 'cart' ? (
                  <button
                    onClick={() => setCheckoutStep('shipping')}
                    className="w-full bg-indigo-500/20 hover:bg-indigo-500/35 border border-indigo-500/30 text-white font-black py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-1.5 uppercase tracking-wide cursor-pointer"
                  >
                    Proceed to Shipping <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="w-full border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <ArrowLeftRight className="w-4 h-4" /> Modify Cart Items
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 24/7 CUSTOMER SUPPORT FLOATING BAR */}
      <div className={`fixed bottom-4 left-4 z-40 transition-all duration-300 flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl border shadow-xl ${
        isDarkMode 
          ? 'bg-slate-900/90 border-white/10 text-white shadow-indigo-500/5' 
          : 'bg-white border-slate-200 text-slate-800 shadow-slate-300'
      }`}>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <div className="text-xs font-semibold">
          <span className="text-[10px] text-slate-400 block uppercase font-black">Support Hotline</span>
          <span className="font-extrabold text-indigo-500 flex items-center gap-1">
            <Phone className="w-3 h-3 text-indigo-500" /> +919569303799
          </span>
        </div>
      </div>

      {/* FLOATING AI CHAT SUPPORT */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 font-sans">
        {/* Chat Window */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`w-80 md:w-96 h-[450px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
                isDarkMode 
                  ? 'bg-[#0f172a]/95 border-white/10 text-white shadow-indigo-500/10' 
                  : 'bg-white border-slate-200 text-slate-800 shadow-slate-400'
              }`}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 bg-indigo-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-extrabold text-sm text-white">
                      🤖
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wide">MY STORE Bot</h4>
                    <p className="text-[9px] text-indigo-200 font-bold">24/7 AI Sales Representative</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Message scroll list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {chatMessages.map((msg, idx) => {
                  const isBot = msg.role === 'bot';
                  return (
                    <div
                      key={idx}
                      className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
                    >
                      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${
                        isBot
                          ? isDarkMode
                            ? 'bg-white/5 border border-white/10 text-slate-100'
                            : 'bg-slate-100 text-slate-800'
                          : 'bg-indigo-600 text-white font-semibold'
                      }`}>
                        <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-slate-400 animate-pulse flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" /> MY STORE chatbot is thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions Panel */}
              <div className="p-2 border-t border-white/10 flex gap-1.5 overflow-x-auto bg-white/5 no-scrollbar select-none">
                <button
                  type="button"
                  onClick={() => handleSendChatMessage("What coupons are available?")}
                  className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-black text-[9px] px-2.5 py-1 rounded-lg border border-indigo-500/20 flex-shrink-0 cursor-pointer uppercase"
                >
                  🏷️ Coupons
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChatMessage("Tell me about bulk discounts")}
                  className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-black text-[9px] px-2.5 py-1 rounded-lg border border-indigo-500/20 flex-shrink-0 cursor-pointer uppercase"
                >
                  📦 Bulk Deals
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChatMessage("Show me popular smartphone stock")}
                  className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-black text-[9px] px-2.5 py-1 rounded-lg border border-indigo-500/20 flex-shrink-0 cursor-pointer uppercase"
                >
                  📱 Smartphones
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChatMessage("How do I contact customer support?")}
                  className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-black text-[9px] px-2.5 py-1 rounded-lg border border-indigo-500/20 flex-shrink-0 cursor-pointer uppercase"
                >
                  📞 Phone Support
                </button>
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className="p-3 border-t border-white/10 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className={`flex-1 rounded-xl px-3 py-2 text-xs outline-none ${
                    isDarkMode
                      ? 'bg-[#131a35]/60 border border-white/10 text-white focus:border-indigo-500'
                      : 'bg-slate-100 border border-slate-300 text-slate-800 focus:bg-white focus:border-indigo-500'
                  }`}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs uppercase cursor-pointer"
                >
                  Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing Toggle Button */}
        <button
          type="button"
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20 transition-all scale-100 hover:scale-110 active:scale-95 relative cursor-pointer group"
        >
          <MessageSquare className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[8px] font-black text-white items-center justify-center">1</span>
          </span>
        </button>
      </div>

      {/* FLASH SALE ALERT DIALOG OVERLAY */}
      <AnimatePresence>
        {showFlashSalePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-3xl border shadow-2xl max-w-sm w-full relative ${
                isDarkMode ? 'bg-slate-900/95 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <button
                type="button"
                onClick={() => setShowFlashSalePopup(false)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
              <div className="text-center space-y-3">
                <div className="text-4xl animate-bounce">⚡ 🔥</div>
                <h3 className="text-lg font-black tracking-tight uppercase text-indigo-500">Flash Sale Extravaganza!</h3>
                <p className="text-xs font-bold leading-relaxed">
                  Get massive bulk discounts on over **100 types of smartphones** with **100 units of each in stock**!
                </p>
                <div className="p-3 bg-indigo-500/10 border border-indigo-400/20 rounded-xl text-xs space-y-1 text-center">
                  <div className="font-black text-indigo-400">Special Active Promo Code:</div>
                  <div className="text-base font-black text-indigo-500 tracking-wider">SUPERMEGA</div>
                  <div className="text-[10px] text-slate-400">15% EXTRA discount on orders over ₹5,000</div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFlashSalePopup(false)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 rounded-xl text-xs transition-all uppercase cursor-pointer"
                >
                  Claim Deals Now!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PURCHASING CONGRATULATIONS BALLOONS PARTY OVERLAY */}
      {showBalloons && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {/* Staggered floating balloons particle generator */}
          {Array.from({ length: 30 }).map((_, i) => {
            const colors = ['#f43f5e', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
            const left = Math.random() * 100; // random horizontal position
            const delay = Math.random() * 3; // random animation delay
            const scale = 0.6 + Math.random() * 0.8; // random size scale
            const duration = 4 + Math.random() * 4; // random rise duration
            const color = colors[i % colors.length];

            return (
              <motion.div
                key={i}
                initial={{ y: '110vh', x: `${left}vw`, scale: scale, opacity: 0.9 }}
                animate={{ y: '-20vh', rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: duration,
                  delay: delay,
                  ease: 'easeOut',
                  repeat: 0
                }}
                onAnimationComplete={() => {
                  if (i === 29) {
                    setShowBalloons(false);
                  }
                }}
                className="absolute flex flex-col items-center"
                style={{ transform: 'translateX(-50%)' }}
              >
                {/* Balloon Body */}
                <div
                  className="w-14 h-16 rounded-t-full rounded-b-[40%] shadow-lg relative flex items-center justify-center text-xs animate-pulse"
                  style={{ backgroundColor: color }}
                >
                  🎈
                  {/* Balloon Knot/Base */}
                  <div
                    className="absolute -bottom-1 w-2 h-2 border-t-[4px] border-l-[4px] border-r-[4px] border-b-0 border-transparent"
                    style={{ borderTopColor: color }}
                  />
                  {/* Balloon String */}
                  <div className="absolute -bottom-12 w-0.5 h-12 bg-white/40" />
                </div>
              </motion.div>
            );
          })}

          {/* Big floating celebratory congratulations card */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: '50vh' }}
            animate={{ scale: 1, opacity: 1, y: '35vh' }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="absolute left-1/2 -translate-x-1/2 bg-slate-900/90 border border-white/20 p-6 md:p-8 rounded-3xl text-center shadow-2xl max-w-sm pointer-events-auto text-white"
          >
            <div className="text-4xl">🎉 🥳 🎉</div>
            <h2 className="text-lg font-black text-indigo-400 mt-3 uppercase tracking-wide">Congratulations!</h2>
            <p className="text-sm text-slate-200 mt-2 font-bold leading-relaxed">
              Greetings <span className="text-indigo-400">{customerName || 'Valued Buyer'}</span>! Your order has been placed successfully in <span className="text-indigo-400 font-extrabold">MY STORE</span>!
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-semibold leading-relaxed">
              We have dispatched balloons to celebrate! Sourced order items are processed securely. Enjoy your premium smartphone devices!
            </p>
            <button
              type="button"
              onClick={() => setShowBalloons(false)}
              className="mt-4 w-full bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/30 text-emerald-300 font-black py-2.5 rounded-xl text-xs uppercase cursor-pointer"
            >
              Yay! Thank you!
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
