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
  X,
  Loader2,
  Edit2,
  Trash2,
} from "lucide-react";

import { useAuth } from "@clerk/clerk-react";
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
} from "../../api/ClientApi";

import "../../Styles/Client.css";

const ClientsPage = () => {
  const { getToken } = useAuth();

  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    email: "",
    phone: "",
    website: "",
  });

  /* ================= FETCH CLIENTS ================= */
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const data = await fetchClients(token);
      setClients(data);
    } catch (err) {
      console.error("Fetch clients failed", err);
      setClients([]);
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

      if (editingClient) {
        await updateClient(editingClient._id, formData, token);
      } else {
        await createClient(formData, token);
      }

      await loadClients();
      handleCloseModal();
    } catch (err) {
      console.error("Save client failed", err);
      alert("Failed to save client");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      const token = await getToken();
      await deleteClient(id, token);
      await loadClients();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete client");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || "",
      industry: client.industry || "",
      email: client.email || "",
      phone: client.phone || "",
      website: client.website || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({
      name: "",
      industry: "",
      email: "",
      phone: "",
      website: "",
    });
  };

  /* ================= FILTER ================= */
  const filteredClients = clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return "CL";
    const parts = name.split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

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
          <a className="nav-item">Dashboard</a>
          <a className="nav-item">
            <CheckSquare size={20} /> Tasks
          </a>
          <a className="nav-item active">
            <Building2 size={20} /> Clients
          </a>
          <a className="nav-item">
            <Users size={20} /> Users
          </a>
          <a className="nav-item">
            <Calendar size={20} /> Calendar
          </a>
          <a className="nav-item">
            <TrendingUp size={20} /> Analytics
          </a>
        </nav>

        <div className="sidebar-footer">
          <a className="nav-item">
            <Settings size={20} /> Settings
          </a>
          <div className="user-profile">
            <div className="user-avatar">AT</div>
            <div className="user-info">
              <div className="user-name">Admin</div>
              <div className="user-role">Administrator</div>
            </div>
            <LogOut size={16} />
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1 className="page-title">Clients</h1>
            <p className="page-subtitle">
              Manage your agency's clients and projects
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Client
          </button>
        </header>

        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-state">
            <Loader2 size={48} className="loading-spinner" />
            <p>Loading clients...</p>
          </div>
        ) : (
          <div className="clients-grid">
            {filteredClients.map((client) => (
              <div key={client._id} className="client-card">
                <div className="client-card-header">
                  <div className="client-icon">
                    {getInitials(client.name)}
                  </div>
                  <div className="client-actions">
                    <button onClick={() => handleEdit(client)}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(client._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="client-name">{client.name}</h3>
                <p className="client-industry">
                  {client.industry || "No industry"}
                </p>
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
              <h2 className="modal-title">
                {editingClient ? "Edit Client" : "Add New Client"}
              </h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Client Name *</label>
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
                <label>Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
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
                  {submitting ? "Saving..." : editingClient ? "Update Client" : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
