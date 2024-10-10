import React from "react";
import Logout from "../auth/logout"; // Mengimport komponen log out
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Menggunakan FontAwesome untuk ikon
import { faCircleUser } from "@fortawesome/free-solid-svg-icons"; // Ikon profil

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white"
      style={{ border: "1px solid #ddd" }}
    >
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
          {/* Tulisan hanya tampil di layar besar */}
          <div className="d-none d-lg-block">
            <h1 className="fs-5 text-primary m-0">FITZ</h1>
            <h2 className="fs-6 text-dark m-0">
              Integrated Service Operation Tool
            </h2>
          </div>
        </div>

        {/* Tombol Log Out untuk layar kecil */}
        <div className="d-lg-none ms-auto">
          <Logout /> {/* Komponen Log Out */}
        </div>

        {/* Menu Collapse untuk layar besar */}
        <div
          className="collapse navbar-collapse d-none d-lg-flex"
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto d-flex align-items-right">
            {/* Ikon Profil hanya tampil di layar besar */}
            <li className="nav-item me-1">
              <FontAwesomeIcon icon={faCircleUser} className="fs-1" />
            </li>

            {/* Tombol Log Out untuk layar besar */}
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
