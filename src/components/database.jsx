import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import "bootstrap/dist/css/bootstrap.min.css";
// import TambahWebSpace from "./tambahwebspace";
// import EditWebSpace from "./editwebspace";

const Database = () => {
  const [project, setProject] = useState(null);
  const [database, setDatabase] = useState([]);
  const [showAddDatabase, setShowAddDatabase] = useState(false);
  const [showEditDatabase, setShowEditDatabase] = useState(false);
  const [currentDatabase, setCurrentDatabase] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectGuid = localStorage.getItem("currentProjectGuid");
        if (projectGuid) {
          const projectResponse = await axios.get(
            `${apiUrl}/projects/${projectGuid}`
          );
          setProject(projectResponse.data);

          const databaseResponse = await axios.get(
            `${apiUrl}/databases/by-project/${projectGuid}`
          );
          setDatabase(databaseResponse.data);
        }
      } catch (error) {
        console.error("Error fetching project or database:", error);
      }
    };

    fetchProjectDetails();
  }, [apiUrl]);

  const handleAddHost = () => {
    navigate("/hostdatabase");
  };

  const handleAddDatabase = (newDatabase) => {
    setDatabase((prevDatabase) => [...prevDatabase, newDatabase]);
    setShowAddDatabase(false);
  };

  const handleEditDatabase = (database) => {
    setCurrentDatabase(database);
    setShowEditDatabase(true);
  };

  const handleDatabaseUpdated = (updatedDatabase) => {
    setDatabase((prevDatabase) =>
      prevDatabase.map((database) =>
        database.guid === updatedDatabase.guid ? updatedDatabase : database
      )
    );
    setShowEditDatabase(false);
  };

  const handleDeleteDatabase = async (database) => {
    const confirmDelete = window.confirm(
      "Apakah anda yakin untuk menghapus data?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `${apiUrl}/databases/${database.guid}`
        );
        if (response.status === 200) {
          setDatabase((prevDatabase) =>
            prevDatabase.filter((ws) => ws.guid !== database.guid)
          );
          alert("Database berhasil dihapus!");
        }
      } catch (error) {
        console.error("Error deleting database:", error);
        alert("Gagal menghapus database.");
      }
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="d-flex flex-grow-1">
        <Sidebar />

        <div className="flex-grow-1 p-4 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Database Project: {project.name}</h2>
            <div>
              <button className="btn btn-primary me-2" onClick={handleAddHost}>
                <i className="fas fa-plus me-1"></i>Host
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddDatabase(true)}
              >
                <i className="fas fa-plus me-1"></i>Tambah Database
              </button>
            </div>
          </div>

          {showAddDatabase && (
            <TambahDatabase
              onClose={() => setShowAddDatabase(false)}
              onDatabaseAdded={handleAddDatabase}
            />
          )}

          {showEditDatabase && (
            <EditDatabase
              database={currentDatabase}
              onClose={() => setShowEditDatabase(false)}
              onWebSpaceUpdated={handleDatabaseUpdated}
            />
          )}

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Host</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Nama Database</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {database.length > 0 ? (
                  database.map((database) => (
                    <tr key={database.guid}>
                      <td>{database.host}</td>
                      <td>{database.username}</td>
                      <td>{database.password}</td>
                      <td>{database.databaseName}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleEditDatabase(database)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteDatabase(database)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Tidak ada database yang tersedia
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

export default Database;
