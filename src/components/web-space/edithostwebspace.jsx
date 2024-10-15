import React, { useState, useEffect } from "react";
import axios from "axios";
import "./edithostwebspace.css";
import Swal from "sweetalert2"; // Import SweetAlert2

const EditHostWebSpace = ({ host, onClose, onHostUpdated }) => {
  const [hostData, setHostData] = useState({ ...host });
  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle perubahan input
  const handleChange = (e) => {
    setHostData({
      ...hostData,
      [e.target.name]: e.target.value,
    });
  };

  // Fungsi untuk memperbarui data host
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${apiUrl}/host-webspace/${host.guid}`,
        hostData
      );
      onHostUpdated(response.data); // Kirim data host yang telah diperbarui ke parent component
      // SweetAlert success notification
      Swal.fire({
        title: "Success",
        text: "Web space berhasil diperbarui!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#664343",
      });
      onClose(); // Tutup modal setelah host berhasil diperbarui
    } catch (error) {
      console.error("Error updating host:", error);
      // SweetAlert error notification
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui web space!",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#664343",
      });
    }
  };

  return (
    <div className="modal-backdrop d-flex justify-content-center align-items-center">
      <div className="modal-content p-4 rounded shadow">
        <div className="modal-header">
          <h2 className="h5">Edit Host</h2>
          <button
            className="btn-close ms-auto"
            aria-label="Close"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.5rem",
            }}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nama Host
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={hostData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="url" className="form-label">
                URL
              </label>
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
              <label htmlFor="ipAddress" className="form-label">
                IP Address
              </label>
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
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={hostData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={hostData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="os" className="form-label">
                OS
              </label>
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
              <label htmlFor="serverType" className="form-label">
                Jenis Server
              </label>
              <select
                className="form-select"
                name="serverType"
                value={hostData.serverType}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Jenis Server</option>
                <option value="Dedicated">Dedicated</option>
                <option value="VPS">VPS</option>
                <option value="Cloud">Cloud</option>
              </select>
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              style={{
                width: "80px",
                backgroundColor: "#664343",
                color: "#FFF0D1",
              }}
              type="submit"
              className="btn-primary rounded-pill px-4 w-100"
            >
              Perbarui
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHostWebSpace;
