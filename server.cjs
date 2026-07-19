var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");

// src/data/mockData.ts
var CATEGORIES = [
  "Smartphones",
  "Laptops",
  "Smart TVs",
  "Tablets",
  "Smart Watches",
  "Gaming Consoles",
  "Headphones",
  "Speakers",
  "Cameras",
  "Printers",
  "Monitors",
  "Keyboards",
  "Mouse",
  "Routers",
  "SSD",
  "Hard Drives",
  "Power Banks",
  "Smart Home Devices",
  "Accessories",
  "More Electronics"
];
function generateExtraSmartphones() {
  const brands = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Motorola", "Realme", "Oppo", "Vivo", "Asus", "Nothing", "Sony", "IQOO"];
  const colors = ["Obsidian Black", "Titanium Silver", "Cosmic Blue", "Sunset Gold", "Emerald Green", "Shadow Grey"];
  const images = [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80",
    "https://images.unsplash.com/photo-1565849904461-09a7dfdb3556?w=500&q=80",
    "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=500&q=80"
  ];
  const list = [];
  for (let i = 1; i <= 100; i++) {
    const brand = brands[i % brands.length];
    const color = colors[i % colors.length];
    const storage = ["128GB", "256GB", "512GB", "1TB"][i % 4];
    const ram = ["8GB", "12GB", "16GB", "24GB"][i % 4];
    let name = "";
    let basePrice = 25e3 + i * 1234 % 95e3;
    if (brand === "Apple") {
      const appleModels = ["iPhone 15", "iPhone 15 Plus", "iPhone 16", "iPhone 16 Pro", "iPhone 17 Pro"];
      const model = appleModels[i % appleModels.length];
      name = `${model} (${storage}, ${color})`;
      basePrice = 79900 + i * 1500 % 8e4;
    } else if (brand === "Samsung") {
      const samsungModels = ["Galaxy S25", "Galaxy S26", "Galaxy A55", "Galaxy S26 FE", "Galaxy M55"];
      const model = samsungModels[i % samsungModels.length];
      name = `${model} (${ram} RAM, ${storage}, ${color})`;
      basePrice = 24900 + i * 1800 % 1e5;
    } else {
      const otherModels = ["Nord CE4", "12R", "Pixel 9a", "Pixel 10 Pro", "Nothing Phone (2a)", "Redmi Note 14 Pro", "Edge 50 Pro", "V40 Pro", "Reno 12 Pro", "IQOO Neo 9 Pro"];
      const model = otherModels[i % otherModels.length];
      name = `${brand} ${model} (${ram} RAM, ${storage}, ${color})`;
    }
    const mrp = Math.round(basePrice * 1.15);
    const discount = 5 + i % 21;
    const price = Math.round(mrp * (1 - discount / 100));
    list.push({
      id: `generated-smartphone-${i}`,
      name,
      category: "Smartphones",
      brand,
      description: `Premium smartphone from ${brand} featuring cutting-edge design, optimized performance, stunning high-frequency display, and a versatile, high-resolution camera setup.`,
      mrp,
      price,
      discount,
      ratings: parseFloat((4 + i % 10 * 0.1).toFixed(1)),
      reviewsCount: 100 + i * 37 % 3500,
      reviews: [
        {
          id: `r-gen-${i}-1`,
          userName: "Verified Buyer " + i,
          rating: 4 + i % 2,
          comment: `Amazing performance! The battery lasts all day and the camera is exceptionally crisp. Highly recommend this brand.`,
          date: "2026-07-10"
        }
      ],
      baseStock: 100,
      currentStock: 100,
      // 100 each items
      demandScore: 60 + i % 38,
      supplyScore: 80,
      popularityIndex: 70 + i % 26,
      recommendationScore: 75 + i % 21,
      specifications: {
        "Display": "6.7-inch AMOLED 120Hz",
        "Processor": brand === "Apple" ? "A18 Pro" : brand === "Samsung" ? "Exynos 2500" : "Snapdragon 8 Gen 4",
        "Storage": storage,
        "RAM": ram,
        "Battery": "5000 mAh"
      },
      image: images[i % images.length],
      seller: "SuperCom Net",
      warranty: "1 Year Brand Sourced Warranty",
      deliveryDays: 1 + i % 4
    });
  }
  return list;
}
var INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "iPhone 16 Pro Max (256GB, Desert Titanium)",
    category: "Smartphones",
    brand: "Apple",
    description: "The ultimate iPhone featuring a stunning titanium design, the revolutionary A18 Pro chip, a major leap in battery life, and a pro camera system with 5x Telephoto.",
    mrp: 144900,
    price: 139900,
    discount: 3,
    ratings: 4.8,
    reviewsCount: 15200,
    baseStock: 150,
    currentStock: 42,
    // low stock -> dynamic pricing increases price slightly
    demandScore: 94,
    supplyScore: 35,
    popularityIndex: 98,
    recommendationScore: 96,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80",
    seller: "SuperCom Net",
    warranty: "1 Year Apple Domestic Warranty",
    deliveryDays: 2,
    specifications: {
      "Display": "6.9-inch Super Retina XDR OLED",
      "Processor": "A18 Pro chip with 6-core GPU",
      "Camera": "48MP Main + 48MP Ultra Wide + 12MP 5x Telephoto",
      "Storage": "256 GB",
      "OS": "iOS 18",
      "Weight": "227g"
    },
    reviews: [
      { id: "r-1", userName: "Aman S.", rating: 5, comment: "Phenomenal battery life and camera upgrades. The titanium texture is beautiful.", date: "2026-07-15" },
      { id: "r-2", userName: "Neha R.", rating: 4, comment: "Fantastic screen and gaming capability. Expensive but totally worth it.", date: "2026-07-12" }
    ]
  },
  {
    id: "prod-2",
    name: "Samsung Galaxy S26 Ultra (512GB, Titanium Gray)",
    category: "Smartphones",
    brand: "Samsung",
    description: "Power-packed Android smartphone with an integrated S Pen, Snapdragon 8 Gen 5 processor, a breathtaking 200MP Quad Telephoto zoom camera, and advanced AI features.",
    mrp: 139999,
    price: 129999,
    discount: 7,
    ratings: 4.7,
    reviewsCount: 12400,
    baseStock: 200,
    currentStock: 145,
    // high stock -> dynamic pricing lowers price slightly
    demandScore: 88,
    supplyScore: 75,
    popularityIndex: 95,
    recommendationScore: 92,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80",
    seller: "RetailerIndia Ltd",
    warranty: "1 Year Brand Warranty",
    deliveryDays: 3,
    specifications: {
      "Display": "6.8-inch Dynamic AMOLED 2X",
      "Processor": "Snapdragon 8 Gen 5",
      "Camera": "200MP + 50MP + 12MP + 10MP Quad Camera",
      "Storage": "512 GB",
      "RAM": "12 GB",
      "Battery": "5000 mAh"
    },
    reviews: [
      { id: "r-3", userName: "Rohan M.", rating: 5, comment: "The zoom clarity on this camera is witchcraft. Best Android flag-ship by far.", date: "2026-07-14" }
    ]
  },
  {
    id: "prod-3",
    name: 'MacBook Pro 16" (M4 Pro, 24GB Unified Memory, 512GB SSD)',
    category: "Laptops",
    brand: "Apple",
    description: "Built for developers, creators, and professionals. The M4 Pro chip offers blazing-fast speeds, a spectacular Liquid Retina XDR display, up to 24 hours of battery life.",
    mrp: 249900,
    price: 244900,
    discount: 2,
    ratings: 4.9,
    reviewsCount: 3800,
    baseStock: 80,
    currentStock: 12,
    // extremely low stock -> high premium
    demandScore: 97,
    supplyScore: 15,
    popularityIndex: 99,
    recommendationScore: 98,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    seller: "SuperCom Net",
    warranty: "1 Year Apple International Warranty",
    deliveryDays: 1,
    specifications: {
      "Display": "16.2-inch Liquid Retina XDR",
      "Processor": "Apple M4 Pro 14-core CPU",
      "Graphics": "20-core GPU",
      "Memory": "24 GB Unified RAM",
      "Storage": "512 GB SSD",
      "OS": "macOS Sequoia"
    },
    reviews: [
      { id: "r-4", userName: "Vikram K.", rating: 5, comment: "Compilation speeds are insane. Absolutely silent even under full load!", date: "2026-07-10" }
    ]
  },
  {
    id: "prod-4",
    name: "Dell XPS 16 Laptop (Intel Core Ultra 9, 32GB RAM, 1TB SSD)",
    category: "Laptops",
    brand: "Dell",
    description: "Artistic aluminum design meets bleeding-edge power. Features a stunning 16.3-inch OLED touch display, NVIDIA RTX 4060 graphics, and Intel AI boost processor.",
    mrp: 219999,
    price: 199999,
    discount: 9,
    ratings: 4.5,
    reviewsCount: 2100,
    baseStock: 100,
    currentStock: 85,
    // medium-high stock -> normal/discounted price
    demandScore: 78,
    supplyScore: 82,
    popularityIndex: 84,
    recommendationScore: 81,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80",
    seller: "DellDirect Express",
    warranty: "2 Years Premium Support Plus",
    deliveryDays: 4,
    specifications: {
      "Display": "16.3-inch 4K OLED Touchscreen",
      "Processor": "Intel Core Ultra 9 185H",
      "Graphics": "NVIDIA GeForce RTX 4060 (8GB GDDR6)",
      "Memory": "32 GB LPDDR5X",
      "Storage": "1 TB Gen4 NVMe SSD",
      "OS": "Windows 11 Pro"
    },
    reviews: [
      { id: "r-5", userName: "Dev J.", rating: 4, comment: "The screen is amazing. Keyboard takes getting used to, but build is high quality.", date: "2026-07-08" }
    ]
  },
  {
    id: "prod-5",
    name: 'Sony Bravia 65" XR OLED Smart Google TV',
    category: "Smart TVs",
    brand: "Sony",
    description: "Step into incredible contrast with absolute blacks and high brightness powered by the Cognitive Processor XR. Features immersive acoustic surface audio + Google TV interface.",
    mrp: 189900,
    price: 169900,
    discount: 10,
    ratings: 4.8,
    reviewsCount: 4500,
    baseStock: 60,
    currentStock: 52,
    // high stock -> stable lower price
    demandScore: 85,
    supplyScore: 85,
    popularityIndex: 89,
    recommendationScore: 91,
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80",
    seller: "Sony Retail Sourcing",
    warranty: "2 Years Comprehensive Warranty",
    deliveryDays: 5,
    specifications: {
      "Screen Size": "65 inches",
      "Display Type": "OLED",
      "Resolution": "Ultra HD 4K (3840 x 2160)",
      "Smart TV OS": "Google TV",
      "Sound Output": "60 Watts Acoustic Surface Audio+",
      "Refresh Rate": "120 Hz"
    },
    reviews: [
      { id: "r-6", userName: "Sanjay P.", rating: 5, comment: "OLED blacks are gorgeous. Built-in sound is so good I do not need a soundbar.", date: "2026-07-02" }
    ]
  },
  {
    id: "prod-6",
    name: "Sony WH-1000XM6 Wireless Noise Canceling Headphones",
    category: "Headphones",
    brand: "Sony",
    description: "Industry-leading adaptive active noise cancellation, custom audio enhancement engine, ultra-comfortable build, and up to 45 hours of immersive audio performance.",
    mrp: 32990,
    price: 29990,
    discount: 9,
    ratings: 4.7,
    reviewsCount: 8900,
    baseStock: 300,
    currentStock: 15,
    // extremely low stock -> increased price
    demandScore: 92,
    supplyScore: 10,
    popularityIndex: 96,
    recommendationScore: 94,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    seller: "Sony Retail Sourcing",
    warranty: "1 Year Sony Warranty",
    deliveryDays: 3,
    specifications: {
      "Type": "Over-Ear",
      "Connectivity": "Bluetooth 5.4, Multipoint",
      "Battery Life": "45 Hours (ANC On)",
      "ANC Type": "Dual Processor Adaptive",
      "Charging": "USB-C Fast Charging (5 mins = 5 hrs)",
      "Weight": "242g"
    },
    reviews: []
  },
  {
    id: "prod-7",
    name: "PlayStation 5 Pro Console (Custom DualSense Bundle)",
    category: "Gaming Consoles",
    brand: "Sony",
    description: "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, 3D Audio, and advanced ray tracing.",
    mrp: 69990,
    price: 64990,
    discount: 7,
    ratings: 4.8,
    reviewsCount: 18200,
    baseStock: 120,
    currentStock: 3,
    // out of stock soon -> peak pricing
    demandScore: 99,
    supplyScore: 5,
    popularityIndex: 100,
    recommendationScore: 99,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80",
    seller: "ApexGamer Store",
    warranty: "1 Year Brand Warranty",
    deliveryDays: 2,
    specifications: {
      "Console Type": "Home Gaming Console",
      "Storage": "2 TB Ultra-Speed Custom SSD",
      "Graphics": "AMD Radeon RDNA 3 Custom Engine",
      "Max Resolution": "8K HDR, 120 FPS Support",
      "Included Accessories": "2x DualSense Wireless Controllers, HDMI 2.1"
    },
    reviews: []
  },
  {
    id: "prod-8",
    name: "Logitech MX Master 3S Wireless Performance Mouse",
    category: "Mouse",
    brand: "Logitech",
    description: "High precision wireless productivity mouse. Features 8000 DPI track-anywhere optical sensor, quiet clicks, and the electromagnetic MagSpeed scroll wheel.",
    mrp: 10995,
    price: 9495,
    discount: 13,
    ratings: 4.6,
    reviewsCount: 14500,
    baseStock: 500,
    currentStock: 480,
    // high stock -> lower price
    demandScore: 72,
    supplyScore: 96,
    popularityIndex: 82,
    recommendationScore: 85,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80",
    seller: "Peripherals Hub",
    warranty: "1 Year Limited Hardware Warranty",
    deliveryDays: 1,
    specifications: {
      "Sensor": "Darkfield High Precision (8000 DPI)",
      "Buttons": "7 customizable buttons",
      "Scroll": "MagSpeed Electromagnetic Wheel",
      "Battery": "Rechargeable Li-Po (500 mAh)",
      "Connectivity": "Logi Bolt USB, Bluetooth LE"
    },
    reviews: []
  },
  {
    id: "prod-9",
    name: "Sony Alpha 7R V Full-Frame Mirrorless Camera (Body Only)",
    category: "Cameras",
    brand: "Sony",
    description: "61.0 Megapixels full-frame mirrorless camera with AI-processing unit, 8K video, 8-stop image stabilization, and high-speed intelligent autofocus tracking.",
    mrp: 349900,
    price: 334900,
    discount: 4,
    ratings: 4.9,
    reviewsCount: 1100,
    baseStock: 40,
    currentStock: 38,
    // normal stock
    demandScore: 80,
    supplyScore: 90,
    popularityIndex: 88,
    recommendationScore: 92,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
    seller: "CamCenter India",
    warranty: "2 Years Manufacturer Warranty",
    deliveryDays: 3,
    specifications: {
      "Resolution": "61.0 Megapixels",
      "Sensor": "Full-Frame Exmor R CMOS",
      "Video Resolution": "8K @ 24p, 4K @ 60p",
      "Stabilization": "5-axis in-body (8.0 stops)",
      "Focus Points": "693 phase-detection points"
    },
    reviews: []
  },
  {
    id: "prod-10",
    name: "Anker Prime 20,000mAh Power Bank (200W Output)",
    category: "Power Banks",
    brand: "Anker",
    description: "Anker Prime power bank features 200W total charging speed output, custom intelligent smart display, ultra-compact design, and dual USB-C charging ports.",
    mrp: 14999,
    price: 12999,
    discount: 13,
    ratings: 4.5,
    reviewsCount: 5200,
    baseStock: 400,
    currentStock: 350,
    demandScore: 68,
    supplyScore: 88,
    popularityIndex: 75,
    recommendationScore: 78,
    image: "https://images.unsplash.com/photo-1609592424085-f5b22f7787f0?w=500&q=80",
    seller: "Anker Retail",
    warranty: "18 Months Replacement Warranty",
    deliveryDays: 2,
    specifications: {
      "Capacity": "20,000 mAh",
      "Total Output": "200 Watts Max",
      "Ports": "2x USB-C, 1x USB-A",
      "Display": "TFT Color LCD Smart Display",
      "Recharge Time": "75 mins with 100W input"
    },
    reviews: []
  },
  {
    id: "prod-11",
    name: "Netgear Nighthawk RS700 WiFi 7 Router",
    category: "Routers",
    brand: "Netgear",
    description: "Unlock breathtaking WiFi 7 performance up to 19Gbps speeds. Covers up to 3500 sq. ft. with quad-band high capacity antennas and 10Gbps high-speed internet port.",
    mrp: 79999,
    price: 74999,
    discount: 6,
    ratings: 4.7,
    reviewsCount: 950,
    baseStock: 50,
    currentStock: 5,
    // very low stock
    demandScore: 89,
    supplyScore: 10,
    popularityIndex: 82,
    recommendationScore: 88,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
    seller: "SuperCom Net",
    warranty: "3 Years Hardware Warranty",
    deliveryDays: 3,
    specifications: {
      "WiFi Standard": "WiFi 7 (802.11be) Quad-Band",
      "Max Speed": "Up to 19 Gbps",
      "Ethernet Ports": "1x 10G WAN, 1x 10G LAN, 4x 1G LAN",
      "Coverage": "3,500 sq. ft.",
      "Antennas": "8x Internal High-Gain"
    },
    reviews: []
  },
  {
    id: "prod-12",
    name: 'Samsung Odyssey OLED G9 49" Curved Gaming Monitor',
    category: "Monitors",
    brand: "Samsung",
    description: "Dual QHD 49-inch super ultra-wide curved screen with OLED panel, 240Hz refresh rate, near-instant 0.03ms response time, and stunning deep colors.",
    mrp: 199900,
    price: 159900,
    discount: 20,
    ratings: 4.8,
    reviewsCount: 1650,
    baseStock: 30,
    currentStock: 28,
    demandScore: 85,
    supplyScore: 92,
    popularityIndex: 91,
    recommendationScore: 94,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
    seller: "RetailerIndia Ltd",
    warranty: "3 Years Domestic On-Site Warranty",
    deliveryDays: 4,
    specifications: {
      "Screen Size": "49 inches Super Ultra-Wide",
      "Panel Type": "QD-OLED Curved 1800R",
      "Resolution": "Dual QHD (5120 x 1440)",
      "Refresh Rate": "240 Hz",
      "Response Time": "0.03 ms"
    },
    reviews: []
  },
  ...generateExtraSmartphones()
].map((p) => ({
  ...p,
  currentStock: 100,
  baseStock: 100
}));
var INITIAL_ADVERTISEMENTS = [
  {
    id: "ad-1",
    type: "festival",
    title: "Grand Electronics Festival - Save Up to 40%!",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    targetUrl: "/store",
    impressions: 45e4,
    clicks: 38200,
    ctr: 8.49,
    conversions: 4210,
    revenue: 542e4
  },
  {
    id: "ad-2",
    type: "flash_sale",
    title: "Flash Sale: Sony Noise Cancellation ANC Headset",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    targetUrl: "/product/prod-6",
    impressions: 21e4,
    clicks: 19800,
    ctr: 9.43,
    conversions: 1840,
    revenue: 5518160
  },
  {
    id: "ad-3",
    type: "popup",
    title: "New Launch! MacBook Pro M4 Series Pro Speed",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    targetUrl: "/product/prod-3",
    impressions: 125e3,
    clicks: 14200,
    ctr: 11.36,
    conversions: 420,
    revenue: 10285800
  },
  {
    id: "ad-4",
    type: "category",
    title: "Best Selling Premium Smartphones Collection",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    targetUrl: "/store?category=Smartphones",
    impressions: 32e4,
    clicks: 22400,
    ctr: 7,
    conversions: 1520,
    revenue: 2052e4
  }
];
function calculateDynamicPrice(product, businessRules2) {
  const stockRatio = product.currentStock / product.baseStock;
  let multiplier = 1;
  if (stockRatio < 0.1) {
    multiplier = businessRules2.priceCurve === "aggressive" ? 1.15 : businessRules2.priceCurve === "linear" ? 1.05 : 1.1;
  } else if (stockRatio < 0.3) {
    multiplier = businessRules2.priceCurve === "aggressive" ? 1.08 : businessRules2.priceCurve === "linear" ? 1.03 : 1.05;
  } else if (stockRatio > 0.8) {
    multiplier = businessRules2.priceCurve === "aggressive" ? 0.9 : businessRules2.priceCurve === "linear" ? 0.97 : 0.95;
  }
  const baseDiscountPrice = product.mrp * (1 - product.discount / 100);
  const calculatedPrice = Math.round(baseDiscountPrice * multiplier);
  return Math.min(product.mrp, calculatedPrice);
}
function calculateBulkDiscount(qty, basePrice) {
  let percent = 0;
  if (qty >= 10 && qty <= 20) percent = 5;
  else if (qty >= 21 && qty <= 50) percent = 10;
  else if (qty >= 51 && qty <= 100) percent = 15;
  else if (qty > 100) percent = 20;
  const discountVal = Math.round(basePrice * percent / 100);
  return {
    percent,
    saved: discountVal * qty,
    finalPrice: basePrice - discountVal
  };
}
function getDeterministicBIStats(dashboard, filterCategory, timeRange, refreshTrigger) {
  const catSeed = filterCategory ? filterCategory.charCodeAt(0) + filterCategory.length : 42;
  const rangeMultiplier = timeRange === "Today" ? 0.15 : timeRange === "Weekly" ? 0.55 : timeRange === "Monthly" ? 1 : 4.5;
  const noise = (Math.sin(refreshTrigger * 1.5) + 1) * 0.05 + 0.98;
  const baseRevenue = 245e6 * rangeMultiplier * noise;
  const baseSales = 12540 * rangeMultiplier * noise;
  const margin = 0.28;
  const mockKPIs = {
    "Sales": [
      { title: "Total Volume Sold", value: Math.round(baseSales).toLocaleString(), change: "+14.2% vs last period", isPositive: true, icon: "ShoppingBag" },
      { title: "Conversion Rate", value: "3.42%", change: "+0.25% MoM", isPositive: true, icon: "TrendingUp" },
      { title: "Average Order Value", value: `\u20B9${Math.round(21500 + catSeed * 10).toLocaleString()}`, change: "+1.8% vs last period", isPositive: true, icon: "CreditCard" },
      { title: "Active Buyers", value: Math.round(84200 * rangeMultiplier).toLocaleString(), change: "+5.1% MoM", isPositive: true, icon: "Users" }
    ],
    "Revenue": [
      { title: "Gross Revenue", value: `\u20B9${Math.round(baseRevenue).toLocaleString()}`, change: "+12.8% vs last period", isPositive: true, icon: "DollarSign" },
      { title: "Net Profit", value: `\u20B9${Math.round(baseRevenue * margin).toLocaleString()}`, change: "+15.1% YoY", isPositive: true, icon: "Activity" },
      { title: "Average Order Revenue", value: `\u20B9${Math.round(18500 + catSeed * 50).toLocaleString()}`, change: "-2.1% due to bulk promos", isPositive: false, icon: "ArrowDownUp" },
      { title: "Projected Sales Growth", value: "22.4%", change: "Optimistic Forecast", isPositive: true, icon: "Sparkles" }
    ],
    "Inventory": [
      { title: "Total Catalog Items", value: "10,482", change: "20 Active Categories", isPositive: true, icon: "Layers" },
      { title: "Active Warehouse Stock", value: "542,800 units", change: "92.4% Storage Utilized", isPositive: true, icon: "Package" },
      { title: "Out of Stock Items", value: "14", change: "-8 from yesterday", isPositive: true, icon: "AlertTriangle" },
      { title: "Inventory Turnover Ratio", value: "8.4", change: "Fast-Moving Electronics", isPositive: true, icon: "Shuffle" }
    ],
    "Customer": [
      { title: "Total Registered", value: "125,480", change: "+1,240 Today", isPositive: true, icon: "UserCheck" },
      { title: "Customer Sat. Score (CSAT)", value: "4.82/5", change: "Based on 300,000+ reviews", isPositive: true, icon: "Smile" },
      { title: "Returning Buyers", value: "48.2%", change: "+3.2% loyalty campaign", isPositive: true, icon: "Repeat" },
      { title: "Lifetime Value (Avg LTV)", value: "\u20B945,200", change: "+4.1% YoY", isPositive: true, icon: "TrendingUp" }
    ],
    "Product": [
      { title: "Total SKU Count", value: "24,500", change: "100% active list", isPositive: true, icon: "Box" },
      { title: "Top Selling Brand", value: "Apple Inc.", change: "\u20B945M revenue contribution", isPositive: true, icon: "Award" },
      { title: "Damaged/Returned Stock", value: "0.18%", change: "Industry lowest", isPositive: true, icon: "ShieldAlert" },
      { title: "Average SKU Rating", value: "4.65/5", change: "Highly rated overall", isPositive: true, icon: "Star" }
    ],
    "Advertisement": [
      { title: "Total Ad Impressions", value: (45e5 * rangeMultiplier).toLocaleString(), change: "Across 6 campaigns", isPositive: true, icon: "Eye" },
      { title: "Avg CTR (Click-Through)", value: "8.49%", change: "+1.2% creative optimization", isPositive: true, icon: "MousePointerClick" },
      { title: "Ad-Attributed Revenue", value: `\u20B9${Math.round(baseRevenue * 0.35).toLocaleString()}`, change: "35% of total store sales", isPositive: true, icon: "PiggyBank" },
      { title: "Ad Spending Efficiency (ROAS)", value: "4.8x", change: "Industry standard is 3x", isPositive: true, icon: "Target" }
    ],
    "Marketing": [
      { title: "New Subscribers", value: Math.round(54200 * rangeMultiplier).toLocaleString(), change: "+12.1% newsletter popup", isPositive: true, icon: "Mail" },
      { title: "Social Referral Clicks", value: Math.round(124e3 * rangeMultiplier).toLocaleString(), change: "+18.4% Instagram video", isPositive: true, icon: "Share2" },
      { title: "Campaign Conversion Rate", value: "4.21%", change: "Festival sale active", isPositive: true, icon: "Percent" },
      { title: "Cost Per Acquisition (CPA)", value: "\u20B9240", change: "-8% optimization", isPositive: true, icon: "BadgePercent" }
    ],
    "Finance": [
      { title: "Gross Revenue (GST Inc)", value: `\u20B9${Math.round(baseRevenue * 1.18).toLocaleString()}`, change: "18% GST average applied", isPositive: true, icon: "Briefcase" },
      { title: "Operating Cost", value: `\u20B9${Math.round(baseRevenue * 0.15).toLocaleString()}`, change: "Cloud Run & Fulfillment cost", isPositive: true, icon: "Sliders" },
      { title: "Estimated Tax Liability", value: `\u20B9${Math.round(baseRevenue * 0.18 * 0.3).toLocaleString()}`, change: "Provincial & national taxes", isPositive: true, icon: "FileText" },
      { title: "Net Operating Margin", value: "24.5%", change: "Stable high profit", isPositive: true, icon: "Percent" }
    ],
    "Supplier": [
      { title: "On-Time Fulfillment Rate", value: "98.4%", change: "500+ verified suppliers", isPositive: true, icon: "ShieldCheck" },
      { title: "Lead Delivery Time", value: "2.4 Days", change: "-0.5 days optimization", isPositive: true, icon: "Clock" },
      { title: "Defect Return Rate", value: "0.12%", change: "-0.04% vs last Q", isPositive: true, icon: "AlertOctagon" },
      { title: "Supplier Sourcing Value", value: `\u20B9${Math.round(baseRevenue * 0.58).toLocaleString()}`, change: "Electronics raw procurement", isPositive: true, icon: "DollarSign" }
    ],
    "Warehouse": [
      { title: "Active Warehouses", value: "100+", change: "Pan-India fulfillment hub", isPositive: true, icon: "Home" },
      { title: "Utilized Capacity", value: "84.2%", change: "+5% peak sales loading", isPositive: true, icon: "PieChart" },
      { title: "Safety stock status", value: "99.8% Healthy", change: "Automatic reorder active", isPositive: true, icon: "Activity" },
      { title: "Average Dispatch Speed", value: "4.2 Hours", change: "Automated conveyor belts", isPositive: true, icon: "Zap" }
    ],
    "Order": [
      { title: "Total Placed Orders", value: Math.round(baseSales * 1.2).toLocaleString(), change: "Bulk + retail split", isPositive: true, icon: "ClipboardList" },
      { title: "Pending Fulfillment", value: "142", change: "Dispatched in next hour", isPositive: true, icon: "Loader2" },
      { title: "Canceled/Failed Orders", value: "1.45%", change: "-0.2% gateway upgrade", isPositive: true, icon: "XCircle" },
      { title: "Average Items Per Order", value: "2.4 items", change: "+0.4 cross-sell suggestions", isPositive: true, icon: "PlusSquare" }
    ],
    "Delivery": [
      { title: "Delivered Orders", value: Math.round(baseSales * 0.98).toLocaleString(), change: "Via 12 courier partners", isPositive: true, icon: "Truck" },
      { title: "On-Time SLA Delivery", value: "97.8%", change: "+1.2% hyper-local routes", isPositive: true, icon: "Calendar" },
      { title: "Express Shipments (24H)", value: "34.2%", change: "Premium shipping option", isPositive: true, icon: "Compass" },
      { title: "Average Transit Rating", value: "4.85/5", change: "Highly rated courier care", isPositive: true, icon: "HeartHandshake" }
    ],
    "Returns": [
      { title: "Total Returns Initiated", value: Math.round(baseSales * 0.024).toLocaleString(), change: "2.4% return rate", isPositive: true, icon: "RotateCcw" },
      { title: "Approved & Refunded", value: "94.2%", change: "Processed within 4 hours", isPositive: true, icon: "FileCheck" },
      { title: "Fraudulent Return Flagged", value: "0.08%", change: "Slashed by AI vision audit", isPositive: true, icon: "AlertTriangle" },
      { title: "Top Return Reason", value: "Incorrect Spec Choice", change: "42% of total returns", isPositive: false, icon: "Info" }
    ],
    "Discounts": [
      { title: "Coupon Redemptions", value: Math.round(baseSales * 0.42).toLocaleString(), change: "42% checkout usage", isPositive: true, icon: "Bookmark" },
      { title: "Bulk Sales Premium", value: `\u20B9${Math.round(baseRevenue * 0.18).toLocaleString()}`, change: "18% of volume from bulk orders", isPositive: true, icon: "Percent" },
      { title: "Direct Price Cuts (GST)", value: `\u20B9${Math.round(baseRevenue * 0.05).toLocaleString()}`, change: "5% equivalent direct subsidy", isPositive: true, icon: "Minimize2" },
      { title: "Avg Discount Percentage", value: "12.4%", change: "Optimized retail margin", isPositive: true, icon: "Award" }
    ],
    "Customer Interest": [
      { title: "Most Clicked Item", value: "iPhone 16 Pro Max", change: "145K views today", isPositive: true, icon: "MousePointerClick" },
      { title: "Total Wishlist Additions", value: Math.round(854200 * rangeMultiplier).toLocaleString(), change: "+15% festive pre-save", isPositive: true, icon: "Heart" },
      { title: "Cart-to-Purchase Ratio", value: "34.5%", change: "Highly optimized funnel", isPositive: true, icon: "Filter" },
      { title: "Avg Time On Product", value: "3.2 Minutes", change: "+18s video specs reviews", isPositive: true, icon: "Timer" }
    ],
    "Product Demand": [
      { title: "High Demand SKUs", value: "42 items", change: "Supply constraints active", isPositive: true, icon: "TrendingUp" },
      { title: "Dead Stock SKU Count", value: "2", change: "Action needed (clearance)", isPositive: false, icon: "FileMinus" },
      { title: "Reorder Trigger Alerts", value: "11 items", change: "Safety stock levels crossed", isPositive: true, icon: "BellRing" },
      { title: "Category Momentum", value: "+18.2%", change: "Smart Watches leading growth", isPositive: true, icon: "Activity" }
    ],
    "Stock Movement": [
      { title: "Stock-In Batches Today", value: "4,500 units", change: "Checked & barcoded", isPositive: true, icon: "PlusSquare" },
      { title: "Stock-Out Dispatches Today", value: "12,420 units", change: "100% SLA compliant", isPositive: true, icon: "MinusSquare" },
      { title: "FIFO Order Sequence Rate", value: "100.0%", change: "Zero inventory aging lapses", isPositive: true, icon: "CheckSquare" },
      { title: "Estimated Stock Lifetime", value: "14.2 Days", change: "Just-in-time logistics level", isPositive: true, icon: "Zap" }
    ],
    "Executive": [
      { title: "Company Valuation Multiplier", value: "14.8x", change: "EBITDA baseline", isPositive: true, icon: "Activity" },
      { title: "Enterprise EBITDA Margin", value: "21.4%", change: "+1.5% YoY optimization", isPositive: true, icon: "Check" },
      { title: "Fulfillment Sourcing Cost", value: `\u20B9${Math.round(baseRevenue * 0.12).toLocaleString()}`, change: "Reduced by hyper-local hubs", isPositive: true, icon: "Compass" },
      { title: "Net promoter Score (NPS)", value: "78", change: "Top tier in consumer retail", isPositive: true, icon: "Heart" }
    ],
    "Business Intelligence": [
      { title: "Predictive Forecast Accuracy", value: "96.42%", change: "TensorFlow dynamic optimizer", isPositive: true, icon: "Cpu" },
      { title: "Cross-Sell Affinity Index", value: "1.42", change: "Items bought together average", isPositive: true, icon: "Shuffle" },
      { title: "Customer Churn Risk", value: "0.41%", change: "Extremely high engagement", isPositive: true, icon: "ThumbsUp" },
      { title: "Ad Campaign ROI Multiplier", value: "4.89x", change: "Industry top 10%", isPositive: true, icon: "LineChart" }
    ],
    "KPI": [
      { title: "Aggregate Health KPI", value: "98.4/100", change: "Excellent operational status", isPositive: true, icon: "Sparkles" },
      { title: "Daily Active Users (DAU)", value: (124e3 * rangeMultiplier).toLocaleString(), change: "+8.2% vs yesterday", isPositive: true, icon: "Users" },
      { title: "SLA Response SLA", value: "99.85%", change: "API & database lag < 12ms", isPositive: true, icon: "Zap" },
      { title: "Net Promoter Growth", value: "+12.4% MoM", change: "Consistent customer delight", isPositive: true, icon: "Award" }
    ]
  };
  const selectedKPIs = mockKPIs[dashboard] || mockKPIs["Sales"];
  const mockCharts = {
    "Sales": [
      {
        title: "Sales Trend (Quantity vs Revenue)",
        type: "line",
        keys: ["Revenue", "Quantity"],
        data: [
          { name: "Mon", Revenue: Math.round(baseRevenue * 0.1), Quantity: Math.round(baseSales * 0.1) },
          { name: "Tue", Revenue: Math.round(baseRevenue * 0.12), Quantity: Math.round(baseSales * 0.11) },
          { name: "Wed", Revenue: Math.round(baseRevenue * 0.14), Quantity: Math.round(baseSales * 0.13) },
          { name: "Thu", Revenue: Math.round(baseRevenue * 0.11), Quantity: Math.round(baseSales * 0.1) },
          { name: "Fri", Revenue: Math.round(baseRevenue * 0.18), Quantity: Math.round(baseSales * 0.17) },
          { name: "Sat", Revenue: Math.round(baseRevenue * 0.22), Quantity: Math.round(baseSales * 0.23) },
          { name: "Sun", Revenue: Math.round(baseRevenue * 0.25), Quantity: Math.round(baseSales * 0.26) }
        ]
      },
      {
        title: "Top 5 Sales Categories",
        type: "bar",
        keys: ["Sales"],
        data: [
          { name: "Smartphones", Sales: Math.round(baseSales * 0.35) },
          { name: "Laptops", Sales: Math.round(baseSales * 0.25) },
          { name: "Smart TVs", Sales: Math.round(baseSales * 0.15) },
          { name: "Headphones", Sales: Math.round(baseSales * 0.15) },
          { name: "Gaming Consoles", Sales: Math.round(baseSales * 0.1) }
        ]
      }
    ],
    "Revenue": [
      {
        title: "Revenue by Sourcing Brand",
        type: "donut",
        keys: ["Revenue"],
        data: [
          { name: "Apple", Revenue: Math.round(baseRevenue * 0.4) },
          { name: "Samsung", Revenue: Math.round(baseRevenue * 0.25) },
          { name: "Sony", Revenue: Math.round(baseRevenue * 0.15) },
          { name: "Dell", Revenue: Math.round(baseRevenue * 0.12) },
          { name: "Others", Revenue: Math.round(baseRevenue * 0.08) }
        ]
      },
      {
        title: "Revenue Forecast Analysis (Next 6 Months)",
        type: "area",
        keys: ["Forecast", "ConfidenceInterval"],
        data: [
          { name: "Aug", Forecast: Math.round(baseRevenue * 1.1), ConfidenceInterval: Math.round(baseRevenue * 1.05) },
          { name: "Sep", Forecast: Math.round(baseRevenue * 1.25), ConfidenceInterval: Math.round(baseRevenue * 1.18) },
          { name: "Oct", Forecast: Math.round(baseRevenue * 1.4), ConfidenceInterval: Math.round(baseRevenue * 1.3) },
          { name: "Nov", Forecast: Math.round(baseRevenue * 1.7), ConfidenceInterval: Math.round(baseRevenue * 1.55) },
          { name: "Dec", Forecast: Math.round(baseRevenue * 2.1), ConfidenceInterval: Math.round(baseRevenue * 1.9) },
          { name: "Jan", Forecast: Math.round(baseRevenue * 1.5), ConfidenceInterval: Math.round(baseRevenue * 1.35) }
        ]
      }
    ],
    "Inventory": [
      {
        title: "Warehouse Utilization & Stock Age",
        type: "heatmap",
        keys: ["StockAge", "Utilization"],
        data: [
          { name: "Hub Delhi", StockAge: 12, Utilization: 88 },
          { name: "Hub Mumbai", StockAge: 8, Utilization: 94 },
          { name: "Hub Bangalore", StockAge: 15, Utilization: 79 },
          { name: "Hub Chennai", StockAge: 10, Utilization: 81 },
          { name: "Hub Kolkata", StockAge: 22, Utilization: 65 }
        ]
      },
      {
        title: "Fast Moving Electronics Categories (Inventory Days)",
        type: "bar",
        keys: ["DaysInInventory"],
        data: [
          { name: "Power Banks", DaysInInventory: 4 },
          { name: "Headphones", DaysInInventory: 6 },
          { name: "Smartphones", DaysInInventory: 9 },
          { name: "Gaming Consoles", DaysInInventory: 11 },
          { name: "Laptops", DaysInInventory: 18 }
        ]
      }
    ],
    "Customer": [
      {
        title: "Customer Geographic Location Density",
        type: "pie",
        keys: ["Customers"],
        data: [
          { name: "North India", Customers: 42e3 },
          { name: "West India", Customers: 38e3 },
          { name: "South India", Customers: 51e3 },
          { name: "East India", Customers: 18e3 },
          { name: "Central India", Customers: 12e3 }
        ]
      },
      {
        title: "Loyalty Tier Distribution",
        type: "donut",
        keys: ["Count"],
        data: [
          { name: "Standard (Bronze)", Count: 74e3 },
          { name: "Silver Member", Count: 32e3 },
          { name: "Gold Club", Count: 14e3 },
          { name: "Platinum Elites", Count: 5480 }
        ]
      }
    ],
    "Product": [
      {
        title: "Product Quality & Review Star Distribution",
        type: "bar",
        keys: ["ReviewsCount"],
        data: [
          { name: "5 Stars", ReviewsCount: 185e3 },
          { name: "4 Stars", ReviewsCount: 94e3 },
          { name: "3 Stars", ReviewsCount: 15e3 },
          { name: "2 Stars", ReviewsCount: 4200 },
          { name: "1 Star", ReviewsCount: 1800 }
        ]
      },
      {
        title: "SKU Diversity by Main Category",
        type: "treemap",
        keys: ["SKUs"],
        data: [
          { name: "Smartphones", SKUs: 120 },
          { name: "Laptops", SKUs: 95 },
          { name: "TVs & Audio", SKUs: 140 },
          { name: "Accessories", SKUs: 320 },
          { name: "Smart Home", SKUs: 180 }
        ]
      }
    ],
    "Advertisement": [
      {
        title: "Advertisement Campaign Conversions",
        type: "funnel",
        keys: ["CTR"],
        data: [
          { name: "Festival Promo", CTR: 8.5 },
          { name: "Flash Sale (Sony)", CTR: 9.4 },
          { name: "MacBook Launch", CTR: 11.4 },
          { name: "Smartphones Banner", CTR: 7 }
        ]
      },
      {
        title: "CTR Click-Through Trend (By Day)",
        type: "area",
        keys: ["CTR_Percent"],
        data: [
          { name: "Mon", CTR_Percent: 7.2 },
          { name: "Tue", CTR_Percent: 7.9 },
          { name: "Wed", CTR_Percent: 8.1 },
          { name: "Thu", CTR_Percent: 8.4 },
          { name: "Fri", CTR_Percent: 9.1 },
          { name: "Sat", CTR_Percent: 10.3 },
          { name: "Sun", CTR_Percent: 9.8 }
        ]
      }
    ],
    "Marketing": [
      {
        title: "Conversion Funnel Analysis",
        type: "funnel",
        keys: ["UsersCount"],
        data: [
          { name: "1. Ad Impressions", UsersCount: 1e5 },
          { name: "2. Product Clicks", UsersCount: 22e3 },
          { name: "3. Cart Additions", UsersCount: 8400 },
          { name: "4. Checkout Form", UsersCount: 4100 },
          { name: "5. Success Orders", UsersCount: 3420 }
        ]
      },
      {
        title: "Subscriber Newsletter Signup Source",
        type: "donut",
        keys: ["Count"],
        data: [
          { name: "Google Ads", Count: 18200 },
          { name: "Organic Search", Count: 15400 },
          { name: "Instagram Referral", Count: 11200 },
          { name: "Direct Visit", Count: 9400 }
        ]
      }
    ],
    "Finance": [
      {
        title: "Gross Profit vs Operating Expenses (INR)",
        type: "bar",
        keys: ["GrossProfit", "Expenses"],
        data: [
          { name: "Q1", GrossProfit: Math.round(baseRevenue * 0.28), Expenses: Math.round(baseRevenue * 0.1) },
          { name: "Q2", GrossProfit: Math.round(baseRevenue * 0.3), Expenses: Math.round(baseRevenue * 0.11) },
          { name: "Q3", GrossProfit: Math.round(baseRevenue * 0.32), Expenses: Math.round(baseRevenue * 0.1) },
          { name: "Q4", GrossProfit: Math.round(baseRevenue * 0.38), Expenses: Math.round(baseRevenue * 0.14) }
        ]
      },
      {
        title: "Annual Revenue vs Maintenance Costs",
        type: "line",
        keys: ["GrossRevenue", "MaintenanceCost"],
        data: [
          { name: "2022", GrossRevenue: 12e7, MaintenanceCost: 6e6 },
          { name: "2023", GrossRevenue: 155e6, MaintenanceCost: 8e6 },
          { name: "2024", GrossRevenue: 198e6, MaintenanceCost: 9e6 },
          { name: "2025", GrossRevenue: 245e6, MaintenanceCost: 1e7 }
        ]
      }
    ],
    "Supplier": [
      {
        title: "Supplier Lead Times & Quality Return Rate",
        type: "scatter",
        keys: ["LeadTimeDays", "DefectPercent"],
        data: [
          { name: "SourcingHub Inc", LeadTimeDays: 1.5, DefectPercent: 0.1 },
          { name: "GlobalChip Sourcing", LeadTimeDays: 4.2, DefectPercent: 0.3 },
          { name: "Apex Logistics", LeadTimeDays: 2.1, DefectPercent: 0.05 },
          { name: "Delta Peripherals", LeadTimeDays: 3, DefectPercent: 0.15 },
          { name: "Optima Screens", LeadTimeDays: 5, DefectPercent: 0.4 }
        ]
      },
      {
        title: "Procurement Volume (INR) by Core Supplier",
        type: "bar",
        keys: ["ProcurementValue"],
        data: [
          { name: "Apple Authorized Sourcing", ProcurementValue: Math.round(baseRevenue * 0.3) },
          { name: "Sony National Distributors", ProcurementValue: Math.round(baseRevenue * 0.15) },
          { name: "Samsung India Sourcing", ProcurementValue: Math.round(baseRevenue * 0.18) },
          { name: "Dell Enterprise Dist.", ProcurementValue: Math.round(baseRevenue * 0.1) }
        ]
      }
    ],
    "Warehouse": [
      {
        title: "Warehouse Distribution Utilization Rate (%)",
        type: "bar",
        keys: ["Utilized"],
        data: [
          { name: "Delhi NCR Hub", Utilized: 94 },
          { name: "Mumbai JNPT Hub", Utilized: 88 },
          { name: "Bengaluru TechPark", Utilized: 79 },
          { name: "Kolkata Sourcing", Utilized: 65 },
          { name: "Chennai Port Hub", Utilized: 81 }
        ]
      },
      {
        title: "Dispatched Stock Speed (Transit Hours)",
        type: "line",
        keys: ["AvgHours"],
        data: [
          { name: "Jan", AvgHours: 6.2 },
          { name: "Feb", AvgHours: 5.8 },
          { name: "Mar", AvgHours: 5.1 },
          { name: "Apr", AvgHours: 4.6 },
          { name: "May", AvgHours: 4.2 },
          { name: "Jun", AvgHours: 4 }
        ]
      }
    ],
    "Order": [
      {
        title: "Order Fulfillment Sequence (SLA vs Real-time)",
        type: "line",
        keys: ["SLA_Goal", "FulfillTimeMinutes"],
        data: [
          { name: "Batch A", SLA_Goal: 30, FulfillTimeMinutes: 24 },
          { name: "Batch B", SLA_Goal: 30, FulfillTimeMinutes: 28 },
          { name: "Batch C", SLA_Goal: 30, FulfillTimeMinutes: 32 },
          { name: "Batch D", SLA_Goal: 30, FulfillTimeMinutes: 19 },
          { name: "Batch E", SLA_Goal: 30, FulfillTimeMinutes: 15 }
        ]
      },
      {
        title: "Order Platform Checkout Method (Distribution)",
        type: "pie",
        keys: ["Count"],
        data: [
          { name: "Mobile App Store", Count: 34e3 },
          { name: "Mobile Web browser", Count: 12e3 },
          { name: "Desktop Storefront", Count: 8200 },
          { name: "Tablet UI", Count: 4210 }
        ]
      }
    ],
    "Delivery": [
      {
        title: "SLA Compliant Deliveries by Logistics Partner",
        type: "bar",
        keys: ["SLA_Compliance_Percent"],
        data: [
          { name: "Bluedart Express", SLA_Compliance_Percent: 98.4 },
          { name: "Delhivery Smart", SLA_Compliance_Percent: 95.8 },
          { name: "Ekart (Fulfillment)", SLA_Compliance_Percent: 99.2 },
          { name: "Shadowfax Local", SLA_Compliance_Percent: 92.1 },
          { name: "DHL Air Premium", SLA_Compliance_Percent: 97.5 }
        ]
      },
      {
        title: "Delivery Speed Distribution (Days to Destination)",
        type: "area",
        keys: ["OrdersCount"],
        data: [
          { name: "1 Day (Next-Day)", OrdersCount: 12400 },
          { name: "2 Days", OrdersCount: 18200 },
          { name: "3 Days", OrdersCount: 9400 },
          { name: "4 Days", OrdersCount: 4200 },
          { name: "5+ Days", OrdersCount: 1500 }
        ]
      }
    ],
    "Returns": [
      {
        title: "Initiated Return Rates by Main Category",
        type: "bar",
        keys: ["ReturnPercent"],
        data: [
          { name: "Smartphones", ReturnPercent: 1.8 },
          { name: "Laptops", ReturnPercent: 2.1 },
          { name: "Accessories", ReturnPercent: 4.8 },
          { name: "Cameras", ReturnPercent: 1.2 },
          { name: "Smart TVs", ReturnPercent: 3.1 }
        ]
      },
      {
        title: "Approved Refund Speeds (Hours Breakdown)",
        type: "line",
        keys: ["AvgProcessingHours"],
        data: [
          { name: "Mon", AvgProcessingHours: 8.5 },
          { name: "Tue", AvgProcessingHours: 6.2 },
          { name: "Wed", AvgProcessingHours: 5.1 },
          { name: "Thu", AvgProcessingHours: 4.4 },
          { name: "Fri", AvgProcessingHours: 3.8 },
          { name: "Sat", AvgProcessingHours: 2.2 },
          { name: "Sun", AvgProcessingHours: 2.1 }
        ]
      }
    ],
    "Discounts": [
      {
        title: "Discount Slabs Sales Velocity",
        type: "bar",
        keys: ["OrdersWithDiscount"],
        data: [
          { name: "No Promo (MSRP)", OrdersWithDiscount: 24e3 },
          { name: "10% Discount Coupon", OrdersWithDiscount: 18200 },
          { name: "15% Bulk Discount", OrdersWithDiscount: 5200 },
          { name: "25% Festival Clearance", OrdersWithDiscount: 8420 }
        ]
      },
      {
        title: "Average Saved Amount by Coupon Code",
        type: "donut",
        keys: ["TotalSavedINR"],
        data: [
          { name: "ELECTRO10", TotalSavedINR: 421e4 },
          { name: "SUPERMEGA", TotalSavedINR: 582e4 },
          { name: "FESTIVE25", TotalSavedINR: 1145e4 }
        ]
      }
    ],
    "Customer Interest": [
      {
        title: "User Wishlist & Cart Additions Funnel",
        type: "area",
        keys: ["WishlistCount", "CartAdditions"],
        data: [
          { name: "Smartphones", WishlistCount: 22e3, CartAdditions: 8400 },
          { name: "Laptops", WishlistCount: 14e3, CartAdditions: 4100 },
          { name: "Smart TVs", WishlistCount: 9500, CartAdditions: 3200 },
          { name: "Headphones", WishlistCount: 18500, CartAdditions: 11200 },
          { name: "Cameras", WishlistCount: 4200, CartAdditions: 1500 }
        ]
      },
      {
        title: "Average Duration on Product Page (Seconds)",
        type: "bar",
        keys: ["SecondsSpent"],
        data: [
          { name: "Smartphones", SecondsSpent: 210 },
          { name: "Laptops", SecondsSpent: 245 },
          { name: "Smart TVs", SecondsSpent: 180 },
          { name: "Accessories", SecondsSpent: 45 },
          { name: "Cameras", SecondsSpent: 165 }
        ]
      }
    ],
    "Product Demand": [
      {
        title: "Inventory Stocks vs Customer Demand Score (Correlation)",
        type: "line",
        keys: ["CurrentStock", "DemandScore"],
        data: [
          { name: "iPhone 16 PM", CurrentStock: 42, DemandScore: 94 },
          { name: "Galaxy S26 Ultra", CurrentStock: 145, DemandScore: 88 },
          { name: "MacBook Pro 16", CurrentStock: 12, DemandScore: 97 },
          { name: "Dell XPS 16", CurrentStock: 85, DemandScore: 78 },
          { name: "Sony Bravia XR", CurrentStock: 52, DemandScore: 85 }
        ]
      },
      {
        title: "Category Demands Momentum Index (1-100)",
        type: "bar",
        keys: ["MomentumIndex"],
        data: [
          { name: "Smartphones", MomentumIndex: 96 },
          { name: "Laptops", MomentumIndex: 92 },
          { name: "Smart TVs", MomentumIndex: 84 },
          { name: "Gaming Consoles", MomentumIndex: 98 },
          { name: "Smart Watches", MomentumIndex: 99 }
        ]
      }
    ],
    "Stock Movement": [
      {
        title: "Monthly Stock-In vs Stock-Out Volumes",
        type: "bar",
        keys: ["StockInUnits", "StockOutUnits"],
        data: [
          { name: "Jan", StockInUnits: 45e3, StockOutUnits: 42e3 },
          { name: "Feb", StockInUnits: 48e3, StockOutUnits: 46500 },
          { name: "Mar", StockInUnits: 52e3, StockOutUnits: 51e3 },
          { name: "Apr", StockInUnits: 49e3, StockOutUnits: 47800 },
          { name: "May", StockInUnits: 55e3, StockOutUnits: 54200 },
          { name: "Jun", StockInUnits: 58e3, StockOutUnits: 57100 }
        ]
      },
      {
        title: "FIFO Sequence Integrity Rate (%)",
        type: "line",
        keys: ["FIFO_Accuracy_Percent"],
        data: [
          { name: "Week 1", FIFO_Accuracy_Percent: 100 },
          { name: "Week 2", FIFO_Accuracy_Percent: 100 },
          { name: "Week 3", FIFO_Accuracy_Percent: 99.8 },
          { name: "Week 4", FIFO_Accuracy_Percent: 100 }
        ]
      }
    ],
    "Executive": [
      {
        title: "Enterprise Revenue vs EBITDA Profit Contribution",
        type: "area",
        keys: ["NetRevenue", "EBITDA_Profit"],
        data: [
          { name: "2022", NetRevenue: Math.round(baseRevenue * 0.7), EBITDA_Profit: Math.round(baseRevenue * 0.7 * 0.18) },
          { name: "2023", NetRevenue: Math.round(baseRevenue * 0.85), EBITDA_Profit: Math.round(baseRevenue * 0.85 * 0.19) },
          { name: "2024", NetRevenue: Math.round(baseRevenue * 1), EBITDA_Profit: Math.round(baseRevenue * 1 * 0.214) }
        ]
      },
      {
        title: "Executive Strategic Cost Slabs (INR)",
        type: "pie",
        keys: ["SlabCost"],
        data: [
          { name: "Procurement & Logistics", SlabCost: Math.round(baseRevenue * 0.58) },
          { name: "Marketing & Ad Spend", SlabCost: Math.round(baseRevenue * 0.12) },
          { name: "Enterprise Employee Compensation", SlabCost: Math.round(baseRevenue * 0.08) },
          { name: "Technical Infrastructure (Cloud)", SlabCost: Math.round(baseRevenue * 0.04) },
          { name: "Net Operating Profit (EBITDA)", SlabCost: Math.round(baseRevenue * 0.18) }
        ]
      }
    ],
    "Business Intelligence": [
      {
        title: "Smart Product Recommendation Uplift Rate (%)",
        type: "line",
        keys: ["SmartRecUpliftPercent"],
        data: [
          { name: "W1", SmartRecUpliftPercent: 12.4 },
          { name: "W2", SmartRecUpliftPercent: 14.8 },
          { name: "W3", SmartRecUpliftPercent: 15.1 },
          { name: "W4", SmartRecUpliftPercent: 18.9 },
          { name: "W5", SmartRecUpliftPercent: 22.4 }
        ]
      },
      {
        title: "Customer Purchase Frequency vs Average Cart Size",
        type: "scatter",
        keys: ["FrequencyPerYear", "AvgCartSizeItems"],
        data: [
          { name: "Gold Tier Buyers", FrequencyPerYear: 18, AvgCartSizeItems: 3.4 },
          { name: "SOHO Enterprise", FrequencyPerYear: 8, AvgCartSizeItems: 14.5 },
          { name: "Frugal Retail Buyers", FrequencyPerYear: 2, AvgCartSizeItems: 1.1 },
          { name: "Students & Tech Enthusiasts", FrequencyPerYear: 6, AvgCartSizeItems: 2.4 }
        ]
      }
    ],
    "KPI": [
      {
        title: "SLA Infrastructure Quality Score vs Core DAU",
        type: "area",
        keys: ["InfrastructureHealth", "CoreDAU_Thousands"],
        data: [
          { name: "Mon", InfrastructureHealth: 98.4, CoreDAU_Thousands: 120 },
          { name: "Tue", InfrastructureHealth: 99.1, CoreDAU_Thousands: 124 },
          { name: "Wed", InfrastructureHealth: 97.9, CoreDAU_Thousands: 128 },
          { name: "Thu", InfrastructureHealth: 99.5, CoreDAU_Thousands: 135 },
          { name: "Fri", InfrastructureHealth: 98.9, CoreDAU_Thousands: 158 },
          { name: "Sat", InfrastructureHealth: 98.2, CoreDAU_Thousands: 182 },
          { name: "Sun", InfrastructureHealth: 99.8, CoreDAU_Thousands: 174 }
        ]
      },
      {
        title: "Operational KPI Index Target Achievement (%)",
        type: "bar",
        keys: ["AchievedPercent"],
        data: [
          { name: "Sales Fulfillment", AchievedPercent: 99.85 },
          { name: "Returns Management SLA", AchievedPercent: 94.2 },
          { name: "Marketing Sourcing ROAS", AchievedPercent: 100 },
          { name: "Dynamic Price Accuracy", AchievedPercent: 100 },
          { name: "Ad-Spend Conversion Yield", AchievedPercent: 98.4 }
        ]
      }
    ]
  };
  const selectedCharts = mockCharts[dashboard] || mockCharts["Sales"];
  const mockTables = {
    "Sales": {
      headers: ["Transaction ID", "Customer", "Product Purchased", "Quantity", "Sales Revenue", "Status"],
      rows: [
        { "Transaction ID": "TXN-9021", "Customer": "Vikram Sharma", "Product Purchased": "iPhone 16 Pro Max", "Quantity": 1, "Sales Revenue": "\u20B91,39,900", "Status": "Delivered" },
        { "Transaction ID": "TXN-9022", "Customer": "Meenakshi Iyer", "Product Purchased": "Logitech MX Mouse", "Quantity": 12, "Sales Revenue": "\u20B91,13,940", "Status": "Shipped" },
        { "Transaction ID": "TXN-9023", "Customer": "Aman Gupta", "Product Purchased": "PlayStation 5 Pro", "Quantity": 2, "Sales Revenue": "\u20B91,29,980", "Status": "Delivered" },
        { "Transaction ID": "TXN-9024", "Customer": "Siddharth Roy", "Product Purchased": 'MacBook Pro 16"', "Quantity": 1, "Sales Revenue": "\u20B92,44,900", "Status": "Processing" }
      ]
    },
    "Revenue": {
      headers: ["Fiscal Period", "Gross Sales (INR)", "Discount Direct Cost", "GST Slabs Paid", "Net Corporate Profit", "Status"],
      rows: [
        { "Fiscal Period": "Today", "Gross Sales (INR)": `\u20B9${Math.round(baseRevenue * 0.15).toLocaleString()}`, "Discount Direct Cost": "\u20B92,45,000", "GST Slabs Paid": "\u20B94,41,000", "Net Corporate Profit": "\u20B912,45,000", "Status": "Reconciled" },
        { "Fiscal Period": "Yesterday", "Gross Sales (INR)": `\u20B9${Math.round(baseRevenue * 0.17).toLocaleString()}`, "Discount Direct Cost": "\u20B92,90,000", "GST Slabs Paid": "\u20B94,82,000", "Net Corporate Profit": "\u20B914,20,000", "Status": "Reconciled" },
        { "Fiscal Period": "This Week", "Gross Sales (INR)": `\u20B9${Math.round(baseRevenue * 0.55).toLocaleString()}`, "Discount Direct Cost": "\u20B91,12,00,000", "GST Slabs Paid": "\u20B91,98,00,000", "Net Corporate Profit": "\u20B94,51,00,000", "Status": "Reconciled" },
        { "Fiscal Period": "This Month", "Gross Sales (INR)": `\u20B9${Math.round(baseRevenue).toLocaleString()}`, "Discount Direct Cost": "\u20B94,52,00,000", "GST Slabs Paid": "\u20B97,80,00,000", "Net Corporate Profit": "\u20B918,20,00,000", "Status": "Audited" }
      ]
    },
    "Inventory": {
      headers: ["SKU Ref", "Name", "Warehouse Sourcing", "Base Stock Limit", "Current Units Available", "Replenish Status"],
      rows: [
        { "SKU Ref": "SKU-091A", "Name": "iPhone 16 Pro Max", "Warehouse Sourcing": "Delhi NCR Hub", "Base Stock Limit": 150, "Current Units Available": 42, "Replenish Status": "Attention" },
        { "SKU Ref": "SKU-024B", "Name": "Galaxy S26 Ultra", "Warehouse Sourcing": "Mumbai JNPT Hub", "Base Stock Limit": 200, "Current Units Available": 145, "Replenish Status": "Sufficient" },
        { "SKU Ref": "SKU-012X", "Name": 'MacBook Pro 16"', "Warehouse Sourcing": "Delhi NCR Hub", "Base Stock Limit": 80, "Current Units Available": 12, "Replenish Status": "Reorder Placed" },
        { "SKU Ref": "SKU-077H", "Name": "Logitech MX Mouse", "Warehouse Sourcing": "Kolkata Sourcing", "Base Stock Limit": 500, "Current Units Available": 480, "Replenish Status": "High Inventory" }
      ]
    },
    "Customer": {
      headers: ["Customer ID", "Registered Name", "Location Sourced", "Order Inception Count", "LTV Spend Contribution", "CSAT Level"],
      rows: [
        { "Customer ID": "CUST-8021", "Registered Name": "Aditya Verma", "Location Sourced": "Bengaluru", "Order Inception Count": 45, "LTV Spend Contribution": "\u20B94,50,000", "CSAT Level": "\u2B50\u2B50\u2B50\u2B50\u2B50" },
        { "Customer ID": "CUST-3829", "Registered Name": "Priyanka Sen", "Location Sourced": "Mumbai", "Order Inception Count": 28, "LTV Spend Contribution": "\u20B93,20,000", "CSAT Level": "\u2B50\u2B50\u2B50\u2B50\u2B50" },
        { "Customer ID": "CUST-1920", "Registered Name": "Kunal Kapoor", "Location Sourced": "Delhi NCR", "Order Inception Count": 12, "LTV Spend Contribution": "\u20B91,50,000", "CSAT Level": "\u2B50\u2B50\u2B50\u2B50" },
        { "Customer ID": "CUST-4812", "Registered Name": "Srinivas Murthy", "Location Sourced": "Chennai", "Order Inception Count": 34, "LTV Spend Contribution": "\u20B93,90,000", "CSAT Level": "\u2B50\u2B50\u2B50\u2B50\u2B50" }
      ]
    }
  };
  const selectedTable = mockTables[dashboard] || mockTables["Sales"];
  return {
    type: dashboard,
    kpis: selectedKPIs,
    charts: selectedCharts,
    table: selectedTable
  };
}

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
  }
  return aiClient;
}
var productsList = [...INITIAL_PRODUCTS];
var advertisementsList = [...INITIAL_ADVERTISEMENTS];
var ordersHistory = [];
var businessRules = {
  priceCurve: "standard",
  safetyStockLimit: 10,
  taxRatePercent: 18,
  // 18% GST typical for electronics in India
  shippingFreeLimit: 2e3,
  shippingFlatRate: 150
};
app.get("/api/store-info", (req, res) => {
  res.json({
    categories: CATEGORIES,
    businessRules,
    geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
  });
});
app.post("/api/store-config", (req, res) => {
  const { priceCurve, safetyStockLimit, taxRatePercent, shippingFreeLimit, shippingFlatRate } = req.body;
  if (priceCurve) businessRules.priceCurve = priceCurve;
  if (typeof safetyStockLimit === "number") businessRules.safetyStockLimit = safetyStockLimit;
  if (typeof taxRatePercent === "number") businessRules.taxRatePercent = taxRatePercent;
  if (typeof shippingFreeLimit === "number") businessRules.shippingFreeLimit = shippingFreeLimit;
  if (typeof shippingFlatRate === "number") businessRules.shippingFlatRate = shippingFlatRate;
  productsList = productsList.map((p) => ({
    ...p,
    price: calculateDynamicPrice(p, { priceCurve: businessRules.priceCurve })
  }));
  res.json({ success: true, businessRules, products: productsList });
});
app.get("/api/products", (req, res) => {
  const { category, brand, search } = req.query;
  let filtered = productsList.map((p) => ({
    ...p,
    price: calculateDynamicPrice(p, { priceCurve: businessRules.priceCurve })
  }));
  if (category) {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (brand) {
    filtered = filtered.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  res.json(filtered);
});
app.get("/api/products/:id", (req, res) => {
  const product = productsList.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  const dynamicPrice = calculateDynamicPrice(product, { priceCurve: businessRules.priceCurve });
  res.json({ ...product, price: dynamicPrice });
});
app.post("/api/products/:id/stock", (req, res) => {
  const { type, amount } = req.body;
  const productIndex = productsList.findIndex((p2) => p2.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  const p = productsList[productIndex];
  if (type === "in") {
    p.currentStock += amount;
  } else if (type === "out") {
    p.currentStock = Math.max(0, p.currentStock - amount);
  } else if (type === "set") {
    p.currentStock = Math.max(0, amount);
  }
  p.price = calculateDynamicPrice(p, { priceCurve: businessRules.priceCurve });
  res.json({
    success: true,
    product: p,
    isLowInventory: p.currentStock <= businessRules.safetyStockLimit,
    isOutOfStock: p.currentStock === 0
  });
});
app.post("/api/products/:id/edit", (req, res) => {
  const { name, brand, mrp, discount, currentStock, description } = req.body;
  const productIndex = productsList.findIndex((p2) => p2.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  const p = productsList[productIndex];
  if (name !== void 0) p.name = name;
  if (brand !== void 0) p.brand = brand;
  if (mrp !== void 0) p.mrp = Number(mrp);
  if (discount !== void 0) p.discount = Number(discount);
  if (currentStock !== void 0) p.currentStock = Math.max(0, Number(currentStock));
  if (description !== void 0) p.description = description;
  p.price = calculateDynamicPrice(p, { priceCurve: businessRules.priceCurve });
  res.json({ success: true, product: p, products: productsList });
});
app.post("/api/products/:id/review", (req, res) => {
  const { userName, rating, comment } = req.body;
  const productIndex = productsList.findIndex((p2) => p2.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  if (!userName || !rating || !comment) {
    return res.status(400).json({ error: "Missing review fields." });
  }
  const p = productsList[productIndex];
  const newReview = {
    id: `r-gen-user-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
    userName,
    rating: Number(rating),
    comment,
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  };
  p.reviews = [newReview, ...p.reviews];
  p.reviewsCount += 1;
  const totalRatingSum = p.reviews.reduce((sum, r) => sum + r.rating, 0);
  p.ratings = parseFloat((totalRatingSum / p.reviews.length).toFixed(1));
  res.json({ success: true, product: p, products: productsList });
});
app.get("/api/advertisements", (req, res) => {
  res.json(advertisementsList);
});
app.post("/api/advertisements/:id/action", (req, res) => {
  const { action } = req.body;
  const adIndex = advertisementsList.findIndex((a) => a.id === req.params.id);
  if (adIndex !== -1) {
    const ad = advertisementsList[adIndex];
    if (action === "impression") ad.impressions++;
    if (action === "click") ad.clicks++;
    if (action === "conversion") {
      ad.conversions++;
      ad.revenue += 15e3;
    }
    ad.ctr = ad.impressions > 0 ? parseFloat((ad.clicks / ad.impressions * 100).toFixed(2)) : 0;
  }
  res.json(advertisementsList);
});
app.post("/api/search/ai", async (req, res) => {
  const { query } = req.body;
  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query is required." });
  }
  const client = getGeminiClient();
  if (client) {
    try {
      const catalogContext = productsList.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        brand: p.brand,
        price: calculateDynamicPrice(p, { priceCurve: businessRules.priceCurve }),
        mrp: p.mrp,
        stock: p.currentStock,
        rating: p.ratings
      }));
      const systemInstruction = `You are a Flipkart-style Senior AI Retail Shopping Assistant for electronics. 
Your goal is to parse the user's shopping request, evaluate the available catalog context, and provide a helpful, engaging response recommending the best-matching products.
Follow these rules:
1. Reference real products from the context whenever possible, including their pricing and stock status.
2. Structure your output clearly using markdown, including lists, pricing details, and bullet points.
3. Keep it brief, polite, and helpful (focus on consumer electronics).
4. If the user asks for a comparison, outline the pros and cons clearly.`;
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Available Store Catalog:
${JSON.stringify(catalogContext, null, 2)}

User Shopping Query: "${query}"`,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      const responseText2 = response.text || "I was unable to analyze this request. Please try again.";
      return res.json({ response: responseText2, source: "Gemini AI" });
    } catch (err) {
      console.error("Gemini API call failed:", err);
    }
  }
  const q = query.toLowerCase();
  let recommendations = productsList.map((p) => ({
    ...p,
    price: calculateDynamicPrice(p, { priceCurve: businessRules.priceCurve })
  }));
  if (q.includes("iphone") || q.includes("apple") || q.includes("phone") || q.includes("mobile")) {
    recommendations = recommendations.filter((p) => p.category === "Smartphones" || p.brand === "Apple");
  } else if (q.includes("laptop") || q.includes("macbook") || q.includes("computer") || q.includes("pc")) {
    recommendations = recommendations.filter((p) => p.category === "Laptops");
  } else if (q.includes("tv") || q.includes("television") || q.includes("display")) {
    recommendations = recommendations.filter((p) => p.category === "Smart TVs" || p.category === "Monitors");
  } else if (q.includes("headphone") || q.includes("earphone") || q.includes("music") || q.includes("sound")) {
    recommendations = recommendations.filter((p) => p.category === "Headphones" || p.category === "Speakers");
  } else {
    recommendations = recommendations.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  const topRecs = recommendations.slice(0, 3);
  let responseText = `### Local Smart Search Match (Gemini API key is not configured in Secrets)

I searched our catalog for **"${query}"** and found some excellent electronics matching your criteria:

`;
  if (topRecs.length > 0) {
    topRecs.forEach((p) => {
      const stockMsg = p.currentStock === 0 ? "\u{1F6AB} Out of Stock" : p.currentStock < businessRules.safetyStockLimit ? `\u26A0\uFE0F Low Stock (${p.currentStock} left)` : `\u2705 In Stock (${p.currentStock} units)`;
      responseText += `*   **${p.name}** (${p.brand})
    *   **Special Price:** \u20B9${p.price.toLocaleString()} (MRP: ~~\u20B9${p.mrp.toLocaleString()}~~)
    *   **Rating:** \u2B50 ${p.ratings} / 5
    *   **Stock Status:** ${stockMsg}
    *   *Sourcing from Partner: ${p.seller}*

`;
    });
    responseText += `*Tip: To activate fully conversational, comparative, and context-aware Gemini AI features, configure a valid \`GEMINI_API_KEY\` in your AI Studio Secrets panel!*`;
  } else {
    responseText += `I couldn't find any direct match for "${query}" in our local search. Try searching for popular categories like **Smartphones**, **Laptops**, **Smart TVs**, or **Gaming Consoles**.

*Configure a \`GEMINI_API_KEY\` in your Secrets panel to enable comprehensive cross-category generative reasoning!*`;
  }
  res.json({ response: responseText, source: "Local NLP Fallback" });
});
app.post("/api/chatbot", async (req, res) => {
  const { message, history } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required." });
  }
  const client = getGeminiClient();
  if (client) {
    try {
      const catalogContext = productsList.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        brand: p.brand,
        price: p.price,
        mrp: p.mrp,
        stock: p.currentStock
      })).slice(0, 35);
      const systemInstruction = `You are the friendly Customer Support AI Chatbot representative for "MY STORE".
Our official customer support hotline/WhatsApp is +919569303799. Encourage users to call or message this number for manual resolution, bulk custom orders, or invoice disputes.
We offer generous bulk order discount slabs:
- Buy 10-20 units: 5% OFF
- Buy 21-50 units: 10% OFF
- Buy 51-100 units: 15% OFF
- Buy >100 units: 20% OFF
These discounts are shown live below each product and auto-applied in the shopping cart!

Standard Coupon Promo Codes:
1. ELECTRO10 (10% OFF on order amount > \u20B91,000)
2. SUPERMEGA (15% OFF on order amount > \u20B95,000)
3. FESTIVE25 (25% OFF on order amount > \u20B915,000)

Always greet with high-fidelity professionalism, refer to the store as "MY STORE" (never say Flipkart or Amazon), structure answers elegantly using markdown lists or bold markers, and remain brief. If users ask for specific products, review the provided store catalog and recommend matching ids or names!`;
      const formattedContents = [];
      if (history && Array.isArray(history)) {
        history.slice(-10).forEach((item) => {
          formattedContents.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.text }]
          });
        });
      }
      formattedContents.push({
        role: "user",
        parts: [{ text: `Store Catalog:
${JSON.stringify(catalogContext, null, 2)}

User Message: "${message}"` }]
      });
      const result = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 500
        }
      });
      return res.json({ response: result.text || "Hello! I am glad to assist you. What can I help you find in MY STORE today?", source: "Gemini AI Assistant" });
    } catch (err) {
      console.error("Chatbot Gemini API call failed, falling back to local:", err);
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
1.  **ELECTRO10**: 10% OFF (Minimum purchase \u20B91,000)
2.  **SUPERMEGA**: 15% OFF (Minimum purchase \u20B95,000)
3.  **FESTIVE25**: 25% OFF (Minimum purchase \u20B915,000)`;
  } else if (text.includes("smartphone") || text.includes("phone") || text.includes("mobile")) {
    fallbackResponse = `We have over **100 different types of smartphones** in stock with **100 units each** ready to ship! Search for premium Apple iPhones, Samsung Galaxies, Google Pixels, OnePlus flagships, and more. Use our search bar or filter by "Smartphones" to explore!`;
  } else {
    fallbackResponse = `Thank you for messaging **MY STORE** support! We specialize in high-fidelity electronics, with a catalog of 100+ top-tier smartphones and e-commerce deals. For questions or direct support, dial our 24/7 hotline at **+919569303799**.`;
  }
  res.json({ response: fallbackResponse, source: "MY STORE Support Bot" });
});
app.post("/api/cart/checkout", (req, res) => {
  const { items, couponCode, customerName, shippingAddress } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty." });
  }
  let subtotal = 0;
  let bulkDiscountAmount = 0;
  const processedItems = [];
  for (const item of items) {
    const product = productsList.find((p) => p.id === item.productId);
    if (!product) continue;
    const dynamicPrice = calculateDynamicPrice(product, { priceCurve: businessRules.priceCurve });
    const itemSubtotal = dynamicPrice * item.quantity;
    subtotal += itemSubtotal;
    const bulk = calculateBulkDiscount(item.quantity, dynamicPrice);
    bulkDiscountAmount += bulk.saved;
    processedItems.push({
      productId: product.id,
      name: product.name,
      price: dynamicPrice,
      quantity: item.quantity,
      total: itemSubtotal - bulk.saved
    });
    product.currentStock = Math.max(0, product.currentStock - item.quantity);
    product.price = calculateDynamicPrice(product, { priceCurve: businessRules.priceCurve });
  }
  let discountAmount = 0;
  let couponApplied = void 0;
  if (couponCode) {
    const codeUpper = couponCode.toUpperCase();
    if (codeUpper === "ELECTRO10" && subtotal >= 1e3) {
      discountAmount = Math.round(subtotal * 0.1);
      couponApplied = "ELECTRO10";
    } else if (codeUpper === "SUPERMEGA" && subtotal >= 5e3) {
      discountAmount = Math.round(subtotal * 0.15);
      couponApplied = "SUPERMEGA";
    } else if (codeUpper === "FESTIVE25" && subtotal >= 15e3) {
      discountAmount = Math.round(subtotal * 0.25);
      couponApplied = "FESTIVE25";
    }
  }
  const taxableAmount = subtotal - discountAmount - bulkDiscountAmount;
  const gstAmount = Math.round(taxableAmount * businessRules.taxRatePercent / 100);
  const shippingCharge = taxableAmount >= businessRules.shippingFreeLimit ? 0 : businessRules.shippingFlatRate;
  const totalAmount = taxableAmount + gstAmount + shippingCharge;
  const summary = {
    id: `INV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
    items: processedItems,
    subtotal,
    discountAmount,
    bulkDiscountAmount,
    gstAmount,
    shippingCharge,
    totalAmount,
    couponApplied,
    date: (/* @__PURE__ */ new Date()).toISOString(),
    customerName: customerName || "Valued Electronic Buyer",
    shippingAddress: shippingAddress || "12-B Tech Tower, Electronic City Phase 1, Bengaluru, Karnataka"
  };
  ordersHistory.push(summary);
  res.json({
    success: true,
    invoice: summary,
    products: productsList
    // returns updated stocks & prices
  });
});
app.get("/api/dashboards/:type", (req, res) => {
  const dashboardType = req.params.type;
  const category = req.query.category || "";
  const timeRange = req.query.timeRange || "Monthly";
  const refreshTrigger = parseInt(req.query.refreshTrigger || "0");
  const stats = getDeterministicBIStats(dashboardType, category, timeRange, refreshTrigger);
  res.json(stats);
});
app.get("/api/orders", (req, res) => {
  res.json(ordersHistory);
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Enterprise Fullstack Electronics Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
