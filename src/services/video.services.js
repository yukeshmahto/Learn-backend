import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/claudinary.js";
import ApiError from "../utils/ApiError.js";

const publishVideoService = async ({
    title,
    description,
    videoFilePath,
    thumbnailPath,
    owner
}) => {

    const [videoUpload, thumbnailUpload] =
        await Promise.all([
            uploadOnCloudinary(videoFilePath),
            uploadOnCloudinary(thumbnailPath)
        ]);

    if (!videoUpload) {
        throw new ApiError(
            500,
            "Video upload failed"
        );
    }

    if (!thumbnailUpload) {
        throw new ApiError(
            500,
            "Thumbnail upload failed"
        );
    }

    const createdVideo = await Video.create({

        title,

        description,

        videoFile:
            videoUpload.secure_url,

        thumbnail:
            thumbnailUpload.secure_url,

        duration:
            videoUpload.duration,

        owner
    });

    return createdVideo;
};

export {
    publishVideoService
};