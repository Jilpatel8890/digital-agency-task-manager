import React, { useEffect, useState } from "react";
import {
  CheckSquare,
  Plus,
  Calendar as CalendarIcon,
  Users,
  Building2,
  Loader2,
  TrendingUp,
  Settings,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth, useUser, SignOutButton } from "@clerk/clerk-react";

import { fetchTasks } from "../../api/TaskApi";

import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

import "../../Styles/Calender.css";

const Calendar = () => {
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
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const taskRes = await fetchTasks(token);
      setTasks(taskRes);
    } catch (err) {
      console.error("Load failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CALENDAR HELPERS ================= */
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad days to start from Sunday
  const startDay = monthStart.getDay();
  const paddedDays = [...Array(startDay).fill(null), ...days];

  // Pad end to complete the last week
  const endPadding = (7 - (paddedDays.length % 7)) % 7;
  const fullPaddedDays = [...paddedDays, ...Array(endPadding).fill(null)];

  const getTasksForDay = (day) => {
    return tasks.filter((task) =>
      isSameDay(new Date(task.due_date), day)
    );
  };

  const getPlatformClass = (platform) => {
    switch (platform?.toLowerCase()) {
      case "instagram":
        return "platform-instagram";
      case "facebook":
        return "platform-facebook";
      case "linkedin":
        return "platform-linkedin";
      case "website":
        return "platform-website";
      default:
        return "";
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
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
            to="/calendar"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <CalendarIcon size={20} />
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
            <h1 className="page-title">Calendar</h1>
            <p className="page-subtitle">View your scheduled posts and content</p>
          </div>

          <div className="month-navigation">
            <button className="nav-btn" onClick={handlePrevMonth}>
              <ChevronLeft size={20} />
            </button>
            <span className="current-month">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button className="nav-btn" onClick={handleNextMonth}>
              <ChevronRight size={20} />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="loading-state">
            <Loader2 size={48} className="loading-spinner" />
            <p>Loading calendar...</p>
          </div>
        ) : (
          <>
            {/* Calendar Grid */}
            <div className="calendar-container">
              {/* Day Headers */}
              <div className="calendar-header">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="calendar-header-cell">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="calendar-grid">
                {fullPaddedDays.map((day, index) => {
                  if (!day) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="calendar-cell empty"
                      />
                    );
                  }

                  const dayTasks = getTasksForDay(day);
                  const isToday = isSameDay(day, new Date());
                  const isCurrentMonth = isSameMonth(day, currentMonth);

                  return (
                    <div
                      key={day.toISOString()}
                      className={`calendar-cell ${
                        !isCurrentMonth ? "outside-month" : ""
                      } ${isToday ? "today" : ""}`}
                    >
                      <div className="cell-header">
                        <span className={`day-number ${isToday ? "today" : ""}`}>
                          {format(day, "d")}
                        </span>
                      </div>
                      <div className="cell-tasks">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div
                            key={task._id}
                            className={`task-pill ${getPlatformClass(
                              task.platform
                            )}`}
                            title={`${task.platform} - ${task.task_type}: ${
                              task.client_id?.name || "Unknown Client"
                            }`}
                          >
                            {task.platform} • {task.task_type}
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="more-tasks">
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="calendar-legend">
              <div className="legend-item">
                <div className="legend-dot platform-instagram"></div>
                <span>Instagram</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot platform-facebook"></div>
                <span>Facebook</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot platform-linkedin"></div>
                <span>LinkedIn</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot platform-website"></div>
                <span>Website</span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Calendar;
