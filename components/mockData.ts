
import { Product } from '../types';

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const DEFAULT_COLORS = ['#000000', '#F5F5F0', '#9e6b4f']; // Black, Off-white, Copper

export const MOCK_PRODUCTS: Record<string, Product[]> = {
  streetwear: [
    { 
      id: '1', 
      name: 'Obsidian Hoodie', 
      price: 450, 
      category: 'Street Wear', 
      rating: 4.8,
      reviewCount: 124,
      image: 'https://picsum.photos/800/800?random=1', // 1. Square
      images: [
        'https://picsum.photos/800/800?random=1',
        'https://picsum.photos/800/1200?random=101',
        'https://picsum.photos/800/800?random=201'
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#000000', '#333333']
    },
    { 
      id: '2', 
      name: 'Urban Cargo V2', 
      price: 320, 
      category: 'Street Wear', 
      rating: 4.2,
      reviewCount: 89,
      image: 'https://picsum.photos/800/533?random=2', // 2. Landscape
      images: [
        'https://picsum.photos/800/533?random=2',
        'https://picsum.photos/800/1000?random=102'
      ],
      sizes: ['28', '30', '32', '34', '36'],
      colors: ['#000000', '#556B2F', '#8B4513']
    },
    { 
      id: '3', 
      name: 'Matte Black Bomber', 
      price: 890, 
      category: 'Street Wear', 
      rating: 3.5,
      reviewCount: 45,
      image: 'https://picsum.photos/800/800?random=3', // 3. Square
      images: [
        'https://picsum.photos/800/800?random=3',
        'https://picsum.photos/800/1000?random=103'
      ],
      sizes: ['M', 'L', 'XL'],
      colors: ['#000000']
    },
    { 
      id: '4', 
      name: 'Oversized Graphic Tee', 
      price: 180, 
      category: 'Street Wear', 
      rating: 2.5,
      reviewCount: 12,
      image: 'https://picsum.photos/800/533?random=4', // 4. Landscape
      images: [
        'https://picsum.photos/800/533?random=4',
        'https://picsum.photos/800/1000?random=104'
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['#FFFFFF', '#000000', '#D4AF37']
    },
    { 
      id: '4b', 
      name: 'Techwear Vest', 
      price: 550, 
      category: 'Street Wear', 
      rating: 4.9,
      reviewCount: 22,
      image: 'https://picsum.photos/800/800?random=41', // 5. Square
      images: ['https://picsum.photos/800/800?random=41'],
      sizes: ['S', 'M', 'L'],
      colors: ['#000000']
    },
  ],
  casual: [
    { 
      id: '5', 
      name: 'Linen Lounge Set', 
      price: 280, 
      category: 'Casual', 
      rating: 4.9,
      reviewCount: 210,
      image: 'https://picsum.photos/800/800?random=5', // 1. Square
      images: [
        'https://picsum.photos/800/800?random=5',
        'https://picsum.photos/800/1000?random=105'
      ],
      sizes: ['S', 'M', 'L'],
      colors: ['#F5F5DC', '#E6E6FA']
    },
    { 
      id: '6', 
      name: 'Essential Knit', 
      price: 210, 
      category: 'Casual', 
      rating: 3.8,
      reviewCount: 56,
      image: 'https://picsum.photos/800/533?random=6', // 2. Landscape
      images: [
        'https://picsum.photos/800/533?random=6',
        'https://picsum.photos/800/1000?random=106'
      ],
      sizes: DEFAULT_SIZES,
      colors: ['#808080', '#000000', '#9e6b4f']
    },
    { 
      id: '6b', 
      name: 'Everyday Trousers', 
      price: 180, 
      category: 'Casual', 
      rating: 4.5,
      reviewCount: 40,
      image: 'https://picsum.photos/800/800?random=61', // 3. Square
      images: ['https://picsum.photos/800/800?random=61'],
      sizes: ['30', '32', '34'],
      colors: ['#000000', '#333333']
    },
  ],
  winter: [
    { 
      id: '7', 
      name: 'Wool Trench Coat', 
      price: 1250, 
      category: 'Winter', 
      rating: 5.0,
      reviewCount: 32,
      image: 'https://picsum.photos/800/800?random=7', // 1. Square
      images: [
        'https://picsum.photos/800/800?random=7',
        'https://picsum.photos/800/1000?random=107'
      ],
      sizes: ['M', 'L', 'XL'],
      colors: ['#000000', '#8B4513']
    },
    { 
      id: '8', 
      name: 'Cashmere Scarf', 
      price: 195, 
      category: 'Winter', 
      rating: 4.5,
      reviewCount: 150,
      image: 'https://picsum.photos/800/533?random=8', // 2. Landscape
      images: [
        'https://picsum.photos/800/533?random=8',
        'https://picsum.photos/800/1000?random=108'
      ],
      sizes: ['One Size'],
      colors: ['#D4AF37', '#000000', '#A52A2A']
    },
    { 
      id: '9', 
      name: 'Thermal Layer', 
      price: 150, 
      category: 'Winter', 
      rating: 2.7,
      reviewCount: 41,
      image: 'https://picsum.photos/800/800?random=9', // 3. Square
      images: ['https://picsum.photos/800/800?random=9'],
      sizes: DEFAULT_SIZES,
      colors: ['#000000', '#FFFFFF']
    },
  ],
  summer: [
    { 
      id: '10', 
      name: 'Silk Resort Shirt', 
      price: 350, 
      category: 'Summer', 
      rating: 4.1,
      reviewCount: 78,
      image: 'https://picsum.photos/800/800?random=10', // 1. Square
      images: ['https://picsum.photos/800/800?random=10'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#FFD700', '#87CEEB', '#FFFFFF']
    },
    { 
      id: '11', 
      name: 'Pleated Shorts', 
      price: 220, 
      category: 'Summer', 
      rating: 3.2,
      reviewCount: 65,
      image: 'https://picsum.photos/800/533?random=11', // 2. Landscape
      images: ['https://picsum.photos/800/533?random=11'],
      sizes: ['30', '32', '34'],
      colors: ['#F5F5F0', '#000000']
    },
  ],
};

export const getAllProducts = (): Product[] => {
  return Object.values(MOCK_PRODUCTS).flat();
};

export const getProductById = (id: string): Product | undefined => {
  return getAllProducts().find(p => p.id === id);
};
