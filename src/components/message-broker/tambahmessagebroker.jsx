import React, { useState } from "react";
import "./tambahmessagebroker.css"; // Make sure to create this CSS file

function TambahMessageBroker({ onClose, onMessageBrokerAdded }) {
  const [messageBrokerData, setMessageBrokerData] = useState({
    host: "",
    virtualHost: "",
    username: "",
    password: "",
    topic: "",
    queue: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setMessageBrokerData({
      ...messageBrokerData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to POST data to backend using fetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", messageBrokerData);
    if (
      messageBrokerData.host &&
      messageBrokerData.virtualHost &&
      messageBrokerData.username &&
      messageBrokerData.password &&
      messageBrokerData.topic &&
      messageBrokerData.queue
    ) {
      // Prepare data to be sent
      const dataToSend = {
        ...messageBrokerData,
        projectGuid: localStorage.getItem("currentProjectGuid"),
      };

      console.log("Data to send to the server:", dataToSend);

      try {
        // Send data to server via POST request using fetch
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/message-brokers`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorResponse.message}`
          );
        }

        const result = await response.json();
        console.log("Response data from server:", result);

        onMessageBrokerAdded(result); // Send the successfully saved message broker data to parent component
        onClose(); // Close modal after message broker is successfully added
      } catch (error) {
        console.error("Error adding message broker:", error.message);
      }
    } else {
      alert("Please fill in all fields!"); // Input validation
    }
  };

  return (
    <div className="modal-backdrop d-flex justify-content-center align-items-center">
      <div className="modal-content p-4 rounded shadow">
        <div className="modal-header">
          <h2 className="h5">Add Message Broker</h2>
          <button
            className="btn-close ms-auto"
            aria-label="Close"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.5rem",
            }}
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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TambahMessageBroker;