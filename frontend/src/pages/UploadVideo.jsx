import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const body = new FormData();
      body.append("title", title);
      body.append("description", description);
      if (videoFile) body.append("video", videoFile);
      if (thumbnail) body.append("thumbnail", thumbnail);

      await api.post("/video/publish-video", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page-shell form-shell">
      <h1>Publish a video</h1>
      <p>
        Upload a new video with a thumbnail to make it available on the
        platform.
      </p>

      <form onSubmit={handleSubmit} className="form-card">
        <label>
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            rows="5"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </label>
        <label>
          Video file
          <input
            type="file"
            accept="video/*"
            onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)}
            required
          />
        </label>
        <label>
          Thumbnail image
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setThumbnail(event.target.files?.[0] ?? null)}
            required
          />
        </label>
        {error && <div className="status-message status-error">{error}</div>}
        <button className="button button-primary" disabled={saving}>
          {saving ? "Publishing..." : "Publish Video"}
        </button>
      </form>
    </main>
  );
};

export default UploadVideo;
