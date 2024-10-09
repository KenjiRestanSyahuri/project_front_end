import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import "./editproject.css";

const EditProject = ({ guid, onClose, onProjectUpdated }) => {
  const [projectData, setProjectData] = useState(null); // State untuk menyimpan data proyek
  const [loading, setLoading] = useState(true); // State untuk loading

  const apiUrl = import.meta.env.VITE_API_URL; // Mengambil API_URL dari environment variables

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/projects/${guid}`); // Gunakan apiUrl di sini
        setProjectData(response.data); // Menyimpan data proyek yang diambil
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false); // Mengubah state loading setelah pengambilan data selesai
      }
    };

    fetchProjectData();
  }, [guid, apiUrl]); // Mengambil data proyek saat guid berubah

  const handleChange = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kirim data proyek yang telah diperbarui ke API
      await axios.put(`${apiUrl}/projects/${guid}`, projectData); // Gunakan apiUrl di sini
      onProjectUpdated(projectData); // Mengirim data proyek yang telah diperbarui ke parent component
      onClose(); // Menutup modal setelah memperbarui
    } catch (error) {
      console.error("Error updating project data:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Menampilkan loading saat data diambil
  }

  if (!projectData) {
    return <div>Error: Data project tidak ditemukan.</div>; // Menangani jika data tidak ada
  }

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="header">
          <div>
            <h2 className="h4">Edit Project</h2>
            <p className="text-muted small mb-0">Masukkan Detail Project</p>
          </div>
          <div className="close" onClick={onClose}>
            <FaTimes />
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
                value={projectData.startDate.substring(0, 10)} // Format tanggal YYYY-MM-DD
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
                value={projectData.lastUpdated.substring(0, 10)} // Format tanggal YYYY-MM-DD
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
                value={projectData.lastVersion} // Versi Terakhir
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
            <button type="submit" className="btn btn-primary rounded-pill px-4">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
