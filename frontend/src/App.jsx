import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import { Toaster } from './components/Toast.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import SuccessPage from './pages/SuccessPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AdminLogin from './admin/AdminLogin.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import AdminRoute from './admin/AdminRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

export default function App() {
  return (
    <Toaster>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="*"
          element={
            <>
              <Header />
              <CartDrawer />
              <main className="site-main">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/produits" element={<ProductsPage />} />
                  <Route path="/produit/:id" element={<ProductDetailPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/commande" element={<CheckoutPage />} />
                  <Route path="/merci/:orderId" element={<SuccessPage />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </Toaster>
  );
}
