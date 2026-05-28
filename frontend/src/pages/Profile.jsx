import { useEffect, useState } from "react";
import { api } from "../api";
import { getAuth, saveAuth } from "../utils/auth";

const Profile = () => {
  const [user, setUser] = useState(getAuth()?.user || null);
  const [watchHistory, setWatchHistory] = useState([]);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/user/current-user");
      setUser(response.data.data);
      setFullName(response.data.data.fullName || "");
      setEmail(response.data.data.email || "");
      const auth = getAuth();
      if (auth) {
        saveAuth({ ...auth, user: response.data.data });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWatchHistory = async () => {
    try {
      const response = await api.get("/user/watch-history");
      setWatchHistory(response.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchWatchHistory();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const response = await api.patch("/user/update-account", {
        fullName,
        email,
      });
      setUser(response.data.data.user);
      saveAuth({ ...getAuth(), user: response.data.data.user });
      setStatus({ type: "success", message: "Profile updated successfully." });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Unable to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page-shell form-shell">
      <section className="profile-panel">
        <div className="profile-card">
          <img
            className="profile-avatar"
            src={user?.avatar || "https://via.placeholder.com/92"}
            alt={user?.fullName || "Profile"}
          />
          <div>
            <h1>Profile</h1>
            <p>{user?.fullName || "Your profile details"}</p>
            <p className="meta-line">Username: {user?.Username}</p>
            <p className="meta-line">
              Joined: {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="form-card">
        <label>
          Full name
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        {status && (
          <div
            className={`status-message ${status.type === "error" ? "status-error" : "status-success"}`}
          >
            {status.message}
          </div>
        )}
        <button className="button button-primary" disabled={saving}>
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>

      <section className="content-section">
        <h2>Watch history</h2>
        {watchHistory.length === 0 ? (
          <div className="status-message">No watch history found yet.</div>
        ) : (
          <div className="grid-list">
            {watchHistory.map((video) => (
              <div className="history-card" key={video._id}>
                <img src={video.thumbnail} alt={video.title} />
                <div>
                  <h3>{video.title}</h3>
                  <p>
                    {video.owner?.fullName ||
                      video.owner?.Username ||
                      "Unknown creator"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;
