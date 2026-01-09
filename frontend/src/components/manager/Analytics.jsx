import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
} from "lucide-react";
import Sidebar from "../auth/Sidebar";
import { fetchTasks } from "../../api/TaskApi";
import { fetchClients } from "../../api/ClientApi";
import { fetchUsers } from "../../api/UserApi";
import { useAuth } from "@clerk/clerk-react";


const Analytics = () => {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const [taskRes, clientRes, userRes] = await Promise.all([
        fetchTasks(token),
        fetchClients(token),
        fetchUsers(token),
      ]);
      setTasks(taskRes);
      setClients(clientRes);
      setUsers(userRes);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const pendingTasks = tasks.filter(t => t.status === "Pending").length;
  const inProgressTasks = tasks.filter(t => t.status === "In Progress").length;
  const onTimeTasks = tasks.filter(t => {
    if (t.status === "Completed") return true;
    return new Date(t.due_date) >= new Date();
  }).length;
  const activeClients = clients.filter(c => c.isActive).length;

  const platformStats = ["Instagram", "Facebook", "LinkedIn", "Website"].map(platform => ({
    platform,
    total: tasks.filter(t => t.platform === platform).length,
    completed: tasks.filter(t => t.platform === platform && t.status === "Completed").length,
  }));

  const clientStats = clients.map(client => {
    const clientTasks = tasks.filter(t => t.client_id === client._id || t.client_id?._id === client._id);
    const completed = clientTasks.filter(t => t.status === "Completed").length;
    const pending = clientTasks.filter(t => t.status === "Pending").length;
    return {
      name: client.name,
      total: clientTasks.length,
      completed,
      pending,
    };
  });

  if (loading) {
    return (
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <div className="loading-state">
            <p>Loading analytics...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <header className="header">
          <div>
            <h1 className="page-title">Analytics</h1>
            <p className="page-subtitle">Track your agency's performance and progress</p>
          </div>
        </header>

        {/* Overview Stats */}
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{totalTasks}</div>
              <div className="stat-title">Total Tasks</div>
              <div className="stat-subtitle">This month</div>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{completedTasks}</div>
              <div className="stat-title">Completed</div>
              <div className="stat-subtitle">{totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% completion rate` : "0% completion rate"}</div>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{totalTasks > 0 ? `${Math.round((onTimeTasks / totalTasks) * 100)}%` : "0%"}</div>
              <div className="stat-title">On-time Rate</div>
              <div className="stat-subtitle">Delivered on schedule</div>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{activeClients}</div>
              <div className="stat-title">Active Clients</div>
              <div className="stat-subtitle">Currently managed</div>
            </div>
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="analytics-card">
          <h3 className="card-title">Platform Breakdown</h3>
          <div className="platform-breakdown">
            {platformStats.map(({ platform, total, completed }) => (
              <div key={platform} className="platform-item">
                <div className="platform-label">{platform}</div>
                <div className="platform-bar-container">
                  <div className="platform-bar">
                    <div
                      className="platform-progress"
                      style={{
                        width: `${total > 0 ? (completed / total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="platform-count">
                  {completed}/{total} done
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Performance */}
        <div className="analytics-card">
          <h3 className="card-title">Client Task Summary</h3>
          <div className="client-table">
            <div className="table-header">
              <div>Client</div>
              <div>Total Tasks</div>
              <div>Completed</div>
              <div>Pending</div>
            </div>
            {clients.filter(c => c.isActive).map(client => {
              const clientTasks = tasks.filter(t => t.client_id === client._id || t.client_id?._id === client._id);
              const completed = clientTasks.filter(t => t.status === "Completed").length;
              const pending = clientTasks.filter(t => t.status === "Pending").length;
              
              return (
                <div key={client._id} className="table-row">
                  <div className="client-name">{client.name}</div>
                  <div>{clientTasks.length}</div>
                  <div className="completed">{completed}</div>
                  <div className="pending">{pending}</div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;