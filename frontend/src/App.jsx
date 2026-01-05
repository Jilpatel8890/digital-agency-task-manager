import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AuthGuard from "./components/auth/AuthGuard";

const Dashboard = () => <h1>Dashboard</h1>;

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login/*" element={<Login />} />
      <Route path="/signup/*" element={<Signup />} />

      {/* Protected route */}
      <Route
        path="/"
        element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        }
      />
    </Routes>
  );
}

export default App;
