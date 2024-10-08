import React from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link and useNavigate from react-router-dom
import { DashboardIcon } from "@radix-ui/react-icons"; // Import the Dashboard icon from Radix Icons
import { Data } from "akar-icons"; // Import the Data icon from Akar Icons
import { FaDatabase, FaClipboardCheck } from "react-icons/fa"; // Import the Database and Clipboard Check icons from react-icons
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
//import { IconDeviceTv } from '@tabler/icons-react';
import { LogoutBroken } from 'solar-icons'; // Import the Logout Broken icon from Solar Icons

const Sidebar = () => {
  const navigate = useNavigate(); // Gunakan useNavigate untuk navigasi

  const sidebarStyle = {
    minWidth: '250px',
    height: '100vh',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
  };

  const linkStyle = {
    color: '#1B1B1B',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 300,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px', // Uniform padding for all menu items
    borderRadius: '4px', // Optional: Add some border radius for hover effect
    transition: 'background-color 0.2s ease', // Smooth background transition on hover
    fontSize: '14px', // Set a consistent font size for the icons
  };

  const iconStyle = {
    width: '20px', // Set a consistent width for icons
    height: '20px', // Set a consistent height for icons
    marginRight: '10px', // Space between icon and text
    flexShrink: 0, // Prevents the icon from shrinking
    display: 'inline-flex', // Ensures consistent alignment with text
    alignItems: 'center', // Center align the icon
  };

  // Function to handle navigation back to the dashboard
  const handleBackToMenu = () => {
    console.log("Navigating back to Dashboard"); // Log for debugging
    navigate("/dashboard"); // Ganti history.push dengan navigate
  };

  return (
    <div style={sidebarStyle}>
      <div className="p-4">
        <ul className="list-unstyled">
          <li className="mb-3">
            <Link to="/webspace" style={linkStyle}> {/* Link to WebSpace page */}
              <DashboardIcon style={iconStyle} />
              Web Space
            </Link>
          </li>
          <li className="mb-3">
            <a href="#" style={linkStyle}>
              <Data style={iconStyle} /> {/* Use the Data icon from Akar Icons */}
              Database
            </a>
          </li>
          <li className="mb-3">
            <a href="#" style={linkStyle}>
              <FaDatabase style={iconStyle} /> {/* Use the Database icon from react-icons */}
              Storage
            </a>
          </li>
          <li className="mb-3">
            <a href="#" style={linkStyle}>
              {/* <IconDeviceTv stroke={2} style={iconStyle} /> */}
              Message Broker
            </a>
          </li>
          <li className="mb-3">
            <a href="#" style={linkStyle}>
              <FaClipboardCheck style={iconStyle} /> {/* Use the Clipboard Check icon as a substitute for License */}
              Worker
            </a>
          </li>
        </ul>
        <a 
          href="#" 
          style={{ ...linkStyle, color: 'blue' }} 
          className="mt-5" 
          onClick={handleBackToMenu} // Call the function on click
        >
          <LogoutBroken style={{ ...iconStyle, transform: 'scaleX(-1)' }} /> Kembali Ke Menu {/* Mirrored icon */}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
