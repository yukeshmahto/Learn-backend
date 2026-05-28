import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const Register = () => {
  const [formState, setFormState] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload = new FormData();
      payload.append("fullName", formState.fullName);
      payload.append("Username", formState.username.trim().toLowerCase());
      payload.append("email", formState.email);
      payload.append("password", formState.password);
      if (avatar) payload.append("avatar", avatar);
      if (coverImage) payload.append("coverImage", coverImage);

      await api.post("/user/register", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page-shell form-shell">
      <h1>Create an account</h1>
      <p>Register to publish videos and manage your profile.</p>

      <form onSubmit={handleSubmit} className="form-card">
        <label>
          Full name
          <input
            name="fullName"
            value={formState.fullName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Username
          <input
            name="username"
            value={formState.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Avatar
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setAvatar(event.target.files?.[0] ?? null)}
            required
          />
        </label>
        <label>
          Cover image
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setCoverImage(event.target.files?.[0] ?? null)}
          />
        </label>
        {error && <div className="status-message status-error">{error}</div>}
        <button className="button button-primary" disabled={saving}>
          {saving ? "Creating account..." : "Register"}
        </button>
      </form>
    </main>
  );
};

export default Register;
