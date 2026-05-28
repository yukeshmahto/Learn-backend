import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { saveAuth } from "../utils/auth";

const Login = ({ onLogin }) => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload = {
        email: emailOrUsername.includes("@") ? emailOrUsername : undefined,
        username: emailOrUsername.includes("@") ? undefined : emailOrUsername,
        password,
      };
      const response = await api.post("/user/login", payload);
      const authData = response.data.data;
      saveAuth(authData);
      onLogin?.(authData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page-shell form-shell">
      <h1>Login</h1>
      <p>Use your email or username and password to sign in.</p>
      <form onSubmit={handleSubmit} className="form-card">
        <label>
          Email or Username
          <input
            value={emailOrUsername}
            onChange={(event) => setEmailOrUsername(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && <div className="status-message status-error">{error}</div>}
        <button className="button button-primary" disabled={saving}>
          {saving ? "Signing in..." : "Login"}
        </button>
      </form>
    </main>
  );
};

export default Login;
