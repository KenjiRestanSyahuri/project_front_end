import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar'; 
import TambahProject from './tambahproject'; 
import EditProject from './editproject'; 
import './dashboard.css'; // Mengimpor CSS yang berisi style untuk modal

const Dashboard = () => {
  const [projects, setProjects] = useState([]); // State untuk menyimpan daftar proyek
  const [searchQuery, setSearchQuery] = useState(''); // State untuk menyimpan input pencarian
  const [showAddProject, setShowAddProject] = useState(false); // State untuk kontrol modal Tambah Project
  const [showEditProject, setShowEditProject] = useState(false); // State untuk modal edit
  const [currentGuid, setCurrentGuid] = useState(''); // State untuk menyimpan guid proyek yang akan diedit

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
        const response = await axios.get(`${apiUrl}/projects/search?name=${searchQuery}`);
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options); 
  };

  // Fungsi untuk mengeksekusi pencarian saat tombol Enter ditekan
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
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
    setProjects(projects.map(project => 
      project.guid === updatedProject.guid ? updatedProject : project // Perbarui proyek yang diedit
    ));
  };

  // Fungsi untuk menghapus proyek berdasarkan guid
  const handleDeleteProject = async (guid) => {
    try {
      await axios.delete(`${apiUrl}/projects/${guid}`);
      setProjects(projects.filter(project => project.guid !== guid)); // Hapus proyek dari state
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Menghitung proyek yang ditampilkan berdasarkan pagination
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

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
            className="form-control"
            placeholder="Cari project"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
            onKeyPress={handleKeyPress} 
            style={{ paddingLeft: '30px' }} 
          />
          <button className="btn btn-primary" type="button" onClick={searchProjects}>
            Cari
          </button>

          {/* Tombol untuk menampilkan modal Tambah Project */}
          <button className="ms-3 btn btn-success" onClick={() => setShowAddProject(true)}>
            Tambah Project
          </button>
          
          {/* Ikon pencarian di dalam input */}
          <i className="bi bi-search position-absolute" style={{ left: '10px', top: '10px', fontSize: '20px', color: '#6c757d' }}></i>
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
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.length > 0 ? (
              currentProjects.map((project) => (
                <tr key={project.guid}>
                  <td>{project.name}</td>
                  <td>{project.owner}</td>
                  <td>{project.user}</td>
                  <td>{project.description}</td>
                  <td>{formatDate(project.startDate)}</td>
                  <td>
                    {/* Tombol untuk edit dan hapus project */}
                    <button className="btn btn-info btn-sm me-1 rounded-5" onClick={() => handleEditProject(project.guid)}>Edit</button>
                    <button className="btn btn-danger btn-sm rounded-5" onClick={() => handleDeleteProject(project.guid)}>Hapus</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination controls */}
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
