import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import TambahHostDatabase from "./tambahhostdatabase";
import EditHostDatabase from "./edithostdatabase";
import Swal from "sweetalert2";

const HostDatabase = () => {
  const [hosts, setHosts] = useState([]);
  const [showAddHost, setShowAddHost] = useState(false);
  const [showEditHost, setShowEditHost] = useState(false);
  const [currentHost, setCurrentHost] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const projectGuid = sessionStorage.getItem("currentProjectGuid");
        const response = await axios.get(
          `${apiUrl}/host-database/by-project/${projectGuid}`
        );
        console.log(response.data);
        setHosts(response.data);
      } catch (error) {
        console.error("Error fetching hosts:", error);
      }
    };

    fetchHosts();
  }, [apiUrl]);

  const handleBackToDatabase = () => {
    navigate("/database");
  };

  const handleAddHost = (newHost) => {
    setHosts((prevHosts) => [...prevHosts, newHost]);
    setShowAddHost(false);
    Swal.fire("Sukses", "Host Database berhasil ditambahkan!", "success");
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
    // SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${apiUrl}/host-database/${host.guid}`
        );
        if (response.status === 200) {
          setHosts((prevHosts) =>
            prevHosts.filter((h) => h.guid !== host.guid)
          );
          Swal.fire("Dihapus!", "Host berhasil dihapus!", "success");
        }
      } catch (error) {
        console.error("Error deleting host:", error);
        Swal.fire("Gagal!", "Gagal menghapus host.", "error");
      }
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="d-flex flex-grow-1">
        <Sidebar />

        <div className="flex-grow-1 p-4 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Host</h2>
            <div>
              <button
                className="btn btn btn-sm me-1 rounded-5"
                onClick={handleBackToDatabase}
                style={{
                  backgroundColor: "#AFD0ED",
                  color: "#1168E7",
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  width: "95px",
                }}
              >
                Database
              </button>
              <button
                className="btn btn btn-sm me-1 rounded-5"
                onClick={() => setShowAddHost(true)}
                style={{
                  backgroundColor: "white",
                  width: "170px",
                  color: "#226195",
                  fontFamily: "sans-serif",
                }}
              >
                <IconCirclePlusFilled />
                Tambah Host
              </button>
            </div>
          </div>

          {showAddHost && (
            <TambahHostDatabase
              onClose={() => setShowAddHost(false)}
              onHostAdded={handleAddHost}
            />
          )}

          {showEditHost && (
            <EditHostDatabase
              host={currentHost}
              onClose={() => setShowEditHost(false)}
              onHostUpdated={handleHostUpdated}
            />
          )}

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Host</th>
                  <th>IP Address</th>
                  <th>URL</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>OS</th>
                  <th>Database Server Type</th>
                  <th className="action-cell">Aksi</th>
                </tr>
              </thead>
              <tbody>
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
                      <td>{host.databaseType}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleEditHost(host)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteHost(host)}
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
  );
};

export default HostDatabase;
