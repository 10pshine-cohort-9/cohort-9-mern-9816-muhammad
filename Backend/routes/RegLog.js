import express from "express";
import {signUp, Login} from '../controllers/authControllers.js'

const authRoutes = express.Router()

authRoutes.post('/signup', signUp)

authRoutes.post('/login', Login)

export default authRoutes