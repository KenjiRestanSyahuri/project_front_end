// src/components/Sidebar.jsx
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Sidebar = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-white shadow-lg" style={{ width: '20%', height: '100vh' }}>
        <div className="p-4">
          <div className="d-flex align-items-center mb-4">
            <div
              className="rounded-circle bg-secondary"
              style={{ width: '40px', height: '40px' }}
            ></div>
            <div className="ms-3">
              <h1 className="h5 fw-bold">FITZ</h1>
              <p className="text-muted small">Integrated Service Operation Tool</p>
            </div>
          </div>
          <ul className="list-unstyled">
            <li className="mb-3">
              <a href="#" className="text-primary">Web Space</a>
            </li>
            <li className="mb-3">
              <a href="#" className="text-dark">Database</a>
            </li>
            <li className="mb-3">
              <a href="#" className="text-dark">Storage</a>
            </li>
            <li className="mb-3">
              <a href="#" className="text-dark">Msg Broker</a>
            </li>
            <li className="mb-3">
              <a href="#" className="text-dark">Worker</a>
            </li>
          </ul>
          <a href="#" className="text-primary d-flex align-items-center mt-5">
            <i className="fas fa-arrow-left me-2"></i> Kembali Ke Menu
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
