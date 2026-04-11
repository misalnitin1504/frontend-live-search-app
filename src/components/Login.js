import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
// IMPORT THE CSS FILE HERE
//import "./App.css";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordRegex.test(password)) {
      setError("Password must be 8+ chars with uppercase, lowercase, number, and symbol.");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      await axios.post("https://backend-livesearchfilter-12.onrender.com/login", params, {
        withCredentials: true,
      });

      window.location.href = "/home";
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-body">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            
            <div className="card login-card p-4 shadow-lg border-0">
              <h3 className="text-center mb-4 fw-bold text-primary">Login</h3>

              <form onSubmit={handleLogin}>
                {/* Table for structured alignment */}
                <table className="table table-borderless align-middle">
                  <tbody>
                    <tr>
                      <td style={{ width: "30%" }}>
                        <label className="fw-bold text-secondary">Username</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          className={`form-control shadow-none ${error && !username ? "is-invalid" : ""}`}
                          placeholder="User Name"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <label className="fw-bold text-secondary">Password</label>
                      </td>
                      <td>
                        <input
                          type="password"
                          className={`form-control shadow-none ${error && !passwordRegex.test(password) ? "is-invalid" : ""}`}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 🔴 Error Message Row */}
                {error && (
                  <div className="alert alert-danger small py-2 fw-bold text-center border-0 mb-3">
                    {error}
                  </div>
                )}

                <div className="px-2">
                  <button type="submit" className="btn btn-primary btn-login w-100 fw-bold shadow-sm">
                    LOG IN
                  </button>
                </div>
              </form>

             </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;