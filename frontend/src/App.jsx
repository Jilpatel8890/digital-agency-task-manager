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
      {/* Auth routes */}
      <Route path="/login/*" element={<Login />} />
      <Route path="/signup/*" element={<Signup />} />
      
      <Route path="/client" element={<ClientsPage />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        }
      />
    </Routes>

    </>
  );
}

export default App;
