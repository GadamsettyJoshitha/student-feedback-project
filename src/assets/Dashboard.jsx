import React, { useEffect, useState } from "react";
import "./App.css";

const LOCAL_USERS_KEY = "sf_users_v1";
const LOCAL_FEEDBACKS_KEY = "sf_feedbacks_v1";
const LOCAL_USER_KEY = "sf_current_user_v1";

export default function App() {
  // load from localStorage or fallback to demo data
  const loadUsers = () => {
    try {
      const raw = localStorage.getItem(LOCAL_USERS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore parse error */ }
    return [
      { username: "admin", password: "admin123", role: "admin", fullName: "Administrator" },
      { username: "student", password: "student123", role: "student", fullName: "Demo Student", studentId: "S100" },
      { username: "teacher", password: "teacher123", role: "teacher", fullName: "Prof. Alice", instructorName: "Prof. Alice" },
    ];
  };

  const loadFeedbacks = () => {
    try {
      const raw = localStorage.getItem(LOCAL_FEEDBACKS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  };

  const loadCurrentUser = () => {
    try {
      const raw = localStorage.getItem(LOCAL_USER_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  };

  const [users, setUsers] = useState(loadUsers);
  const [feedbacks, setFeedbacks] = useState(loadFeedbacks);
  const [user, setUser] = useState(loadCurrentUser);

  // If there's a logged-in user, set the initial page to their role; otherwise login
  const initialPage = user ? user.role : "login";
  const [page, setPage] = useState(initialPage);

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "student",
    fullName: "",
    studentId: "",
    instructorName: "",
  });

  const questionList = [
    { id: "teachingQuality", label: "Teaching Quality" },
    { id: "courseContent", label: "Course Content" },
    { id: "presentation", label: "Presentation / Clarity" },
    { id: "assessment", label: "Assessment Fairness" },
    { id: "practicalRelevance", label: "Practical Relevance" },
    { id: "supportServices", label: "Support Services" },
  ];

  const [courses] = useState([
    "Introduction to Computer Science",
    "Calculus I",
    "Physics I",
    "Chemistry",
    "Biology",
    "Data Structures",
    "Operating Systems",
  ]);

  const emptyFeedback = () => {
    const base = { studentName: "", studentId: "", course: "", instructor: "", comments: "" };
    questionList.forEach((q) => (base[q.id] = ""));
    return base;
  };
  const [form, setForm] = useState(emptyFeedback());

  // Persist users, feedbacks and current user to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    } catch (e) {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_FEEDBACKS_KEY, JSON.stringify(feedbacks));
    } catch (e) {}
  }, [feedbacks]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(LOCAL_USER_KEY);
    } catch (e) {}
  }, [user]);

  // keep page synced to user role
  useEffect(() => {
    setPage(user ? user.role : "login");
  }, [user]);

  // Login
  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = users.find((u) => u.username === loginData.username);
    if (!foundUser) {
      alert("❌ User does not exist!");
      return;
    }
    if (foundUser.password !== loginData.password) {
      alert("❌ Wrong password!");
      return;
    }
    setUser(foundUser);
    setPage(foundUser.role);
    if (foundUser.role === "student") {
      setForm((prev) => ({ ...prev, studentName: foundUser.fullName || "", studentId: foundUser.studentId || "" }));
    }
    setLoginData({ username: "", password: "" });
  };

  // Register
  const handleRegister = (e) => {
    e.preventDefault();
    if (!registerData.username || !registerData.password || !registerData.fullName) {
      alert("Please fill username, password and full name.");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (users.some((u) => u.username === registerData.username)) {
      alert("Username already taken. Choose another one.");
      return;
    }
    const newUser = {
      username: registerData.username,
      password: registerData.password,
      role: registerData.role,
      fullName: registerData.fullName,
    };
    if (registerData.role === "student") newUser.studentId = registerData.studentId || "";
    if (registerData.role === "teacher") newUser.instructorName = registerData.instructorName || registerData.fullName;

    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setPage(newUser.role);
    if (newUser.role === "student") {
      setForm((prev) => ({ ...prev, studentName: newUser.fullName || "", studentId: newUser.studentId || "" }));
    }
    setRegisterData({ username: "", password: "", confirmPassword: "", role: "student", fullName: "", studentId: "", instructorName: "" });
    alert("✅ Account created and logged in!");
  };

  // Submit feedback (students)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.course || !form.instructor) {
      alert("Please choose a course and enter instructor name.");
      return;
    }
    const normalized = { ...form };
    questionList.forEach((q) => {
      normalized[q.id] = Number(normalized[q.id]) || 0;
    });
    normalized._submittedBy = user?.username || "anonymous";
    normalized._submittedAt = new Date().toISOString();

    setFeedbacks((prev) => [...prev, normalized]);
    setForm({ ...emptyFeedback(), studentName: user?.fullName || "", studentId: user?.studentId || "" });
    alert("✅ Feedback submitted successfully!");
  };

  const calculateAverage = (field) => {
    if (feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((sum, f) => sum + Number(f[field] || 0), 0);
    return (total / feedbacks.length).toFixed(2);
  };

  const getTeacherFeedbacks = () => {
    if (!user || user.role !== "teacher") return [];
    const name = user.instructorName || user.fullName || user.username;
    return feedbacks.filter((f) => f.instructor && f.instructor === name);
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
    setForm(emptyFeedback());
  };

  return (
    <div className="container">
      {page === "login" && (
        <div className="card login-card">
          <h1>🎓 Student Feedback System</h1>
          <h3>Login</h3>
          <form onSubmit={handleLogin}>
            <label>
              Username:
              <input type="text" value={loginData.username} onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} required />
            </label>

            <label>
              Password:
              <input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
            </label>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button type="submit">Login</button>
              <button type="button" onClick={() => setPage("register")}>Create account</button>
            </div>
          </form>

          <p className="hint">
            💡 Try: <br />
            <b>Admin:</b> admin / admin123 <br />
            <b>Student:</b> student / student123 <br />
            <b>Teacher:</b> teacher / teacher123
          </p>
        </div>
      )}

      {page === "register" && (
        <div className="card">
          <div className="header">
            <h2>➕ Create Account</h2>
            <button onClick={() => setPage("login")}>Back to Login</button>
          </div>

          <form onSubmit={handleRegister}>
            <label>
              Username:
              <input type="text" value={registerData.username} onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} required />
            </label>

            <label>
              Password:
              <input type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required />
            </label>

            <label>
              Confirm Password:
              <input type="password" value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} required />
            </label>

            <label>
              Role:
              <select value={registerData.role} onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label>
              Full Name:
              <input type="text" value={registerData.fullName} onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })} required />
            </label>

            {registerData.role === "student" && (
              <label>
                Student ID:
                <input type="text" value={registerData.studentId} onChange={(e) => setRegisterData({ ...registerData, studentId: e.target.value })} />
              </label>
            )}

            {registerData.role === "teacher" && (
              <label>
                Instructor Name (how students will select you):
                <input type="text" value={registerData.instructorName} onChange={(e) => setRegisterData({ ...registerData, instructorName: e.target.value })} />
              </label>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">Create Account & Login</button>
              <button type="button" onClick={() => setPage("login")}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {page === "student" && (
        <div className="card">
          <div className="header">
            <h2>🧑‍🎓 Student Dashboard</h2>
            <div>
              <span style={{ marginRight: 12 }}>{user?.fullName || user?.username}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>

          <p><b>Account:</b> {user?.username} {user?.studentId ? `| ID: ${user.studentId}` : ""}</p>

          <form onSubmit={handleSubmit}>
            <label>
              Student Name:
              <input type="text" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} required />
            </label>

            <label>
              Student ID:
              <input type="text" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required />
            </label>

            <label>
              Course Name:
              <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} required>
                <option value="">-- Select course --</option>
                {courses.map((c, i) => (<option key={i} value={c}>{c}</option>))}
              </select>
            </label>

            <label>
              Instructor Name:
              <input type="text" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} required placeholder="Enter instructor name exactly as registered" />
            </label>

            <fieldset style={{ border: "1px solid #ddd", padding: 12 }}>
              <legend>Rate the following (1 = Poor, 5 = Excellent)</legend>
              {questionList.map((q) => (
                <label key={q.id} style={{ display: "block", marginBottom: 8 }}>
                  {q.label}:
                  <select value={form[q.id]} onChange={(e) => setForm({ ...form, [q.id]: e.target.value })}>
                    <option value="">--</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </label>
              ))}
            </fieldset>

            <label>
              Additional Comments:
              <textarea value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} />
            </label>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">Submit Feedback</button>
              <button type="button" onClick={() => setForm({ ...emptyFeedback(), studentName: user?.fullName || "", studentId: user?.studentId || "" })}>Clear</button>
            </div>
          </form>

          <p style={{ marginTop: 16, color: "#666" }}>
            Note: Feedback results are visible only to teachers. Students cannot view submitted answers.
          </p>
        </div>
      )}

      {page === "teacher" && (
        <div className="card">
          <div className="header">
            <h2>👩‍🏫 Teacher Dashboard</h2>
            <div>
              <span style={{ marginRight: 12 }}>{user?.fullName || user?.username}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>

          <p>Feedbacks for: <b>{user?.instructorName || user?.fullName}</b></p>

          {getTeacherFeedbacks().length === 0 ? (
            <p>No feedbacks for your name yet.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Course</th>
                    {questionList.map((q) => (<th key={q.id}>{q.label}</th>))}
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {getTeacherFeedbacks().map((f, idx) => (
                    <tr key={idx}>
                      <td>{new Date(f._submittedAt).toLocaleString()}</td>
                      <td>{f.studentName || f.studentId || f._submittedBy}</td>
                      <td>{f.course}</td>
                      {questionList.map((q) => (<td key={q.id}>{f[q.id] || "—"}</td>))}
                      <td>{f.comments || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {page === "admin" && (
        <div className="card">
          <div className="header">
            <h2>📊 Admin Dashboard (Aggregates only)</h2>
            <div>
              <span style={{ marginRight: 12 }}>{user?.fullName || user?.username}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>

          <p>Total Feedbacks: {feedbacks.length}</p>
          <div className="stats">
            {questionList.map((q) => (<p key={q.id}>Average {q.label}: {calculateAverage(q.id)}</p>))}
          </div>

          <h4 style={{ marginTop: 16 }}>Feedbacks by Course</h4>
          {courses.map((c) => (<p key={c}>{c}: {feedbacks.filter(f => f.course === c).length}</p>))}

          <h4 style={{ marginTop: 16 }}>Registered Users</h4>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Student ID / Instructor Name</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={idx}>
                  <td>{u.username}</td>
                  <td>{u.fullName}</td>
                  <td>{u.role}</td>
                  <td>{u.studentId || u.instructorName || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
