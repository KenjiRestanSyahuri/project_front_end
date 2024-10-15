import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import "./tambahdatabase.css";

function TambahDatabase({ onClose, onDatabaseAdded }) {
  const [databaseData, setDatabaseData] = useState({
    hostGuid: "",
    host: "",
    username: "",
    databaseName: "",
    databaseType: "",
  });

  const [hosts, setHosts] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const projectGuid = sessionStorage.getItem("currentProjectGuid");
        const response = await axios.get(
          `${apiUrl}/host-database/by-project/${projectGuid}`
        );
        setHosts(response.data);
      } catch (error) {
        console.error("Error fetching hosts:", error);
      }
    };

    fetchHosts();
  }, [apiUrl]);

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "host") {
      // Dapatkan hostGuid dan databaseType berdasarkan host yang dipilih
      const selectedHost = hosts.find((host) => host.name === value);
      const hostGuid = selectedHost ? selectedHost.guid : "";
      const databaseType = selectedHost ? selectedHost.databaseType : ""; // Ambil tipe database dari host

      setDatabaseData({
        ...databaseData,
        host: value,
        hostGuid, // Set hostGuid yang sesuai
        databaseType, // Set databaseType yang sesuai
      });
    } else {
      setDatabaseData({
        ...databaseData,
        [name]: value,
      });
    }
  };

  // Fungsi untuk POST data ke backend menggunakan fetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", databaseData); // Log data sebelum pengiriman
    if (
      databaseData.host &&
      databaseData.username &&
      databaseData.databaseName
    ) {
      // Menyiapkan data untuk dikirim
      const dataToSend = {
        host: databaseData.host,
        hostGuid: databaseData.hostGuid,
        username: databaseData.username,
        databaseName: databaseData.databaseName,
        databaseType: databaseData.databaseType,
        projectGuid: sessionStorage.getItem("currentProjectGuid"),
      };

      console.log("Data to send to the server:", dataToSend); // Log data yang akan dikirim

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/databases`,
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

        onDatabaseAdded(result);
        onClose();
      } catch (error) {
        console.error("Error adding database:", error.message);
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
            <h2 className="h2">Tambah Database</h2>
            <p className="text-muted small">
              Masukkan Detail Database Untuk Menambahkan
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="host" className="form-label">
                Host
              </label>
              <select
                className="form-select"
                name="host"
                value={databaseData.host}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Host</option>
                {hosts.map((host) => (
                  <option key={host.guid} value={host.name}>
                    {host.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="databaseType" className="form-label">
                Tipe Database
              </label>
              <input
                type="text"
                className="form-control"
                name="databaseType"
                value={databaseData.databaseType}
                disabled
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
                value={databaseData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="databaseName" className="form-label">
                Nama Database
              </label>
              <input
                type="text"
                className="form-control"
                name="databaseName"
                value={databaseData.databaseName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              type="submit"
              className="btn-primary rounded-pill px-4 w-100"
              style={{ color: "#FFF0D1" }}
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TambahDatabase;
