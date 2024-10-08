import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import TambahHostWebSpace from './tambahhostwebspace';
//import EditHostWebSpace from './edithostwebspace';

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
        const response = await axios.get(`${apiUrl}/host-webspace`);
        setHosts(response.data);
      } catch (error) {
        console.error("Error fetching hosts:", error);
      }
    };

    fetchHosts();
  }, [apiUrl]);

  const handleBackToWebSpace = () => {
    navigate('/webspace');
  };

  const handleAddHost = (newHost) => {
    setHosts((prevHosts) => [...prevHosts, newHost]);
    setShowAddHost(false);
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
    const confirmDelete = window.confirm("Apakah anda yakin untuk menghapus data?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${apiUrl}/host-webspace/${host.guid}`);
        if (response.status === 200) {
          setHosts((prevHosts) => prevHosts.filter((h) => h.guid !== host.guid));
          alert("Host berhasil dihapus!");
        }
      } catch (error) {
        console.error("Error deleting host:", error);
        alert("Gagal menghapus host.");
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
            <h2>Web Space Hosts</h2>
            <button className="btn btn-primary" onClick={() => setShowAddHost(true)}>
              <i className="fas fa-plus me-2"></i>Tambah Host
            </button>
            <button className="btn btn-secondary" onClick={handleBackToWebSpace}>
              Kembali ke Web Space
            </button>
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

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Web Space</th>
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
                      <td>{host.webSpace}</td>
                      <td>{host.ipAddress}</td>
                      <td>
                        <a href={host.url} target="_blank" rel="noopener noreferrer">
                          {host.url}
                        </a>
                      </td>
                      <td>{host.username}</td>
                      <td>{host.password}</td>
                      <td>{host.os}</td>
                      <td>{host.serverType}</td>
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
                    <td colSpan="8" className="text-center">Tidak ada data host yang tersedia</td>
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
