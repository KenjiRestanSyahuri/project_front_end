import React, { useState, useEffect } from "react";
import "./editstorage.css";
import Swal from "sweetalert2";

function EditStorage({ storage, onClose, onStorageUpdated }) {
  const [storageData, setStorageData] = useState({ ...storage });

  useEffect(() => {
    if (!storage.guid) {
      console.error("GUID is missing from the storage data:", storage);
    }
  }, [storage]);

  const handleChange = (e) => {
    setStorageData({
      ...storageData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with updated data:", storageData);

    if (!storageData.guid) {
      Swal.fire({
        title: "Error",
        text: "GUID tidak ditemukan, tidak dapat memperbarui storage!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/storages/${storageData.guid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(storageData),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorResponse.message}`
        );
      }

      // SweetAlert success notification
      Swal.fire({
        title: "Success",
        text: "Storage berhasil diperbarui!",
        icon: "success",
        confirmButtonText: "OK",
      });

      const result = await response.json();
      console.log("Updated storage data from server:", result);
      onStorageUpdated(result);
      onClose();
    } catch (error) {
      console.error("Error updating storage:", error.message);
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui storage!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="modal-backdrop d-flex justify-content-center align-items-center">
      <div className="modal-content p-4 rounded shadow">
        <div className="modal-header">
          <h2 className="h5">Edit Storage</h2>
          <button
            className="btn-close ms-auto"
            aria-label="Close"
            onClick={onClose}
          >
            &times;
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
                <option value="Nginx">Nginx</option>
                <option value="Apache">Apache</option>
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStorage;
