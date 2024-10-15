import React, { useState } from "react";
import "./editWorker.css";
import Swal from "sweetalert2";

function EditWorker({ worker, onClose, onWorkerUpdated }) {
  const [workerData, setWorkerData] = useState({ ...worker });

  const handleChange = (e) => {
    setWorkerData({
      ...workerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with updated data:", workerData);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/workers/${worker.guid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workerData),
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
        text: "Worker berhasil diperbarui!",
        icon: "success",
        confirmButtonText: "OK",
      });

      const result = await response.json();
      console.log("Updated worker data from server:", result);
      onWorkerUpdated(result);
      onClose();
    } catch (error) {
      console.error("Error updating worker:", error.message);
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
              <input
                type="text"
                className="form-control"
                name="host"
                value={workerData.host}
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
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={workerData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="directoryName" className="form-label">
                Directory
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditWorker;
