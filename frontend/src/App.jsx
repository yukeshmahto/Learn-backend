import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadVideo from "./pages/UploadVideo";
import Profile from "./pages/Profile";
import VideoDetails from "./pages/VideoDetails";
import { api } from "./api";
import { clearAuth, getAuth, saveAuth } from "./utils/auth";

function App() {
  const [auth, setAuth] = useState(getAuth());

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!auth?.accessToken) return;
      try {
        const response = await api.get("/user/current-user");
        const currentUser = response.data.data;
        setAuth((current) => ({ ...current, user: currentUser }));
        saveAuth({ ...auth, user: currentUser });
      } catch (_) {
        clearAuth();
        setAuth(null);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogin = (authData) => {
    saveAuth(authData);
    setAuth(authData);
  };

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
    } catch {
      // ignore logout error
    }
    clearAuth();
    setAuth(null);
  };

  return (
    <Router>
      <div className="app-shell">
        <Navbar user={auth?.user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              auth?.accessToken ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadVideo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/videos/:id" element={<VideoDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
