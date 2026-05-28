import { useEffect, useState } from "react";
import { api } from "../api";
import VideoCard from "../components/VideoCard";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/video/get-all-videos", {
        params: { search, limit: 20 },
      });
      setVideos(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [search]);

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div>
          <h1>Welcome to VideoTube</h1>
          <p>
            Discover and share amazing videos on our platform. Use the search bar below to find videos by title or explore the latest uploads. Happy watching!
          </p>
        </div>
        <div className="search-row">
          <input
            type="search"
            placeholder="Search videos by title..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </section>

      <section className="content-section">
        {loading && <div className="status-message">Loading videos...</div>}
        {error && <div className="status-message status-error">{error}</div>}
        {!loading && !error && videos.length === 0 && (
          <div className="status-message">
            No videos found. Try a different search.
          </div>
        )}
        <div className="grid-list">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
