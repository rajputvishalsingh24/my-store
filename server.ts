import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS, INITIAL_ADVERTISEMENTS, calculateDynamicPrice, calculateBulkDiscount, getDeterministicBIStats, CATEGORIES } from './src/data/mockData.js';
import { Product, OrderSummary } from './src/types.js';

// Setup Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini API Client with required httpOptions header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
  }
  return aiClient;
}

// Global in-memory lists (resets on server restart, providing dynamic interactive playground state!)
let productsList: Product[] = [...INITIAL_PRODUCTS];
let advertisementsList = [...INITIAL_ADVERTISEMENTS];
let ordersHistory: OrderSummary[] = [];

// Business Rules Configuration (Customizable via admin UI!)
const businessRules = {
  priceCurve: 'standard' as 'linear' | 'aggressive' | 'standard',
  safetyStockLimit: 10,
  taxRatePercent: 18, // 18% GST typical for electronics in India
  shippingFreeLimit: 2000,
  shippingFlatRate: 150
};

// --- API ENDPOINTS ---

// GET: Store general details
app.get('/api/store-info', (req, res) => {
  res.json({
    categories: CATEGORIES,
    businessRules,
    geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
  });
});

// POST: Update Business Rules
app.post('/api/store-config', (req, res) => {
  const { priceCurve, safetyStockLimit, taxRatePercent, shippingFreeLimit, shippingFlatRate } = req.body;
  if (priceCurve) businessRules.priceCurve = priceCurve;
  if (typeof safetyStockLimit === 'number') businessRules.safetyStockLimit = safetyStockLimit;
  if (typeof taxRatePercent === 'number') businessRules.taxRatePercent = taxRatePercent;
  if (typeof shippingFreeLimit === 'number') businessRules.shippingFreeLimit = shippingFreeLimit;
  if (typeof shippingFlatRate === 'number') businessRules.shippingFlatRate = shippingFlatRate;

  // Recalculate dynamic prices across the entire catalog based on new curves
  productsList = productsList.map(p => ({
    ...p,
    price: calculateDynamicPrice(p, { priceCurve: businessRules.priceCurve })
  }));

  res.json({ success: true, businessRules, products: productsList });
});

// GET: Products catalog (with live price calculations based on stock ratios)
app.get('/api/products', (req, res) => {
  const { category, brand, search } = req.query;
  let filtered = productsList.map(p => ({
    ...p,
    price: calculateDynamicPrice(p, { priceCurve: businessRules.priceCurve })
  }));

  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
  }
  if (brand) {
    filtered = filtered.filter(p => p.brand.toLowerCase() === (brand as string).toLowerCase());
  }
  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

// GET: Single product
app.get('/api/products/:id', (req, res) => {
  const product = productsList.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const dynamicPrice = calculateDynamicPrice(product, { priceCurve: businessRules.priceCurve });
  res.json({ ...product, price: dynamicPrice });
});

// POST: Update stock (Simulates Stock-In / Stock-Out / Purchase replenishment)
app.post('/api/products/:id/stock', (req, res) => {
  const { type, amount } = req.body; // type: 'in' | 'out' | 'set'
  const productIndex = productsList.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const p = productsList[productIndex];
  if (type === 'in') {
    p.currentStock += amount;
  } else if (type === 'out') {
    p.currentStock = Math.max(0, p.currentStock - amount);
  } else if (type === 'set') {
    p.currentStock = Math.max(0, amount);
  }

  // Recalculate dynamic price for this product immediately
  p.price = calculateDynamicPrice(p, { priceCurve: businessRules.priceCurve });

  res.json({
    success: true,
    product: p,
    isLowInventory: p.currentStock <= businessRules.safetyStockLimit,
    isOutOfStock: p.currentStock === 0
  });
});

// POST: Edit product details live (Admin Live Inventory Manager)
app.post('/api/products/:id/edit', (req, res) => {
  const { name, brand, mrp, discount, currentStock, description } = req.body;
  const productIndex = productsList.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const p = productsList[productIndex];
  if (name !== undefined) p.name = name;
  if (brand !== undefined) p.brand = brand;
  if (mrp !== undefined) p.mrp = Number(mrp);
  if (discount !== undefined) p.discount = Number(discount);
  if (currentStock !== undefined) p.currentStock = Math.max(0, Number(currentStock));
  if (description !== undefined) p.description = description;

  // Recalculate dynamic price based on rules
  p.price = calculateDynamicPrice(p, { priceCurve: businessRules.priceCurve });

  res.json({ success: true, product: p, products: productsList });
});

// POST: Add customer review live
app.post('/api/products/:id/review', (req, res) => {
  const { userName, rating, comment } = req.body;
  const productIndex = productsList.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (!userName || !rating || !comment) {
    return res.status(400).json({ error: 'Missing review fields.' });
  }

  const p = productsList[productIndex];
  
  const newReview = {
    id: `r-gen-user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userName: userName,
    rating: Number(rating),
    comment: comment,
    date: new Date().toISOString().split('T')[0]
  };

  p.reviews = [newReview, ...p.reviews];
  p.reviewsCount += 1;
  
  // Recalculate average rating
  const totalRatingSum = p.reviews.reduce((sum, r) => sum + r.rating, 0);
  p.ratings = parseFloat((totalRatingSum / p.reviews.length).toFixed(1));

  res.json({ success: true, product: p, products: productsList });
});

// GET: Advertisements campaigns list
app.get('/api/advertisements', (req, res) => {
  res.json(advertisementsList);
});

// POST: Trigger advertisement click/impression
app.post('/api/advertisements/:id/action', (req, res) => {
  const { action } = req.body; // action: 'impression' | 'click' | 'conversion'
  const adIndex = advertisementsList.findIndex(a => a.id === req.params.id);
  if (adIndex !== -1) {
    const ad = advertisementsList[adIndex];
    if (action === 'impression') ad.impressions++;
    if (action === 'click') ad.clicks++;
    if (action === 'conversion') {
      ad.conversions++;
      ad.revenue += 15000; // Average conversion revenue
    }
    // Recalculate CTR
    ad.ctr = ad.impressions > 0 ? parseFloat(((ad.clicks / ad.impressions) * 100).toFixed(2)) : 0;
  }
  res.json(advertisementsList);
});

// POST: AI Search (Gemini API Integration with rich electronics suggestions)
app.post('/api/search/ai', async (req, res) => {
  const { query } = req.body;
  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query is required.' });
  }

  // Try using the server-side Gemini client
  const client = getGeminiClient();
  if (client) {
    try {
      const catalogContext = productsList.map(p => ({
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
        model: 'gemini-3.5-flash',
        contents: `Available Store Catalog:\n${JSON.stringify(catalogContext, null, 2)}\n\nUser Shopping Query: "${query}"`,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7
        }
      });

      const responseText = response.text || "I was unable to analyze this request. Please try again.";
      return res.json({ response: responseText, source: 'Gemini AI' });
    } catch (err: any) {
      console.error("Gemini API call failed:", err);
      // Fallback to local NLP on error
    }
  }

  // Robust Smart Local Search NLP Fallback when key is missing or errored
  const q = query.toLowerCase();
  let recommendations = productsList.map(p => ({
    ...p,
    price: calculateDynamicPrice(p, { priceCurve: businessRules.priceCurve })
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
    // general matching
    recommendations = recommendations.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  // slice to top 3 recommendations
  const topRecs = recommendations.slice(0, 3);
  let responseText = `### Local Smart Search Match (Gemini API key is not configured in Secrets)

I searched our catalog for **"${query}"** and found some excellent electronics matching your criteria:

`;

  if (topRecs.length > 0) {
    topRecs.forEach(p => {
      const stockMsg = p.currentStock === 0 ? '🚫 Out of Stock' : p.currentStock < businessRules.safetyStockLimit ? `⚠️ Low Stock (${p.currentStock} left)` : `✅ In Stock (${p.currentStock} units)`;
      responseText += `*   **${p.name}** (${p.brand})
    *   **Special Price:** ₹${p.price.toLocaleString()} (MRP: ~~₹${p.mrp.toLocaleString()}~~)
    *   **Rating:** ⭐ ${p.ratings} / 5
    *   **Stock Status:** ${stockMsg}
    *   *Sourcing from Partner: ${p.seller}*\n\n`;
    });
    responseText += `*Tip: To activate fully conversational, comparative, and context-aware Gemini AI features, configure a valid \`GEMINI_API_KEY\` in your AI Studio Secrets panel!*`;
  } else {
    responseText += `I couldn't find any direct match for "${query}" in our local search. Try searching for popular categories like **Smartphones**, **Laptops**, **Smart TVs**, or **Gaming Consoles**.\n\n*Configure a \`GEMINI_API_KEY\` in your Secrets panel to enable comprehensive cross-category generative reasoning!*`;
  }

  res.json({ response: responseText, source: 'Local NLP Fallback' });
});

// POST: Interactive Customer Support Chatbot (Gemini AI + Local fallback)
app.post('/api/chatbot', async (req, res) => {
  const { message, history } = req.body;
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const client = getGeminiClient();
  if (client) {
    try {
      const catalogContext = productsList.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        brand: p.brand,
        price: p.price,
        mrp: p.mrp,
        stock: p.currentStock
      })).slice(0, 35); // Keep context size optimized

      const systemInstruction = `You are the friendly Customer Support AI Chatbot representative for "MY STORE".
Our official customer support hotline/WhatsApp is +919569303799. Encourage users to call or message this number for manual resolution, bulk custom orders, or invoice disputes.
We offer generous bulk order discount slabs:
- Buy 10-20 units: 5% OFF
- Buy 21-50 units: 10% OFF
- Buy 51-100 units: 15% OFF
- Buy >100 units: 20% OFF
These discounts are shown live below each product and auto-applied in the shopping cart!

Standard Coupon Promo Codes:
1. ELECTRO10 (10% OFF on order amount > ₹1,000)
2. SUPERMEGA (15% OFF on order amount > ₹5,000)
3. FESTIVE25 (25% OFF on order amount > ₹15,000)

Always greet with high-fidelity professionalism, refer to the store as "MY STORE" (never say Flipkart or Amazon), structure answers elegantly using markdown lists or bold markers, and remain brief. If users ask for specific products, review the provided store catalog and recommend matching ids or names!`;

      // Structure conversation history for Gemini Content
      const formattedContents: any[] = [];
      if (history && Array.isArray(history)) {
        // limit history items to keep payload light
        history.slice(-10).forEach((item: any) => {
          formattedContents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }]
          });
        });
      }
      formattedContents.push({
        role: 'user',
        parts: [{ text: `Store Catalog:\n${JSON.stringify(catalogContext, null, 2)}\n\nUser Message: "${message}"` }]
      });

      const result = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 500
        }
      });

      return res.json({ response: result.text || "Hello! I am glad to assist you. What can I help you find in MY STORE today?", source: 'Gemini AI Assistant' });
    } catch (err) {
      console.error("Chatbot Gemini API call failed, falling back to local:", err);
    }
  }

  // Fallback intelligent response logic
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

  res.json({ response: fallbackResponse, source: 'MY STORE Support Bot' });
});

// POST: Cart checkout, coupons, tax/GST additions, shipping, bulk discounts
app.post('/api/cart/checkout', (req, res) => {
  const { items, couponCode, customerName, shippingAddress } = req.body; // items: { productId, quantity }[]
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty.' });
  }

  let subtotal = 0;
  let bulkDiscountAmount = 0;
  const processedItems = [];

  for (const item of items) {
    const product = productsList.find(p => p.id === item.productId);
    if (!product) continue;

    const dynamicPrice = calculateDynamicPrice(product, { priceCurve: businessRules.priceCurve });
    const itemSubtotal = dynamicPrice * item.quantity;
    subtotal += itemSubtotal;

    // Calculate bulk discounts (only applicable when min quantity = 10 as specified in PDF page 9)
    const bulk = calculateBulkDiscount(item.quantity, dynamicPrice);
    bulkDiscountAmount += bulk.saved;

    processedItems.push({
      productId: product.id,
      name: product.name,
      price: dynamicPrice,
      quantity: item.quantity,
      total: itemSubtotal - bulk.saved
    });

    // Reduce inventory immediately upon checkout to simulate dynamic real-time catalog changes!
    product.currentStock = Math.max(0, product.currentStock - item.quantity);
    product.price = calculateDynamicPrice(product, { priceCurve: businessRules.priceCurve });
  }

  // Base checkout calculation
  let discountAmount = 0;
  let couponApplied = undefined;

  // Validate general coupon
  if (couponCode) {
    const codeUpper = couponCode.toUpperCase();
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

  // Calculate taxes (GST is 18% average)
  const taxableAmount = subtotal - discountAmount - bulkDiscountAmount;
  const gstAmount = Math.round((taxableAmount * businessRules.taxRatePercent) / 100);

  // Shipping logic
  const shippingCharge = taxableAmount >= businessRules.shippingFreeLimit ? 0 : businessRules.shippingFlatRate;

  const totalAmount = taxableAmount + gstAmount + shippingCharge;

  // Generate invoice
  const summary: OrderSummary = {
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
    customerName: customerName || 'Valued Electronic Buyer',
    shippingAddress: shippingAddress || '12-B Tech Tower, Electronic City Phase 1, Bengaluru, Karnataka'
  };

  ordersHistory.push(summary);

  res.json({
    success: true,
    invoice: summary,
    products: productsList // returns updated stocks & prices
  });
});

// GET: 20 completely functional dashboards
app.get('/api/dashboards/:type', (req, res) => {
  const dashboardType = req.params.type as any;
  const category = (req.query.category as string) || '';
  const timeRange = (req.query.timeRange as string) || 'Monthly';
  const refreshTrigger = parseInt((req.query.refreshTrigger as string) || '0');

  const stats = getDeterministicBIStats(dashboardType, category, timeRange, refreshTrigger);
  res.json(stats);
});

// GET: Orders history list
app.get('/api/orders', (req, res) => {
  res.json(ordersHistory);
});

// Start Server Setup with Vite integration for React
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite dev server middleware to handle index.html + React hot reloading
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise Fullstack Electronics Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
