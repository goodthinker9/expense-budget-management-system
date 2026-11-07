import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import ForCouples from '../pages/ForCouples';
import ForProfessionals from '../pages/ForProfessionals';
import Pricing from '../pages/Pricing';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Transaction from '../pages/Transaction';
import Category from '../pages/Category';
import Reports from '../pages/Reports';
import Budgets from '../pages/Budgets';
import Profile from '../pages/Profile';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/for-couples" element={<ForCouples />} />
        <Route path="/for-professionals" element={<ForProfessionals />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/category" element={<Category />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoute;
