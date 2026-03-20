
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string; // Primary image (thumbnail)
  images: string[]; // Gallery images
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: string[]; // Hex codes
}

export interface CartItem extends Product {
  cartId: string;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  token?: string; // Simulated JWT
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  author: string;
  rating: number;
  content: string;
  date: string;
}

export type CategoryPath = 'streetwear' | 'casual' | 'winter' | 'summer' | 'customer-service';

export interface NavItem {
  label: string;
  path: CategoryPath;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Street Wear', path: 'streetwear' },
  { label: 'Casual', path: 'casual' },
  { label: 'Winter', path: 'winter' },
  { label: 'Summer', path: 'summer' },
  { label: 'Customer Service', path: 'customer-service' },
];

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
