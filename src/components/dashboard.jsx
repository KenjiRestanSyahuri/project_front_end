import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./navbar";
import TambahProject from "./tambahproject";
import EditProject from "./editproject";
import "./dashboard.css"; // Mengimpor CSS yang berisi style untuk modal
import "bootstrap-icons/font/bootstrap-icons.css";

const Dashboard = () => {
  const [projects, setProjects] = useState([]); // State untuk menyimpan daftar proyek
  const [searchQuery, setSearchQuery] = useState(""); // State untuk menyimpan input pencarian
  const [showAddProject, setShowAddProject] = useState(false); // State untuk kontrol modal Tambah Project
  const [showEditProject, setShowEditProject] = useState(false); // State untuk modal edit
  const [currentGuid, setCurrentGuid] = useState(""); // State untuk menyimpan guid proyek yang akan diedit

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [itemsPerPage] = useState(5); // Jumlah item per halaman

  const apiUrl = import.meta.env.VITE_API_URL; // Mengambil API_URL dari environment variables

  useEffect(() => {
    fetchProjects(); // Ambil daftar proyek saat komponen pertama kali dimuat
  }, []);

  // Fungsi untuk mengambil daftar proyek dari API
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${apiUrl}/projects`);
      setProjects(response.data); // Update state dengan data proyek
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Fungsi untuk melakukan pencarian proyek berdasarkan query
  const searchProjects = async () => {
    if (searchQuery) {
      try {
        const response = await axios.get(
          `${apiUrl}/projects/search?name=${searchQuery}`
        );
        setProjects(response.data); // Update state dengan hasil pencarian
      } catch (error) {
        console.error("Error searching projects:", error);
      }
    } else {
      fetchProjects(); // Kembali ambil semua proyek jika query kosong
    }
  };

  // Fungsi untuk memformat tanggal dalam format yang lebih ramah
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Fungsi untuk mengeksekusi pencarian saat tombol Enter ditekan
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchProjects();
    }
  };

  // Fungsi untuk menambah proyek baru ke dalam daftar
  const handleAddProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  // Fungsi untuk mengedit proyek yang sudah ada
  const handleEditProject = (guid) => {
    setCurrentGuid(guid); // Set guid proyek yang akan diedit
    setShowEditProject(true); // Tampilkan modal edit
  };

  // Fungsi untuk memperbarui proyek yang sudah diedit
  const handleProjectUpdated = (updatedProject) => {
    setProjects(
      projects.map(
        (project) =>
          project.guid === updatedProject.guid ? updatedProject : project // Perbarui proyek yang diedit
      )
    );
  };

  // Fungsi untuk menghapus proyek berdasarkan guid
  const handleDeleteProject = async (guid) => {
    try {
      await axios.delete(`${apiUrl}/projects/${guid}`);
      setProjects(projects.filter((project) => project.guid !== guid)); // Hapus proyek dari state
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Menghitung proyek yang ditampilkan berdasarkan pagination
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  // Fungsi untuk mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar />
      <div className="container mt-3">
        <h2>List Project Terdaftar</h2>

        <div className="input-group mb-3 position-relative">
          {/* Input pencarian project */}
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

          {/* Tombol untuk menampilkan modal Tambah Project */}
          <button
            className="ms-3 btn btn rounded-pill"
            onClick={() => setShowAddProject(true)}
            style={{ backgroundColor: "#fff", color: "#226195" }}
          >
            <i className="bi bi-plus-circle-fill me-2"></i>
            Tambah Project
          </button>

          {/* Ikon search */}
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

        {/* Modal Tambah Project */}
        {showAddProject && (
          <TambahProject
            onClose={() => setShowAddProject(false)}
            onProjectAdded={handleAddProject}
          />
        )}

        {/* Modal Edit Project */}
        {showEditProject && (
          <EditProject
            guid={currentGuid} // Pass guid proyek yang akan diedit
            onClose={() => setShowEditProject(false)}
            onProjectUpdated={handleProjectUpdated} // Handle untuk pembaruan proyek
          />
        )}

        {/* Tabel daftar project */}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nama Projek</th>
              <th>Owner</th>
              <th>User</th>
              <th>Deskripsi</th>
              <th>Tanggal Mulai</th>
              <th className="action-cell">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.length > 0 ? (
              currentProjects.map((project) => (
                <tr key={project.guid}>
                  <td className="same-width">{project.name}</td>
                  <td className="same-width">{project.owner}</td>
                  <td className="same-width">{project.user}</td>
                  <td className="same-width">{project.description}</td>
                  <td className="same-width">
                    {formatDate(project.startDate)}
                  </td>
                  <td className="action-cell">
                    {/* Tombol untuk edit dan hapus project */}
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

        {/* Pagination controls */}
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
