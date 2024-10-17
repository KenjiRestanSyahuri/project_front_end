import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import TambahHostWorker from "./tambahHostWorker";
import EditHostWorker from "./editHostWorker";
import Swal from "sweetalert2";
import { IconCirclePlusFilled } from "@tabler/icons-react";

const HostWorker = () => {
  const [workers, setWorkers] = useState([]);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showEditWorker, setShowEditWorker] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const projectGuid = sessionStorage.getItem("currentProjectGuid");
        const response = await axios.get(
          `${apiUrl}/host-worker/by-project/${projectGuid}`
        );
        setWorkers(response.data);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchWorkers();
  }, [apiUrl]);

  const handleBackToWorker = () => {
    navigate("/worker");
  };

  const handleAddWorker = (newWorker) => {
    setWorkers((prevWorkers) => [...prevWorkers, newWorker]);
    setShowAddWorker(false);
    Swal.fire({
      title: "Sukses!",
      text: "Host Worker berhasil ditambahkan!",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#795757",
    });
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
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#795757",
      cancelButtonColor: "#664343",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${apiUrl}/host-worker/${worker.guid}`
        );
        if (response.status === 200) {
          setWorkers((prevWorkers) =>
            prevWorkers.filter((w) => w.guid !== worker.guid)
          );
          Swal.fire({
            title: "Dihapus!",
            text: "Berhasil menghapus host worker",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#795757",
          });
        }
      } catch (error) {
        console.error("Error deleting host worker:", error);
        Swal.fire({
          title: "Gagal!",
          text: "Gagal menghapus host worker",
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
                <h2
                  style={{
                    color: "#664343",
                  }}
                >
                  Host Worker
                </h2>
                <div>
                  <button
                    className="btn btn btn-sm me-1 rounded-5"
                    onClick={handleBackToWorker}
                    style={{
                      backgroundColor: "#FFF0D1",
                      color: "#664343",
                      fontFamily: "sans-serif",
                      fontWeight: "bold",
                      width: "90px",
                    }}
                  >
                    Worker
                  </button>
                  <button
                    className="btn btn btn-sm me-1 rounded-5"
                    onClick={() => setShowAddWorker(true)}
                    style={{
                      backgroundColor: "transparent",
                      width: "130px",
                      color: "#664343",
                      fontFamily: "sans-serif",
                    }}
                  >
                    <IconCirclePlusFilled />
                    Tambah Host 
                  </button>
                </div>
              </div>

              {showAddWorker && (
                <TambahHostWorker
                  onClose={() => setShowAddWorker(false)}
                  onWorkerAdded={handleAddWorker}
                />
              )}

              {showEditWorker && (
                <EditHostWorker
                  worker={currentWorker}
                  onClose={() => setShowEditWorker(false)}
                  onWorkerUpdated={handleWorkerUpdated}
                />
              )}

              <div>
                <table>
                  <thead class="table-group-divider">
                    <tr>
                      <th>Nama</th>
                      <th>URL</th>
                      <th>IP Address</th>
                      <th>Username</th>
                      <th>OS</th>
                      <th>Bahasa</th>
                      <th>Process Manager</th>
                      <th>Directory Name</th>
                      <th className="action-cell">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="table-group-divider">
                    {workers.length > 0 ? (
                      workers.map((worker) => (
                        <tr key={worker.guid}>
                          <td>{worker.name}</td>
                          <td>{worker.url}</td>
                          <td>{worker.ipAddress}</td>
                          <td>{worker.username}</td>
                          <td>{worker.os}</td>
                          <td>{worker.language}</td>
                          <td>{worker.processManager}</td>
                          <td>{worker.directoryName}</td>
                          <td className="action-cell">
                            <div className="d-grid gap-2 d-md-block">
                              <button
                                className="btn btn btn-sm me-1 rounded-5"
                                onClick={() => handleEditWorker(worker)}
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
                                onClick={() => handleDeleteWorker(worker)}
                                style={{
                                  width: "80px",
                                  height: "32px",
                                  backgroundColor: "#664343",
                                  color: "#FFF0D1",
                                  border: "none",
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
                        <td colSpan="9" className="text-center">
                          Tidak ada data worker yang tersedia
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

export default HostWorker;
