export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  price: number; // dynamically calculated based on stock
  mrp: number; // manufacturer's suggested retail price
  discount: number; // general discount percentage
  ratings: number;
  reviewsCount: number;
  reviews: Review[];
  baseStock: number;
  currentStock: number;
  demandScore: number; // 1-100 scale
  supplyScore: number; // 1-100 scale
  popularityIndex: number; // 1-100 scale
  recommendationScore: number; // 1-100 scale
  specifications: Record<string, string>;
  image: string;
  seller: string;
  warranty: string;
  deliveryDays: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minAmount: number;
}

export interface OrderSummary {
  id: string;
  items: { productId: string; name: string; price: number; quantity: number; total: number }[];
  subtotal: number;
  discountAmount: number;
  bulkDiscountAmount: number;
  gstAmount: number;
  shippingCharge: number;
  totalAmount: number;
  couponApplied?: string;
  date: string;
  customerName: string;
  shippingAddress: string;
}

export interface Advertisement {
  id: string;
  type: 'popup' | 'side' | 'product' | 'category' | 'festival' | 'flash_sale';
  title: string;
  image: string;
  targetUrl: string;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  revenue: number;
}

// 20 Dashboards definitions
export type DashboardType =
  | 'Sales'
  | 'Revenue'
  | 'Inventory'
  | 'Customer'
  | 'Product'
  | 'Advertisement'
  | 'Marketing'
  | 'Finance'
  | 'Supplier'
  | 'Warehouse'
  | 'Order'
  | 'Delivery'
  | 'Returns'
  | 'Discounts'
  | 'Customer Interest'
  | 'Product Demand'
  | 'Stock Movement'
  | 'Executive'
  | 'Business Intelligence'
  | 'KPI';

export interface KPICard {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface DashboardData {
  type: DashboardType;
  kpis: KPICard[];
  charts: {
    title: string;
    type: 'bar' | 'line' | 'pie' | 'treemap' | 'heatmap' | 'scatter' | 'area' | 'donut' | 'funnel' | 'gauge';
    data: ChartDataPoint[];
    keys: string[];
  }[];
  table: {
    headers: string[];
    rows: Record<string, any>[];
  };
}
