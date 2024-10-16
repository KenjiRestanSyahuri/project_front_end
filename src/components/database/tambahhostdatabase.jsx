import React, { useState } from "react";
// import "./tambahhostwebspace.css";
import { FaTimes } from "react-icons/fa";

function TambahHostDatabase({ onClose, onHostAdded }) {
  const [hostData, setHostData] = useState({
    hostName: "",
    alamatHost: "",
    adminUsername: "",
    adminPassword: "",
    databaseType: "",
  });

  // Mengambil currentProjectGuid dari sessionStorage
  const currentProjectGuid = sessionStorage.getItem("currentProjectGuid");

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
    console.log("Form submitted with data:", hostData);

    // Validasi currentProjectGuid
    if (!currentProjectGuid || typeof currentProjectGuid !== "string") {
      alert("currentProjectGuid tidak valid! Harap hubungi administrator.");
      return;
    }

    if (hostData.hostName && hostData.alamatHost) {
      const dataToSend = {
        projectGuid: currentProjectGuid, // Gunakan currentProjectGuid dari sessionStorage
        name: hostData.hostName,
        alamatHost: hostData.alamatHost,
        adminUsername: hostData.adminUsername,
        adminPassword: hostData.adminPassword,
        databaseType: hostData.databaseType,
      };

      console.log("Data to send to the server:", dataToSend);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/host-database`,
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

        onHostAdded(result); // Kirim data host ke parent component
        onClose(); // Tutup modal setelah host berhasil ditambahkan
      } catch (error) {
        console.error("Error adding host:", error.message);
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
            <h2 className="h5">Tambah Host Database</h2>
            <p className="text-muted small">
              Masukkan Detail Host Database Untuk Menambahkan
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Field form sama seperti sebelumnya */}
            <div className="mb-3">
              <label htmlFor="hostName" className="form-label">
                Nama Host
              </label>
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
              <label htmlFor="alamatHost" className="form-label">
                Alamat Host
              </label>
              <input
                type="string"
                className="form-control"
                name="alamatHost"
                value={hostData.alamatHost}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="adminUsername" className="form-label">
                Admin Username
              </label>
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
              <label htmlFor="adminPassword" className="form-label">
                Admin Password
              </label>
              <input
                type="text"
                className="form-control"
                name="adminPassword"
                value={hostData.adminPassword}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="databaseType" className="form-label">
                Jenis Database Server
              </label>
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
                <option value="MariaDB">MariaDB</option>
                <option value="ArangooDB">ArangooDB</option>
                <option value="Neo4j">Neo4j</option>
              </select>
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

export default TambahHostDatabase;
