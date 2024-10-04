import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./navbar";
import TambahProject from "./tambahproject";
import EditProject from "./editproject";
import "./dashboard.css";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [currentGuid, setCurrentGuid] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [message, setMessage] = useState(""); // State untuk menampilkan pesan notifikasi

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${apiUrl}/projects`);
      setProjects(response.data);
      setMessage(""); // Reset pesan saat data berhasil diambil
    } catch (error) {
      console.error("Error fetching projects:", error);
      setMessage("Gagal memuat data proyek."); // Set pesan error
    }
  };

  const searchProjects = async () => {
    if (searchQuery) {
      try {
        const response = await axios.get(`${apiUrl}/projects/search?name=${searchQuery}`);
        setProjects(response.data);
      } catch (error) {
        console.error("Error searching projects:", error);
        setMessage("Gagal melakukan pencarian."); // Set pesan error
      }
    } else {
      fetchProjects();
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchProjects();
    }
  };

  const handleAddProject = (newProject) => {
    setProjects([...projects, newProject]);
    setMessage("Proyek berhasil ditambahkan."); // Set pesan sukses
  };

  const handleEditProject = (guid) => {
    setCurrentGuid(guid);
    setShowEditProject(true);
  };

  const handleProjectUpdated = (updatedProject) => {
    setProjects(projects.map((project) => (project.guid === updatedProject.guid ? updatedProject : project)));
    setMessage("Proyek berhasil diperbarui."); // Set pesan sukses
  };

  const handleDeleteProject = async (guid) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      try {
        await axios.delete(`${apiUrl}/projects/${guid}`);
        setProjects(projects.filter((project) => project.guid !== guid));
        setMessage("Proyek berhasil dihapus."); // Set pesan sukses
      } catch (error) {
        console.error("Error deleting project:", error);
        setMessage("Gagal menghapus proyek."); // Set pesan error
      }
    }
  };

  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar />
      <div className="container mt-3">
        <h2>List Project Terdaftar</h2>

        {/* Notifikasi Pesan */}
        {message && <div className="alert alert-info">{message}</div>}

        <div className="input-group mb-3 position-relative">
          <input
            type="text"
            className="form-control rounded-pill"
            placeholder="Cari project"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ paddingLeft: "30px", marginRight: "20px" }}
          />
          <button
            className="btn btn-primary rounded-pill"
            type="button"
            onClick={searchProjects}
            style={{ backgroundColor: "#226195", width: "80px" }}
          >
            Cari
          </button>

          <button
            className="ms-3 btn btn-success rounded-pill"
            onClick={() => setShowAddProject(true)}
          >
            Tambah Project
          </button>

          <i
            className="bi bi-search position-absolute"
            style={{
              left: "10px",
              top: "10px",
              fontSize: "20px",
              color: "#6c757d",
            }}
          ></i>
        </div>

        {showAddProject && (
          <TambahProject
            onClose={() => setShowAddProject(false)}
            onProjectAdded={handleAddProject}
          />
        )}

        {showEditProject && (
          <EditProject
            guid={currentGuid}
            onClose={() => setShowEditProject(false)}
            onProjectUpdated={handleProjectUpdated}
          />
        )}

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nama Projek</th>
              <th>Owner</th>
              <th>User</th>
              <th>Deskripsi</th>
              <th>Tanggal Mulai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.length > 0 ? (
              currentProjects.map((project) => (
                <tr key={project.guid}>
                  <td>
                    <Link to={`/project/${project.guid}`} className="text-decoration-none">
                      {project.name}
                    </Link>
                  </td>
                  <td>{project.owner}</td>
                  <td>{project.user}</td>
                  <td>{project.description}</td>
                  <td>{formatDate(project.startDate)}</td>
                  <td>
                    <button
                      className="btn btn btn-sm me-1 rounded-5"
                      onClick={() => handleEditProject(project.guid)}
                      style={{ width: "80px", backgroundColor: "#D4E6E8" }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm rounded-5"
                      onClick={() => handleDeleteProject(project.guid)}
                      style={{ backgroundColor: "#FF4545", width: "80px" }}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <nav>
          <ul className="pagination justify-content-center">
            {[...Array(Math.ceil(projects.length / itemsPerPage))].map((_, index) => (
              <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
