import React, { useState, useEffect } from "react";
import "./tambahstorage.css";
import axios from "axios";

function TambahStorage({ onClose, onStorageAdded }) {
  const [storageData, setStorageData] = useState({
    host: "",
    username: "",
    password: "",
    directoryName: "",
  });

  const [hosts, setHosts] = useState([]); // State untuk menyimpan daftar host
  const apiUrl = import.meta.env.VITE_API_URL;

  // Mengambil daftar host dari backend
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const projectGuid = sessionStorage.getItem("currentProjectGuid");
        const response = await axios.get(
          `${apiUrl}/host-storage/by-project/${projectGuid}`
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
    setStorageData({
      ...storageData,
      [e.target.name]: e.target.value,
    });
  };

  // Fungsi untuk POST data ke backend menggunakan fetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", storageData); // Log data sebelum pengiriman
    if (
      storageData.host &&
      storageData.username &&
      storageData.password &&
      storageData.directoryName
    ) {
      // Menyiapkan data untuk dikirim
      const dataToSend = {
        host: storageData.host,
        username: storageData.username,
        password: storageData.password,
        directoryName: storageData.directoryName,
        projectGuid: sessionStorage.getItem("currentProjectGuid"), // Mengambil projectGuid dari sessionStorage
      };

      console.log("Data to send to the server:", dataToSend); // Log data yang akan dikirim

      try {
        // Mengirim data ke server melalui POST request menggunakan fetch
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/storages`, // Mengubah URL endpoint
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

        onStorageAdded(result); // Mengirim data storage yang berhasil disimpan ke parent component
        onClose(); // Tutup modal setelah storage berhasil ditambahkan
      } catch (error) {
        console.error("Error adding storage:", error.message); // Log kesalahan
      }
    } else {
      alert("Harap isi semua field!"); // Validasi input wajib
    }
  };

  return (
    <div className="modal-backdrop d-flex justify-content-center align-items-center">
      <div className="modal-content p-4 rounded shadow">
        <div className="modal-header">
          <h2 className="h5">Tambah Storage</h2>
          <button
            className="btn-close ms-auto"
            aria-label="Close"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.5rem",
            }} // Mengubah gaya tombol X
          >
            &times; {/* Simbol X untuk tombol tutup */}
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
                value={storageData.host}
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
                value={storageData.username}
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
                value={storageData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="directoryName" className="form-label">
                Nama Directory
              </label>
              <input
                type="text"
                className="form-control"
                name="directoryName"
                value={storageData.directoryName}
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

export default TambahStorage;
