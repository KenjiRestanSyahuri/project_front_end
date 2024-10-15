import React, { useState } from "react";
import "./tambahproject.css";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

function TambahProject({ onClose, onProjectAdded }) {
  const [projectData, setProjectData] = useState({
    name: "",
    owner: "",
    startDate: "",
    user: "",
    lastVersion: "",
    lastUpdated: "",
    gitRepository: "",
    frontendUrl: "",
    backendUrl: "",
    androidAppLink: "",
    iosAppLink: "",
    windowsAppLink: "",
    macAppLink: "",
    description: "",
  });

  // Handle perubahan input
  const handleChange = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value,
    });
    console.log("Updated projectData:", {
      ...projectData,
      [e.target.name]: e.target.value,
    });
  };

  // Fungsi untuk POST data ke backend menggunakan fetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting project data...");

    if (projectData.name && projectData.owner && projectData.startDate) {
      // Menyiapkan data untuk dikirim
      const dataToSend = {
        name: projectData.name,
        owner: projectData.owner,
        startDate: projectData.startDate,
        lastUpdated: new Date().toISOString(), // Format untuk tanggal pembaruan
        user: projectData.user,
        lastVersion: projectData.lastVersion,
        gitRepository: projectData.gitRepository,
        frontendUrl: projectData.frontendUrl,
        backendUrl: projectData.backendUrl,
        androidAppLink: projectData.androidAppLink,
        iosAppLink: projectData.iosAppLink,
        windowsAppLink: projectData.windowsAppLink,
        macAppLink: projectData.macAppLink,
        description: projectData.description,
      };

      console.log("Data to send:", dataToSend); // Log data yang akan dikirim

      try {
        // Mengirim data ke server melalui POST request menggunakan fetch
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/projects`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Project added:", result);
        onProjectAdded(result); // Mengirim data project yang berhasil disimpan ke parent component
        onClose(); // Tutup modal setelah project berhasil ditambahkan

        // Tampilkan SweetAlert sukses
        Swal.fire({
          icon: "success",
          title: "Project Ditambahkan",
          text: "Project berhasil ditambahkan ke database",
          timer: 3000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error adding project:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        } else if (error.request) {
          console.error("Request data:", error.request);
        } else {
          console.error("Error message:", error.message);
        }

        // Tampilkan SweetAlert error
        Swal.fire({
          icon: "error",
          title: "Terjadi Kesalahan",
          text: "Gagal menambahkan project. Silakan coba lagi.",
        });
      }
    } else {
      // Validasi input wajib dengan SweetAlert
      Swal.fire({
        icon: "warning",
        title: "Field Wajib Kosong",
        text: "Harap isi semua field yang wajib diisi!",
      });
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
            <h2 className="h2">Tambah Project</h2>
            <p className="text-muted small">Masukkan Detail Project</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col">
                <div className="form-group"></div>
                <label htmlFor="name" className="form-label">
                  Nama Project
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={projectData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="owner" className="form-label">
                  Owner
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="owner"
                  value={projectData.owner}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="startDate" className="form-label">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={projectData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="lastUpdated" className="form-label">
                  Pembaruan Terakhir
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="lastUpdated"
                  value={projectData.lastUpdated}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="user" className="form-label">
                  User
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="user"
                  value={projectData.user}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label htmlFor="lastVersion" className="form-label">
                  Versi Terakhir
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="lastVersion"
                  value={projectData.lastVersion}
                  onChange={handleChange}
                />
              </div>
            </div>
            <label htmlFor="gitRepository" className="form-label">
              Git Repository
            </label>
            <input
              type="text"
              className="form-control mb-3"
              name="gitRepository"
              value={projectData.gitRepository}
              onChange={handleChange}
            />
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="frontendUrl" className="form-label">
                  URL Frontend
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="frontendUrl"
                  value={projectData.frontendUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label htmlFor="backendUrl" className="form-label">
                  URL Backend
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="backendUrl"
                  value={projectData.backendUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label htmlFor="androidAppLink" className="form-label">
                  Aplikasi Android
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="androidAppLink"
                  value={projectData.androidAppLink}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="iosAppLink" className="form-label">
                  Aplikasi IOS
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="iosAppLink"
                  value={projectData.iosAppLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label htmlFor="windowsAppLink" className="form-label">
                  Aplikasi Windows
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="windowsAppLink"
                  value={projectData.windowsAppLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label htmlFor="macAppLink" className="form-label">
                  Aplikasi Mac
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="macAppLink"
                  value={projectData.macAppLink}
                  onChange={handleChange}
                />
              </div>
            </div>
            <label htmlFor="description" className="form-label">
              Deskripsi
            </label>
            <textarea
              className="form-control mb-3"
              name="description"
              rows="3"
              value={projectData.description}
              onChange={handleChange}
            />
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

export default TambahProject;
