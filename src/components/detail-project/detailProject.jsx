import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar"; // Import Navbar
import "bootstrap/dist/css/bootstrap.min.css";
import EditProject from "../dashboard/editproject";
import Swal from "sweetalert2"; // Import SweetAlert2
import { TailSpin } from "react-loader-spinner";
import "./detailProject.css";

const DetailProject = () => {
  const [projects, setProjects] = useState([]);
  const { guid } = useParams(); // Mengambil guid dari URL
  const [project, setProject] = useState(null); // State untuk menyimpan data proyek
  const apiUrl = import.meta.env.VITE_API_URL; // Mengambil API URL dari environment
  const [currentGuid, setCurrentGuid] = useState("");
  const [showEditProject, setShowEditProject] = useState(false);
  const [message, setMessage] = useState(""); // State untuk menampilkan pesan notifikasi

  // Mengambil detail proyek berdasarkan guid
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${apiUrl}/projects/${guid}`);
        setProject(response.data); // Menyimpan data proyek ke state
        localStorage.setItem("currentProjectGuid", response.data.guid);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProject();
  }, [guid]);

  const handleEditProject = (guid) => {
    setCurrentGuid(guid);
    setShowEditProject(true);
  };

  const handleProjectUpdated = (updatedProject) => {
    setProject(
      projects.map((project) =>
        project.guid === updatedProject.guid ? updatedProject : project
      )
    );
    setProject(updatedProject); // Update state project langsung
    setMessage("Proyek berhasil diperbarui."); // Set pesan sukses
    Swal.fire("Proyek berhasil diperbarui", "", "success"); // Notifikasi sukses
  };

  if (!project) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <TailSpin height="60" width="60" color="#226195" ariaLabel="loading" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar /> {/* Menambahkan Navbar di sini */}
      <div className="d-flex flex-grow-1">
        <Sidebar />

        {/* Konten Detail Proyek */}
        <div className="flex-grow-1 p-4 bg-light">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">{project.name}</h2>
                <button
                  className="btn"
                  onClick={() => handleEditProject(project.guid)}
                  style={{
                    backgroundColor: "white",
                    color: "#664343",
                    fontFamily: "sans-serif"
                    
                  }}
                >
                  <i className="fas fa-edit me-2"></i>Edit Data Project
                </button>
              </div>

              {showEditProject && (
                <EditProject
                  guid={currentGuid}
                  onClose={() => setShowEditProject(false)}
                  onProjectUpdated={handleProjectUpdated}
                />
              )}

              <div>
                <table>
                  <tbody>
                    <tr>
                      <td className="fw-bold">Owner</td>
                      <td>{project.owner}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">User</td>
                      <td>{project.user}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Tanggal Mulai</td>
                      <td>
                        {new Date(project.startDate).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Pembaruan Terakhir</td>
                      <td>
                        {new Date(project.lastUpdated).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Versi Terakhir</td>
                      <td>{project.lastVersion}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Git Repository</td>
                      <td>
                        <a
                          href={project.gitRepo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.gitRepo}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">URL Frontend</td>
                      <td>
                        <a
                          href={project.frontendUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.frontendUrl}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">URL Backend</td>
                      <td>
                        <a
                          href={project.backendUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.backendUrl}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Aplikasi Android</td>
                      <td>
                        <a
                          href={project.androidApp}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.androidApp ? "PlayStore" : "-"}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Aplikasi iOS</td>
                      <td>{project.iosApp || "-"}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Aplikasi Windows</td>
                      <td>{project.windowsApp || "-"}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Aplikasi Mac</td>
                      <td>{project.macApp || "-"}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Deskripsi</td>
                      <td>{project.description}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProject;
