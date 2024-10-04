import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Hapus token dari local storage atau session storage
    localStorage.removeItem('token');

    // Arahkan ke halaman login setelah log out
    navigate('/');
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Log Out
    </button>
  );
};

export default Logout;
