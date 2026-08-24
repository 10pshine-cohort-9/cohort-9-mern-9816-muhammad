import express from 'express'
import {getProfile, updatedProfile} from '../controllers/ProfileController.js'
import upload from '../middlewares/multer.js'
import userAuthantication from '../middlewares/authMiddleware.js';
const profileRoutes = express.Router();

profileRoutes.get('/userprofile', userAuthantication, getProfile)

profileRoutes.put('/userprofile', userAuthantication, upload.single("Image"), updatedProfile)

// TEMPORARY error handler



export default profileRoutes