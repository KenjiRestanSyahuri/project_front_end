import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import TambahWebSpace from './tambahwebspace';
import EditWebSpace from './editwebspace';

const DetailProject = () => {
  const [project, setProject] = useState(null);
  const [webSpaces, setWebSpaces] = useState([]);
  const [showAddWebSpace, setShowAddWebSpace] = useState(false);
  const [showEditWebSpace, setShowEditWebSpace] = useState(false);
  const [currentWebSpace, setCurrentWebSpace] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectGuid = localStorage.getItem('currentProjectGuid');
        if (projectGuid) {
          const projectResponse = await axios.get(`${apiUrl}/projects/${projectGuid}`);
          setProject(projectResponse.data);

          const webSpacesResponse = await axios.get(`${apiUrl}/web-spaces/by-project/${projectGuid}`);
          setWebSpaces(webSpacesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching project or web spaces:", error);
      }
    };

    fetchProjectDetails();
  }, [apiUrl]);

  const handleAddHost = () => {
    navigate('/hostwebspace');
  };

  const handleAddWebSpace = (newWebSpace) => {
    setWebSpaces((prevWebSpaces) => [...prevWebSpaces, newWebSpace]);
    setShowAddWebSpace(false);
  };

  const handleEditWebSpace = (webSpace) => {
    setCurrentWebSpace(webSpace);
    setShowEditWebSpace(true);
  };

  const handleWebSpaceUpdated = (updatedWebSpace) => {
    setWebSpaces((prevWebSpaces) =>
      prevWebSpaces.map((webSpace) =>
        webSpace.guid === updatedWebSpace.guid ? updatedWebSpace : webSpace
      )
    );
    setShowEditWebSpace(false);
  };

  // Fungsi untuk menghapus web space
  const handleDeleteWebSpace = async (webSpace) => {
    const confirmDelete = window.confirm("Apakah anda yakin untuk menghapus data?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${apiUrl}/web-spaces/${webSpace.guid}`);
        if (response.status === 200) {
          setWebSpaces((prevWebSpaces) => prevWebSpaces.filter((ws) => ws.guid !== webSpace.guid));
          alert("Web space berhasil dihapus!");
        }
      } catch (error) {
        console.error("Error deleting web space:", error);
        alert("Gagal menghapus web space.");
      }
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="d-flex flex-grow-1">
        <Sidebar />

        <div className="flex-grow-1 p-4 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Web Space untuk Proyek: {project.name}</h2>
            <button className="btn btn-primary" onClick={handleAddHost}>
              <i className="fas fa-plus me-2"></i>Host
            </button>
            <button className="btn btn-primary" onClick={() => setShowAddWebSpace(true)}>
              <i className="fas fa-plus me-2"></i>Tambah Web Space
            </button>
          </div>

          {showAddWebSpace && (
            <TambahWebSpace
              onClose={() => setShowAddWebSpace(false)}
              onWebSpaceAdded={handleAddWebSpace}
            />
          )}

          {showEditWebSpace && (
            <EditWebSpace
              webSpace={currentWebSpace}
              onClose={() => setShowEditWebSpace(false)}
              onWebSpaceUpdated={handleWebSpaceUpdated}
            />
          )}

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
                  webSpaces.map((webSpace) => (
                    <tr key={webSpace.guid}>
                      <td>{webSpace.host}</td>
                      <td>
                        <a href={webSpace.url} target="_blank" rel="noopener noreferrer">
                          {webSpace.url}
                        </a>
                      </td>
                      <td>{webSpace.directory}</td>
                      <td>{webSpace.language}</td>
                      <td>
                        <button 
                          className="btn btn-success btn-sm me-2" 
                          onClick={() => handleEditWebSpace(webSpace)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => handleDeleteWebSpace(webSpace)} // Panggil handleDeleteWebSpace saat tombol diklik
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">Tidak ada web space yang tersedia</td>
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
