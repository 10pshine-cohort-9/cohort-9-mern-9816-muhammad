import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import logger from "../logger/logger.js";

// Configure Cloudinary immediately on file load
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verified connection test function
const connectCloudinary = async () => {
    try {
        if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error("Cloudinary env variables are missing")
        }
        logger.info("Cloudinary configured successfully")
    } catch (error) {
        logger.error(error)
    }
};

export default connectCloudinary