import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [myResearch, setMyResearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedGuideId, setSelectedGuideId] = useState("");
  const navigate = useNavigate();

  const fetchMyResearch = async () => {
    try {
      setLoading(true);
      const res = await api.get("/research/my");
      setMyResearch(res.data || []);
    } catch {
      alert("Failed to load your research");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/auth/teachers");
      setTeachers(res.data || []);
    } catch {
      alert("Failed to load teachers");
    }
  };

  useEffect(() => {
    fetchMyResearch();
    fetchTeachers();
  }, []);

  const submitResearch = async () => {
    try {
      if (!selectedGuideId) {
        alert("Please select a teacher to assign as guide");
        return;
      }
      await api.post("/research/submit", {
        title,
        description,
        documentUrl,
        guideId: selectedGuideId,
      });
      setTitle(""); setDescription(""); setDocumentUrl(""); setSelectedGuideId("");
      fetchMyResearch();
      alert("Research submitted");
    } catch (error) {
      alert(error?.response?.data?.message || "Submission failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/");
  };

  const email = localStorage.getItem("email") || "Student";
  const role = localStorage.getItem("role") || "student";

  return (
    <div className="dashboard fade-in">
      <div className="header">
        <div className="title">Student Dashboard</div>
        <button className="btn ghost" onClick={logout}>
          <svg viewBox="0 0 24 24" style={{width:18,height:18}}><path fill="currentColor" d="M16 13v-2H7V8l-5 4 5 4v-3h9Z"/></svg>
          Logout
        </button>
      </div>

      <div className="grid">
        <div className="card section-card">
          <h3 className="small" style={{marginTop:0}}>Profile</h3>
          <div style={{display:'flex', gap:16, alignItems:'center'}}>
            <svg viewBox="0 0 24 24" style={{width:34,height:34, fill:'var(--secondary)'}}><path d="M12 2a10 10 0 100 20 10 10 0 000-20Zm0 5a3 3 0 110 6 3 3 0 010-6Zm0 8c2.67 0 5.33 1.34 6 4H6c.67-2.66 3.33-4 6-4Z"/></svg>
            <div>
              <div style={{fontWeight:700}}>{email}</div>
              <div className="small">Role: {role}</div>
            </div>
          </div>
        </div>

        <div className="card section-card">
          <h3 style={{marginTop:0}}>Submit Research</h3>
          <input className="input" placeholder="Research Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          <input className="input" placeholder="Document URL (optional)" value={documentUrl} onChange={(e) => setDocumentUrl(e.target.value)} />
          <div className="small" style={{marginTop:8, marginBottom:4}}>Assign Teacher (Guide)</div>
          <select className="input" value={selectedGuideId} onChange={(e) => setSelectedGuideId(e.target.value)}>
            <option value="">Select a teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
            ))}
          </select>
          <button className="btn" onClick={submitResearch}>Submit</button>
        </div>
      </div>

      <div className="card section-card" style={{marginTop:16}}>
        <h3 style={{marginTop:0}}>My Research</h3>
        {loading ? (
          <div className="small">Loading...</div>
        ) : (
          <div className="scrolling-wrapper">
            {myResearch.length === 0 && <div className="small">No submissions yet.</div>}
            {myResearch.map((r) => (
              <div key={r._id} className="card research-card">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <h4 style={{margin:'6px 0'}}>{r.title}</h4>
                  <span className={`status ${r.status}`}>
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20Zm5 7-6 6-3-3 1.41-1.41L11 12.17l4.59-4.59L17 9Z"/></svg>
                    {r.status}
                  </span>
                </div>
                <div className="small">{r.description}</div>
                {r.documentUrl && (
                  <div style={{marginTop:8}}>
                    <a className="link" href={r.documentUrl} target="_blank" rel="noreferrer">View Document</a>
                  </div>
                )}
                {r.feedback && (
                  <div style={{marginTop:8}}>
                    <strong>Feedback:</strong>
                    <div className="small">{r.feedback}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;