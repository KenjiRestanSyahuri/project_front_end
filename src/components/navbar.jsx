import React from 'react';
import Logout from './logout'; // Mengimport komponen log out
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Menggunakan FontAwesome untuk ikon
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Ikon profil

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Menampilkan Gambar Logo dan Tulisan Dua Baris */}
        <div className="navbar-brand d-flex align-items-center">
          <img
            src="/Life_Cycle-01-1.png" // Path ke gambar logo yang dimasukkan
            alt="Logo"
            height="40"
            width="40"
            className="me-2"
          />
          <div>
            <h1 className="fs-5 text-primary m-0">FITZ</h1>
            <h2 className="fs-6 text-dark m-0">Integrated Service Operation Tool</h2>
          </div>
        </div>

        {/* Navbar Toggle untuk layar kecil */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Collapse */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            {/* Ikon Profil */}
            <li className="nav-item me-3">
              <FontAwesomeIcon icon={faUser} className="fs-4" /> {/* Ikon Profil */}
            </li>

            {/* Tombol Log Out */}
            <li className="nav-item">
              <Logout /> {/* Komponen Log Out */}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
