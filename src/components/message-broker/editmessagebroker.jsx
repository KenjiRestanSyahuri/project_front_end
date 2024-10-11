import React, { useState, useEffect } from "react";
import "./editmessagebroker.css"; // Make sure to create this CSS file
import Swal from "sweetalert2";

function EditMessageBroker({ messageBroker, onClose, onMessageBrokerUpdated }) {
  const [messageBrokerData, setMessageBrokerData] = useState({ ...messageBroker });

  useEffect(() => {
    if (!messageBroker.guid) {
      console.error("GUID is missing from the message broker data:", messageBroker);
    }
  }, [messageBroker]);

  const handleChange = (e) => {
    setMessageBrokerData({
      ...messageBrokerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with updated data:", messageBrokerData);

    if (!messageBrokerData.guid) {
      Swal.fire({
        title: "Error",
        text: "GUID not found, unable to update message broker!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/message-brokers/${messageBrokerData.guid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageBrokerData),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorResponse.message}`
        );
      }

      // SweetAlert success notification
      Swal.fire({
        title: "Success",
        text: "Message broker updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      const result = await response.json();
      console.log("Updated message broker data from server:", result);
      onMessageBrokerUpdated(result);
      onClose();
    } catch (error) {
      console.error("Error updating message broker:", error.message);
      Swal.fire({
        title: "Error",
        text: "Failed to update message broker!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="modal-backdrop d-flex justify-content-center align-items-center">
      <div className="modal-content p-4 rounded shadow">
        <div className="modal-header">
          <h2 className="h5">Edit Message Broker</h2>
          <button
            className="btn-close ms-auto"
            aria-label="Close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="host" className="form-label">
                Host
              </label>
              <input
                type="text"
                className="form-control"
                name="host"
                value={messageBrokerData.host}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="virtualHost" className="form-label">
                Virtual Host
              </label>
              <input
                type="text"
                className="form-control"
                name="virtualHost"
                value={messageBrokerData.virtualHost}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={messageBrokerData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={messageBrokerData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="topic" className="form-label">
                Topic
              </label>
              <input
                type="text"
                className="form-control"
                name="topic"
                value={messageBrokerData.topic}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="queue" className="form-label">
                Queue
              </label>
              <input
                type="text"
                className="form-control"
                name="queue"
                value={messageBrokerData.queue}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4 w-100"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMessageBroker;