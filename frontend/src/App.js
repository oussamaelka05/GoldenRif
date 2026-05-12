import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import MyBookings from './pages/MyBookings';
import About from './pages/About';
import SpecialOffers from './pages/SpecialOffers';
import Locations from './pages/Locations';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import FAQ from './pages/FAQ';
import HelpCenter from './pages/HelpCenter';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import CookiePolicy from './pages/CookiePolicy';
import Cancellation from './pages/Cancellation';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import CustomerDashboard from './pages/CustomerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import MyCars from './pages/owner/MyCars';
import AddCar from './pages/owner/AddCar';
import EditCar from './pages/owner/EditCar';
import Bookings from './pages/owner/Bookings';
import Earnings from './pages/owner/Earnings';
import Offers from './pages/owner/Offers';
import AddOffer from './pages/owner/AddOffer';

const ProtectedOwnerRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'owner') return <Navigate to="/" replace />;
  return children;
};

const ProtectedCustomerRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'customer') return <Navigate to="/" replace />;
  return children;
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return children;
  return <Navigate to={user.role === 'owner' ? '/owner/dashboard' : '/'} replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/cars" element={<Cars />} />
    <Route path="/cars/:id" element={<CarDetail />} />
    <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
    <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/dashboard"   element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
    <Route path="/saved-cars"  element={<Navigate to="/my-bookings" replace />} />
    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
    <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
    <Route path="/owner/dashboard" element={<ProtectedOwnerRoute><OwnerDashboard /></ProtectedOwnerRoute>} />
    <Route path="/owner/cars" element={<ProtectedOwnerRoute><MyCars /></ProtectedOwnerRoute>} />
    <Route path="/owner/cars/add" element={<ProtectedOwnerRoute><AddCar /></ProtectedOwnerRoute>} />
    <Route path="/owner/cars/:id/edit" element={<ProtectedOwnerRoute><EditCar /></ProtectedOwnerRoute>} />
    <Route path="/owner/bookings" element={<ProtectedOwnerRoute><Bookings /></ProtectedOwnerRoute>} />
    <Route path="/owner/earnings" element={<ProtectedOwnerRoute><Earnings /></ProtectedOwnerRoute>} />
    <Route path="/owner/offers" element={<ProtectedOwnerRoute><Offers /></ProtectedOwnerRoute>} />
    <Route path="/owner/offers/add" element={<ProtectedOwnerRoute><AddOffer /></ProtectedOwnerRoute>} />
    <Route path="/about"          element={<About />} />
    <Route path="/special-offers" element={<SpecialOffers />} />
    <Route path="/locations"      element={<Locations />} />
    <Route path="/blog"           element={<Blog />} />
    <Route path="/blog/:slug"     element={<BlogPost />} />
    <Route path="/faq"            element={<FAQ />} />
    <Route path="/help"           element={<HelpCenter />} />
    <Route path="/terms"          element={<Terms />} />
    <Route path="/privacy"        element={<Privacy />} />
    <Route path="/cookies"        element={<CookiePolicy />} />
    <Route path="/cancellation"   element={<Cancellation />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
