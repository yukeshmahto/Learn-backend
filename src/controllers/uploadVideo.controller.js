



const uploadVideo = async (req, res) => {
    const { file } = req;
    const { secure_url, public_id } = await uploadOnCloudinary(file.path);
    res.json({ secure_url, public_id });
}

export { uploadVideo };