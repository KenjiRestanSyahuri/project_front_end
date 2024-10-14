import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import "./tambahdatabase.css";

function TambahDatabase({ onClose, onDatabaseAdded }) {
  const [databaseData, setDatabaseData] = useState({
    host: "",
    username: "",
    password: "",
    databaseName: "",
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
    setDatabaseData({
      ...databaseData,
      [e.target.name]: e.target.value,
    });
  };

  // Fungsi untuk POST data ke backend menggunakan fetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", databaseData); // Log data sebelum pengiriman
    if (databaseData.host && databaseData.username && databaseData.password) {
      // Menyiapkan data untuk dikirim
      const dataToSend = {
        host: databaseData.host,
        username: databaseData.username,
        password: databaseData.password,
        databaseName: databaseData.databaseName,
        projectGuid: sessionStorage.getItem("currentProjectGuid"), 
      };

      console.log("Data to send to the server:", dataToSend); // Log data yang akan dikirim

      try {
        // Mengirim data ke server melalui POST request menggunakan fetch
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/databases`, // Mengubah URL endpoint
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
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorResponse.message}`
          );
        }

        const result = await response.json();
        console.log("Response data from server:", result); // Log data yang diterima dari server

        onDatabaseAdded(result); // Mengirim data database yang berhasil disimpan ke parent component
        onClose(); // Tutup modal setelah database berhasil ditambahkan
      } catch (error) {
        console.error("Error adding database:", error.message); // Log kesalahan
      }
    } else {
      alert("Harap isi field wajib!"); // Validasi input wajib
    }
  };

  return (
    <div className="modal-backdrop d-flex justify-content-center align-items-center">
      <div className="modal-content p-4 rounded shadow">
        <div className="modal-header">
          <div>
            <h2 className="h2">Tambah Database</h2>
            <p className="text-muted small">
              Masukkan Detail Database Untuk Menambahkan
            </p>
          </div>
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
              <label htmlFor="Password" className="form-label">
                Password
              </label>
              <input
                type="text"
                className="form-control"
                name="password"
                value={databaseData.password}
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

export default TambahDatabase;
