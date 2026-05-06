import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { CheckCircle2, LayoutDashboard, LogOut, Plus, Shield, Users } from "lucide-react";
import "./styles.css";

const statusLabels = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done"
};

const blankProject = { name: "", description: "" };
const blankTask = { title: "", description: "", assigneeId: "", dueDate: "", status: "TODO" };
const apiBase = import.meta.env.DEV ? "http://localhost:9090/api" : "/api";

function apiClient(token, onLogout) {
  return async (path, options = {}) => {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });

    if (response.status === 401) onLogout?.();
    if (response.status === 204) return null;

    const text = await response.text();
    const payload = text ? tryParseJson(text) : {};
    if (!response.ok) throw new Error(payload.message || "Request failed");
    return payload;
  };
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function formatDate(date) {
  if (!date) return "No date";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
      const body =
        mode === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };
      const payload = await apiClient()(endpoint, { method: "POST", body: JSON.stringify(body) });
      onAuth(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Full-stack assignment</p>
          <h1>Team Task Manager</h1>
          <p className="muted">Create projects, invite teammates, assign work, and track overdue tasks with admin/member access.</p>
        </div>
        <div className="segmented" role="tablist">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">
            Login
          </button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")} type="button">
            Sign up
          </button>
        </div>
        <form className="form" onSubmit={submit}>
          {mode === "signup" && (
            <>
              <label>
                Name
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
              </label>
            </>
          )}
          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label>
            Password
            <input
              type="password"
              minLength={8}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="primary" disabled={loading} type="submit">
            {loading ? "Working..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className={`stat ${tone || ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function App() {
  const stored = JSON.parse(localStorage.getItem("ttm-session") || "null");
  const [session, setSession] = useState(stored);
  const [dashboard, setDashboard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [users, setUsers] = useState([]);
  const [projectForm, setProjectForm] = useState(blankProject);
  const [taskForm, setTaskForm] = useState(blankTask);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("MEMBER");
  const [error, setError] = useState("");

  const request = useMemo(
    () =>
      apiClient(session?.token, () => {
        localStorage.removeItem("ttm-session");
        setSession(null);
      }),
    [session?.token]
  );

  const selected = projects.find((project) => project.id === selectedId) || projects[0];
  const isAdmin = session?.user.role === "ADMIN";

  async function loadData() {
    if (!session) return;
    const [dash, projectData, userData] = await Promise.all([request("/dashboard"), request("/projects"), request("/users")]);
    setDashboard(dash);
    setProjects(projectData.projects);
    setUsers(userData.users);
    if (!selectedId && projectData.projects[0]) setSelectedId(projectData.projects[0].id);
  }

  useEffect(() => {
    loadData().catch((err) => setError(err.message));
  }, [session?.token]);

  function onAuth(payload) {
    localStorage.setItem("ttm-session", JSON.stringify(payload));
    setSession(payload);
  }

  function logout() {
    localStorage.removeItem("ttm-session");
    setSession(null);
  }

  async function createProject(event) {
    event.preventDefault();
    setError("");
    try {
      const payload = await request("/projects", { method: "POST", body: JSON.stringify(projectForm) });
      setProjects([payload.project, ...projects]);
      setSelectedId(payload.project.id);
      setProjectForm(blankProject);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function addMember(event) {
    event.preventDefault();
    if (!selected) return;
    setError("");
    try {
      await request(`/projects/${selected.id}/members`, {
        method: "POST",
        body: JSON.stringify({ email: memberEmail, role: memberRole })
      });
      setMemberEmail("");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function createTask(event) {
    event.preventDefault();
    if (!selected) return;
    setError("");
    try {
      await request(`/projects/${selected.id}/tasks`, {
        method: "POST",
        body: JSON.stringify({
          ...taskForm,
          assigneeId: taskForm.assigneeId || null,
          dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : null
        })
      });
      setTaskForm(blankTask);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateStatus(task, status) {
    setError("");
    try {
      await request(`/tasks/${task.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!session) return <AuthScreen onAuth={onAuth} />;

  const projectMembers = selected?.members || [];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <CheckCircle2 />
          <div>
            <strong>Task Manager</strong>
            <span>{session.user.role}</span>
          </div>
        </div>
        <nav>
          {projects.map((project) => (
            <button key={project.id} className={selected?.id === project.id ? "active" : ""} onClick={() => setSelectedId(project.id)}>
              {project.name}
            </button>
          ))}
        </nav>
        <button className="ghost logout" onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Welcome, {session.user.name}</p>
            <h1>Project dashboard</h1>
          </div>
          <span className="role-pill">
            <Shield size={16} /> {session.user.role === "ADMIN" ? "Admin access" : "Member access"}
          </span>
        </header>

        {error && <p className="error surface">{error}</p>}

        <section className="stats-grid" aria-label="Dashboard totals">
          <StatCard label="Total tasks" value={dashboard?.stats.total ?? 0} />
          <StatCard label="To do" value={dashboard?.stats.todo ?? 0} />
          <StatCard label="In progress" value={dashboard?.stats.inProgress ?? 0} />
          <StatCard label="Overdue" value={dashboard?.stats.overdue ?? 0} tone="danger" />
        </section>

        <div className="content-grid">
          <section className="panel project-main">
            {selected ? (
              <>
                <div className="section-head">
                  <div>
                    <p className="eyebrow">Active project</p>
                    <h2>{selected.name}</h2>
                    <p className="muted">{selected.description || "No description yet."}</p>
                  </div>
                  <span>{selected.tasks.length} tasks</span>
                </div>

                <div className="task-list">
                  {selected.tasks.map((task) => {
                    const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";
                    return (
                      <article key={task.id} className={`task-card ${overdue ? "overdue" : ""}`}>
                        <div>
                          <h3>{task.title}</h3>
                          <p>{task.description || "No details provided."}</p>
                          <small>
                            {task.assignee ? `Assigned to ${task.assignee.name}` : "Unassigned"} • Due {formatDate(task.dueDate)}
                          </small>
                        </div>
                        <select value={task.status} onChange={(event) => updateStatus(task, event.target.value)} aria-label="Task status">
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </article>
                    );
                  })}
                  {selected.tasks.length === 0 && <p className="empty">No tasks yet. Create the first one from the admin panel.</p>}
                </div>
              </>
            ) : (
              <p className="empty">No projects available yet.</p>
            )}
          </section>

          <aside className="right-rail">
            {isAdmin && (
              <section className="panel">
                <div className="section-title">
                  <LayoutDashboard size={18} />
                  <h2>New project</h2>
                </div>
                <form className="form compact" onSubmit={createProject}>
                  <input
                    placeholder="Project name"
                    value={projectForm.name}
                    onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={projectForm.description}
                    onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })}
                  />
                  <button className="primary" type="submit">
                    <Plus size={16} /> Create
                  </button>
                </form>
              </section>
            )}

            {selected && isAdmin && (
              <section className="panel">
                <div className="section-title">
                  <Plus size={18} />
                  <h2>New task</h2>
                </div>
                <form className="form compact" onSubmit={createTask}>
                  <input
                    placeholder="Task title"
                    value={taskForm.title}
                    onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={taskForm.description}
                    onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })}
                  />
                  <select value={taskForm.assigneeId} onChange={(event) => setTaskForm({ ...taskForm, assigneeId: event.target.value })}>
                    <option value="">Unassigned</option>
                    {projectMembers.map((member) => (
                      <option key={member.userId} value={member.userId}>
                        {member.user.name}
                      </option>
                    ))}
                  </select>
                  <input type="date" value={taskForm.dueDate} onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })} />
                  <button className="primary" type="submit">
                    <Plus size={16} /> Add task
                  </button>
                </form>
              </section>
            )}

            {selected && (
              <section className="panel">
                <div className="section-title">
                  <Users size={18} />
                  <h2>Team</h2>
                </div>
                <div className="member-list">
                  {projectMembers.map((member) => (
                    <div key={member.id} className="member-row">
                      <span>{member.user.name}</span>
                      <strong>{member.role}</strong>
                    </div>
                  ))}
                </div>
                {isAdmin && (
                  <form className="form compact" onSubmit={addMember}>
                    <input
                      type="email"
                      placeholder="User email"
                      value={memberEmail}
                      onChange={(event) => setMemberEmail(event.target.value)}
                      required
                    />
                    <select value={memberRole} onChange={(event) => setMemberRole(event.target.value)}>
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <button className="secondary" type="submit">
                      Add member
                    </button>
                  </form>
                )}
              </section>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
