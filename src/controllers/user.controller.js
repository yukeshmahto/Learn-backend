import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import uploadOnCloudinary from "../utils/claudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAcessAndRefreshToken = async (userId) => {
    try {
        await user.findById(userId)
       const acessToken = user.generateAcessToken();
       const refreshToken = user.generateRefreshToken();

         user.refreshToken = refreshToken;
         await user.save({validateBeforeSave: false});

         return {acesstoken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Error while generating access and refresh token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user detail from payload
    // Validation for feilds
    // check if user already exist: usernam, email
    //images
    // upload them to cloudnary
    // hash password
    // create user
    // send response

    const {Username, email, password, fullName} = req.body
    console.log(Username, email, password, fullName);
    if (
        [
            Username,
            email,
            password,
            fullName
        ].some((field) => field?.trim() === "")
    )
        throw new ApiError(400, "All fields are required");
    
    const existedUser = await User .findOne({
        $or: [
            {Username},
            {email}
        ]
    })

    if (existedUser){ 
        throw new ApiError(409, "User already exist")
    }

    // console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar fields is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar fields is required");
    }

    const user = await User.create({
        fullName,
        Username: Username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
   }

   return res.status(201).json(
    new ApiResponse(200, createdUser, "User created successfully")
   )
})

const loginUser = asyncHandler(async (req, res) => {
    // get user detail from payload
    // Validation for feilds
    // check if user exist with email or username
    // if exist then compare password
    // if password is correct then generate access token and refresh token
    // send cookie

    const {email, username, password} = req.body
    if (!email || !username) {
        throw new ApiError(400, "Email or username is required");
    }

    User.findOne({
        $or: [
            {email},
            {username}
        ]
    })

    if (!user) {
        throw new ApiError(404, "User not found with provided email or username");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid password");
    }

    const {accessToken, refreshToken} = await generateAcessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("refreshToken", refreshToken, cookieOptions).cookie("accessToken", accessToken, cookieOptions).json(
        new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "User logged in successfully")
    )
})

const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshTokes: undefined
            }  
    },
     {new: true}
    )

    const cookieOptions = {
    httpOnly: true,
    secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})

export {registerUser, loginUser, logoutUser}