import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import TambahHostWebSpace from "./tambahhostwebspace";
import EditHostWebSpace from "./edithostwebspace";
import Swal from "sweetalert2";
import {IconCirclePlusFilled } from "@tabler/icons-react";
import "./hostwebspace.css";


const HostWebSpace = () => {
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
        const response = await axios.get(`${apiUrl}/host-webspace/by-project/${projectGuid}`);
        setHosts(response.data);
      } catch (error) {
        console.error("Error fetching hosts:", error);
      }
    };

    fetchHosts();
  }, [apiUrl]);

  const handleBackToWebSpace = () => {
    navigate("/webspace");
  };

  const handleAddHost = (newHost) => {
    setHosts((prevHosts) => [...prevHosts, newHost]);
    setShowAddHost(false);
    Swal.fire("Sukses", "Host Web space berhasil ditambahkan!", "success");
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
          `${apiUrl}/host-webspace/${host.guid}`
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
            <h2
            style={{
              color : "#664343",
            }} 
            >Host Web Space</h2>
            <div>
              <button
                className="btn btn btn-sm me-1 rounded-5"
                onClick={handleBackToWebSpace}
                style={{
                  backgroundColor: "#FFF0D1",
                  color: "#3B3030",
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  width: "200px",
                }}
              >
                Kembali ke Web Space
              </button>
              <button
                className="btn btn btn-sm me-1 rounded-5"
                onClick={() => setShowAddHost(true)}
                style={{
                  backgroundColor: "transparent",
                  width: "170px",
                  color: "#3B3030",
                  fontFamily: "sans-serif",
                }}
              >
                {/* <i className="fas fa-plus me-1"></i> */}
                <IconCirclePlusFilled />
                Host Web Space
              </button>
            </div>
          </div>

          {showAddHost && (
            <TambahHostWebSpace
              onClose={() => setShowAddHost(false)}
              onHostAdded={handleAddHost}
            />
          )}

          {showEditHost && (
            <EditHostWebSpace
              host={currentHost}
              onClose={() => setShowEditHost(false)}
              onHostUpdated={handleHostUpdated}
            />
          )}

          <div>
            <table>
              <thead>
                <tr>
                  <th>Host</th>
                  <th>IP Address</th>
                  <th>URL</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>OS</th>
                  <th>Server Type</th>
                  <th>Aksi</th>
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
                      <td>{host.serverType}</td>
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
                            border: "none",
                            color: "#FFF0D1",
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
  );
};

export default HostWebSpace;
