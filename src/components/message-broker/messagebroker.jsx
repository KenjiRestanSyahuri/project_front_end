import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";
import { IconCirclePlusFilled } from "@tabler/icons-react";

const MessageBroker = () => {
  const [messageBrokers, setMessageBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessageBrokers = async () => {
      try {
        const projectGuid = localStorage.getItem("currentProjectGuid"); // Ambil projectGuid dari localStorage
        if (projectGuid) {
          const response = await axios.get(
            `${apiUrl}/host-webspace/by-project/${projectGuid}`
          );
          setMessageBrokers(response.data); // Simpan data yang diambil
          setLoading(false); // Set loading ke false setelah data berhasil diambil
        }
      } catch (error) {
        console.error("Error fetching message brokers:", error);
        Swal.fire("Gagal", "Terjadi kesalahan saat mengambil data.", "error");
      }
    };

    fetchMessageBrokers();
  }, [apiUrl]);

  // Fungsi untuk menambah Message Broker
  const handleAddMessageBroker = () => {
    navigate("/tambahmessagebroker");
  };

  // Fungsi untuk mengedit Message Broker
  const handleEditMessageBroker = (broker) => {
    navigate(`/editmessagebroker/${broker.projectGuid}`);
  };

  // Fungsi untuk menghapus Message Broker
  const handleDeleteMessageBroker = async (broker) => {
    const confirmDelete = await Swal.fire({
      title: "Apakah Anda yakin?",
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
        const response = await axios.delete(`${apiUrl}/host-webspace/${broker.projectGuid}`);
        if (response.status === 200) {
          setMessageBrokers((prev) => prev.filter((item) => item.projectGuid !== broker.projectGuid));
          Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        }
      } catch (error) {
        console.error("Error deleting broker:", error);
        Swal.fire("Gagal", "Gagal menghapus data.", "error");
      }
    }
  };

  // Tampilkan loading spinner jika masih mengambil data
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <TailSpin height="60" width="60" color="#226195" ariaLabel="loading" />
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
                <h2>Message Broker</h2>
                <button
                  className="btn btn-primary"
                  onClick={handleAddMessageBroker}
                >
                  <IconCirclePlusFilled /> Tambah Message Broker
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Host</th>
                      <th>Virtual Host</th>
                      <th>Username</th>
                      <th>Password</th>
                      <th>Topic</th>
                      <th>Queue</th>
                      <th className="action-cell">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messageBrokers.length > 0 ? (
                      messageBrokers.map((broker) => (
                        <tr key={broker.projectGuid}>
                          <td>{broker.host}</td>
                          <td>{broker.virtualHost}</td>
                          <td>{broker.username}</td>
                          <td>{broker.password}</td>
                          <td>{broker.topic || '-'}</td>
                          <td>{broker.queue || '-'}</td>
                          <td className="action-cell">
                            <button
                              className="btn btn-sm btn-info me-2"
                              onClick={() => handleEditMessageBroker(broker)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteMessageBroker(broker)}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          Tidak ada data Message Broker yang tersedia
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

export default MessageBroker;
