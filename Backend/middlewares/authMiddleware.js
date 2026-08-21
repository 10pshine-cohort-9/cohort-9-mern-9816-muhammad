import express from "express";
import jwt from 'jsonwebtoken'
import logger from "../logger/logger.js";

const userAuthantication = async (req, res, next) => {
    try {
    const header = req.headers.authorization;
    
    if (!header) {
        return res.status(401).json({'success': false, 'message': "Token is not provided"})
    }
    const token = header.split(" ")[1];
    const decrypted = await jwt.verify(token, process.env.JWT_SECRET)
    
    req.UserId = decrypted.id;
    next();    
    } catch (error) {
        logger.error(error)
        return res.status(401).json({'success': false, 'message': "Invalid or Expired Token"})
    }
    
}
export default userAuthantication
//6a7cc3260a90355b86f69c3e