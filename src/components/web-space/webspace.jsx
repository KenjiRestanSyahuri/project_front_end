import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import TambahWebSpace from "./tambahwebspace";
import EditWebSpace from "./editwebspace";
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import "./webspace.css";

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
        const projectGuid = sessionStorage.getItem("currentProjectGuid");
        if (projectGuid) {
          const projectResponse = await axios.get(
            `${apiUrl}/projects/${projectGuid}`
          );
          setProject(projectResponse.data);

          const webSpacesResponse = await axios.get(
            `${apiUrl}/web-spaces/by-project/${projectGuid}`
          );
          setWebSpaces(webSpacesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching project or web spaces:", error);
      }
    };

    fetchProjectDetails();
  }, [apiUrl]);

  const handleAddHost = () => {
    navigate("/hostwebspace");
  };

  const handleAddWebSpace = (newWebSpace) => {
    setWebSpaces((prevWebSpaces) => [...prevWebSpaces, newWebSpace]);
    setShowAddWebSpace(false);
    Swal.fire({
      title: "Web Space berhasil ditambahkan",
      icon: "success",
      showCloseButton: true,
      confirmButtonColor: "#664343",
    });
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

  const handleDeleteWebSpace = async (webSpace) => {
    const confirmDelete = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#795757",
      cancelButtonColor: "#664343",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.delete(
          `${apiUrl}/web-spaces/${webSpace.guid}`
        );
        if (response.status === 200) {
          setWebSpaces((prevWebSpaces) =>
            prevWebSpaces.filter((ws) => ws.guid !== webSpace.guid)
          );
          Swal.fire({
            title: "Web Space sudah berhasil dihapus",
            icon: "success",
            showCloseButton: true,
            confirmButtonColor: "#664343",
          });
        }
      } catch (error) {
        console.error("Error deleting web space:", error);
        Swal.fire({
          title: "Gagal menghapus web space.",
          icon: "error",
          showCloseButton: true,
          confirmButtonColor: "#664343",
        });
      }
    }
  };

  if (!project) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <TailSpin height="60" width="60" color="#664343" ariaLabel="loading" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="d-flex flex-grow-1">
        <Sidebar />

        <div className="flex-grow-1 p-4 bg-light">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2
                  style={{
                    color: "#664343",
                  }}
                >
                  Web Space: {project.name}
                </h2>
                <div>
                  <button
                    className="btn btn btn-sm me-1 rounded-5"
                    onClick={handleAddHost}
                    style={{
                      backgroundColor: "#FFF0D1",
                      color: "#664343",
                      fontFamily: "sans-serif",
                      fontWeight: "bold",
                      width: "150px",
                    }}
                  >
                    <i className="fas me-1"></i>Host Web Space
                  </button>
                  <button
                    className="btn btn btn-sm me-1 rounded-5"
                    onClick={() => setShowAddWebSpace(true)}
                    style={{
                      backgroundColor: "transparent",
                      width: "170px",
                      color: "#664343",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {/* <i className="fas fa-plus me-1"></i> */}
                    <IconCirclePlusFilled />
                    Tambah Web Space
                  </button>
                </div>
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

              <div>
                <table>
                  <thead class="table-group-divider">
                    <tr>
                      <th>Host</th>
                      <th>URL</th>
                      <th>Directory</th>
                      <th>Bahasa</th>
                      <th className="action-cell">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="table-group-divider">
                    {webSpaces.length > 0 ? (
                      webSpaces.map((webSpace) => (
                        <tr key={webSpace.guid}>
                          <td>{webSpace.host}</td>
                          <td
                            style={{
                              maxWidth: "20rem",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <a
                              href={webSpace.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {webSpace.url}
                            </a>
                          </td>
                          <td>{webSpace.directory}</td>
                          <td>{webSpace.language}</td>
                          <td className="action-cell">
                            <div className="d-grid gap-2 d-md-block">
                              <button
                                className="btn btn btn-sm me-1 rounded-5"
                                onClick={() => handleEditWebSpace(webSpace)}
                                style={{
                                  width: "80px",
                                  backgroundColor: "#795757",
                                  color: "#FFF0D1",
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn btn-sm rounded-5"
                                onClick={() => handleDeleteWebSpace(webSpace)}
                                style={{
                                  width: "80px",
                                  backgroundColor: "#664343",
                                  color: "#FFF0D1",
                                }}
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          Tidak ada web space yang tersedia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default DetailProject;
