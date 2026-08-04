import {v2 as cloudinary} from 'cloudinary'
import logger from "../logger/logger.js";

const connectCloudinary = async () => {
    try {
        cloudinary.config({
        cloud_name : process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET  
})
        logger.info("Cloudinary connected successfully")
    } 
    catch (error) {
        logger.error(error)
    }
}

export default connectCloudinary;
