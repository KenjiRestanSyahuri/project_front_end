import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import TambahWorker from "./tambahWorker";
import EditWorker from "./editWorker";
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";
import { IconCirclePlusFilled } from "@tabler/icons-react";

const Worker = () => {
  const [project, setProject] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showEditWorker, setShowEditWorker] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);
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

          const workersResponse = await axios.get(
            `${apiUrl}/workers/by-project/${projectGuid}`
          );
          setWorkers(workersResponse.data);
        }
      } catch (error) {
        console.error("Error fetching project or workers:", error);
      }
    };

    fetchProjectDetails();
  }, [apiUrl]);

  const handleAddWorker = (newWorker) => {
    setWorkers((prevWorkers) => [...prevWorkers, newWorker]);
    setShowAddWorker(false);
    Swal.fire("Sukses", "Worker berhasil ditambahkan!", "success");
  };

  const handleAddHost = () => {
    navigate("/hostworker");
  };

  const handleEditWorker = (worker) => {
    setCurrentWorker(worker);
    setShowEditWorker(true);
  };

  const handleWorkerUpdated = (updatedWorker) => {
    setWorkers((prevWorkers) =>
      prevWorkers.map((worker) =>
        worker.guid === updatedWorker.guid ? updatedWorker : worker
      )
    );
    setShowEditWorker(false);
  };

  const handleDeleteWorker = async (worker) => {
    const confirmDelete = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.delete(`${apiUrl}/workers/${worker.guid}`);
        if (response.status === 200) {
          setWorkers((prevWorkers) =>
            prevWorkers.filter((w) => w.guid !== worker.guid)
          );
          Swal.fire("Terhapus!", "Worker berhasil dihapus.", "success");
        }
      } catch (error) {
        console.error("Error deleting worker:", error);
        Swal.fire("Gagal", "Gagal menghapus worker.", "error");
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
                <h2>Workers: {project.name}</h2>
                <div>
                  <button
                    className="btn btn btn-sm me-1 rounded-5"
                    onClick={handleAddHost}
                    style={{
                      backgroundColor: "#AFD0ED",
                      color: "#1168E7",
                      fontFamily: "sans-serif",
                      fontWeight: "bold",
                      width: "150px",
                    }}
                  >
                    <i className="fas me-1"></i>Host Worker
                  </button>
                  <button
                    className="btn btn btn-sm me-1 rounded-5"
                    onClick={() => setShowAddWorker(true)}
                    style={{
                      backgroundColor: "transparent",
                      width: "170px",
                      color: "#226195",
                      fontFamily: "sans-serif",
                    }}
                  >
                    <IconCirclePlusFilled />
                    Tambah Worker
                  </button>
                </div>
              </div>

              {showAddWorker && (
                <TambahWorker
                  onClose={() => setShowAddWorker(false)}
                  onWorkerAdded={handleAddWorker}
                />
              )}

              {showEditWorker && (
                <EditWorker
                  worker={currentWorker}
                  onClose={() => setShowEditWorker(false)}
                  onWorkerUpdated={handleWorkerUpdated}
                />
              )}

              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Host</th>
                      <th>Username</th>
                      <th>Password</th>
                      <th>Nama Directory</th>
                      <th className="action-cell">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.length > 0 ? (
                      workers.map((worker) => (
                        <tr key={worker.guid}>
                          <td>{worker.host}</td>
                          <td>{worker.username}</td>
                          <td>••••••••</td>
                          <td>{worker.directoryName}</td>
                          <td className="action-cell">
                            <div className="d-grid gap-2 d-md-block">
                              <button
                                className="btn btn btn-sm me-1 rounded-5"
                                onClick={() => handleEditWorker(worker)}
                                style={{
                                  width: "80px",
                                  backgroundColor: "#D4E6E8",
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm rounded-5"
                                onClick={() => handleDeleteWorker(worker)}
                                style={{
                                  width: "80px",
                                  backgroundColor: "#FF4545",
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
                          Tidak ada worker yang tersedia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {showAddWorker && (
            <TambahWorker
              onClose={() => setShowAddWorker(false)}
              onWorkerAdded={handleAddWorker}
            />
          )}

          {showEditWorker && (
            <EditWorker
              worker={currentWorker}
              onClose={() => setShowEditWorker(false)}
              onWorkerUpdated={handleWorkerUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Worker;
