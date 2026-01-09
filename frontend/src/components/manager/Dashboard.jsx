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
import Sidebar from "../auth/Sidebar";
import { fetchTasks } from "../../api/TaskApi";
import { useAuth } from "@clerk/clerk-react";
import "../../Styles/Dashboard.css";

const Dashboard = () => {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const token = await getToken();
      const data = await fetchTasks(token);
      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setLoading(false);
    }
  };

  // Compute stats
  const stats = [
    {
      title: "Pending Tasks",
      value: tasks.filter(t => t.status === "Pending").length,
      subtitle: tasks.filter(t => t.status === "Pending" && new Date(t.due_date) < new Date()).length + " overdue",
      icon: Clock,
      variant: "warning"
    },
    {
      title: "In Progress",
      value: tasks.filter(t => t.status === "In Progress").length,
      icon: CheckSquare,
      variant: "info"
    },
    {
      title: "Completed",
      value: tasks.filter(t => t.status === "Completed").length,
      icon: CheckCircle2,
      variant: "success"
    },
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: BadgeCheck,
      variant: "primary"
    },
  ];

  // Today's tasks
  const today = new Date().toDateString();
  const todayTasks = tasks.filter(t => new Date(t.due_date).toDateString() === today);

  // Recent activity - completed tasks, sorted by updatedAt desc
  const recentActivity = tasks
    .filter(t => t.status === "Completed")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="app">
      <Sidebar />

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
                {loading ? (
                  <p>Loading tasks...</p>
                ) : todayTasks.length === 0 ? (
                  <p>No tasks due today</p>
                ) : (
                  todayTasks.map((task) => (
                    <div key={task._id} className="task-card">
                      <h3 className="task-title">{task.taskname}</h3>
                      <p className="task-description">{task.platform} • {task.task_type} • Assigned to: {task.assigned_to?.name}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="sidebar-right">
            <div className="card">
              <h3 className="card-title">Recent Activity</h3>
              {loading ? (
                <p>Loading...</p>
              ) : recentActivity.length === 0 ? (
                <p>No recent completed tasks</p>
              ) : (
                recentActivity.map((task) => (
                  <p key={task._id}>{task.taskname}</p>
                ))
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
