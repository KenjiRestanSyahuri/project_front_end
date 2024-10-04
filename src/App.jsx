import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import LupaPassword from './components/lupapassword';
import Dashboard from './components/dashboard';
import ProtectedRoute from './components/protectedroute';
import NotFound from './components/notfound';
import Sidebar from './components/sidebar';
import DetailProject from './components/detailProject';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/lupapassword" element={<LupaPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/project/:guid" element={<DetailProject />} />
        <Route path="*" element={<NotFound />} /> {/* Route fallback */}
      </Routes>
    </Router>
  );
};

export default App;
