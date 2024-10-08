import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './sidebar';
import Navbar from './navbar'; // Import Navbar
import 'bootstrap/dist/css/bootstrap.min.css';

const DetailProject = () => {
  const { guid } = useParams(); // Mengambil guid dari URL
  const [project, setProject] = useState(null); // State untuk menyimpan data proyek
  const apiUrl = import.meta.env.VITE_API_URL; // Mengambil API URL dari environment

  // Mengambil detail proyek berdasarkan guid
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${apiUrl}/projects/${guid}`);
        setProject(response.data); // Menyimpan data proyek ke state
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProject();
  }, [guid]);

  if (!project) {
    return <div>Loading...</div>; // Menampilkan loading saat data sedang diambil
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar /> {/* Menambahkan Navbar di sini */}

      <div className="d-flex flex-grow-1">
        <Sidebar />

        {/* Detail Project Content */}
        <div className="flex-grow-1 p-4 bg-light">
          <div className="card shadow-sm">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className='mb-0'>{project.name}</h2>
                <button className="btn btn-primary">
                  <i className="fas fa-edit me-2"></i>Edit Data Project
                </button>
              </div>
              
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <tbody>
                    <tr>
                      <td className="bg-light fw-bold">Owner</td>
                      <td>{project.owner}</td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold">User</td>
                      <td>{project.user}</td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold">Tanggal Mulai</td>
                      <td>{new Date(project.startDate).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold">Pembaruan Terakhir</td>
                      <td>{new Date(project.updatedAt).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold">Versi Terakhir</td>
                      <td>{project.version}</td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold">Git Repository</td>
                      <td>
                        <a href={project.gitRepo} target="_blank" rel="noopener noreferrer">
                          {project.gitRepo}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold">URL Frontend</td>
                      <td>
                        <a href={project.frontendUrl} target="_blank" rel="noopener noreferrer">
                          {project.frontendUrl}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold">URL Backend</td>
                      <td>
                        <a href={project.backendUrl} target="_blank" rel="noopener noreferrer">
                          {project.backendUrl}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold">Aplikasi Android</td>
                      <td>
                        <a href={project.androidApp} target="_blank" rel="noopener noreferrer">
                          {project.androidApp ? 'PlayStore' : '-'}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold">Aplikasi iOS</td>
                      <td>{project.iosApp || '-'}</td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold">Aplikasi Windows</td>
                      <td>{project.windowsApp || '-'}</td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold">Aplikasi Mac</td>
                      <td>{project.macApp || '-'}</td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold">Deskripsi</td>
                      <td>{project.description}</td>
                    </tr>
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

export default DetailProject;
