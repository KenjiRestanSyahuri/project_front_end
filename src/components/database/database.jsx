import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import TambahDatabase from "./tambahdatabase";
import EditDatabase from "./editdatabase";
import "./database.css";

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
        const projectGuid = sessionStorage.getItem("currentProjectGuid");
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
      prevDatabase.map((db) =>
        db.guid === updatedDatabase.guid ? updatedDatabase : db
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
            prevDatabase.filter((db) => db.guid !== database.guid)
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
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4" style={{color: "#664343"}}>
                <h2>Database Project: {project.name}</h2>
                <div>
                  <button
                    className="btn btn btn-sm me-1 rounded-5"
                    onClick={handleAddHost}
                    style={{
                      backgroundColor: "#FFF0D1",
                      color: "#3B3030",
                      fontFamily: "sans-serif",
                      fontWeight: "bold",
                      width: "130px",
                    }}
                  >
                    Host Database
                  </button>
                  <button
                    className="btn btn btn-sm me-1 rounded-5"
                    onClick={() => setShowAddDatabase(true)}
                    style={{
                      backgroundColor: "white",
                      width: "170px",
                      color: "#664343",
                      fontFamily: "sans-serif",
                    }}
                  >
                    <IconCirclePlusFilled />
                    Tambah Database
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
                  onDatabaseUpdated={handleDatabaseUpdated}
                />
              )}

              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Host</th>
                      <th>Username</th>
                      <th>Password</th>
                      <th>Nama Database</th>
                      <th className="action-cell" >Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {database.length > 0 ? (
                      database.map((db) => (
                        <tr key={db.guid}>
                          <td>{db.host}</td>
                          <td>{db.username}</td>
                          <td>{db.password}</td>
                          <td>{db.databaseName}</td>
                          <td className="action-cell">
                            <div className="d-grid gap-2 d-md-block">
                              <button
                                className="btn btn btn-sm me-1 rounded-5"
                                onClick={() => handleEditDatabase(db)}
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
                                onClick={() => handleDeleteDatabase(db)}
                                style={{
                                  width: "80px",
                                  backgroundColor: "#664343",
                                  color: "#FFF0D1",
                                  borderColor: "#664343"
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
      </div>
    </div>
  );
};

export default Database;