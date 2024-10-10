import React, { useState } from "react";
import axios from "axios";
import "./editHostWorker.css";
import Swal from "sweetalert2";

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
      });
      onClose();
    } catch (error) {
      console.error("Error updating worker:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui worker!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="modal-backdrop d-flex justify-content-center align-items-center">
      <div className="modal-content p-4 rounded shadow">
        <div className="modal-header">
          <h2 className="h5">Edit Worker</h2>
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
                Nama Worker
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
              <label htmlFor="port" className="form-label">
                Port
              </label>
              <input
                type="text"
                className="form-control"
                name="port"
                value={workerData.port}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                className="form-select"
                name="status"
                value={workerData.status}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="workerType" className="form-label">
                Jenis Worker
              </label>
              <select
                className="form-select"
                name="workerType"
                value={workerData.workerType}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Jenis Worker</option>
                <option value="Processing">Processing</option>
                <option value="Storage">Storage</option>
                <option value="Network">Network</option>
              </select>
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
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
