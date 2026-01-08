import React, { useEffect, useState } from "react";
import {
  Clock,
  CheckSquare,
  CheckCircle2,
  BadgeCheck,
  Plus,
  Users,
  Calendar,
  TrendingUp,
  Settings,
  Zap,
  FileText,
  LogOut,
} from "lucide-react";
import { useAuth, useUser, SignOutButton } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";
import "../../Styles/Dashboard.css";

const Dashboard = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [role, setRole] = useState("");

  /* ================= FETCH ROLE FROM BACKEND ================= */
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = await getToken();

        const res = await fetch("http://localhost:5000/api/protected/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setRole(data?.role || "User");
      } catch (err) {
        console.error("Failed to fetch role", err);
      }
    };

    fetchRole();
  }, []);

  /* ================= USER DETAILS ================= */
  const fullName = user?.fullName || "User";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  /* ================= STATIC DATA ================= */
  const stats = [
    { title: "Pending Tasks", value: 2, subtitle: "4 overdue", icon: Clock, variant: "warning" },
    { title: "In Progress", value: 2, icon: CheckSquare, variant: "info" },
    { title: "Posted", value: 1, icon: CheckCircle2, variant: "success" },
    { title: "Approved", value: 1, icon: BadgeCheck, variant: "primary" },
  ];

  const todayTasks = [
    {
      id: 1,
      title: "AI in Business Blog Post",
      description: "1500-word blog post about AI implementation strategies",
    },
  ];

  const recentActivity = [
    { id: 1, title: "Product Launch Post" },
    { id: 2, title: "Instagram Stories" },
    { id: 3, title: "Newsletter Design" },
  ];

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

        {/* ================= NAV ================= */}
        <nav className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <div className="nav-icon-grid" />
            Dashboard
          </NavLink>

          <NavLink to="/tasks" className="nav-item">
            <CheckSquare size={20} />
            Tasks
          </NavLink>

          <NavLink
            to="/client"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Users size={20} />
            Clients
          </NavLink>

          <NavLink to="/team" className="nav-item">
            <Users size={20} />
            Users
          </NavLink>

          <NavLink to="/calender" className="nav-item">
            <Calendar size={20} />
            Calendar
          </NavLink>

          <NavLink to="/analytics" className="nav-item">
            <TrendingUp size={20} />
            Analytics
          </NavLink>
        </nav>

        {/* ================= FOOTER ================= */}
        <div className="sidebar-footer">
          <NavLink to="/settings" className="nav-item">
            <Settings size={20} />
            Settings
          </NavLink>

          <div className="user-profile">
            <div className="user-avatar">{initials}</div>

            <div className="user-info">
              <div className="user-name">{fullName}</div>
              <div className="user-role">{role}</div>
            </div>

            <SignOutButton>
              <LogOut size={16} className="logout-icon" />
            </SignOutButton>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Track your team's progress</p>
          </div>

          <button className="btn-primary">
            <Plus size={16} />
            New Task
          </button>
        </header>

        {/* ================= STATS ================= */}
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`stat-card stat-${stat.variant}`}>
                <div className="stat-header">
                  <span className="stat-title">{stat.title}</span>
                  <div className="stat-icon">
                    <Icon size={20} />
                  </div>
                </div>
                <div className="stat-value">{stat.value}</div>
                {stat.subtitle && (
                  <div className="stat-subtitle">{stat.subtitle}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="content-grid">
          <div className="main-column">
            <section className="section">
              <h2 className="section-title">Today's Tasks</h2>
              <div className="tasks-list">
                {todayTasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-description">{task.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="sidebar-right">
            <div className="card">
              <h3 className="card-title">Recent Activity</h3>
              {recentActivity.map((item) => (
                <p key={item.id}>{item.title}</p>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
