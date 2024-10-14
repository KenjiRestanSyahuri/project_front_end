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
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Nama Project"
                  value={projectData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  name="owner"
                  placeholder="Owner"
                  value={projectData.owner}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Baris untuk Tanggal Mulai dan Pembaruan Terakhir */}
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

            {/* Baris untuk Tanggal Mulai dan Pembaruan Terakhir */}
            <div className="row mb-3">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  name="user"
                  placeholder="User"
                  value={projectData.user}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  name="lastVersion"
                  placeholder="Versi Terakhir"
                  value={projectData.lastVersion}
                  onChange={handleChange}
                />
              </div>
            </div>

            <input
              type="text"
              className="form-control mb-3"
              name="gitRepository"
              placeholder="Git Repository"
              value={projectData.gitRepository}
              onChange={handleChange}
            />
            <div className="row mb-3">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  name="frontendUrl"
                  placeholder="URL Frontend"
                  value={projectData.frontendUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  name="backendUrl"
                  placeholder="URL Backend"
                  value={projectData.backendUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  name="androidAppLink"
                  placeholder="Aplikasi Android"
                  value={projectData.androidAppLink}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  name="iosAppLink"
                  placeholder="Aplikasi IOS"
                  value={projectData.iosAppLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  name="windowsAppLink"
                  placeholder="Aplikasi Windows"
                  value={projectData.windowsAppLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  name="macAppLink"
                  placeholder="Aplikasi Mac"
                  value={projectData.macAppLink}
                  onChange={handleChange}
                />
              </div>
            </div>
            <textarea
              className="form-control mb-3"
              name="description"
              placeholder="Deskripsi"
              rows="3"
              value={projectData.description}
              onChange={handleChange}
            />
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              type="submit"
              className="btn-primary rounded-pill px-4 w-100"
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
