import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", email);

      if (res.data.role === "student") {
        navigate("/student");
      } else {
        navigate("/teacher");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container fade-in">
      <form onSubmit={handleLogin} className="auth-card">
        <h2 className="auth-title">
          <svg className="auth-icon" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20Zm0 5a3 3 0 110 6 3 3 0 010-6Zm0 8c2.67 0 5.33 1.34 6 4H6c.67-2.66 3.33-4 6-4Z"/></svg>
          Welcome back
        </h2>

        {error && <div className="card" style={{marginTop:8, marginBottom:12, color:'#ffb4b4'}}>{error}</div>}

        <input
          className="input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn" type="submit">Login</button>

        <div className="small" style={{marginTop:12}}>
          New here? <Link to="/register" className="link">Create an account</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;