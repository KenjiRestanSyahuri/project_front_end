import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./navbar";
import TambahProject from "./tambahproject";
import EditProject from "./editproject";
import "./dashboard.css"; // Mengimpor CSS yang berisi style untuk modal
import "bootstrap-icons/font/bootstrap-icons.css";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const response = await axios.get(
          `${apiUrl}/projects/search?name=${searchQuery}`
        );
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
    setProjects(
      projects.map((project) =>
        project.guid === updatedProject.guid ? updatedProject : project
      )
    );
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
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

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
            className="bi bi-search form-control rounded-pill"
            placeholder="Cari project"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ paddingLeft: "40px", marginRight: "20px" }}
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
            className="ms-3 btn btn rounded-pill"
            onClick={() => setShowAddProject(true)}
            style={{ backgroundColor: "#fff", color: "#226195" }}
          >
            <i className="bi bi-plus-circle-fill me-2"></i>
            Tambah Project
          </button>

          <i
            className="bi bi-search position-absolute"
            style={{
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
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
              <th>Tanggal Mulai</th>
              <th>Aksi</th> 
              <th>Edit Terakhir</th>
              <th className="action-cell">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.length > 0 ? (
              currentProjects.map((project) => (
                <tr key={project.guid}>
                  {/* Bungkus row proyek dengan Link */}
                  <td>
                    <Link
                      to={`/project/${project.guid}`}
                      className="text-decoration-none same-width"
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td className="same-width">{project.owner}</td>
                  <td className="same-width">{project.user}</td>
                  <td className="same-width">
                    {formatDate(project.startDate)}
                  </td>
                  <td className="same-width">
                    {formatDate(project.lastUpdated)}
                  </td>
                  <td className="action-cell">
                    {/* Tombol untuk edit dan hapus project */}

                    <button
                      className="btn btn-sm me-1 rounded-5"
                      onClick={() => handleEditProject(project.guid)}
                      style={{ backgroundColor: "#D4E6E8", height: "100%" }} 
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm rounded-5"
                      onClick={() => handleDeleteProject(project.guid)}
                      style={{ backgroundColor: "#FF4545", height: "100%" }}  
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
            {[...Array(Math.ceil(projects.length / itemsPerPage))].map(
              (_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    index + 1 === currentPage ? "active" : ""
                  }`}
                >
                  <button
                    onClick={() => paginate(index + 1)}
                    className="page-link"
                  >
                    {index + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
