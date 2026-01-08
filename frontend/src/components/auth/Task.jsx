import React, { useEffect, useState } from "react";
import {
  CheckSquare,
  Plus,
  Calendar,
  Users,
  Building2,
  X,
  Loader2,
  Trash2,
  Edit2,
  TrendingUp,
  Settings,
  Zap,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth, useUser, SignOutButton } from "@clerk/clerk-react";

import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../api/TaskApi";

import { fetchClients } from "../../api/ClientApi";
import { fetchUsers } from "../../api/UserApi";

import "../../Styles/task.css";

const Task = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  /* ================= USER INFO ================= */
  const fullName = user?.fullName || "User";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  /* ================= STATE ================= */
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState("All");

  const [formData, setFormData] = useState({
    client_id: "",
    assigned_to: "",
    platform: "Instagram",
    task_type: "Post",
    status: "Pending",
    due_date: "",
    post_link: "",
    notes: "",
  });

  const filters = ["All", "Instagram", "Facebook", "LinkedIn", "Website"];

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const [taskRes, clientRes, userRes] = await Promise.all([
        fetchTasks(token),
        fetchClients(token),
        fetchUsers(token),
      ]);

      setTasks(taskRes);
      setClients(clientRes.filter((c) => c.isActive));
      setUsers(
        userRes.filter(
          (u) => u.role === "team" && u.approved && u.isActive
        )
      );
    } catch (err) {
      console.error("Load failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = await getToken();

      if (editingTask) {
        await updateTask(editingTask._id, formData, token);
      } else {
        await createTask(formData, token);
      }

      await loadAll();
      handleCloseModal();
    } catch (err) {
      console.error("Save task failed", err);
      alert("Failed to save task");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      const token = await getToken();
      await deleteTask(id, token);
      await loadAll();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      client_id: task.client_id?._id || task.client_id,
      assigned_to: task.assigned_to?._id || task.assigned_to,
      platform: task.platform,
      task_type: task.task_type,
      status: task.status,
      due_date: task.due_date?.slice(0, 10),
      post_link: task.post_link || "",
      notes: task.notes || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({
      client_id: "",
      assigned_to: "",
      platform: "Instagram",
      task_type: "Post",
      status: "Pending",
      due_date: "",
      post_link: "",
      notes: "",
    });
  };

  /* ================= HELPERS ================= */
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "In Progress":
        return "status-progress";
      case "Completed":
        return "status-posted";
      default:
        return "";
    }
  };

  const filteredTasks =
    selectedFilter === "All"
      ? tasks
      : tasks.filter(
          (t) =>
            t.platform.toLowerCase() === selectedFilter.toLowerCase()
        );

  const groupedTasks = {
    Pending: filteredTasks.filter((t) => t.status === "Pending"),
    "In Progress": filteredTasks.filter((t) => t.status === "In Progress"),
    Completed: filteredTasks.filter((t) => t.status === "Completed"),
  };

  /* ================= UI ================= */
  return (
    <div className="app">
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <Zap className="logo-icon" />
            <span className="logo-text">TaskFlow</span>
          </div>
        </div>

        <nav className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <div className="nav-icon-grid" />
            Dashboard
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <CheckSquare size={20} />
            Tasks
          </NavLink>

          <NavLink
            to="/client"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Building2 size={20} />
            Clients
          </NavLink>

          <NavLink
            to="/team"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Users size={20} />
            Users
          </NavLink>

          <NavLink
            to="/calender"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Calendar size={20} />
            Calendar
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <TrendingUp size={20} />
            Analytics
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/settings" className="nav-item">
            <Settings size={20} />
            Settings
          </NavLink>

          <div className="user-profile">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{fullName}</div>
              <div className="user-role">User</div>
            </div>

            <SignOutButton>
              <LogOut size={16} className="logout-icon" />
            </SignOutButton>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1 className="page-title">Tasks</h1>
            <p className="page-subtitle">Manage all tasks</p>
          </div>

          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Task
          </button>
        </header>

        {/* ================= TOOLBAR ================= */}
        <div className="toolbar">
          <div className="filter-group">
            <span className="filter-label">Filter:</span>
            <div className="filter-buttons">
              {filters.map((f) => (
                <button
                  key={f}
                  className={`filter-btn ${
                    selectedFilter === f ? "active" : ""
                  }`}
                  onClick={() => setSelectedFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <Loader2 size={48} className="loading-spinner" />
            <p>Loading tasks...</p>
          </div>
        ) : (
          <div className="tasks-board">
            {Object.entries(groupedTasks).map(([status, statusTasks]) => (
              <div key={status} className="task-column">
                <div className="column-header">
                  <div className="column-title-group">
                    <div className={`status-dot ${getStatusColor(status)}`} />
                    <h2 className="column-title">{status}</h2>
                  </div>
                  <span className="task-count">{statusTasks.length}</span>
                </div>

                <div className="task-list">
                  {statusTasks.length === 0 ? (
                    <div className="empty-column">No tasks</div>
                  ) : (
                    statusTasks.map((task) => (
                      <div key={task._id} className="task-item">
                        <div className="task-item-header">
                          <h3 className="task-item-title">
                            {task.platform} • {task.task_type}
                          </h3>
                          <span
                            className={`task-status-badge ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </div>

                        <p className="task-client">
                          {task.client_id?.name}
                        </p>

                        <div className="task-tags">
                          <span
                            className={`task-tag platform-${task.platform.toLowerCase()}`}
                          >
                            {task.platform}
                          </span>
                          <span className="task-tag task-type">
                            {task.task_type}
                          </span>
                        </div>

                        {task.notes && (
                          <p className="task-desc">{task.notes}</p>
                        )}

                        <div className="task-item-footer">
                          <div className="task-assignee">
                            <Users size={14} />
                            {task.assigned_to?.name}
                          </div>
                          <div className="task-date">
                            <Calendar size={14} />
                            {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="task-actions">
                          <button onClick={() => handleEdit(task)}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(task._id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTask ? "Edit Task" : "Add Task"}</h2>
              <button onClick={handleCloseModal}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <select
                required
                value={formData.client_id}
                onChange={(e) =>
                  setFormData({ ...formData, client_id: e.target.value })
                }
              >
                <option value="">Select Client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                required
                value={formData.assigned_to}
                onChange={(e) =>
                  setFormData({ ...formData, assigned_to: e.target.value })
                }
              >
                <option value="">Assign To</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <select
                value={formData.platform}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value })
                }
              >
                <option>Instagram</option>
                <option>Facebook</option>
                <option>LinkedIn</option>
                <option>Website</option>
              </select>

              <select
                value={formData.task_type}
                onChange={(e) =>
                  setFormData({ ...formData, task_type: e.target.value })
                }
              >
                <option>Post</option>
                <option>Reel</option>
                <option>Blog</option>
              </select>

              <input
                type="date"
                required
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
              />

              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />

              <button className="btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Save Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
