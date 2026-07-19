import { Product, OrderSummary, Advertisement, DashboardType } from '../types';
import productsSeed from '../data/products.json';

// Configuration keys for local storage
const LS_PRODUCTS_KEY = 'mystore_offline_products';
const LS_ORDERS_KEY = 'mystore_offline_orders';
const LS_RULES_KEY = 'mystore_offline_rules';
const LS_ADS_KEY = 'mystore_offline_ads';

// Define business rules interface
export interface BusinessRules {
  priceCurve: 'linear' | 'aggressive' | 'standard';
  safetyStockLimit: number;
  taxRatePercent: number;
  shippingFreeLimit: number;
  shippingFlatRate: number;
}

// Initial default business rules
const DEFAULT_RULES: BusinessRules = {
  priceCurve: 'standard',
  safetyStockLimit: 10,
  taxRatePercent: 18,
  shippingFreeLimit: 2000,
  shippingFlatRate: 150
};

// Default initial advertisement list
const DEFAULT_ADS: Advertisement[] = [
  {
    id: 'ad-1',
    type: 'festival',
    title: 'Grand Electronics Festival - Save Up to 40%!',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    targetUrl: '/store',
    impressions: 450000,
    clicks: 38200,
    ctr: 8.49,
    conversions: 4210,
    revenue: 5420000
  },
  {
    id: 'ad-2',
    type: 'flash_sale',
    title: 'Flash Sale: Sony Noise Cancellation ANC Headset',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    targetUrl: '/product/prod-6',
    impressions: 210000,
    clicks: 19800,
    ctr: 9.43,
    conversions: 1840,
    revenue: 5518160
  },
  {
    id: 'ad-3',
    type: 'popup',
    title: 'New Launch! MacBook Pro M4 Series Pro Speed',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    targetUrl: '/product/prod-3',
    impressions: 125000,
    clicks: 14200,
    ctr: 11.36,
    conversions: 420,
    revenue: 10285800
  }
];

// Helper to compute dynamic pricing locally
export function localCalculateDynamicPrice(product: Product, rules: BusinessRules): number {
  const stockRatio = product.currentStock / product.baseStock;
  let multiplier = 1.0;

  if (stockRatio < 0.1) {
    multiplier = rules.priceCurve === 'aggressive' ? 1.15 : rules.priceCurve === 'linear' ? 1.05 : 1.10;
  } else if (stockRatio < 0.3) {
    multiplier = rules.priceCurve === 'aggressive' ? 1.08 : rules.priceCurve === 'linear' ? 1.03 : 1.05;
  } else if (stockRatio > 0.8) {
    multiplier = rules.priceCurve === 'aggressive' ? 0.90 : rules.priceCurve === 'linear' ? 0.97 : 0.95;
  }

  const baseDiscountPrice = product.mrp * (1 - product.discount / 100);
  const calculatedPrice = Math.round(baseDiscountPrice * multiplier);
  return Math.min(product.mrp, calculatedPrice);
}

// Helper to compute bulk discount locally
export function localCalculateBulkDiscount(qty: number, basePrice: number) {
  let percent = 0;
  if (qty >= 10 && qty <= 20) percent = 5;
  else if (qty >= 21 && qty <= 50) percent = 10;
  else if (qty >= 51 && qty <= 100) percent = 15;
  else if (qty > 100) percent = 20;

  const discountVal = Math.round((basePrice * percent) / 100);
  return {
    percent,
    saved: discountVal * qty,
    finalPrice: basePrice - discountVal
  };
}

// Initialize Offline database
function getLocalProducts(): Product[] {
  const stored = localStorage.getItem(LS_PRODUCTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  // If not in local storage, parse initial JSON seed
  const initial = productsSeed as any[];
  const rules = getLocalRules();
  const list = initial.map((p: any) => {
    const fresh = {
      ...p,
      reviews: p.reviews || []
    };
    fresh.price = localCalculateDynamicPrice(fresh, rules);
    return fresh as Product;
  });
  saveLocalProducts(list);
  return list;
}

function saveLocalProducts(list: Product[]) {
  localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(list));
}

function getLocalRules(): BusinessRules {
  const stored = localStorage.getItem(LS_RULES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return DEFAULT_RULES;
}

function saveLocalRules(rules: BusinessRules) {
  localStorage.setItem(LS_RULES_KEY, JSON.stringify(rules));
}

function getLocalOrders(): OrderSummary[] {
  const stored = localStorage.getItem(LS_ORDERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return [];
}

function saveLocalOrders(orders: OrderSummary[]) {
  localStorage.setItem(LS_ORDERS_KEY, JSON.stringify(orders));
}

function getLocalAds(): Advertisement[] {
  const stored = localStorage.getItem(LS_ADS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return DEFAULT_ADS;
}

function saveLocalAds(ads: Advertisement[]) {
  localStorage.setItem(LS_ADS_KEY, JSON.stringify(ads));
}

// Global active mode status
let liveModeDetected: boolean | null = null;

export const apiClient = {
  // Check if live server is reachable
  async detectMode(): Promise<boolean> {
    if (liveModeDetected !== null) return liveModeDetected;
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1200); // Fail fast
      const res = await fetch('/api/store-info', { signal: controller.signal });
      clearTimeout(id);
      liveModeDetected = res.ok;
    } catch (err) {
      liveModeDetected = false;
    }
    return liveModeDetected;
  },

  setForceOffline(offline: boolean) {
    liveModeDetected = !offline;
  },

  // Get general store settings and rules
  async getStoreInfo() {
    const isLive = await this.detectMode();
    if (isLive) {
      try {
        const res = await fetch('/api/store-info');
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Express /api/store-info unreachable, falling back to local storage.", err);
      }
    }
    return {
      categories: ['Smartphones', 'Laptops', 'Smart TVs', 'Tablets', 'Smart Watches', 'Headphones', 'Speakers', 'Cameras', 'Monitors', 'Keyboards', 'Mouse', 'Routers', 'Power Banks'],
      businessRules: getLocalRules(),
      geminiConfigured: false,
      offlineStandAlone: true
    };
  },

  // Get active products
  async getProducts(filters?: { category?: string; brand?: string; search?: string }): Promise<Product[]> {
    const isLive = await this.detectMode();
    if (isLive) {
      try {
        let url = '/api/products';
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.brand) params.append('brand', filters.brand);
        if (filters?.search) params.append('search', filters.search);
        
        const queryStr = params.toString();
        if (queryStr) url += `?${queryStr}`;

        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Express /api/products unreachable, falling back locally.", err);
      }
    }

    // Client-side offline evaluation
    const rules = getLocalRules();
    let list = getLocalProducts().map(p => ({
      ...p,
      price: localCalculateDynamicPrice(p, rules)
    }));

    if (filters?.category) {
      list = list.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters?.brand) {
      list = list.filter(p => p.brand.toLowerCase() === filters.brand!.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return list;
  },

  // Checkout shopping cart
  async checkout(payload: {
    items: { productId: string; quantity: number }[];
    couponCode?: string;
    customerName: string;
    shippingAddress: string;
  }): Promise<{ success: boolean; invoice: OrderSummary }> {
    const isLive = await this.detectMode();
    if (isLive) {
      try {
        const res = await fetch('/api/cart/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Express checkout checkout endpoint failed, processing offline.", err);
      }
    }

    // Client-side offline checkout algorithm
    const products = getLocalProducts();
    const rules = getLocalRules();
    let subtotal = 0;
    let bulkDiscountAmount = 0;
    const processedItems: any[] = [];

    for (const item of payload.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) continue;

      const dynamicPrice = localCalculateDynamicPrice(product, rules);
      const itemSubtotal = dynamicPrice * item.quantity;
      subtotal += itemSubtotal;

      const bulk = localCalculateBulkDiscount(item.quantity, dynamicPrice);
      bulkDiscountAmount += bulk.saved;

      processedItems.push({
        productId: product.id,
        name: product.name,
        price: dynamicPrice,
        quantity: item.quantity,
        total: itemSubtotal - bulk.saved
      });

      // Reduce inventory immediately in local DB
      product.currentStock = Math.max(0, product.currentStock - item.quantity);
      product.price = localCalculateDynamicPrice(product, rules);
    }

    saveLocalProducts(products);

    let discountAmount = 0;
    let couponApplied = undefined;
    if (payload.couponCode) {
      const codeUpper = payload.couponCode.toUpperCase().trim();
      if (codeUpper === 'ELECTRO10' && subtotal >= 1000) {
        discountAmount = Math.round(subtotal * 0.1);
        couponApplied = 'ELECTRO10';
      } else if (codeUpper === 'SUPERMEGA' && subtotal >= 5000) {
        discountAmount = Math.round(subtotal * 0.15);
        couponApplied = 'SUPERMEGA';
      } else if (codeUpper === 'FESTIVE25' && subtotal >= 15000) {
        discountAmount = Math.round(subtotal * 0.25);
        couponApplied = 'FESTIVE25';
      }
    }

    const taxableAmount = subtotal - discountAmount - bulkDiscountAmount;
    const gstAmount = Math.round((taxableAmount * rules.taxRatePercent) / 100);
    const shippingCharge = taxableAmount >= rules.shippingFreeLimit ? 0 : rules.shippingFlatRate;
    const totalAmount = taxableAmount + gstAmount + shippingCharge;

    const invoice: OrderSummary = {
      id: `INV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
      items: processedItems,
      subtotal,
      discountAmount,
      bulkDiscountAmount,
      gstAmount,
      shippingCharge,
      totalAmount,
      couponApplied,
      date: new Date().toISOString(),
      customerName: payload.customerName || 'Valued Buyer',
      shippingAddress: payload.shippingAddress || 'No Address, Offline Mode'
    };

    // Save order in history
    const orders = getLocalOrders();
    orders.unshift(invoice);
    saveLocalOrders(orders);

    return { success: true, invoice };
  },

  // Submit product review
  async addReview(productId: string, payload: { userName: string; rating: number; comment: string }): Promise<{ success: boolean; product: Product }> {
    const isLive = await this.detectMode();
    if (isLive) {
      try {
        const res = await fetch(`/api/products/${productId}/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Express add review failed, updating local state.", err);
      }
    }

    const products = getLocalProducts();
    const p = products.find(prod => prod.id === productId);
    if (!p) throw new Error("Product not found");

    const newReview = {
      id: `r-gen-user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userName: payload.userName,
      rating: Number(payload.rating),
      comment: payload.comment,
      date: new Date().toISOString().split('T')[0]
    };

    p.reviews = [newReview, ...(p.reviews || [])];
    p.reviewsCount += 1;

    const totalRatingSum = p.reviews.reduce((sum, r) => sum + r.rating, 0);
    p.ratings = parseFloat((totalRatingSum / p.reviews.length).toFixed(1));

    saveLocalProducts(products);
    return { success: true, product: p };
  },

  // Edit SKU parameter
  async editProduct(productId: string, edits: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    const isLive = await this.detectMode();
    if (isLive) {
      try {
        const res = await fetch(`/api/products/${productId}/edit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(edits)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Express edit product failed, editing offline databases.", err);
      }
    }

    const products = getLocalProducts();
    const p = products.find(prod => prod.id === productId);
    if (!p) throw new Error("Product not found");

    if (edits.name !== undefined) p.name = edits.name;
    if (edits.brand !== undefined) p.brand = edits.brand;
    if (edits.mrp !== undefined) p.mrp = Number(edits.mrp);
    if (edits.discount !== undefined) p.discount = Number(edits.discount);
    if (edits.currentStock !== undefined) p.currentStock = Math.max(0, Number(edits.currentStock));
    if (edits.description !== undefined) p.description = edits.description;

    const rules = getLocalRules();
    p.price = localCalculateDynamicPrice(p, rules);

    saveLocalProducts(products);
    return { success: true, product: p };
  },

  // Replenish product inventory
  async replenishStock(productId: string, qty: number): Promise<{ success: boolean }> {
    const isLive = await this.detectMode();
    if (isLive) {
      try {
        const res = await fetch(`/api/products/${productId}/stock`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'in', amount: qty })
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Express replenish stock endpoint failed, updating locally.", err);
      }
    }

    const products = getLocalProducts();
    const p = products.find(prod => prod.id === productId);
    if (p) {
      p.currentStock = (p.currentStock || 0) + Number(qty);
      const rules = getLocalRules();
      p.price = localCalculateDynamicPrice(p, rules);
      saveLocalProducts(products);
    }
    return { success: true };
  },

  // Decrement stock during simulation or checkout
  async reduceStock(productId: string, qty: number): Promise<{ success: boolean }> {
    const isLive = await this.detectMode();
    if (isLive) {
      try {
        const res = await fetch(`/api/products/${productId}/stock`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'out', amount: qty })
        });
        if (res.ok) return await res.json();
      } catch (err) {}
    }

    const products = getLocalProducts();
    const p = products.find(prod => prod.id === productId);
    if (p) {
      p.currentStock = Math.max(0, (p.currentStock || 0) - Number(qty));
      const rules = getLocalRules();
      p.price = localCalculateDynamicPrice(p, rules);
      saveLocalProducts(products);
    }
    return { success: true };
  },

  // Update business rules config
  async updateStoreConfig(edits: Partial<BusinessRules>) {
    const isLive = await this.detectMode();
    if (isLive) {
      try {
        const res = await fetch('/api/store-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(edits)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Express config update failed, updating client rules.", err);
      }
    }

    const current = getLocalRules();
    const updated = { ...current, ...edits };
    saveLocalRules(updated);

    // Recalculate all local product prices based on new rules
    const products = getLocalProducts();
    products.forEach(p => {
      p.price = localCalculateDynamicPrice(p, updated);
    });
    saveLocalProducts(products);

    return { success: true, businessRules: updated, products };
  },

  // Deterministic local BI data calculations
  async getDashboardData(dashboard: DashboardType, category: string, timeRange: string, refreshTrigger: number) {
    const isLive = await this.detectMode();
    if (isLive) {
      try {
        const url = `/api/dashboards/${dashboard}?category=${encodeURIComponent(category)}&timeRange=${timeRange}&refreshTrigger=${refreshTrigger}`;
        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Express BI dashboard unreachable, serving static analytical formulas.", err);
      }
    }

    // Client-side analytical dashboard modeling
    const catSeed = category ? category.charCodeAt(0) + category.length : 42;
    const rangeMultiplier = timeRange === 'Today' ? 0.15 : timeRange === 'Weekly' ? 0.55 : timeRange === 'Monthly' ? 1.0 : 4.5;
    const noise = (Math.sin(refreshTrigger * 1.5) + 1.0) * 0.05 + 0.98;

    const baseRevenue = 245000000 * rangeMultiplier * noise;
    const baseSales = 12540 * rangeMultiplier * noise;
    const margin = 0.28;

    const mockKPIs: Record<string, any[]> = {
      'Sales': [
        { title: "Total Volume Sold", value: Math.round(baseSales).toLocaleString(), change: "+14.2% vs last period", isPositive: true, icon: 'ShoppingBag' },
        { title: "Conversion Rate", value: "3.42%", change: "+0.25% MoM", isPositive: true, icon: 'TrendingUp' },
        { title: "Average Order Value", value: `₹${Math.round(21500 + catSeed * 10).toLocaleString()}`, change: "+1.8% vs last period", isPositive: true, icon: 'CreditCard' },
        { title: "Active Buyers", value: Math.round(84200 * rangeMultiplier).toLocaleString(), change: "+5.1% MoM", isPositive: true, icon: 'Users' }
      ],
      'Revenue': [
        { title: "Gross Revenue", value: `₹${Math.round(baseRevenue).toLocaleString()}`, change: "+12.8% vs last period", isPositive: true, icon: 'DollarSign' },
        { title: "Net Profit", value: `₹${Math.round(baseRevenue * margin).toLocaleString()}`, change: "+15.1% YoY", isPositive: true, icon: 'Activity' },
        { title: "Average Order Revenue", value: `₹${Math.round(18500 + catSeed * 50).toLocaleString()}`, change: "-2.1% due to bulk promos", isPositive: false, icon: 'ArrowDownUp' },
        { title: "Projected Sales Growth", value: "22.4%", change: "Optimistic Forecast", isPositive: true, icon: 'Sparkles' }
      ],
      'Inventory': [
        { title: "Total Catalog Items", value: "10,482", change: "20 Active Categories", isPositive: true, icon: 'Layers' },
        { title: "Active Warehouse Stock", value: "542,800 units", change: "92.4% Storage Utilized", isPositive: true, icon: 'Package' },
        { title: "Out of Stock Items", value: "14", change: "-8 from yesterday", isPositive: true, icon: 'AlertTriangle' },
        { title: "Inventory Turnover Ratio", value: "8.4", change: "Fast-Moving Electronics", isPositive: true, icon: 'Shuffle' }
      ],
      'Customer': [
        { title: "Total Registered", value: "125,480", change: "+1,240 Today", isPositive: true, icon: 'UserCheck' },
        { title: "Customer Sat. Score (CSAT)", value: "4.82/5", change: "Based on 300,000+ reviews", isPositive: true, icon: 'Smile' },
        { title: "Returning Buyers", value: "48.2%", change: "+3.2% loyalty campaign", isPositive: true, icon: 'Repeat' },
        { title: "Lifetime Value (Avg LTV)", value: "₹45,200", change: "+4.1% YoY", isPositive: true, icon: 'TrendingUp' }
      ]
    };

    const mockCharts: Record<string, any[]> = {
      'Sales': [
        {
          title: "Sourced Smartphone Categories Direct Sales Trend",
          type: 'line',
          keys: ['iOSVolume', 'AndroidVolume'],
          data: [
            { name: 'M1', iOSVolume: Math.round(520 * noise), AndroidVolume: Math.round(410 * noise) },
            { name: 'M2', iOSVolume: Math.round(580 * noise), AndroidVolume: Math.round(440 * noise) },
            { name: 'M3', iOSVolume: Math.round(620 * noise), AndroidVolume: Math.round(480 * noise) },
            { name: 'M4', iOSVolume: Math.round(710 * noise), AndroidVolume: Math.round(510 * noise) }
          ]
        },
        {
          title: "Payment Gateway Transaction Share (%)",
          type: 'bar',
          keys: ['UPI', 'CreditCard', 'NetBanking'],
          data: [
            { name: 'Metro Cities', UPI: 45, CreditCard: 35, NetBanking: 20 },
            { name: 'Tier-2 Hubs', UPI: 62, CreditCard: 22, NetBanking: 16 }
          ]
        }
      ],
      'Revenue': [
        {
          title: "Corporate Electronics Margin Trajectory",
          type: 'area',
          keys: ['Revenue', 'Profit'],
          data: [
            { name: 'Q1', Revenue: Math.round(baseRevenue * 0.22), Profit: Math.round(baseRevenue * 0.22 * margin) },
            { name: 'Q2', Revenue: Math.round(baseRevenue * 0.26), Profit: Math.round(baseRevenue * 0.26 * margin) },
            { name: 'Q3', Revenue: Math.round(baseRevenue * 0.32), Profit: Math.round(baseRevenue * 0.32 * margin) },
            { name: 'Q4', Revenue: Math.round(baseRevenue * 0.38), Profit: Math.round(baseRevenue * 0.38 * margin) }
          ]
        }
      ]
    };

    const selectedKPIs = mockKPIs[dashboard] || mockKPIs['Sales'];
    const selectedCharts = mockCharts[dashboard] || mockCharts['Sales'];

    const mockTables: Record<string, { headers: string[]; rows: any[] }> = {
      'Sales': {
        headers: ['Transaction ID', 'Customer', 'Product Purchased', 'Quantity', 'Sales Revenue', 'Status'],
        rows: [
          { 'Transaction ID': 'TXN-9021', 'Customer': 'Vikram Sharma', 'Product Purchased': 'iPhone 16 Pro Max', 'Quantity': 1, 'Sales Revenue': '₹1,39,900', 'Status': 'Delivered' },
          { 'Transaction ID': 'TXN-9022', 'Customer': 'Meenakshi Iyer', 'Product Purchased': 'Logitech MX Mouse', 'Quantity': 12, 'Sales Revenue': '₹1,13,940', 'Status': 'Shipped' },
          { 'Transaction ID': 'TXN-9023', 'Customer': 'Aman Gupta', 'Product Purchased': 'PlayStation 5 Pro', 'Quantity': 2, 'Sales Revenue': '₹1,29,980', 'Status': 'Delivered' }
        ]
      }
    };

    const selectedTable = mockTables[dashboard] || mockTables['Sales'];

    return {
      type: dashboard,
      kpis: selectedKPIs,
      charts: selectedCharts,
      table: selectedTable
    };
  },

  // Local rule-based intelligent NLP assistant / search matching
  async aiSearch(query: string): Promise<{ response: string; source: string }> {
    const isLive = await this.detectMode();
    if (isLive) {
      try {
        const res = await fetch('/api/search/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("AI search api endpoint offline, running local rule engine.", err);
      }
    }

    const q = query.toLowerCase();
    const rules = getLocalRules();
    let recommendations = getLocalProducts().map(p => ({
      ...p,
      price: localCalculateDynamicPrice(p, rules)
    }));

    if (q.includes('iphone') || q.includes('apple') || q.includes('phone') || q.includes('mobile')) {
      recommendations = recommendations.filter(p => p.category === 'Smartphones' || p.brand === 'Apple');
    } else if (q.includes('laptop') || q.includes('macbook') || q.includes('computer') || q.includes('pc')) {
      recommendations = recommendations.filter(p => p.category === 'Laptops');
    } else if (q.includes('tv') || q.includes('television') || q.includes('display')) {
      recommendations = recommendations.filter(p => p.category === 'Smart TVs' || p.category === 'Monitors');
    } else if (q.includes('headphone') || q.includes('earphone') || q.includes('music') || q.includes('sound')) {
      recommendations = recommendations.filter(p => p.category === 'Headphones' || p.category === 'Speakers');
    } else {
      recommendations = recommendations.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    const topRecs = recommendations.slice(0, 3);
    let responseText = `### Local Smart Search Match (Offline Static Mode)

I searched our local bundled catalog for **"${query}"** and found some excellent matching electronic devices:

`;

    if (topRecs.length > 0) {
      topRecs.forEach(p => {
        const stockMsg = p.currentStock === 0 ? '🚫 Out of Stock' : p.currentStock < rules.safetyStockLimit ? `⚠️ Low Stock (${p.currentStock} left)` : `✅ In Stock (${p.currentStock} units)`;
        responseText += `*   **${p.name}** (${p.brand})
    *   **Special Price:** ₹${p.price.toLocaleString()} (MRP: ~~₹${p.mrp.toLocaleString()}~~)
    *   **Rating:** ⭐ ${p.ratings} / 5
    *   **Stock Status:** ${stockMsg}
    *   *Sourcing from Partner: ${p.seller}*\n\n`;
      });
      responseText += `*Operating entirely offline directly from \`products.json\` with client-side dynamic pricing logic.*`;
    } else {
      responseText += `I couldn't find any direct match for "${query}" in our local search. Try searching for popular categories like **Smartphones**, **Laptops**, **Smart TVs**, or **Gaming Consoles**.\n\n*Running entirely offline.*`;
    }

    return { response: responseText, source: 'Local Offline NLP Engine' };
  },

  // Interactive Customer Support Chatbot (Gemini AI + Local fallback)
  async chatbot(message: string, history?: any[]): Promise<{ response: string; source: string }> {
    const isLive = await this.detectMode();
    if (isLive) {
      try {
        const res = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, history })
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Chatbot API endpoint offline, running local chatbot.", err);
      }
    }

    const text = message.toLowerCase();
    let fallbackResponse = "";
    if (text.includes("support") || text.includes("number") || text.includes("contact") || text.includes("help") || text.includes("phone") || text.includes("call")) {
      fallbackResponse = `You can instantly contact our dedicated **MY STORE Support Team** at **+919569303799** (via Call or WhatsApp). We are here 24/7 to resolve shipping, payments, and product inquiries.`;
    } else if (text.includes("bulk") || text.includes("discount") || text.includes("wholesale")) {
      fallbackResponse = `Yes! We offer live bulk order discounts automatically in your cart:
*   **10 - 20 Units:** **5% OFF**
*   **21 - 50 Units:** **10% OFF**
*   **51 - 100 Units:** **15% OFF**
*   **101+ Units:** **20% OFF**
These apply automatically below each item and are compiled on your checkout screen.`;
    } else if (text.includes("coupon") || text.includes("promo") || text.includes("code") || text.includes("offer")) {
      fallbackResponse = `Enjoy extra savings with our standard coupons at checkout:
1.  **ELECTRO10**: 10% OFF (Minimum purchase ₹1,000)
2.  **SUPERMEGA**: 15% OFF (Minimum purchase ₹5,000)
3.  **FESTIVE25**: 25% OFF (Minimum purchase ₹15,000)`;
    } else if (text.includes("smartphone") || text.includes("phone") || text.includes("mobile")) {
      fallbackResponse = `We have over **100 different types of smartphones** in stock with **100 units each** ready to ship! Search for premium Apple iPhones, Samsung Galaxies, Google Pixels, OnePlus flagships, and more. Use our search bar or filter by "Smartphones" to explore!`;
    } else {
      fallbackResponse = `Thank you for messaging **MY STORE** support! We specialize in high-fidelity electronics, with a catalog of 100+ top-tier smartphones and e-commerce deals. For questions or direct support, dial our 24/7 hotline at **+919569303799**.`;
    }

    return { response: fallbackResponse, source: 'MY STORE Offline Support Bot' };
  }
};
