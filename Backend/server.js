import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import logger from './logger/logger.js'
import ConnectDb from './config/MongoDb.js'
import Notesroute from './routes/NotesRoutes.js'
import authRoutes from './routes/RegLog.js'
import  connectCloudinary  from './config/Cloudinary.js';

// Call the verification logger
connectCloudinary();
const serverStarter = async () => {
    try {
        await ConnectDb();
        app.listen(port, () => {
        logger.info(`server has started on port ${port}` )
})
        
    } 
    catch (error) {
        logger.error(error, "Application failed to start")
        process.exit(1);
    }
};

const app = express()
const port = process.env.PORT;
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
}))

app.use('/api', Notesroute )
app.use('/api/user', authRoutes)

app.get('/', (req, res) => {
    res.send("Api working")
})


serverStarter();