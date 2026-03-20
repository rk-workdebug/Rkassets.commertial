import { Product } from '../types';
import { MOCK_PRODUCTS, getAllProducts } from '../data/mockData';

// Simulate network latency (400ms - 800ms)
const delay = (min = 400, max = 800) => {
  const ms = Math.floor(Math.random() * (max - min + 1) + min);
  return new Promise(resolve => setTimeout(resolve, ms));
};

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface OrderPayload {
  order: OrderItem[];
  paymentMethod: string;
  deliveryAddress: string;
}

export const api = {
  // GET /api/products?category={category}
  getProducts: async (category?: string, searchQuery?: string): Promise<Product[]> => {
    await delay();
    
    let products: Product[] = [];

    if (searchQuery) {
       // Search simulation
       const all = getAllProducts();
       const query = searchQuery.toLowerCase();
       products = all.filter(p => 
         p.name.toLowerCase().includes(query) || 
         p.category.toLowerCase().includes(query)
       );
    } else if (!category || category === 'all') {
       products = getAllProducts();
    } else {
       // Database lookup by category
       const key = category.toLowerCase();
       products = MOCK_PRODUCTS[key] || [];
    }

    return products;
  },

  // GET /api/products/{id}
  getProductById: async (id: string): Promise<Product | undefined> => {
    await delay();
    return getAllProducts().find(p => p.id === id);
  },

  // POST /api/order
  submitOrder: async (payload: OrderPayload): Promise<{ success: boolean; orderId: string }> => {
    console.log("------------------------------------------------");
    console.log("🚀 MOCK BACKEND: Received POST Request to /api/order");
    console.log("📦 PAYLOAD:", JSON.stringify(payload, null, 2));
    console.log("------------------------------------------------");
    
    await delay(2000, 3000); // Simulate payment processing time
    
    return {
      success: true,
      orderId: Math.random().toString(36).substring(2, 10).toUpperCase()
    };
  }
};