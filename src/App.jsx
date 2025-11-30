import React, { useState } from "react";
import "./App.css";

/* ---------- PIE CHART COMPONENT (no external libs) ---------- */
function PieChart({ counts = [], labels = [], size = 160, colors = null }) {
  const total = counts.reduce((s, v) => s + (v || 0), 0);
  const r = Math.floor(size / 2) - 6;
  const c = 2 * Math.PI * r;
  const strokeWidth = Math.max(12, Math.floor(size / 12));
  const defaultColors = ["#2b7df7", "#34d399", "#f59e0b", "#f97316", "#ef4444"];
  const sliceColors = colors && colors.length >= counts.length ? colors : defaultColors;

  let offset = 0;
  const segments = counts.map((value, idx) => {
    const portion = total === 0 ? 0 : value / total;
    const dash = Math.max(0, Math.round(portion * c));
    const seg = { dash, offset, color: sliceColors[idx % sliceColors.length], value, portion, index: idx };
    offset += dash;
    return seg;
  });

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <svg width={size} height={size} style={{ flex: "0 0 auto" }}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle r={r} cx="0" cy="0" fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
          {segments.map((s, i) => {
            const dashArray = `${s.dash} ${Math.max(0, c - s.dash)}`;
            return (
              <circle
                key={i}
                r={r}
                cx="0"
                cy="0"
                fill="none"
                stroke={s.color}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={-s.offset}
                transform="rotate(-90)"
                strokeLinecap="butt"
              />
            );
          })}
          <circle r={r - strokeWidth - 2} cx="0" cy="0" fill="#fff" stroke="none" />
          <text x="0" y="-6" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f172a">
            {total}
          </text>
          <text x="0" y="12" textAnchor="middle" fontSize="11" fill="#6b7280">
            responses
          </text>
        </g>
      </svg>

      <div style={{ minWidth: 120 }}>
        {segments.map((s, i) => {
          const percent = total === 0 ? 0 : Math.round((s.portion || 0) * 100);
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 14, height: 14, background: s.color, display: "inline-block", borderRadius: 3 }} />
                <span style={{ fontSize: 13, color: "#0f172a" }}>{labels[i] || `${i + 1}`}</span>
              </div>
              <div style={{ fontSize: 13, color: "#374151", minWidth: 36, textAlign: "right" }}>
                {s.value} ({percent}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- CAPTCHA HELPERS ---------- */
// simple arithmetic captcha generator
function generateCaptcha() {
  // pick two small numbers and an operator
  const a = Math.floor(Math.random() * 9) + 1; // 1..9
  const b = Math.floor(Math.random() * 9) + 1;
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let question = `${a} ${op} ${b}`;
  let answer;
  if (op === "+") answer = a + b;
  else if (op === "-") answer = a - b;
  else answer = a * b;

  return { question, answer };
}

/* ---------- MAIN APP ---------- */

export default function App() {
  const [page, setPage] = useState("login"); // login | register | student | teacher | admin
  const [user, setUser] = useState(null);

  // demo users
  const [users, setUsers] = useState([
    { username: "admin", password: "admin123", role: "admin", fullName: "Administrator" },
    { username: "student", password: "student123", role: "student", fullName: "Demo Student", studentId: "S100", department: "CSE" },
    { username: "teacher", password: "teacher123", role: "teacher", fullName: "Prof. Alice", instructorName: "Prof. Alice" },
  ]);

  // list of departments
  const [departments] = useState(["CSE", "ECE", "ME", "CE", "BT"]);

  // full course catalog
  const [courses] = useState([
    "Introduction to Computer Science",
    "Data Structures",
    "Operating Systems",
    "Calculus I",
    "Physics I",
    "Chemistry",
    "Biology",
    "Signals and Systems",
    "Thermodynamics",
    "Structural Analysis",
    "Concrete Technology",
    "Surveying",
  ]);

  // map course -> department
  const [courseDepartments] = useState({
    "Introduction to Computer Science": "CSE",
    "Data Structures": "CSE",
    "Operating Systems": "CSE",
    "Calculus I": "ME",
    "Physics I": "ME",
    "Chemistry": "BT",
    "Biology": "BT",
    "Signals and Systems": "ECE",
    "Thermodynamics": "ME",
    "Structural Analysis": "CE",
    "Concrete Technology": "CE",
    "Surveying": "CE",
  });

  // course -> default instructor mapping
  const [courseInstructors] = useState({
    "Introduction to Computer Science": "Prof. Alice",
    "Data Structures": "Prof. Alice",
    "Operating Systems": "Dr. Banerjee",
    "Calculus I": "Dr. Kumar",
    "Physics I": "Dr. Mehta",
    "Chemistry": "Dr. Rao",
    "Biology": "Dr. Sharma",
    "Signals and Systems": "Dr. Iyer",
    "Thermodynamics": "Dr. Singh",
    "Structural Analysis": "Dr. Gupta",
    "Concrete Technology": "Dr. Verma",
    "Surveying": "Dr. Reddy",
  });

  const [feedbacks, setFeedbacks] = useState([]);

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginCaptcha, setLoginCaptcha] = useState(generateCaptcha());
  const [loginCaptchaInput, setLoginCaptchaInput] = useState("");

  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "student",
    fullName: "",
    studentId: "",
    instructorName: "",
    department: "CSE",
  });
  const [registerCaptcha, setRegisterCaptcha] = useState(generateCaptcha());
  const [registerCaptchaInput, setRegisterCaptchaInput] = useState("");

  const questionList = [
    { id: "teachingQuality", label: "Teaching Quality" },
    { id: "courseContent", label: "Course Content" },
    { id: "presentation", label: "Presentation / Clarity" },
    { id: "assessment", label: "Assessment Fairness" },
    { id: "practicalRelevance", label: "Practical Relevance" },
    { id: "supportServices", label: "Support Services" },
  ];

  const emptyFeedback = () => {
    const base = { studentName: "", studentId: "", course: "", instructor: "", comments: "" };
    questionList.forEach((q) => (base[q.id] = ""));
    return base;
  };
  const [form, setForm] = useState(emptyFeedback());

  // LOGIN
  const handleLogin = (e) => {
    e.preventDefault();

    // captcha check
    if (String(loginCaptchaInput).trim() === "") {
      alert("Please answer the CAPTCHA.");
      return;
    }
    if (Number(loginCaptchaInput) !== loginCaptcha.answer) {
      alert("CAPTCHA incorrect. Please try again.");
      setLoginCaptcha(generateCaptcha());
      setLoginCaptchaInput("");
      return;
    }

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
      setForm((prev) => ({
        ...prev,
        studentName: foundUser.fullName || "",
        studentId: foundUser.studentId || "",
      }));
    }
    setLoginData({ username: "", password: "" });
    setLoginCaptcha(generateCaptcha());
    setLoginCaptchaInput("");
  };

  // REGISTER
  const handleRegister = (e) => {
    e.preventDefault();

    // captcha check
    if (String(registerCaptchaInput).trim() === "") {
      alert("Please answer the CAPTCHA.");
      return;
    }
    if (Number(registerCaptchaInput) !== registerCaptcha.answer) {
      alert("CAPTCHA incorrect. Please try again.");
      setRegisterCaptcha(generateCaptcha());
      setRegisterCaptchaInput("");
      return;
    }

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
    if (registerData.role === "student") {
      newUser.studentId = registerData.studentId || "";
      newUser.department = registerData.department || departments[0];
    }
    if (registerData.role === "teacher") newUser.instructorName = registerData.instructorName || registerData.fullName;
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setPage(newUser.role);
    if (newUser.role === "student") {
      setForm((prev) => ({ ...prev, studentName: newUser.fullName || "", studentId: newUser.studentId || "" }));
    }
    setRegisterData({ username: "", password: "", confirmPassword: "", role: "student", fullName: "", studentId: "", instructorName: "", department: "CSE" });
    setRegisterCaptcha(generateCaptcha());
    setRegisterCaptchaInput("");
    alert("✅ Account created and logged in!");
  };

  // Submit feedback
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
    setLoginData({ username: "", password: "" });
  };

  // auto-fill instructor when course changes
  const handleCourseChange = (courseValue) => {
    const defaultInstructor = courseInstructors[courseValue] || "";
    setForm((prev) => ({ ...prev, course: courseValue, instructor: defaultInstructor }));
  };

  // Build counts array for a teacher + question id: returns [count1..count5]
  const buildRatingCounts = (teacherFeedbacks, qid) => {
    const counts = [0, 0, 0, 0, 0];
    teacherFeedbacks.forEach((f) => {
      const v = Number(f[qid]) || 0;
      if (v >= 1 && v <= 5) counts[v - 1] += 1;
    });
    return counts;
  };

  // Helper: courses available for the currently logged-in student (by department)
  const coursesForStudent = (() => {
    if (!user || user.role !== "student") return courses; // fallback: show all (for safety)
    const dept = user.department;
    const filtered = courses.filter((c) => courseDepartments[c] === dept);
    return filtered;
  })();

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

            {/* CAPTCHA */}
            <label>
              CAPTCHA: <span style={{ fontWeight: 700 }}>{loginCaptcha.question}</span>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <input
                  type="number"
                  value={loginCaptchaInput}
                  onChange={(e) => setLoginCaptchaInput(e.target.value)}
                  placeholder="Answer"
                  required
                />
                <button type="button" onClick={() => { setLoginCaptcha(generateCaptcha()); setLoginCaptchaInput(""); }}>
                  Refresh
                </button>
              </div>
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
              <>
                <label>
                  Student ID:
                  <input type="text" value={registerData.studentId} onChange={(e) => setRegisterData({ ...registerData, studentId: e.target.value })} />
                </label>

                <label>
                  Department:
                  <select value={registerData.department} onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}>
                    {departments.map((d) => (<option key={d} value={d}>{d}</option>))}
                  </select>
                </label>
              </>
            )}

            {registerData.role === "teacher" && (
              <label>
                Instructor Name (how students will select you):
                <input type="text" value={registerData.instructorName} onChange={(e) => setRegisterData({ ...registerData, instructorName: e.target.value })} />
              </label>
            )}

            {/* CAPTCHA */}
            <label>
              CAPTCHA: <span style={{ fontWeight: 700 }}>{registerCaptcha.question}</span>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <input
                  type="number"
                  value={registerCaptchaInput}
                  onChange={(e) => setRegisterCaptchaInput(e.target.value)}
                  placeholder="Answer"
                  required
                />
                <button type="button" onClick={() => { setRegisterCaptcha(generateCaptcha()); setRegisterCaptchaInput(""); }}>
                  Refresh
                </button>
              </div>
            </label>

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
              <span style={{ marginRight: 12 }}>{user?.fullName || user?.username} {user?.department ? `| ${user.department}` : ""}</span>
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
              <select
                value={form.course}
                onChange={(e) => handleCourseChange(e.target.value)}
                required
              >
                <option value="">-- Select course --</option>
                {coursesForStudent.length === 0 ? (
                  <option value="" disabled>No courses available for your department</option>
                ) : (
                  coursesForStudent.map((c, i) => (<option key={i} value={c}>{c}</option>))
                )}
              </select>
            </label>

            <label>
              Instructor Name:
              <input
                type="text"
                value={form.instructor}
                onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                required
                placeholder="Instructor name (auto-filled from course, editable)"
              />
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
            <>
              <div style={{ marginBottom: 16 }}>
                <strong>Total responses:</strong> {getTeacherFeedbacks().length}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
                {questionList.map((q) => {
                  const counts = buildRatingCounts(getTeacherFeedbacks(), q.id);
                  const labels = ["1", "2", "3", "4", "5"];
                  return (
                    <div key={q.id} style={{ background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 6px 16px rgba(15,23,42,0.04)" }}>
                      <div style={{ fontWeight: 700, marginBottom: 10 }}>{q.label}</div>
                      <PieChart counts={counts} labels={labels} size={160} />
                    </div>
                  );
                })}
              </div>

              <hr style={{ margin: "18px 0", border: "none", borderTop: "1px solid #eef2ff" }} />

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
            </>
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
                <th>Student ID / Instructor Name / Department</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={idx}>
                  <td>{u.username}</td>
                  <td>{u.fullName}</td>
                  <td>{u.role}</td>
                  <td>{u.studentId || u.instructorName || "—"} {u.department ? `| ${u.department}` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
