import React, { useEffect, useState } from "react";
import {
  CheckSquare,
  Users,
  Calendar,
  TrendingUp,
  Settings,
  Zap,
  LogOut,
} from "lucide-react";
import { useAuth, useUser, SignOutButton } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";
import "../../Styles/Sidebar.css";

const Sidebar = () => {
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
  }, [getToken]);

  /* ================= USER DETAILS ================= */
  const fullName = user?.fullName || "User";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
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
          Team
        </NavLink>

        <NavLink to="/calender" className="nav-item">
          <Calendar size={20} />
          Calendar
        </NavLink>

        {role === "manager" && (
          <NavLink to="/analytics" className="nav-item">
            <TrendingUp size={20} />
            Analytics
          </NavLink>
        )}
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
  );
};

export default Sidebar;