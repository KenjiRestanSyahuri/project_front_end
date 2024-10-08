import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './sidebar';
import Navbar from './navbar'; // Import Navbar
import 'bootstrap/dist/css/bootstrap.min.css';

const DetailProject = () => {
  const { guid } = useParams(); // Mengambil guid dari URL
  const [project, setProject] = useState(null); // State untuk menyimpan data proyek
  const [webSpaces, setWebSpaces] = useState([]); // State untuk data web spaces
  const apiUrl = import.meta.env.VITE_API_URL; // Mengambil API URL dari environment

  // Mengambil detail proyek berdasarkan projectGuid (guid dari URL)
  useEffect(() => {
    const fetchProjectDetails = async () => {
      console.log(`Fetching project details for GUID: ${guid}`); // Log GUID yang sedang diambil
      try {
        // Mengambil detail proyek
        const projectResponse = await axios.get(`${apiUrl}/projects/${guid}`);
        console.log('Project API Response:', projectResponse.data); // Log respons API untuk detail proyek

        if (projectResponse.data) {
          setProject(projectResponse.data); // Menyimpan data proyek ke state
          const projectGuid = projectResponse.data.guid; // Ambil projectGuid dari data proyek
          console.log(`Project GUID: ${projectGuid}`); // Log projectGuid yang digunakan untuk fetch web spaces

          // Mengambil web spaces berdasarkan projectGuid
          const webSpacesResponse = await axios.get(`${apiUrl}/web-spaces/by-project/${projectGuid}`);
          console.log('Web Spaces API Response:', webSpacesResponse.data); // Log respons API untuk web spaces

          setWebSpaces(webSpacesResponse.data.webSpaces || []); // Sesuaikan dengan struktur yang diterima
        } else {
          console.warn('No project data returned from API'); // Log peringatan jika tidak ada data proyek
        }
      } catch (error) {
        console.error("Error fetching project or web spaces:", error); // Log kesalahan jika terjadi
      }
    };

    fetchProjectDetails();
  }, [guid, apiUrl]);

  if (!project) {
    return <div>Loading...</div>; // Menampilkan loading saat data sedang diambil
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar /> {/* Menambahkan Navbar di sini */}

      <div className="d-flex flex-grow-1">
        <Sidebar />

        {/* Detail Project Content */}
        <div className="flex-grow-1 p-4 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Web Space untuk Proyek: {project.name}</h2> {/* Menampilkan nama proyek */}
            <button className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>Tambah Web Space
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Host</th>
                  <th>URL</th>
                  <th>Directory</th>
                  <th>Bahasa</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {webSpaces.length > 0 ? (
                  webSpaces.map((webSpace, index) => (
                    <tr key={index}>
                      <td>{webSpace.host}</td>
                      <td>
                        <a href={webSpace.url} target="_blank" rel="noopener noreferrer">
                          {webSpace.url}
                        </a>
                      </td>
                      <td>{webSpace.directory}</td>
                      <td>{webSpace.language}</td>
                      <td>
                        <button className="btn btn-success btn-sm me-2">Edit</button>
                        <button className="btn btn-danger btn-sm">Hapus</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">Tidak ada data web space</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProject;
