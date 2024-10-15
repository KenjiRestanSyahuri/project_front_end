import React, { useState } from "react";
import axios from "axios";
import "./editHostWorker.css";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";

const EditHostWorker = ({ worker, onClose, onWorkerUpdated }) => {
  const [workerData, setWorkerData] = useState({ ...worker });
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setWorkerData({
      ...workerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${apiUrl}/host-worker/${worker.guid}`,
        workerData
      );
      onWorkerUpdated(response.data);
      Swal.fire({
        title: "Success",
        text: "Worker berhasil diperbarui!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#795757",
      });
      onClose();
    } catch (error) {
      console.error("Error updating worker:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui worker!",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#795757",
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
            <h2 className="h5">Edit Host Worker</h2>
            <p className="text-muted small">
              Masukkan Detail Host Worker Untuk Perbarui Data
            </p>
          </div>
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
                value={workerData.name}
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
                value={workerData.url}
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
                value={workerData.ipAddress}
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
                value={workerData.username}
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
                value={workerData.os}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Windows</option>
                <option value="Windows">Windows</option>
                <option value="Linux">Linux</option>
                <option value="macOS">macOS</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="bahasa" className="form-label">
                Bahasa
              </label>
              <input
                type="text"
                className="form-control"
                name="bahasa"
                value={workerData.bahasa}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="processManager" className="form-label">
                Process Manager
              </label>
              <select
                className="form-select"
                name="processManager"
                value={workerData.processManager}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Process Manager</option>
                <option value="PM2">PM2</option>
                <option value="Systemd">Systemd</option>
                <option value="Windows">Windows</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="directoryName" className="form-label">
                Directory Name
              </label>
              <input
                type="text"
                className="form-control"
                name="directoryName"
                value={workerData.directoryName}
                onChange={handleChange}
                required
              />
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
              className="btn btn-primary rounded-pill px-4 w-100"
            >
              Perbarui
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHostWorker;
