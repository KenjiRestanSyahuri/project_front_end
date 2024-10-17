import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import TambahHostStorage from "./tambahhoststorage"; // Komponen untuk menambah host storage
import EditHostStorage from "./edithoststorage"; // Komponen untuk mengedit host storage
import Swal from "sweetalert2";
import "./hoststorage.css";

const HostStorage = () => {
  const [hosts, setHosts] = useState([]);
  const [showAddHost, setShowAddHost] = useState(false);
  const [showEditHost, setShowEditHost] = useState(false);
  const [currentHost, setCurrentHost] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const projectGuid = sessionStorage.getItem("currentProjectGuid"); // Ambil projectGuid dari sessionStorage
        if (!projectGuid) {
          Swal.fire("Error", "Project GUID tidak ditemukan!", "error");
          return;
        }

        const response = await axios.get(
          `${apiUrl}/host-storage/by-project/${projectGuid}` // Mengambil host berdasarkan project GUID
        );
        setHosts(response.data);
      } catch (error) {
        console.error("Error fetching hosts:", error);
        Swal.fire("Error", "Gagal mengambil data host storage.", "error");
      }
    };

    fetchHosts();
  }, [apiUrl]);

  const handleBackToStorage = () => {
    navigate("/storage");
  };

  const handleAddHost = (newHost) => {
    setHosts((prevHosts) => [...prevHosts, newHost]);
    setShowAddHost(false);
    Swal.fire("Sukses", "Host storage berhasil ditambahkan!", "success");
  };

  const handleEditHost = (host) => {
    setCurrentHost(host);
    setShowEditHost(true);
  };

  const handleHostUpdated = (updatedHost) => {
    setHosts((prevHosts) =>
      prevHosts.map((host) =>
        host.guid === updatedHost.guid ? updatedHost : host
      )
    );
    setShowEditHost(false);
  };

  const handleDeleteHost = async (host) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      customClass: {
        cancelButton: "batal-swal",
        confirmButton: "confirm-swal",
      },
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${apiUrl}/host-storage/${host.guid}`
        );
        if (response.status === 200) {
          setHosts((prevHosts) =>
            prevHosts.filter((h) => h.guid !== host.guid)
          );
          Swal.fire({
            title: "Dihapus!",
            text: "Host berhasil dihapus!",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#795757",
          });
        }
      } catch (error) {
        console.error("Error deleting host:", error);
        Swal.fire({
          title: "Gagal!",
          text: "Gagal menghapus host.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#795757",
        });
      }
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="d-flex flex-grow-1">
        <Sidebar />

        <div className="flex-grow-1 p-4 bg-light">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Host Storage</h2>
                <div>
                  <button
                    className="btn btn btn-sm me-1 rounded-5"
                    style={{
                      backgroundColor: "#FFF0D1",
                      color: "#664343",
                      fontFamily: "sans-serif",
                      fontWeight: "bold",
                      width: "130px",
                    }}
                    onClick={handleBackToStorage}
                  >
                    Storage
                  </button>
                  <button
                    className="btn btn btn-sm me-1 rounded-5"
                    onClick={() => setShowAddHost(true)}
                    style={{
                      backgroundColor: "white",
                      width: "140px",
                      color: "#664343",
                      fontFamily: "sans-serif",
                    }}
                  >
                    <IconCirclePlusFilled />
                    Tambah Host
                  </button>
                </div>
              </div>

              {showAddHost && (
                <TambahHostStorage
                  onClose={() => setShowAddHost(false)}
                  onHostAdded={handleAddHost}
                />
              )}

              {showEditHost && (
                <EditHostStorage
                  host={currentHost}
                  onClose={() => setShowEditHost(false)}
                  onHostUpdated={handleHostUpdated}
                />
              )}

              <div>
                <table>
                  <thead class="table-group-divider">
                    <tr>
                      <th>Host</th>
                      <th>IP Address</th>
                      <th>URL</th>
                      <th>Username</th>
                      <th>Password</th>
                      <th>OS</th>
                      <th>FTP Server Type</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="table-group-divider">
                    {hosts.length > 0 ? (
                      hosts.map((host) => (
                        <tr key={host.guid}>
                          <td>{host.name}</td>
                          <td>{host.ipAddress}</td>
                          <td
                            style={{
                              maxWidth: "20rem",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <a
                              href={host.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {host.url}
                            </a>
                          </td>
                          <td>{host.username}</td>
                          <td>{host.password}</td>
                          <td>{host.os}</td>
                          <td>{host.ftpType}</td>
                          <td>
                            <button
                              className="btn btn btn-sm me-1 rounded-5"
                              onClick={() => handleEditHost(host)}
                              style={{
                                width: "80px",
                                backgroundColor: "#795757",
                                color: "#FFF0D1",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm rounded-5"
                              onClick={() => handleDeleteHost(host)}
                              style={{
                                width: "80px",
                                backgroundColor: "#664343",
                                color: "#FFF0D1",
                                borderColor: "#664343",
                              }}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          Tidak ada data host yang tersedia
                        </td>
                      </tr>
                    )}
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

export default HostStorage;
