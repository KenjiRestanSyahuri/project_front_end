import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import LupaPassword from "./components/lupapassword";
import Dashboard from "./components/dashboard";
import ProtectedRoute from "./components/protectedroute";
import NotFound from "./components/notfound";
import Sidebar from "./components/sidebar";
import DetailProject from "./components/detailProject";
import Webspace from "./components/webspace";
import HostWebSpace from "./components/hostwebspace";
import Database from "./components/database";
import MessageBroker from "./components/messagebroker";
import Storage from "./components/storage/storage";
import HostStorage from "./components/storage/hoststorage";
import HostDatabase from "./components/hostdatabase";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/lupapassword" element={<LupaPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {" "}
              <Dashboard />{" "}
            </ProtectedRoute>
          }
        />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/project/:guid" element={<DetailProject />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/webspace" element={<Webspace />} />
        <Route path="/hostwebspace" element={<HostWebSpace />} />{" "}
        <Route path="/hoststorage" element={<HostStorage />} />{" "}
        <Route path="/database" element={<Database />} />
        <Route path="/messagebroker" element={<MessageBroker/>}/>
        <Route path="/storage" element={<Storage />} />
        <Route path="/hostdatabase" element={<HostDatabase />} />
      </Routes>
    </Router>
  );
};

export default App;
