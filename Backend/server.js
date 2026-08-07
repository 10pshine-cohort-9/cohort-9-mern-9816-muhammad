import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import logger from './logger/logger.js'
import ConnectDb from './config/MongoDb.js'
import connectCloudinary from './config/Cloudinary.js'
import Notesroute from './routes/NotesRoutes.js'

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


app.get('/', (req, res) => {
    res.send("Api working")
})
app.post('/', (req, res) => {
    const { data } = req.body
    console.log(data);
    
})

serverStarter();