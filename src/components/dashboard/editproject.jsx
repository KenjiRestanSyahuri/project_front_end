import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { TailSpin } from "react-loader-spinner"; // Import TailSpin dari react-loader-spinner
import "./editproject.css";

const EditProject = ({ guid, onClose, onProjectUpdated }) => {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/projects/${guid}`);
        setProjectData(response.data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false); // Mengubah state loading setelah pengambilan data selesai
      }
    };

    fetchProjectData();
  }, [guid, apiUrl]);

  const handleChange = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/projects/${guid}`, projectData);
      onProjectUpdated(projectData);
      onClose();
    } catch (error) {
      console.error("Error updating project data:", error);
    }
  };

  // Ganti teks Loading dengan TailSpin
  if (loading) {
    return (
      <div className="modal-container">
        <div className="spinner-overlay">
          <TailSpin
            height="60"
            width="60"
            color="#664343"
            ariaLabel="loading"
          />
        </div>
      </div>
    );
  }

  if (!projectData) {
    return <div>Error: Data project tidak ditemukan.</div>;
  }

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
        <div className="header">
          <div>
            <h2 className="h5">Edit Project</h2>
            <p className="text-muted small mb-0">
              Masukkan Detail Project Untuk Perbarui Data
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Kolom Nama Projek dan Owner */}
          <div className="form-group row mb-3">
            <div className="col">
              <input
                type="text"
                name="name"
                value={projectData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Nama Projek"
                required
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="owner"
                value={projectData.owner}
                onChange={handleChange}
                className="form-control"
                placeholder="Owner"
                required
              />
            </div>
          </div>

          {/* Kolom Tanggal Mulai dan Pembaharuan Terakhir */}
          <div className="form-group row mb-3">
            <div className="col">
              <input
                type="text"
                name="startDate"
                value={projectData.startDate.substring(0, 10)}
                onChange={handleChange}
                className="form-control"
                placeholder="Tanggal Mulai"
                required
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="lastUpdated"
                value={projectData.lastUpdated.substring(0, 10)}
                onChange={handleChange}
                className="form-control"
                placeholder="Pembaharuan Terakhir"
                required
              />
            </div>
          </div>

          {/* Kolom User dan Versi Terakhir */}
          <div className="form-group row mb-3">
            <div className="col">
              <input
                type="text"
                name="user"
                value={projectData.user}
                onChange={handleChange}
                className="form-control"
                placeholder="User"
                required
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="lastVersion"
                value={projectData.lastVersion}
                onChange={handleChange}
                className="form-control"
                placeholder="Versi Terakhir"
                required
              />
            </div>
          </div>

          {/* Kolom Git Repository */}
          <div className="form-group mb-3">
            <input
              type="text"
              name="gitRepository"
              value={projectData.gitRepository}
              onChange={handleChange}
              className="form-control"
              placeholder="Git Repository"
            />
          </div>

          {/* Kolom URL Frontend dan Backend */}
          <div className="form-group row mb-3">
            <div className="col">
              <input
                type="text"
                name="frontendUrl"
                value={projectData.frontendUrl}
                onChange={handleChange}
                className="form-control"
                placeholder="URL Frontend"
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="backendUrl"
                value={projectData.backendUrl}
                onChange={handleChange}
                className="form-control"
                placeholder="URL Backend"
              />
            </div>
          </div>

          {/* Kolom Aplikasi Android dan iOS */}
          <div className="form-group row mb-3">
            <div className="col">
              <input
                type="text"
                name="androidAppLink"
                value={projectData.androidAppLink}
                onChange={handleChange}
                className="form-control"
                placeholder="Aplikasi Android"
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="iosAppLink"
                value={projectData.iosAppLink}
                onChange={handleChange}
                className="form-control"
                placeholder="Aplikasi iOS"
              />
            </div>
          </div>

          {/* Kolom Aplikasi Windows dan Mac */}
          <div className="form-group row mb-3">
            <div className="col">
              <input
                type="text"
                name="windowsAppLink"
                value={projectData.windowsAppLink}
                onChange={handleChange}
                className="form-control"
                placeholder="Aplikasi Windows"
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="macAppLink"
                value={projectData.macAppLink}
                onChange={handleChange}
                className="form-control"
                placeholder="Aplikasi Mac"
              />
            </div>
          </div>

          {/* Kolom Deskripsi */}
          <div className="form-group mb-3">
            <textarea
              name="description"
              value={projectData.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Deskripsi"
              rows="3"
            ></textarea>
          </div>

          {/* Tombol Update */}
          <div className="button-container">
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4"
              style={{ color: "#FFF0D1" }}
            >
              Perbarui
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
