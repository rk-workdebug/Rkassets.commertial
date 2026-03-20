import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProductGrid } from './pages/ProductGrid';
import { ProductDetail } from './pages/ProductDetail';
import { CustomerService } from './pages/CustomerService';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Origin } from './pages/Origin';
import { ShopProvider } from './context/ShopContext';

function App() {
  return (
    <ShopProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/origin" element={<Origin />} />
            <Route path="/search" element={<ProductGrid />} />
            <Route path="/collections/customer-service" element={<CustomerService />} />
            <Route path="/collections/:category" element={<ProductGrid />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ShopProvider>
  );
}

export default App;