import React, { useEffect, useState } from "react";
import {
  CheckSquare,
  Plus,
  Users,
  Calendar,
  TrendingUp,
  Settings,
  Zap,
  LogOut,
  Search,
  Building2,
  Loader2,
  Mail,
  Trash2,
  Edit2,
  X,
  Send,
} from "lucide-react";

import { useAuth } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";
import { fetchUsers, createUser, updateUser, deleteUser } from "../../api/UserApi";
import Sidebar from "../auth/Sidebar";

import "../../Styles/Team.css";

const TeamPage = () => {
  const { getToken } = useAuth();

  const [teamMembers, setTeamMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    approved: false,
  });

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const data = await fetchUsers(token);
      setTeamMembers(data);
    } catch (err) {
      console.error("Fetch users failed", err);
      setTeamMembers([]);
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

      if (editingMember) {
        await updateUser(editingMember._id, formData, token);
      } else {
        await createUser(formData, token);
      }

      await loadUsers();
      handleCloseModal();
    } catch (err) {
      console.error("Save member failed", err);
      alert(err.message || "Failed to save team member");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || "",
      email: member.email || "",
      role: member.role || "",
      approved: member.approved !== undefined ? member.approved : false,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setFormData({
      name: "",
      email: "",
      role: "",
      approved: false,
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;

    try {
      const token = await getToken();
      await deleteUser(id, token);
      await loadUsers();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete team member");
    }
  };

  /* ================= FILTER ================= */
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return "TM";
    const parts = name.split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const getActiveTasksCount = (member) => {
    // TODO: Fetch from backend when tasks API is ready
    // For now, return 0 as default
    return 0;
  };

  const getRoleDisplayName = (role) => {
    if (!role) return "No Role";
    return role.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getRoleClassName = (role) => {
    if (!role) return "role-badge role-none";
    return `role-badge role-${role.replace(/\s+/g, '-')}`;
  };

  return (
    <div className="app">
      <Sidebar />

      {/* ================= MAIN ================= */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1 className="page-title">Team</h1>
            <p className="page-subtitle">
              Manage your team members and their roles
            </p>
          </div>

          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Member
          </button>
        </header>

        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-state">
            <Loader2 size={48} className="loading-spinner" />
            <p>Loading team members...</p>
          </div>
        ) : (
          <div className="team-list-container">
            {filteredMembers.length === 0 ? (
              <div className="empty-state">
                <Users size={64} className="empty-icon" />
                <p className="empty-text">No team members found</p>
                <p className="empty-subtext">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Get started by adding your first team member"}
                </p>
              </div>
            ) : (
              <div className="team-table">
                {filteredMembers.map((member) => {
                  const activeTasksCount = getActiveTasksCount(member);
                  
                  return (
                    <div key={member._id} className="team-member-row">
                      <div className="team-member-info">
                        <div className="member-avatar">
                          {member.image ? (
                            <img src={member.image} alt={member.name} />
                          ) : (
                            <span>{getInitials(member.name)}</span>
                          )}
                        </div>
                        <div className="member-details">
                          <div className="member-name">{member.name || "No Name"}</div>
                          <div className="member-email">{member.email}</div>
                        </div>
                      </div>

                      <div className="team-member-role">
                        <span className={getRoleClassName(member.role)}>
                          {getRoleDisplayName(member.role)}
                        </span>
                      </div>

                      <div className="team-member-tasks">
                        <span className="tasks-count">{activeTasksCount}</span>
                        <span className="tasks-label">
                          {activeTasksCount === 1 ? "task" : "tasks"}
                        </span>
                      </div>

                      <div className="team-member-actions">
                        <button
                          className="action-btn action-btn-edit"
                          onClick={() => handleEdit(member)}
                          title="Edit member"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="action-btn action-btn-email"
                          onClick={() => window.location.href = `mailto:${member.email}`}
                          title="Send email"
                        >
                          <Mail size={16} />
                        </button>
                        <button
                          className="action-btn action-btn-delete"
                          onClick={() => handleDelete(member._id)}
                          title="Delete member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingMember ? "Edit Team Member" : "Add New Team Member"}
              </h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={!!editingMember}
                />
                {editingMember && (
                  <small style={{ color: "#6e6e73", fontSize: "12px" }}>
                    Email cannot be changed
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="">No Role</option>
                  <option value="manager">Manager</option>
                  <option value="content writer">Content Writer</option>
                  <option value="graphic designer">Graphic Designer</option>
                  <option value="social media manager">Social Media Manager</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    checked={formData.approved}
                    onChange={(e) =>
                      setFormData({ ...formData, approved: e.target.checked })
                    }
                  />
                  Approved
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button className="btn-primary" disabled={submitting}>
                  {submitting
                    ? "Saving..."
                    : editingMember
                    ? "Update Member"
                    : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;

