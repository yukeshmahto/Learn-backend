import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  const ownerName =
    video?.owner?.fullName || video?.owner?.Username || "Unknown";
  const description = video?.description || "No description available.";

  return (
    <article className="video-card">
      <Link to={`/videos/${video?._id}`} className="card-link">
        <div className="thumbnail-wrap">
          <img src={video?.thumbnail} alt={video?.title} />
        </div>
        <div className="video-content">
          <h3>{video?.title}</h3>
          <p>
            {description.length > 120
              ? `${description.slice(0, 120)}...`
              : description}
          </p>
          <span className="video-meta">{ownerName}</span>
        </div>
      </Link>
    </article>
  );
};

export default VideoCard;
