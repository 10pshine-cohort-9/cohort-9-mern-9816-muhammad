import express from 'express'
import logger from '../logger/logger.js'
import UserProfile from '../models/UserProfileSchema.js';
import { cloudinary } from '../config/Cloudinary.js';
const getProfile = async (req, res) => {
    try {
        console.log("user id middleware", req.UserId);
        
        const profile = await UserProfile.findOne({UserId: req.UserId});
        if (!profile) {
            return res.status(404).json({'success': false, 'message': "profile not found"})
        }

        res.status(200).json({success: true, profile})
        logger.info(`User's profile with id is finded successfully`) 
    } catch (error) {
        logger.error(error)
        res.status(404)
    }
}

// const updatedProfile = async (req, res) => {
//     try {
//         const { UserId } = req.params;
//         const url = req.file.path;
//         const fileName = req.file.originalname;

//         const {Name, Email, Password, Tel, Address, Gender, DoB} = req.body;
//         const editedProfile = await UserProfile.findByIdAndUpdate({UserId: req.UserId}, {Image: {url: url, fileName: fileName}, Name, Email,
//              Tel, Address, Gender, DoB}, {returnDocument: 'after', runValidators: true}); 
//         if (!editedProfile) {
//             res.status(505).send("Edited Profile not found or invalid Id");
//         } else {
//             logger.info(`The profile with id ${UserId} updated successfully`);
//            return res.status(200).json({success: true, editedProfile})
//         }     
//     } catch (error) {
//         logger.error(error)
//         res.json({success: false,message: "The profile is not updated"})
//     }
// }
const updatedProfile = async (req, res) => {
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
            updateData.Image = {
                url: result.secure_url,
                fileName: req.file.originalname
            };
        }

        // Upload new image to Cloudinary
//         if (req.file) {
//         const result = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//             {
//                 folder: "NotesAppUsers",
//                 resource_type: "image"
//             },
//             (error, result) => {
//                 if (error) {
//                     console.error("========== CLOUDINARY UPLOAD ERROR ==========");
//                     console.dir(error, { depth: null });
//                     console.error("==============================================");
//                     reject(error);
//                 } else {
//                     resolve(result);
//                 }
//             }
//         );

//         uploadStream.end(req.file.buffer);
//     });

//     console.log("CLOUDINARY RESULT:", result);

//     updateData.Image = {
//         url: result.secure_url,
//         fileName: req.file.originalname
//     };
// }

        console.log("UPDATE DATA:", updateData);

        // // If an image was uploaded
        // if (req.file) {
        //     updateData.Image = {
        //         url: req.file.path,
        //         fileName: req.file.originalname
        //     };
            
        // }
        // console.log("UPDATE DATA:", updateData);

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

        logger.info(
            `The profile with user id ${req.UserId} updated successfully`
        );

        return res.status(200).json({
            success: true,
            profile: editedProfile
        });

     }
     catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    logger.error({
        error: error.message,
        stack: error.stack
    }, "Profile update failed");

    return res.status(500).json({
        success: false,
        message: error.message
    });
}
     // catch (error) {

    //     logger.error(error);

    //     return res.status(500).json({
    //         success: false,
    //         message: "The profile is not updated"
    //     });
    //}
};

export {getProfile, updatedProfile}