import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  const loadAll = async () => {
    try {
      setLoading(true);
      const res = await api.get("/research/mystudent");
      setResearches(res.data || []);
    } catch (e) {
      alert(e?.response?.data?.message || "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const feedback = feedbackMap[id] || "";
      const res = await api.put(`/research/update/${id}`, { status, feedback });
      setResearches((prev) => prev.map((r) => (r._id === id ? res.data.research : r)));
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const teacherResearches = researches;
  const studentMap = {};
  teacherResearches.forEach((r) => {
      const s = r.student;
      if (!s || !s._id) return;
      if (!studentMap[s._id]) studentMap[s._id] = { id: s._id, name: s.name, email: s.email, count: 0 };
      studentMap[s._id].count += 1;
    });
    const students = Object.values(studentMap).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  const filteredResearches = selectedStudent ? teacherResearches.filter((r) => r?.student?._id === selectedStudent.id) : teacherResearches;

  return (
    <div className="dashboard fade-in">
      <div className="header">
        <div className="title">Teacher Dashboard</div>
        <button className="btn ghost" onClick={logout}>
          <svg viewBox="0 0 24 24" style={{width:18,height:18}}><path fill="currentColor" d="M16 13v-2H7V8l-5 4 5 4v-3h9Z"/></svg>
          Logout
        </button>
      </div>

      {loading ? (
        <div className="card">Loading...</div>
      ) : (
        <div className="students-layout">
          <div className="card section-card">
            <h3 style={{marginTop:0}}>Students</h3>
            <div className="small" style={{marginBottom:8}}>Select a student to view their research</div>
            <div style={{display:'grid', gap:8}}>
              <button
                className={`btn ghost`}
                style={{justifyContent:'space-between'}}
                onClick={() => setSelectedStudent(null)}
              >
                <span style={{display:'inline-flex', alignItems:'center', gap:10}}>
                  <svg viewBox="0 0 24 24" style={{width:20,height:20, fill:'var(--secondary)'}}><path d="M12 2a10 10 0 100 20 10 10 0 000-20Z"/></svg>
                  All Students
                </span>
                <span className="small">{teacherResearches.length}</span>
              </button>

              {students.map((s) => (
                <button
                  key={s.id}
                  className={`btn ghost ${selectedStudent?.id === s.id ? 'secondary' : ''}`}
                  style={{justifyContent:'space-between'}}
                  onClick={() => setSelectedStudent(s)}
                >
                  <span style={{display:'inline-flex', alignItems:'center', gap:10}}>
                    <svg viewBox="0 0 24 24" style={{width:20,height:20, fill:'var(--secondary)'}}><path d="M12 2a10 10 0 100 20 10 10 0 000-20Zm0 5a3 3 0 110 6 3 3 0 010-6Z"/></svg>
                    <span>
                      <div style={{fontWeight:700}}>{s.name || 'Unknown'}</div>
                      <div className="small">{s.email}</div>
                    </span>
                  </span>
                  <span className="small">{s.count}</span>
                </button>
              ))}

              {students.length === 0 && (
                <div className="small">No students found.</div>
              )}
            </div>
          </div>

          <div>
            <div className="card section-card" style={{marginBottom:12}}>
              <h3 style={{marginTop:0}}>
                {selectedStudent ? `Research by ${selectedStudent.name}` : 'All Research'}
              </h3>
              {selectedStudent && (
                <div className="small">{selectedStudent.email}</div>
              )}
            </div>

            <div className="research-grid">
              {filteredResearches.map((r) => (
                <div key={r._id} className="card research-card">
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h4 style={{margin:'6px 0'}}>{r.title}</h4>
                    <span className={`status ${r.status}`}>{r.status}</span>
                  </div>
                  <div className="small">{r.description}</div>
                  <div className="small" style={{marginTop:6}}>
                    <strong>Student:</strong> {r?.student?.name} ({r?.student?.email})
                  </div>

                  {r.feedback && (
                    <div style={{marginTop:8}}>
                      <strong>Prev Feedback:</strong>
                      <div className="small">{r.feedback}</div>
                    </div>
                  )}

                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Feedback (optional)"
                    value={feedbackMap[r._id] || ""}
                    onChange={(e) => setFeedbackMap({ ...feedbackMap, [r._id]: e.target.value })}
                  />

                  <div style={{display:'flex', gap:8}}>
                    <button className="btn" onClick={() => updateStatus(r._id, "under_review")}>Under Review</button>
                    <button className="btn" onClick={() => updateStatus(r._id, "approved")}>Approve</button>
                    <button className="btn secondary" onClick={() => updateStatus(r._id, "rejected")}>Reject</button>
                  </div>
                </div>
              ))}

              {filteredResearches.length === 0 && (
                <div className="small">No research submissions for this selection yet.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;