import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AuthGuard from "./components/auth/AuthGuard";
import SyncUser from "./components/auth/SyncUser";
import Dashboard from "./components/auth/Dashboard";
import ClientsPage from "./components/auth/Client";

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
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />

        <Route
          path="/client"
          element={
            <AuthGuard>
              <ClientsPage />
            </AuthGuard>
          }
        />
      </Routes>
    </>
  );
}

export default App;
