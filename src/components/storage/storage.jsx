import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import TambahStorage from "./tambahstorage";
import EditStorage from "./editStorage"; // Komponen untuk mengedit storage
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";
import { IconCirclePlusFilled } from "@tabler/icons-react";

const Storage = () => {
  const [project, setProject] = useState(null);
  const [storages, setStorages] = useState([]);
  const [showAddStorage, setShowAddStorage] = useState(false);
  const [showEditStorage, setShowEditStorage] = useState(false);
  const [currentStorage, setCurrentStorage] = useState(null);
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

          const storagesResponse = await axios.get(
            `${apiUrl}/storages/by-project/${projectGuid}`
          );
          setStorages(storagesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching project or storages:", error);
      }
    };

    fetchProjectDetails();
  }, [apiUrl]);

  const handleAddStorage = (newStorage) => {
    setStorages((prevStorages) => [...prevStorages, newStorage]);
    setShowAddStorage(false);
    Swal.fire({
      title: "Sukses!",
      text: "Storage berhasil ditambahkan!",
      icon: "success",
      showCloseButton: true,
      confirmButtonColor: "#664343",
    }); // Notifikasi sukses
  };

  const handleEditStorage = (storage) => {
    setCurrentStorage(storage);
    setShowEditStorage(true);
  };

  const handleAddHost = () => {
    navigate("/hoststorage");
  };

  const handleStorageUpdated = (updatedStorage) => {
    setStorages((prevStorages) =>
      prevStorages.map((storage) =>
        storage.guid === updatedStorage.guid ? updatedStorage : storage
      )
    );
    setShowEditStorage(false);
  };

  const handleDeleteStorage = async (storage) => {
    const confirmDelete = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#795757",
      cancelButtonColor: "#664343",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.delete(
          `${apiUrl}/storages/${storage.guid}`
        );
        if (response.status === 200) {
          setStorages((prevStorages) =>
            prevStorages.filter((s) => s.guid !== storage.guid)
          );
          Swal.fire({
            title: "Terhapus!",
            text: "Storage berhasil dihapus.",
            icon: "success",
            showCloseButton: true,
            confirmButtonColor: "#664343",
          }); // Notifikasi sukses
        }
      } catch (error) {
        console.error("Error deleting storage:", error);
        Swal.fire({
          title: "Gagal!",
          text: "Gagal menghapus storage.",
          icon: "error",
          showCloseButton: true,
          confirmButtonColor: "#664343",
        }); // Notifikasi sukses
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
              <div
                className="d-flex justify-content-between align-items-center mb-4"
                style={{ color: "#664343" }}
              >
                <h2>Storage: {project.name}</h2>
                <div>
                  <button
                    className="btn btn btn-sm me-1 rounded-5"
                    onClick={handleAddHost}
                    style={{
                      backgroundColor: "#FFF0D1",
                      color: "#664343",
                      fontFamily: "sans-serif",
                      fontWeight: "bold",
                      width: "90px",
                    }}
                  >
                    Host
                  </button>
                  <button
                    className="btn btn btn-sm me-1 rounded-5"
                    onClick={() => setShowAddStorage(true)}
                    style={{
                      backgroundColor: "white",
                      width: "170px",
                      color: "#664343",
                      fontFamily: "sans-serif",
                    }}
                  >
                    <IconCirclePlusFilled />
                    Tambah Storage
                  </button>
                </div>
              </div>
              {showAddStorage && (
                <TambahStorage
                  onClose={() => setShowAddStorage(false)}
                  onStorageAdded={handleAddStorage}
                />
              )}

              {showEditStorage && (
                <EditStorage
                  storage={currentStorage}
                  onClose={() => setShowEditStorage(false)}
                  onStorageUpdated={handleStorageUpdated}
                />
              )}

              <div>
                <table>
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
                    {storages.length > 0 ? (
                      storages.map((storage) => (
                        <tr key={storage.guid}>
                          <td>{storage.host}</td>
                          <td>{storage.username}</td>
                          <td>{storage.password}</td>
                          <td>{storage.directoryName}</td>
                          <td className="action-cell">
                            <div className="d-grid gap-2 d-md-block">
                              <button
                                className="btn btn btn-sm me-1 rounded-5"
                                onClick={() => handleEditStorage(storage)}
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
                                onClick={() => handleDeleteStorage(storage)}
                                style={{
                                  width: "80px",
                                  backgroundColor: "#664343",
                                  color: "#FFF0D1",
                                  borderColor: "#664343",
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
                          Tidak ada storage yang tersedia
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

export default Storage;
