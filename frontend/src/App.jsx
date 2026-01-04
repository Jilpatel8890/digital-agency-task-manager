import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../src/pages/auth/Login";
import AuthGuard from "../src/components/auth/AuthGuard";

const Dashboard = () => <h1>Dashboard</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
