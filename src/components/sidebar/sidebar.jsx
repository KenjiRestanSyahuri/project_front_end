import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Tambahkan useLocation
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  IconLayoutDashboard,
  IconDatabase,
  IconServer,
  IconDeviceTv,
  IconLicense,
} from "@tabler/icons-react";
import { LogoutBroken } from "solar-icons";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Gunakan useLocation untuk mendapatkan path saat ini

  const sidebarStyle = {
    minWidth: "250px",
    height: "100vh",
    backgroundColor: "white",
  };

  const linkStyle = {
    color: "#1B1B1B",
    fontFamily: "Roboto, sans-serif",
    fontWeight: 300,
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    borderRadius: "4px",
    transition: "background-color 0.2s ease",
    fontSize: "14px",
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: "#AFD0ED", // Warna background saat aktif
    color: "black", // Warna teks saat aktif
  };

  const iconStyle = {
    width: "20px",
    height: "20px",
    marginRight: "10px",
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
  };

  const handleBackToMenu = () => {
    console.log("Navigating back to Dashboard");
    navigate("/dashboard");
  };

  return (
    <div style={sidebarStyle}>
      <div className="p-4">
        <ul className="list-unstyled">
          <li className="mb-3">
            <Link
              to="/webspace"
              style={
                location.pathname === "/webspace" ? activeLinkStyle : linkStyle
              } 
            >
              <IconLayoutDashboard style={iconStyle} />
              Web Space
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/database"
              style={
                location.pathname === "/database" ? activeLinkStyle : linkStyle
              } // Cek jika path aktif adalah "/database"
            >
              <IconDatabase style={iconStyle} />
              Database
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/storage"
              style={
                location.pathname === "/storage" ? activeLinkStyle : linkStyle
              } // Cek jika path aktif adalah "/storage"
            >
              <IconServer style={iconStyle} />
              Storage
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/messagebroker"
              style={
                location.pathname === "/messagebroker"
                  ? activeLinkStyle
                  : linkStyle
              } // Cek jika path aktif adalah "/message-broker"
            >
              <IconDeviceTv stroke={2} style={iconStyle} />
              Message Broker
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/worker"
              style={
                location.pathname === "/worker" ? activeLinkStyle : linkStyle
              } // Cek jika path aktif adalah "/worker"
            >
              <IconLicense style={iconStyle} />
              Worker
            </Link>
          </li>
        </ul>
        <a
          href="#"
          style={{ ...linkStyle, color: "blue" }}
          className="mt-1"
          onClick={handleBackToMenu}
        >
          <LogoutBroken style={{ ...iconStyle, transform: "scaleX(-1)" }} />
          Kembali Ke Menu
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
