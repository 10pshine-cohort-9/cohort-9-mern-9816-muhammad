import express from 'express'
import logger from '../logger/logger.js'
import UserProfile from '../models/UserProfileSchema.js';
import { cloudinary } from '../config/Cloudinary.js';
const getProfile = async (req, res) => {
    try {
        
        const profile = await UserProfile.findOne({UserId: req.UserId});
        if (!profile) {
            return res.status(404).json({'success': false, 'message': "profile not found"})
        }

        res.status(200).json({success: true, profile})
        logger.info(`User's profile with id is finded successfully`) 
    } catch (error) {
        logger.error(error)
        res.status(500).json({success: false, message: "User profile with that id is not found"})
    }
}

const updatedProfile = async (req, res) => {
    let newImagepublic_id = null;
    let oldImagepublic_id = null;
    try {
        const { Name, Email, Tel, Gender, Dob } = req.body;
        let updateData = {
            Name,
            Email,
            Tel,
            Address: {
                house: req.body.Address?.house || "",
                 CityState: req.body.Address?.CityState || ""
            },
            Gender,
            Dob
        };

        const existingProfile = await UserProfile.findOne({ UserId: req.UserId })
        if (!existingProfile) {
            return res.status(404).json({
            success: false,
            message: "Profile not found"
        });
        }

        oldImagepublic_id = existingProfile.Image?.public_id || null;
        
        if (req.file) {
            const result = await new Promise ((resolve, reject) => {
             const CloudinaryuploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "NotesAppUsers",
                    resource_type: "image"
                },
                (err, result) => {
                    if (err) {
                        logger.error(err)
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
                
                CloudinaryuploadStream.end(req.file.buffer)  
            })
            newImagepublic_id = result.public_id
            updateData.Image = {
                url: result.secure_url,
                fileName: req.file.originalname,
                public_id: result.public_id
            };
        }

        const editedProfile = await UserProfile.findOneAndUpdate(
            { UserId: req.UserId },
            updateData,
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!editedProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        if ( req.file && oldImagepublic_id && oldImagepublic_id !== newImagepublic_id) {
            await cloudinary.uploader.destroy(oldImagepublic_id);
        }


        logger.info(
            `The profile with user id ${req.UserId} updated successfully`
        );

        return res.status(200).json({
            success: true,
            profile: editedProfile
        });

     }
     catch (error) {

    logger.error({
        error: error.message,
        stack: error.stack
    }, "Profile update failed");

    return res.status(500).json({
        success: false,
        message: error.message
    });
}
    
};

export {getProfile, updatedProfile}