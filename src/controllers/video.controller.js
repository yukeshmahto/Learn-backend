import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/claudinary.js";
import { Video } from "../models/video.model.js";
import { publishVideoService } from "../services/video.services.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
    search = "",
  } = req.query;

  const filter = {};

  // search by title
  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  // filter by owner
  if (userId) {
    filter.owner = userId;
  }

  const allVideo = await Video.find(filter)
    .sort({
      [sortBy]: sortType === "asc" ? 1 : -1,
    })
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .populate("owner", "fullName Username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, allVideo, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const video = await publishVideoService({
    title: req.body.title,

    description: req.body.description,

    videoFilePath: req.files.video[0].path,

    thumbnailPath: req.files.thumbnail[0].path,

    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId).populate(
    "owner",
    "fullName Username avatar",
  );
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // todo: update video details like title, description, thumbnail
  const videoUpdate = await Video.findByIdAndUpdate(videoId, req.body, {
    new: true,
  });
  if (!videoUpdate) {
    throw new ApiError(404, "Video not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, videoUpdate, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // todo: delete video
  const videoDelete = await Video.findByIdAndDelete(videoId);
  if (!videoDelete) {
    throw new ApiError(404, "Video not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, videoDelete, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // todo: toggle publish status
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
