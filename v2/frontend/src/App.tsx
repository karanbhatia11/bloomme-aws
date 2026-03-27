import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Plans from './pages/Plans';
import DeliveryCustomization from './pages/DeliveryCustomization';
import Address from './pages/Address';
import AddOns from './pages/AddOns';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Legal from './pages/Legal';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';
import FlowerShower from './components/FlowerShower';
import { CheckoutProvider } from './contexts/CheckoutContext';
import { AddOnsCheckoutProvider } from './contexts/AddOnsCheckoutContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { CheckoutRoutes } from './pages/Checkout';
import { AddOnsRoutes } from './pages/addons';
import { DashboardRoutes } from './pages/dashboard';
import './styles/App.css';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <CheckoutProvider>
        <AddOnsCheckoutProvider>
          <DashboardProvider>
            <div className="app">
              <FlowerShower />
              <SiteHeader />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {/* Old routes (keep for backward compatibility) */}
                <Route path="/plans-old" element={<Plans />} />
                <Route path="/delivery-old" element={<DeliveryCustomization />} />
                <Route path="/address-old" element={<Address />} />
                <Route path="/addons-old" element={<AddOns />} />
                <Route path="/payment-old" element={<Payment />} />
                <Route path="/success-old" element={<OrderSuccess />} />
                {/* New checkout flow routes */}
                <Route path="/checkout/*" element={<CheckoutRoutes />} />
                {/* Add-ons checkout flow routes */}
                <Route path="/addons/*" element={<AddOnsRoutes />} />
                {/* New dashboard routes */}
                <Route path="/dashboard/*" element={<DashboardRoutes />} />
                {/* Legacy dashboard route (redirect) */}
                <Route path="/dashboard-old" element={<Dashboard />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
              </Routes>
              <SiteFooter />
            </div>
          </DashboardProvider>
        </AddOnsCheckoutProvider>
      </CheckoutProvider>
    </Router>
  );
}

export default App;
