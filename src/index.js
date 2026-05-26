import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path: "./.env"
});

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Listening on port ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("Database connection failed", error);
    process.exit(1);
})






















// import express from "express";

// const app = express();

// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
//         app.on("Unable to connect with DB", (error) => {
//             console.log(error);
//             throw error;
//         });
//         app.listen(process.env.PORT, () => {
//             console.log(`Listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error(
//             'Error connecting to MongoDB',
//             error
//         )
//     }
// }) ()