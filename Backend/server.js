import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import logger from './logger/logger.js'
import ConnectDb from './config/MongoDb.js'
import connectCloudinary from './config/Cloudinary.js'

ConnectDb();
connectCloudinary();

const app = express()
const port = process.env.PORT;

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Api working")
})

app.listen(port, () => {
   logger.info(`server has started on port ${port}` )
})