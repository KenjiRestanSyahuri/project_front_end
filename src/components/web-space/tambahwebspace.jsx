import React, { useState, useEffect } from "react";
import "./tambahwebspace.css";
import axios from "axios"; // Tambahkan axios untuk mengambil data dari API

function TambahWebSpace({ onClose, onWebSpaceAdded }) {
  const [webSpaceData, setWebSpaceData] = useState({
    host: "",
    url: "",
    directory: "",
    language: "",
  });
  
  const [hosts, setHosts] = useState([]); // State untuk menyimpan daftar host
  const apiUrl = import.meta.env.VITE_API_URL; // API URL     

  // Ambil daftar host dari API ketika komponen di-mount
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const projectGuid = localStorage.getItem("currentProjectGuid");
        const response = await axios.get(`${apiUrl}/host-webspace/by-project/${projectGuid}`);
        setHosts(response.data); // Simpan data host ke dalam state
      } catch (error) {
        console.error("Error fetching hosts:", error);
      }
    };

    fetchHosts();
  }, [apiUrl]);

  // Handle perubahan input
  const handleChange = (e) => {
    setWebSpaceData({
      ...webSpaceData,
      [e.target.name]: e.target.value,
    });
  };

  // Fungsi untuk POST data ke backend menggunakan fetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", webSpaceData); // Log data sebelum pengiriman
    if (webSpaceData.host && webSpaceData.url && webSpaceData.directory) {
      // Menyiapkan data untuk dikirim
      const dataToSend = {
        host: webSpaceData.host,
        url: webSpaceData.url,
        directory: webSpaceData.directory,
        language: webSpaceData.language,
        projectGuid: localStorage.getItem("currentProjectGuid"), // Mengambil projectGuid dari localStorage
      };

      console.log("Data to send to the server:", dataToSend); // Log data yang akan dikirim

      try {
        // Mengirim data ke server melalui POST request menggunakan fetch
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/web-spaces`, // Mengubah URL endpoint
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
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorResponse.message}`);
        }

        const result = await response.json();
        console.log("Response data from server:", result); // Log data yang diterima dari server

        onWebSpaceAdded(result); // Mengirim data web space yang berhasil disimpan ke parent component
        onClose(); // Tutup modal setelah web space berhasil ditambahkan
      } catch (error) {
        console.error("Error adding web space:", error.message); // Log kesalahan
      }
    } else {
      alert("Harap isi field wajib!"); // Validasi input wajib
    }
  };

  return (
    <div className="modal-backdrop d-flex justify-content-center align-items-center">
      <div className="modal-content p-4 rounded shadow">
        <div className="modal-header">
          <h2 className="h5">Tambah Web Space</h2>
          <button 
            className="btn-close ms-auto" 
            aria-label="Close" 
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', fontSize: '1.5rem' }} // Mengubah gaya tombol X
          >
            &times; {/* Simbol X untuk tombol tutup */}
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="host" className="form-label">Host</label>
              <select
                className="form-select"
                name="host"
                value={webSpaceData.host}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Host</option>
                {/* Render daftar host dari state */}
                {hosts.map((host) => (
                  <option key={host.guid} value={host.name}>
                    {host.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="url" className="form-label">URL</label>
              <input
                type="text"
                className="form-control"
                name="url"
                value={webSpaceData.url}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="directory" className="form-label">Directory</label>
              <input
                type="text"
                className="form-control"
                name="directory"
                value={webSpaceData.directory}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="language" className="form-label">Bahasa</label>
              <select
                className="form-select"
                name="language"
                value={webSpaceData.language}
                onChange={handleChange}
              >
                <option value="">Pilih Bahasa</option>
                <option value="NodeJS">NodeJS</option>
                <option value="Python">Python</option>
              </select>
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button type="submit" className="btn-primary rounded-pill px-4 w-100">
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TambahWebSpace;
