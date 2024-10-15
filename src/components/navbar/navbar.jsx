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
        {/* Logo dan Teks */}
        <div className="navbar-brand d-flex align-items-center">
          <img
            src="/public/logo_fitz.png"
            alt="Logo"
            height="42"
            width="46"
            className="me-2"
          />
          <div className="d-flex flex-column">
            <h1 className="fs-5 m-0" style={{ color: "#664343" }}>
              FITZ
            </h1>
            <h2
              className="fs-6 m-0 d-none d-lg-block"
              style={{ color: "#664343" }}
            >
              Integrated Service Operation Tool
            </h2>
          </div>
        </div>

        {/* Tombol Log Out untuk layar kecil */}
        <div className="d-lg-none ms-auto">
          <Logout /> {/* Komponen Log Out */}
        </div>

        {/* Menu Collapse untuk layar besar */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            {/* Ikon Profil hanya tampil di layar besar */}
            <li className="nav-item me-1 d-none d-lg-block">
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
