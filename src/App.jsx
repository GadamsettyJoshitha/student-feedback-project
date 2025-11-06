import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("login"); // login | student | admin
  const [user, setUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  const [loginData, setLoginData] = useState({ username: "", password: "", role: "student" });

  const [form, setForm] = useState({
    studentName: "",
    studentId: "",
    course: "",
    instructor: "",
    teachingQuality: "",
    courseContent: "",
    supportServices: "",
    comments: "",
  });

  // Hardcoded credentials (for demo)
  const users = {
    admin: { username: "admin", password: "admin123", role: "admin" },
    student: { username: "student", password: "student123", role: "student" },
  };

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser =
      loginData.role === "admin" ? users.admin : users.student;

    if (
      loginData.username === foundUser.username &&
      loginData.password === foundUser.password
    ) {
      setUser(foundUser);
      setPage(foundUser.role);
    } else {
      alert("❌ Invalid credentials!");
    }
  };

  // Handle feedback submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.course || !form.instructor) {
      alert("Please fill all required fields!");
      return;
    }

    setFeedbacks([...feedbacks, form]);
    setForm({
      studentName: "",
      studentId: "",
      course: "",
      instructor: "",
      teachingQuality: "",
      courseContent: "",
      supportServices: "",
      comments: "",
    });
    alert("✅ Feedback submitted successfully!");
  };

  // Admin average calculator
  const calculateAverage = (field) => {
    if (feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((sum, f) => sum + Number(f[field] || 0), 0);
    return (total / feedbacks.length).toFixed(2);
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    setPage("login");
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
              <input
                type="text"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                required
              />
            </label>

            <label>
              Password:
              <input
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </label>

            <label>
              Role:
              <select
                value={loginData.role}
                onChange={(e) =>
                  setLoginData({ ...loginData, role: e.target.value })
                }
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <button type="submit">Login</button>
          </form>
          <p className="hint">
            💡 Try: <br />
            <b>Admin:</b> admin / admin123 <br />
            <b>Student:</b> student / student123
          </p>
        </div>
      )}

      {page === "student" && (
        <div className="card">
          <div className="header">
            <h2>🧑‍🎓 Student Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <form onSubmit={handleSubmit}>
            <label>
              Student Name:
              <input
                type="text"
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                required
              />
            </label>

            <label>
              Student ID:
              <input
                type="text"
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                required
              />
            </label>

            <label>
              Course Name:
              <input
                type="text"
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                required
              />
            </label>

            <label>
              Instructor Name:
              <input
                type="text"
                value={form.instructor}
                onChange={(e) =>
                  setForm({ ...form, instructor: e.target.value })
                }
                required
              />
            </label>

            <label>
              Teaching Quality (1–5):
              <input
                type="number"
                min="1"
                max="5"
                value={form.teachingQuality}
                onChange={(e) =>
                  setForm({ ...form, teachingQuality: e.target.value })
                }
              />
            </label>

            <label>
              Course Content (1–5):
              <input
                type="number"
                min="1"
                max="5"
                value={form.courseContent}
                onChange={(e) =>
                  setForm({ ...form, courseContent: e.target.value })
                }
              />
            </label>

            <label>
              Support Services (1–5):
              <input
                type="number"
                min="1"
                max="5"
                value={form.supportServices}
                onChange={(e) =>
                  setForm({ ...form, supportServices: e.target.value })
                }
              />
            </label>

            <label>
              Additional Comments:
              <textarea
                value={form.comments}
                onChange={(e) => setForm({ ...form, comments: e.target.value })}
              />
            </label>

            <button type="submit">Submit Feedback</button>
          </form>
        </div>
      )}

      {page === "admin" && (
        <div className="card">
          <div className="header">
            <h2>📊 Admin Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <p>Total Feedbacks: {feedbacks.length}</p>
          <div className="stats">
            <p>Average Teaching Quality: {calculateAverage("teachingQuality")}</p>
            <p>Average Course Content: {calculateAverage("courseContent")}</p>
            <p>Average Support Services: {calculateAverage("supportServices")}</p>
          </div>

          <h3>🗂 All Feedbacks</h3>
          {feedbacks.length === 0 ? (
            <p>No feedback submitted yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Teaching</th>
                  <th>Content</th>
                  <th>Support</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((f, i) => (
                  <tr key={i}>
                    <td>{f.studentName}</td>
                    <td>{f.course}</td>
                    <td>{f.instructor}</td>
                    <td>{f.teachingQuality}</td>
                    <td>{f.courseContent}</td>
                    <td>{f.supportServices}</td>
                    <td>{f.comments || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
