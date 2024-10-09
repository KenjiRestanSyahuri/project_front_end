import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
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
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${apiUrl}/projects`);
      setProjects(response.data);
      setMessage(""); // Reset pesan saat data berhasil diambil
    } catch (error) {
      console.error("Error fetching projects:", error);
      Swal.fire("Gagal memuat data proyek", "", "error"); // Notifikasi error
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
        Swal.fire("Gagal melakukan pencarian", "", "error"); // Notifikasi error
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
    Swal.fire("Proyek berhasil ditambahkan", "", "success"); // Notifikasi sukses
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
    Swal.fire("Proyek berhasil diperbarui", "", "success"); // Notifikasi sukses
  };

  const handleDeleteProject = async (guid) => {
    // Ganti window.confirm dengan Swal untuk konfirmasi
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Proyek ini akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/projects/${guid}`);
          setProjects(projects.filter((project) => project.guid !== guid));
          Swal.fire("Proyek berhasil dihapus", "", "success"); // Notifikasi sukses
        } catch (error) {
          console.error("Error deleting project:", error);
          Swal.fire("Gagal menghapus proyek", "", "error"); // Notifikasi error
        }
      }
    });
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
              <th>Edit Terakhir</th>
              <th className="action-cell">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.length > 0 ? (
              currentProjects.map((project) => (
                <tr key={project.guid}>
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
                    <div className="d-grid gap-2 d-md-block">
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
                    </div>
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
