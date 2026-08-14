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
    res.status(201).json({'success': true, 'message': "Account Created Successfully!"})
    logger.info("A new user registered successfully")    
    } catch (error) {
        res.status(409).send("Add a unique email! This email already exists")
        logger.error(error)
    }
    
}

const Login = async (req, res) => {
    try {
        const {Email, Password}= req.body
        const filteredUser = await NotesAppUsers.findOne({Email})
        if (!filteredUser) {
            res.status(401).send("No account found with this email")
        }
        const isAuthenticated = bcrypt.compare(Password, filteredUser.Password)
        if (!isAuthenticated) {
            res.status(401).json({'success': false, 'message': 'invalid email or password'})
        }
        else{
            res.status(200).json({'success': true, 'message': "Login Successful! Welcome Back"})
            logger.info("The user is authenticated")
        }
    } catch (error) {
        logger.error(error)
    }
}

export {signUp, Login}