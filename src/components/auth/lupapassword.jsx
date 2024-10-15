import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom'; 
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';  

const LupaPassword = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !newPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Username dan Password Baru wajib diisi',
        confirmButtonColor: '#664343',
      });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        // SweetAlert2 ketika password berhasil dirubah
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Password berhasil dirubah!',
          confirmButtonColor: '#664343',
        }).then(() => {
          navigate('/'); // Arahkan user ke halaman login setelah konfirmasi
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: data.message || 'Gagal mengganti password',
          confirmButtonColor: '#664343',
        });
      }      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal mengganti password',
        confirmButtonColor: '#664343',
      });
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex p-0">
      <div className="row w-100 h-100">
        <div className="col-12 col-md-6 p-0 d-none d-md-block">
          <div
            className="h-100"
            style={{
              backgroundImage: "url('src/assets/bg_fitz.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center bg-white form-container">
          <div className="w-100 p-4 form-content" style={{ maxWidth: "500px" }}>
            <div className="d-flex align-items-center mb-4 justify-content-center">
              <img
                src="src/assets/logo_fitz.png"
                alt="FITZ"
                className="mb-2 me-2"
                style={{ maxWidth: "60rem", height: "auto" }}
              />
              <div className="left">
                <h2 style={{ color: "#3B3030" }}>FITZ</h2>
                <h2 style={{ color: "#664343", fontSize: "23px", margin: "0" }}>
                  Integrated Service Operation Tool
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username Saat Ini
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="username"
                  placeholder="Masukkan Username Saat Ini"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: "100%",
                    borderColor: "#664343",
                    backgroundColor: "#FFF0D1",
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  Password Baru
                </label>
                <input
                  type="password"
                  className="form-control rounded-pill"
                  id="newPassword"
                  placeholder="Masukkan Password Baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: "100%",
                    borderColor: "#664343",
                    backgroundColor: "#FFF0D1",
                  }}
                />
              </div>
              <div className="d-grid gap-2">
                <Button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  style={{
                    borderRadius: "20px",
                    padding: "10px 15px",
                    backgroundColor: "#664343",
                    borderColor: "#664343",
                    color: "#FFF0D1",
                  }}
                >
                  Simpan
                </Button>
                <Link
                  to="/"
                  className="btn btn-secondary w-100 mt-3"
                  style={{
                    borderRadius: "20px",
                    padding: "10px 15px",
                    backgroundColor: "#795757",
                    borderColor: "#664343",
                    color: "#FFF0D1",
                  }}
                >
                  Batal
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <style>
        {`
          /* Ketika di layar kecil, gambar akan jadi background form login dan tambahkan padding putih */
          @media (max-width: 768px) {
            .form-container {
              background-image: url('src/assets/bg_fitz.png');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
            }

            // /* Sembunyikan kolom gambar kiri */
            // .h-100 {
            // display: none;
            // }

            .form-content {
              background-color: rgba(255, 255, 255, 11); /* Tambahkan warna putih semi-transparan */
              padding: 20px; /* Tambahkan padding di sekitar form */
              border-radius: 10px; /* Berikan border radius untuk tampilan lebih rapi */
            }
          }
        `}
      </style>
    </div>
  );
};

export default LupaPassword;
