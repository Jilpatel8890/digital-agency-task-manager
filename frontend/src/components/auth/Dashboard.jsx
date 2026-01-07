import React from 'react';
import { Clock, CheckSquare, CheckCircle2, BadgeCheck, Plus, Users, Calendar, TrendingUp, Settings, Zap, FileText, LogOut } from 'lucide-react';
import "../../Styles/Dashboard.css";

const Dashboard = () => {
    const stats = [
      { title: 'Pending Tasks', value: 2, subtitle: '4 overdue', icon: Clock, variant: 'warning' },
      { title: 'In Progress', value: 2, icon: CheckSquare, variant: 'info' },
      { title: 'Posted', value: 1, icon: CheckCircle2, variant: 'success' },
      { title: 'Approved', value: 1, icon: BadgeCheck, variant: 'primary' }
    ];
  
    const todayTasks = [
      {
        id: 1,
        client: 'Website',
        type: 'Blog',
        title: 'AI in Business Blog Post',
        description: '1500-word blog post about AI implementation strategies',
        assignee: 'Emma Wilson',
        dueDate: 'Today',
        company: 'TechFlow Solutions',
        status: 'In Progress'
      }
    ];
  
    const thisWeekTasks = [
      { id: 2, title: 'Product Launch Post', client: 'TechFlow Solutions', status: 'pending' },
      { id: 3, title: 'Instagram Stories', client: 'Creative Co', status: 'in-progress' },
      { id: 4, title: 'Newsletter Design', client: 'Design Studio', status: 'posted' },
      { id: 5, title: 'Twitter Thread', client: 'StartupHub', status: 'approved' }
    ];
  
    const recentActivity = [
      { id: 1, title: 'Product Launch Post', client: 'TechFlow Solutions' },
      { id: 2, title: 'Instagram Stories', client: 'Creative Co' },
      { id: 3, title: 'Newsletter Design', client: 'Design Studio' },
      { id: 4, title: 'Twitter Thread', client: 'StartupHub' }
    ];
  
    return (
      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <Zap className="logo-icon" />
              <span className="logo-text">TaskFlow</span>
            </div>
          </div>
  
          <nav className="nav">
            <a href="#" className="nav-item active">
              <div className="nav-icon-grid" />
              Dashboard
            </a>
            <a href="#" className="nav-item">
              <CheckSquare size={20} />
              Tasks
            </a>
            <a href="#" className="nav-item">
              <Users size={20} />
              Clients
            </a>
            <a href="#" className="nav-item">
              <Users size={20} />
              Users
            </a>
            <a href="#" className="nav-item">
              <Calendar size={20} />
              Calendar
            </a>
            <a href="#" className="nav-item">
              <TrendingUp size={20} />
              Analytics
            </a>
          </nav>
  
          <div className="sidebar-footer">
            <a href="#" className="nav-item">
              <Settings size={20} />
              Settings
            </a>
            <div className="user-profile">
              <div className="user-avatar">AJ</div>
              <div className="user-info">
                <div className="user-name">Alex Johnson</div>
                <div className="user-role">Admin</div>
              </div>
              <LogOut size={16} className="logout-icon" />
            </div>
          </div>
        </aside>
  
        {/* Main Content */}
        <main className="main-content">
          {/* Header */}
          <header className="header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Track your team's social media progress</p>
            </div>
            <button className="btn-primary">
              <Plus size={16} />
              New Task
            </button>
          </header>
  
          {/* Stats Grid */}
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
                  {stat.subtitle && <div className="stat-subtitle">{stat.subtitle}</div>}
                </div>
              );
            })}
          </div>
  
          {/* Main Grid */}
          <div className="content-grid">
            {/* Left Column */}
            <div className="main-column">
              {/* Today's Tasks */}
              <section className="section">
                <div className="section-header">
                  <h2 className="section-title">Today's Tasks</h2>
                  <span className="section-count">1 tasks</span>
                </div>
  
                <div className="tasks-list">
                  {todayTasks.map(task => (
                    <div key={task.id} className="task-card">
                      <div className="task-header">
                        <div className="task-meta">
                          <span className="task-client">{task.client}</span>
                          <span className="task-type">
                            <FileText size={14} />
                            {task.type}
                          </span>
                        </div>
                        <span className="task-status status-progress">
                          <CheckSquare size={14} />
                          {task.status}
                        </span>
                      </div>
                      <h3 className="task-title">{task.title}</h3>
                      <p className="task-description">{task.description}</p>
                      <div className="task-footer">
                        <div className="task-assignee">
                          <Users size={14} />
                          {task.assignee}
                        </div>
                        <div className="task-due">
                          <Calendar size={14} />
                          {task.dueDate}
                        </div>
                      </div>
                      <div className="task-company">{task.company}</div>
                    </div>
                  ))}
                </div>
              </section>
  
              {/* This Week */}
              <section className="section">
                <div className="section-header">
                  <h2 className="section-title">This Week</h2>
                  <span className="section-count">4 tasks</span>
                </div>
  
                <div className="tasks-list-compact">
                  {thisWeekTasks.map(task => (
                    <div key={task.id} className="task-card-compact">
                      <div className="task-compact-info">
                        <h4 className="task-compact-title">{task.title}</h4>
                        <p className="task-compact-client">{task.client}</p>
                      </div>
                      <span className={`task-status-badge status-${task.status}`}>
                        {task.status === 'pending' && 'Pending'}
                        {task.status === 'in-progress' && 'In Progress'}
                        {task.status === 'posted' && 'Posted'}
                        {task.status === 'approved' && 'Approved'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
  
            {/* Right Sidebar */}
            <aside className="sidebar-right">
              {/* Quick Overview */}
              <div className="card">
                <h3 className="card-title">Quick Overview</h3>
                <div className="overview-list">
                  <div className="overview-item">
                    <span className="overview-label">Active Clients</span>
                    <span className="overview-value">4</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Tasks This Week</span>
                    <span className="overview-value">4</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Completion Rate</span>
                    <span className="overview-value success">33%</span>
                  </div>
                </div>
              </div>
  
              {/* Recent Activity */}
              <div className="card">
                <h3 className="card-title">Recent Activity</h3>
                <div className="activity-list">
                  {recentActivity.map(item => (
                    <div key={item.id} className="activity-item">
                      <div className="activity-dot" />
                      <div className="activity-info">
                        <p className="activity-title">{item.title}</p>
                        <p className="activity-client">{item.client}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    );
  };
  
  export default Dashboard;