import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import TambahHostMessageBroker from "./tambahhostmessagebroker"; // Component for adding host message broker
import EditHostMessageBroker from "./edithostmessagebroker"; // Component for editing host message broker
import Swal from "sweetalert2";

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
        const projectGuid = localStorage.getItem("currentProjectGuid");
        const response = await axios.get(`${apiUrl}/host-msg-broker/by-project/${projectGuid}`);
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
          Swal.fire("Deleted!", "Host has been deleted successfully!", "success");
        }
      } catch (error) {
        console.error("Error deleting host:", error);
        Swal.fire("Failed!", "Failed to delete host.", "error");
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
            <h2>Host Message Broker</h2>
            <div>
              <button
                className="btn btn-secondary me-2"
                onClick={handleBackToMessageBroker}
              >
                Message Broker
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddHost(true)}
              >
                <i className="fas fa-plus me-2"></i>Add Host
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

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>IP Address</th>
                  <th>URL</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Broker Type</th>
                  <th>Actions</th>
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
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No host data available
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

export default HostMessageBroker;