import {Router} from "express";
import {
    publishAVideo,
    getVideoById,
    getAllVideos,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js";

import { upload } from "../middlewares/multer.midleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/publish-video").post(

    verifyJWT,

    upload.fields([
        {
            name: "video",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),

    publishAVideo
);

router.route("/get-video/:videoId")
.get(getVideoById);

router.route("/get-all-videos")
.get(getAllVideos);

router.route("/update-video/:videoId")
.patch(verifyJWT, updateVideo);

router.route("/delete-video/:videoId")
.delete(verifyJWT, deleteVideo);

router.route("/toggle-publish-status/:videoId")
.patch(verifyJWT, togglePublishStatus);

export default router;