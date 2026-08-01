import mongoose from "mongoose";
import logger from "../logger/logger.js";

mongoose.connection.on("connected", ()=>{
    logger.info("DataBase connected successfully")
})

const ConnectDb = async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/NotesApp`)
        logger.info("DataBase created successfully")
    }
    catch(error){
        logger.error(error, "DataBase connection failed")
        throw error;
        
    }
}

export default ConnectDb;