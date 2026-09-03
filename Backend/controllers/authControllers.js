import express from "express";
import NotesAppUsers from "../models/Users.js";
import UserProfile from "../models/UserProfileSchema.js";
import logger from '../logger/logger.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const signUp = async (req, res) => {
    const emailRegExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegExpression = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    const saltRounds = 10;
    try {
        const { UserName, Email, Password }  = req.body;
         if (!UserName || !UserName.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "UserName is required"
                })
              }
              if (typeof Email !== "string" ||  !Email.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Email is required"
                })
              }
              if (!emailRegExpression.test(Email)) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid Email"
                })
              }
              if (!Password) {
                return res.status(400).json({
                    success: false,
                    message: "Enter password"
                })
              }
              if (!passwordRegExpression.test(Password)) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 8 characters and contain uppercase, lowercase and a number"
                })
              }
        const encryptedPassword = await bcrypt.hash(Password, saltRounds)
    const user = new NotesAppUsers({ UserName, Email, encryptedPassword });
    await user.save();
    logger.info("A new user registered successfully")  
    
    const userProfile = new UserProfile({
        UserId: user._id,
        Name: user.UserName,
        Email: user.Email
    })
    await userProfile.save()
    res.status(201).json({'success': true, 'message': "Account Created Successfully!"})
    logger.info("Profile of newly registered user created successfully")

    } catch (error) {
        res.status(409).json({'success': false, 'message': "Add a unique email! This email already exists"})
        logger.error(error)
    }
    
}

const Login = async (req, res) => {
    try {
        const {Email, Password}= req.body

        if (typeof Email !== "string" || !Email.trim()) {
            return res.status(400).json({
            success: false,
            message: "Email is required"
            })
        }        
        if (!Password) {
            return res.status(400).json({
            success: false,
            message: "Enter password"
            })
        }
        
        const filteredUser = await NotesAppUsers.findOne({Email})
        if (!filteredUser) {
            return res.status(401).json({'success': false, 'message': "No account found with this email"})
        }
        const isAuthenticated = await bcrypt.compare(Password, filteredUser.encryptedPassword)
        if (!isAuthenticated) {
            logger.error("the user is not authenticated")
           return res.status(401).json({'success': false, 'message': 'invalid email or password'})
        }
       
        const token = jwt.sign({id:filteredUser._id}, process.env.JWT_SECRET, {expiresIn: '2d'} )
            logger.info("The user is authenticated")
            return res.status(200).json({'success': true, 'message': "Login Successful! Welcome Back", token})
        
        
    } catch (error) {
        logger.error(error)
    }
}

export {signUp, Login}