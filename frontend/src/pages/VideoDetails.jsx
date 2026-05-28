import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { getAuth } from "../utils/auth";

const VideoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const currentUser = getAuth()?.user;

  const fetchVideo = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/video/get-video/${id}`);
      setVideo(response.data.data);
      setTitle(response.data.data.title || "");
      setDescription(response.data.data.description || "");
    } catch (err) {
      setError(err.response?.data?.message || "Video not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const videoOwnerId = video?.owner?._id || video?.owner;
  const canEdit =
    currentUser && videoOwnerId && currentUser._id === videoOwnerId;

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/video/delete-video/${id}`);
      navigate("/");
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Unable to delete video.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const response = await api.patch(`/video/update-video/${id}`, {
        title,
        description,
      });
      setVideo(response.data.data);
      setStatus({ type: "success", message: "Video updated successfully." });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Unable to update video.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="page-shell">
        <div className="status-message">Loading video...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell">
        <div className="status-message status-error">{error}</div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="video-detail-shell">
        <div className="video-preview-card">
          <video controls className="video-player" src={video?.videoFile} />
          <div className="video-detail-info">
            <h1>{video?.title}</h1>
            <p>{video?.description}</p>
            <p className="meta-line">Views: {video?.views ?? 0}</p>
            <p className="meta-line">
              Uploaded: {new Date(video?.createdAt).toLocaleDateString()}
            </p>
            <p className="meta-line">
              Author:{" "}
              {video?.owner?.fullName || video?.owner?.Username || videoOwnerId}
            </p>
          </div>
        </div>

        {canEdit && (
          <section className="form-card video-edit-card">
            <div className="section-title-row">
              <h2>Edit video details</h2>
              <button
                className="button button-secondary"
                onClick={() => setEditing((state) => !state)}
              >
                {editing ? "Hide editor" : "Edit"}
              </button>
            </div>
            {editing && (
              <form onSubmit={handleUpdate}>
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
                    rows="4"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
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
                <div className="action-row">
                  <button
                    className="button button-primary"
                    type="submit"
                    disabled={submitting}
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={handleDelete}
                    disabled={submitting}
                  >
                    Delete video
                  </button>
                </div>
              </form>
            )}
          </section>
        )}
      </section>
    </main>
  );
};

export default VideoDetails;
