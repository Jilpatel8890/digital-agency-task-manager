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
import Sidebar from "../auth/Sidebar";

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
    taskname: "",
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
          (u) => ["content writer", "graphic designer", "social media manager"].includes(u.role) && u.approved && u.isActive
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
      taskname: task.taskname || "",
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
      taskname: "",
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
      <Sidebar />

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
                          <div className="task-title-section">
                            <h3 className="task-item-title">{task.taskname}</h3>
                            <p className="task-subtitle">{task.platform} • {task.task_type}</p>
                          </div>
                          <span
                            className={`task-status-badge ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </div>

                        <p className="task-client">
                          Client: {task.client_id?.name}
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
                          <button onClick={() => handleEdit(task)} title="Edit Task">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(task._id)} title="Delete Task">
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
              <div className="form-group">
                <label>Task Name *</label>
                <input
                  type="text"
                  placeholder="Enter task name"
                  required
                  value={formData.taskname}
                  onChange={(e) =>
                    setFormData({ ...formData, taskname: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Client *</label>
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
              </div>

              <div className="form-group">
                <label>Assigned To *</label>
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Platform *</label>
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
                </div>

                <div className="form-group">
                  <label>Task Type *</label>
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
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  required
                  value={formData.due_date}
                  onChange={(e) =>
                    setFormData({ ...formData, due_date: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Post Link</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.post_link}
                  onChange={(e) =>
                    setFormData({ ...formData, post_link: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  placeholder="Additional notes..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              <button className="btn-primary" disabled={submitting} type="submit">
                {submitting ? "Saving..." : editingTask ? "Update Task" : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
