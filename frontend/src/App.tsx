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
      <div className="app">
        <FlowerShower />
        <SiteHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/delivery" element={<DeliveryCustomization />} />
          <Route path="/address" element={<Address />} />
          <Route path="/addons" element={<AddOns />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        </Routes>
        <SiteFooter />
      </div>
    </Router>
  );
}

export default App;
