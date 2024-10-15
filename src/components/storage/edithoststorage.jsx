import React, { useState, useEffect } from "react";
import axios from "axios";
import "./edithoststorage.css";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert2

const EditHostStorage = ({ host, onClose, onHostUpdated }) => {
  const [hostData, setHostData] = useState({ ...host });
  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle perubahan input
  const handleChange = (e) => {
    setHostData({
      ...hostData,
      [e.target.name]: e.target.value,
    });
  };

  // Fungsi untuk memperbarui data host storage
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${apiUrl}/host-storage/${host.guid}`,
        hostData
      );
      onHostUpdated(response.data); // Kirim data host yang telah diperbarui ke parent component
      // SweetAlert success notification
      Swal.fire({
        title: "Success",
        text: "Host storage berhasil diperbarui!",
        icon: "success",
        confirmButtonText: "OK",
      });
      onClose(); // Tutup modal setelah host storage berhasil diperbarui
    } catch (error) {
      console.error("Error updating host storage:", error);
      // SweetAlert error notification
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui host storage!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
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
          <FaTimes />
        </button>
        <div className="modal-header">
          <div>
            <h2 className="h5">Edit Host Storage</h2>
            <p className="text-muted small">
              Masukkan Detail Host Storage Untuk Perbarui Data
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Host
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
                type="text"
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
              <label htmlFor="ftpType" className="form-label">
                Jenis FTP Server
              </label>
              <select
                className="form-select"
                name="ftpType"
                value={hostData.ftpType}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Jenis FTP Server</option>
                <option value="ProFTPD">ProFTPD</option>
                <option value="vsftpd">vsftpd</option>
                <option value="Pure-FTPd">Pure-FTPd</option>
              </select>
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4 w-100"
              style={{ color: "#FFF0D1" }}
            >
              Perbarui
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHostStorage;
