
import { Product, Review, User, OrderPayload } from '../types';
import { MOCK_PRODUCTS, getAllProducts } from '../data/mockData';

// --- MOCK DATABASE ENGINE ---
// In a real Node/Express setup, this file would simply contain fetch() calls to your API endpoints.
// Currently, it simulates the Database, Controller, and Auth Middleware logic using LocalStorage.

const DB_KEYS = {
  USERS: 'rk_db_users',
  REVIEWS: 'rk_db_reviews',
  PRODUCTS: 'rk_db_products',
};

// Simulate Network Latency
const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Read DB
const readDB = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Helper: Write DB
const writeDB = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Seed Database if empty
const seedDatabase = () => {
  if (!readDB(DB_KEYS.PRODUCTS)) {
    writeDB(DB_KEYS.PRODUCTS, MOCK_PRODUCTS);
  }
  if (!readDB(DB_KEYS.REVIEWS)) {
    // Initial dummy reviews
    writeDB(DB_KEYS.REVIEWS, [
       { id: '1', productId: '1', userId: 'mock-u1', author: 'Alexander V.', rating: 5, content: 'The material quality is unparalleled. Fits perfectly.', date: new Date(Date.now() - 172800000).toISOString() },
       { id: '2', productId: '1', userId: 'mock-u2', author: 'Sarah J.', rating: 4, content: 'Exquisite design.', date: new Date(Date.now() - 604800000).toISOString() }
    ]);
  }
  if (!readDB(DB_KEYS.USERS)) {
     // Default dummy users
    writeDB(DB_KEYS.USERS, [
        { id: 'mock-u1', name: 'Alexander V.', email: 'alex@rk.com', password: '123', xp: 150 },
        { id: 'mock-u2', name: 'Sarah J.', email: 'sarah@rk.com', password: '123', xp: 40 }
    ]);
  }
};

seedDatabase();

export const api = {
  // --- AUTHENTICATION ENDPOINTS ---
  
  login: async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    await delay(800);
    const users = readDB(DB_KEYS.USERS) || [];
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      // Simulate JWT
      const { password, ...userWithoutPass } = user;
      return { 
        success: true, 
        user: { ...userWithoutPass, token: `mock-jwt-${Date.now()}` } 
      };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  register: async (name: string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    await delay(800);
    const users = readDB(DB_KEYS.USERS) || [];
    
    if (users.find((u: any) => u.email === email)) {
      return { success: false, error: 'User already exists' };
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      password, // In real backend: bcrypt.hash(password)
      xp: 0 // Initial XP
    };

    users.push(newUser);
    writeDB(DB_KEYS.USERS, users);

    const { password: _, ...userWithoutPass } = newUser;
    return { 
      success: true, 
      user: { ...userWithoutPass, token: `mock-jwt-${Date.now()}` } 
    };
  },

  // --- PRODUCT ENDPOINTS ---

  getProducts: async (category?: string, searchQuery?: string): Promise<Product[]> => {
    await delay(400);
    
    // In real app: SELECT * FROM products
    // Here we use the static mock data augmented by review counts
    const all = getAllProducts(); 
    
    let products = [...all];

    if (searchQuery) {
       const query = searchQuery.toLowerCase();
       products = all.filter(p => 
         p.name.toLowerCase().includes(query) || 
         p.category.toLowerCase().includes(query)
       );
    } else if (category && category !== 'all') {
       const key = category.toLowerCase();
       // For this mock, we are just filtering the flat list to ensure consistency
       products = all.filter(p => p.category.toLowerCase().replace(' ', '-') === key || (key === 'streetwear' && p.category === 'Street Wear'));
    }

    return products;
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    await delay(300);
    const p = getAllProducts().find(p => p.id === id);
    if (!p) return undefined;

    // Calc dynamic rating
    const reviews = await api.getReviews(id);
    if (reviews.length > 0) {
      const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
      return { ...p, rating: parseFloat(avg.toFixed(1)), reviewCount: reviews.length };
    }
    return p;
  },

  // --- REVIEW ENDPOINTS ---

  getReviews: async (productId: string): Promise<Review[]> => {
    // await delay(200); // Fast load for reviews
    const allReviews = readDB(DB_KEYS.REVIEWS) || [];
    return allReviews.filter((r: Review) => r.productId === productId).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  submitReview: async (productId: string, userId: string, rating: number, content: string): Promise<{ success: boolean; review?: Review; xpEarned: number }> => {
    await delay(800);
    
    // 1. Save Review
    const reviews = readDB(DB_KEYS.REVIEWS) || [];
    const users = readDB(DB_KEYS.USERS) || [];
    const user = users.find((u: any) => u.id === userId);

    if (!user) return { success: false, xpEarned: 0 };

    const newReview: Review = {
      id: `r-${Date.now()}`,
      productId,
      userId,
      author: user.name,
      rating,
      content,
      date: new Date().toISOString()
    };

    reviews.unshift(newReview); // Add to top
    writeDB(DB_KEYS.REVIEWS, reviews);

    // 2. XP Logic (+10 XP)
    const XP_GAIN = 10;
    user.xp = (user.xp || 0) + XP_GAIN;
    
    // Update User in DB
    const userIndex = users.findIndex((u: any) => u.id === userId);
    users[userIndex] = user;
    writeDB(DB_KEYS.USERS, users);

    return { success: true, review: newReview, xpEarned: XP_GAIN };
  },

  // --- ORDER ENDPOINTS ---

  submitOrder: async (payload: OrderPayload): Promise<{ success: boolean; orderId: string }> => {
    await delay(1500); 
    // Just simulating success
    return {
      success: true,
      orderId: Math.random().toString(36).substring(2, 10).toUpperCase()
    };
  }
};
