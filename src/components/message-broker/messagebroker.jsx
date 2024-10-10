import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import TambahMessageBroker from "./tambahmessagebroker"; // Component for adding a message broker
import EditMessageBroker from "./editmessagebroker"; // Component for editing a message broker
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";

const MessageBroker = () => {
  const [project, setProject] = useState(null);
  const [messageBrokers, setMessageBrokers] = useState([]);
  const [showAddMessageBroker, setShowAddMessageBroker] = useState(false);
  const [showEditMessageBroker, setShowEditMessageBroker] = useState(false);
  const [currentMessageBroker, setCurrentMessageBroker] = useState(null);
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

          const messageBrokersResponse = await axios.get(
            `${apiUrl}/message-brokers/by-project/${projectGuid}`
          );
          setMessageBrokers(messageBrokersResponse.data);
        }
      } catch (error) {
        console.error("Error fetching project or message brokers:", error);
      }
    };

    fetchProjectDetails();
  }, [apiUrl]);

  const handleAddMessageBroker = (newMessageBroker) => {
    setMessageBrokers((prevMessageBrokers) => [...prevMessageBrokers, newMessageBroker]);
    setShowAddMessageBroker(false);
    Swal.fire("Success", "Message broker added successfully!", "success");
  };

  const handleEditMessageBroker = (messageBroker) => {
    setCurrentMessageBroker(messageBroker);
    setShowEditMessageBroker(true);
  };

  const handleMessageBrokerUpdated = (updatedMessageBroker) => {
    setMessageBrokers((prevMessageBrokers) =>
      prevMessageBrokers.map((mb) =>
        mb.guid === updatedMessageBroker.guid ? updatedMessageBroker : mb
      )
    );
    setShowEditMessageBroker(false);
  };

  const handleDeleteMessageBroker = async (messageBroker) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This data will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.delete(
          `${apiUrl}/message-brokers/${messageBroker.guid}`
        );
        if (response.status === 200) {
          setMessageBrokers((prevMessageBrokers) =>
            prevMessageBrokers.filter((mb) => mb.guid !== messageBroker.guid)
          );
          Swal.fire("Deleted!", "Message broker has been deleted.", "success");
        }
      } catch (error) {
        console.error("Error deleting message broker:", error);
        Swal.fire("Failed", "Failed to delete message broker.", "error");
      }
    }
  };

  if (!project) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Message Brokers: {project.name}</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddMessageBroker(true)}
            >
              <i className="fas fa-plus me-1"></i>Add Message Broker
            </button>
          </div>

          {showAddMessageBroker && (
            <TambahMessageBroker
              onClose={() => setShowAddMessageBroker(false)}
              onMessageBrokerAdded={handleAddMessageBroker}
            />
          )}

          {showEditMessageBroker && (
            <EditMessageBroker
              messageBroker={currentMessageBroker}
              onClose={() => setShowEditMessageBroker(false)}
              onMessageBrokerUpdated={handleMessageBrokerUpdated}
            />
          )}

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Host</th>
                  <th>Virtual Host</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Topic</th>
                  <th>Queue</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messageBrokers.length > 0 ? (
                  messageBrokers.map((mb) => (
                    <tr key={mb.guid}>
                      <td>{mb.host}</td>
                      <td>{mb.virtualHost}</td>
                      <td>{mb.username}</td>
                      <td>{mb.password}</td>
                      <td>{mb.topic}</td>
                      <td>{mb.queue}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleEditMessageBroker(mb)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteMessageBroker(mb)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No message brokers available
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

export default MessageBroker;