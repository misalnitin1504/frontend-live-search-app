import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;

  // 🚪 Logout Handler
  const handleLogout = async () => {
    try {
      // It's good practice to notify the server to clear the session cookie
      await axios.post("http://localhost:8080/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always redirect to login and clear local storage if used
      window.location.href = "/";
    }
  };

  // 1. Debounce Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  // 2. API Call
  useEffect(() => {
    setLoading(true);
    axios
      //.get("http://localhost:8080/api/users/search", {
      .get("https://backend-livesearchfilter-8.onrender.com/api/users", {
        params: { keyword: debouncedKeyword || "" },
        withCredentials: true,
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [debouncedKeyword]);

  // 3. Highlight Function
  const highlightText = (text, highlight) => {
    if (!highlight || !highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "g");
    const parts = String(text).split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-warning p-0 px-1 fw-bold">{part}</mark>
      ) : (part)
    );
  };

  // 4. Pagination Calculations
  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);

  return (
    <div className="container mt-5">
      <style>{`
        .custom-pagination { display: flex; list-style: none; padding: 0; margin: 0; gap: 5px; }
        .custom-pagination li { display: inline-block; }
      `}</style>

      <div className="card shadow-sm border-0">
        {/* Updated Header with Logout Button */}
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
          <div style={{ width: "80px" }}></div> {/* Spacer to help center the title */}
          <h4 className="mb-0 flex-grow-1 text-center">Live Search Filter App (Debounce + Pagination + Case-Sencetive)</h4>
          <button 
            className="btn btn-outline-light btn-sm fw-bold px-3"
            onClick={handleLogout}
          >
            Logout ➡
          </button>
        </div>

        <div className="card-body">
          {/* Search Box */}
          <div className="mb-4">
            <label className="form-label small text-muted fw-bold text-uppercase">Quick Search</label>
            <input
              type="text"
              className="form-control shadow-none border-2"
              placeholder="Search by ID, Name, or Email..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="table-responsive border rounded">
            <table className="table table-hover mb-0">
              <thead className="table-light text-uppercase small fw-bold">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="text-muted fw-bold">#{highlightText(String(user.id), debouncedKeyword)}</td>
                      <td>{highlightText(user.name, debouncedKeyword)}</td>
                      <td>{highlightText(user.email, debouncedKeyword)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-5">
                      {loading ? (
                        <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                      ) : "No matching users found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Area */}
          {users.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <small className="text-muted">
                Showing <strong>{indexOfFirst + 1}</strong> to <strong>{Math.min(indexOfLast, users.length)}</strong> of <strong>{users.length}</strong>
              </small>

              {totalPages > 1 && (
                <ul className="custom-pagination">
                  <li>
                    <button 
                      className="btn btn-sm btn-outline-dark" 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      &laquo;
                    </button>
                  </li>

                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i}>
                      <button 
                        className={`btn btn-sm ${currentPage === i + 1 ? "btn-dark" : "btn-outline-dark"}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li>
                    <button 
                      className="btn btn-sm btn-outline-dark" 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;