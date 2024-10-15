import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

function EditDatabase({ database, onClose, onDatabaseUpdated }) {
  const [databaseData, setDatabaseData] = useState({ ...database });
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "host") {
      const selectedHost = hosts.find((host) => host.name === value);
      const hostGuid = selectedHost ? selectedHost.guid : "";

      setDatabaseData({
        ...databaseData,
        host: value,
        hostGuid, // Set hostGuid yang sesuai
      });
    } else {
      setDatabaseData({
        ...databaseData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/databases/${database.guid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(databaseData),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorResponse.message}`
        );
      }

      Swal.fire({
        title: "Success",
        text: "Database berhasil diperbarui!",
        icon: "success",
        confirmButtonText: "OK",
      });

      const result = await response.json();
      onDatabaseUpdated(result);
      onClose();
    } catch (error) {
      console.error("Error updating database:", error.message);
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui database!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="modal-backdrop d-flex justify-content-center align-items-center">
      <div className="modal-content p-4 rounded shadow">
        <div className="modal-header">
          <div>
            <h2 className="h5">Edit Database</h2>
            <p className="text-muted small">
              Masukkan Detail Database Untuk Perbarui Data
            </p>
          </div>
          <button
            className="btn-close ms-auto"
            aria-label="Close"
            onClick={onClose}
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
              <label htmlFor="password" className="form-label">
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
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDatabase;
