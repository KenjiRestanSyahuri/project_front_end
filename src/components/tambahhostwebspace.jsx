import React, { useState } from "react";
import "./tambahhostwebspace.css";

function TambahHostWebSpace({ onClose, onHostAdded }) {
  const [hostData, setHostData] = useState({
    hostName: "",
    url: "",
    ipAddress: "",
    adminUsername: "",
    adminPassword: "",
    os: "",
    databaseType: "",
  });

  // Handle perubahan input
  const handleChange = (e) => {
    setHostData({
      ...hostData,
      [e.target.name]: e.target.value,
    });
  };

  // Fungsi untuk POST data ke backend menggunakan fetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", hostData); // Log data sebelum pengiriman
    if (hostData.hostName && hostData.url && hostData.ipAddress) {
      // Menyiapkan data untuk dikirim
      const dataToSend = {
        hostName: hostData.hostName,
        url: hostData.url,
        ipAddress: hostData.ipAddress,
        adminUsername: hostData.adminUsername,
        adminPassword: hostData.adminPassword,
        os: hostData.os,
        databaseType: hostData.databaseType,
      };

      console.log("Data to send to the server:", dataToSend); // Log data yang akan dikirim

      try {
        // Mengirim data ke server melalui POST request menggunakan fetch
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/hosts`, // Ubah URL endpoint sesuai kebutuhan
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          }
        );

        console.log("Response status:", response.status); // Log status respons

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorResponse.message}`);
        }

        const result = await response.json();
        console.log("Response data from server:", result); // Log data yang diterima dari server

        onHostAdded(result); // Mengirim data host yang berhasil disimpan ke parent component
        onClose(); // Tutup modal setelah host berhasil ditambahkan
      } catch (error) {
        console.error("Error adding host:", error.message); // Log kesalahan
      }
    } else {
      alert("Harap isi field wajib!"); // Validasi input wajib
    }
  };

  return (
    <div className="modal-backdrop d-flex justify-content-center align-items-center">
      <div className="modal-content p-4 rounded shadow">
        <div className="modal-header">
          <h2 className="h5">Tambah Host</h2>
          <button 
            className="btn-close ms-auto" 
            aria-label="Close" 
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', fontSize: '1.5rem' }} // Mengubah gaya tombol X
          >
            &times; {/* Simbol X untuk tombol tutup */}
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="hostName" className="form-label">Nama Host</label>
              <input
                type="text"
                className="form-control"
                name="hostName"
                value={hostData.hostName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="url" className="form-label">URL</label>
              <input
                type="text"
                className="form-control"
                name="url"
                value={hostData.url}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="ipAddress" className="form-label">IP Address</label>
              <input
                type="text"
                className="form-control"
                name="ipAddress"
                value={hostData.ipAddress}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="adminUsername" className="form-label">Admin Username</label>
              <input
                type="text"
                className="form-control"
                name="adminUsername"
                value={hostData.adminUsername}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="adminPassword" className="form-label">Admin Password</label>
              <input
                type="password"
                className="form-control"
                name="adminPassword"
                value={hostData.adminPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="os" className="form-label">OS</label>
              <select
                className="form-select"
                name="os"
                value={hostData.os}
                onChange={handleChange}
                required
              >
                <option value="">Pilih OS</option>
                <option value="Windows">Windows</option>
                <option value="Linux">Linux</option>
                <option value="macOS">macOS</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="databaseType" className="form-label">Jenis Database Server</label>
              <select
                className="form-select"
                name="databaseType"
                value={hostData.databaseType}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Jenis Database</option>
                <option value="MySQL">MySQL</option>
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="MongoDB">MongoDB</option>
              </select>
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button type="submit" className="btn btn-primary rounded-pill px-4 w-100">
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TambahHostWebSpace;
