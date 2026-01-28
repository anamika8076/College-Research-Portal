import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);
      alert("Registered successfully");
      navigate("/");
    } catch (error) {
      setError(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container fade-in">
      <form onSubmit={handleRegister} className="auth-card">
        <h2 className="auth-title">
          <svg className="auth-icon" viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4 2.5 7-7-4.5-7 4.5L7.5 13 2 9h7z"/></svg>
          Create your account
        </h2>

        {error && <div className="card" style={{marginTop:8, marginBottom:12, color:'#ffb4b4'}}>{error}</div>}

        <input
          className="input"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="input"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="input"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <button className="btn" type="submit">Register</button>

        <div className="small" style={{marginTop:12}}>
          Already have an account? <Link to="/" className="link">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;