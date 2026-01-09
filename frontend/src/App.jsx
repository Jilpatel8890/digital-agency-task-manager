import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AuthGuard from "./components/auth/AuthGuard";
import ManagerGuard from "./components/auth/ManagerGuard";
import SyncUser from "./components/auth/SyncUser";
import DashboardPage from "./pages/manager/Dashboard";
import ClientPage from "./pages/manager/Client";
import TeamPage from "./pages/manager/Team";
import TaskPage from "./pages/manager/Task";
import CalenderPage from "./pages/manager/Calender";
import AnalyticsPage from "./pages/manager/Analytics";
function App() {
  return (
    <>
      <SyncUser />

      <Routes>
        <Route path="/login/*" element={<Login />} />
        <Route path="/signup/*" element={<Signup />} />

        <Route
          path="/"
          element={
            <ManagerGuard>
              <DashboardPage />
            </ManagerGuard>
          }
        />

        <Route
          path="/client"
          element={
            <ManagerGuard>
              <ClientPage />
            </ManagerGuard>
          }
        />

        <Route
          path="/team"
          element={
            <ManagerGuard>
              <TeamPage />
            </ManagerGuard>
          }
        />

        <Route
          path="/tasks"
          element={
            <ManagerGuard>
              <TaskPage />
            </ManagerGuard>
          }
        />
        <Route
          path="/calender"
          element={
            <ManagerGuard>
              <CalenderPage />
            </ManagerGuard>
          }
        />
        <Route
          path="/analytics"
          element={
            <ManagerGuard>
              <AnalyticsPage />
            </ManagerGuard>
          }
        />
      </Routes>
    </>
  );
}

export default App;
