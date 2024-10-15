import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import TambahHostMessageBroker from "./tambahhostmessagebroker";
import EditHostMessageBroker from "./edithostmessagebroker";
import Swal from "sweetalert2";
import { IconCirclePlusFilled } from "@tabler/icons-react";

const HostMessageBroker = () => {
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
          `${apiUrl}/host-msg-broker/by-project/${projectGuid}`
        );
        setHosts(response.data);
      } catch (error) {
        console.error("Error fetching hosts:", error);
      }
    };
    fetchHosts();
  }, [apiUrl]);

  const handleBackToMessageBroker = () => {
    navigate("/messagebroker");
  };

  const handleAddHost = (newHost) => {
    setHosts((prevHosts) => [...prevHosts, newHost]);
    setShowAddHost(false);
    Swal.fire("Success", "Host message broker added successfully!", "success");
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
      title: "Are you sure?",
      text: "This data will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#795757",
      cancelButtonColor: "#664343",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${apiUrl}/host-msg-broker/${host.guid}`
        );
        if (response.status === 200) {
          setHosts((prevHosts) =>
            prevHosts.filter((h) => h.guid !== host.guid)
          );
          Swal.fire({
            title: "Deleted!",
            text: "Host has been deleted.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#795757",
          });
        }
      } catch (error) {
        console.error("Error deleting host:", error);
        Swal.fire({
          title: "Failed!",
          text: "Failed to delete host.",
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
          <div className="container">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-md-flex justify-content-between align-items-center mb-4">
                  <h2
                    style={{
                      color: "#664343",
                    }}
                    className="font-weight-bold"
                  >
                    Host Message Broker
                  </h2>
                  <div className="d-flex">
                    <button
                      className="btn btn-sm me-1 rounded-5"
                      onClick={handleBackToMessageBroker}
                      style={{
                        backgroundColor: "#FFF0D1",
                        color: "#664343",
                        fontFamily: "sans-serif",
                        fontWeight: "bold",
                        width: "250px",
                      }}
                    >
                      Kembali ke Message Broker
                    </button>
                    <button
                      className="btn btn-sm rounded-5 d-flex align-items-center"
                      onClick={() => setShowAddHost(true)}
                      style={{
                        backgroundColor: "transparent",
                        width: "190px",
                        color: "#664343",
                        fontFamily: "sans-serif",
                      }}
                    >
                      <IconCirclePlusFilled />
                      Host Message Broker
                    </button>
                  </div>
                </div>

                {showAddHost && (
                  <TambahHostMessageBroker
                    onClose={() => setShowAddHost(false)}
                    onHostAdded={handleAddHost}
                  />
                )}

                {showEditHost && (
                  <EditHostMessageBroker
                    host={currentHost}
                    onClose={() => setShowEditHost(false)}
                    onHostUpdated={handleHostUpdated}
                  />
                )}

                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>IP Address</th>
                        <th>URL</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Broker Type</th>
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
                            <td>{host.brokerType}</td>
                            <td className="action-cell">
                              <button
                                className="btn btn-sm me-1 rounded-5"
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
                                className="btn btn-sm me-1 rounded-5"
                                onClick={() => handleDeleteHost(host)}
                                style={{
                                  width: "80px",
                                  backgroundColor: "#664343",
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
                          <td colSpan="7" className="text-center">
                            Data host tidak tersedia
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
    </div>
  );
};

export default HostMessageBroker;
