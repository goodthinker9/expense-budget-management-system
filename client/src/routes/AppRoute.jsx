import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Transaction from '../pages/Transaction'
import Category from '../pages/Category'
import Profile from '../pages/Profile'
import MainLayout from '../layouts/MainLayout'
function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/category" element={<Category />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoute