import express from "express";
import NotesAppUsers from "../models/Users.js";
import logger from '../logger/logger.js'
import bcrypt from 'bcrypt'

const signUp = async (req, res) => {
    const saltRounds = 10;
    try {
        const { UserName, Email, Password }  = req.body;
        const encryptedPassword = await bcrypt.hash(Password, saltRounds)
    const user = new NotesAppUsers({ UserName, Email, encryptedPassword });
    await user.save();
    logger.info("A new user registered successfully")    
    } catch (error) {
        logger.error(error)
    }
    
}

const Login = async (req, res) => {
    try {
        const {Email, Password}= req.body
        const filteredUser = await NotesAppUsers.findOne({Email})
        const isAuthenticated = bcrypt.compare(Password, filteredUser.Password)
        if (!isAuthenticated) {
            res.status(401).json({'success': false, 'message': 'invalid email or password'})
        }
        else{
            logger.info("The user is authenticated")
        }
    } catch (error) {
        logger.error(error)
    }
}

export {signUp, Login}