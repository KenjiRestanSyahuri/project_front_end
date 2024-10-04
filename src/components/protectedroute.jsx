import React from 'react';
import { Navigate } from 'react-router-dom';

// Komponen untuk melindungi rute
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Cek token di Local Storage

  if (!token) {
    // Jika tidak ada token, alihkan ke halaman login
    return <Navigate to="/" />;
  }

  return children; // Jika ada token, tampilkan anak komponen
};

export default ProtectedRoute;
