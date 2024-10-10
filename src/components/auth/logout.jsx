import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify-icon/react";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Hapus token dari local storage atau session storage
    localStorage.removeItem("token");

    // Arahkan ke halaman login setelah log out
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="ms-3 btn"
      style={{
        color: "#226195",
        fontWeight: "bold",
        fontSize: "17px",
        lineHeight: "24px", // Sama dengan tinggi ikon
        display: "flex",
        alignItems: "center",
        padding: "8px 10px",
      }}
    >
      {/* <i className="bi bi-escape me-2"></i> */}
      <Icon
        icon="solar:logout-broken"
        width="24"
        height="24"
        className="me-2"
      />
      Log Out
    </button>
  );
};

export default Logout;
