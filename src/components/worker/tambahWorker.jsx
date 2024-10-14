import React, { useState, useEffect } from "react";
import "./tambahWorker.css";
import axios from "axios";

function TambahWorker({ onClose, onWorkerAdded }) {
  const [workerData, setWorkerData] = useState({
    host: "",
    username: "",
    password: "",
    directoryName: "",
  });

  const [hosts, setHosts] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const projectGuid = sessionStorage.getItem("currentProjectGuid");
        const response = await axios.get(
          `${apiUrl}/host-worker/by-project/${projectGuid}`
        );
        setHosts(response.data);
      } catch (error) {
        console.error("Error fetching hosts:", error);
      }
    };

    fetchHosts();
  }, [apiUrl]);

  const handleChange = (e) => {
    setWorkerData({
      ...workerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", workerData);
    if (
      workerData.host &&
      workerData.username &&
      workerData.password &&
      workerData.directoryName
    ) {
      const dataToSend = {
        ...workerData,
        projectGuid: sessionStorage.getItem("currentProjectGuid"),
      };

      console.log("Data to send to the server:", dataToSend);

      try {
        const response = await fetch(`${apiUrl}/workers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

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
      alert("Harap isi semua field!");
    }
  };

  return (
    <div className="modal-backdrop d-flex justify-content-center align-items-center">
      <div className="modal-content p-4 rounded shadow">
        <div className="modal-header">
          <h2 className="h5">Tambah Worker</h2>
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
              <label htmlFor="host" className="form-label">
                Host
              </label>
              <select
                className="form-select"
                name="host"
                value={workerData.host}
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

export default TambahWorker;
