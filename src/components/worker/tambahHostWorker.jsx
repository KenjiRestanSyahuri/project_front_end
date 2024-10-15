import React, { useState } from "react";
import "./tambahhostworker.css";
import { FaTimes } from "react-icons/fa";


function TambahHostWorker({ onClose, onWorkerAdded }) {
  const [workerData, setWorkerData] = useState({
    name: "",
    url: "",
    ipAddress: "",
    username: "",
    password: "",
    os: "",
    language: "",
    processManager: "",
    directoryName: "",
  });

  const currentProjectGuid = sessionStorage.getItem("currentProjectGuid");

  const handleChange = (e) => {
    setWorkerData({
      ...workerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", workerData);

    if (!currentProjectGuid || typeof currentProjectGuid !== "string") {
      alert("currentProjectGuid tidak valid! Harap hubungi administrator.");
      return;
    }

    if (workerData.name && workerData.ipAddress) {
      const dataToSend = {
        projectGuid: currentProjectGuid,
        ...workerData,
      };

      console.log("Data to send to the server:", dataToSend);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/host-worker`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorResponse.message}`
          );
        }

        const result = await response.json();
        console.log("Response data from server:", result);

        onWorkerAdded(result);
        onClose();
      } catch (error) {
        console.error("Error adding worker:", error.message);
      }
    } else {
      alert("Harap isi field wajib!");
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
            <h2 className="h5">Tambah Host Worker</h2>
            <p className="text-muted small">
              Masukkan Detail Host Worker Untuk Menambahkan
            </p>
          </div>
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
              <label htmlFor="url" className="form-label">
                URL
              </label>
              <input
                type="text"
                className="form-control"
                name="url"
                value={workerData.url}
                onChange={handleChange}
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
                value={workerData.password}
                onChange={handleChange}
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
              >
                <option value="">Pilih OS</option>
                <option value="Windows">Windows</option>
                <option value="Linux">Linux</option>
                <option value="macOS">macOS</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="language" className="form-label">
                Language
              </label>
              <input
                type="text"
                className="form-control"
                name="language"
                value={workerData.language}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="processManager" className="form-label">
                Process Manager
              </label>
              <select
                type="text"
                className="form-select"
                name="processManager"
                value={workerData.processManager}
                onChange={handleChange}
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
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TambahHostWorker;
