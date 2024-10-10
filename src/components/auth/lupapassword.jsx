import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom'; 
import { Button } from 'react-bootstrap';

const LupaPassword = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate(); // gunakan useNavigate untuk navigasi

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !newPassword) {
      setError('Username dan Password Baru wajib diisi');
      return;
    }

    try {
      setError('');
      setSuccess('');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message); // Set pesan sukses dari respons
        navigate('/'); // Arahkan user ke halaman login
      } else {
        setError(data.message || 'Gagal mengganti password');
      }      
    } catch (error) {
      setError('Gagal mengganti password');
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex p-0">
      <div className="row w-100 h-100">
        <div className="col-12 col-md-6 p-0">
          <div
            className="h-100"
            style={{
              backgroundImage: "url('/Life_Cycle-Bg-02-1.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
        </div>

        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center bg-white">
          <div className="w-100 p-4" style={{ maxWidth: '500px' }}>
            <div className="d-flex align-items-center mb-4 justify-content-center">
              <img
                src="/Life_Cycle-01-1.png"
                alt="Life Cycle Management Logo"
                className="mb-2 me-2"
                style={{ width: '80px' }}
              />
              <h2 style={{ color: '#226195' }}>LIFE CYCLE MANAGEMENT</h2>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username Saat Ini</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Masukkan Username Saat Ini"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">Password Baru</label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  placeholder="Masukkan Password Baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  style={{ borderRadius: '20px', padding: '10px 15px' }}
                >
                  Simpan
                </Button>
                <Link
                  to="/"
                  className="btn btn-secondary w-100 mt-3 ms-2"
                  style={{ borderRadius: '20px', padding: '10px 15px' }}
                >
                  Batal
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LupaPassword;
