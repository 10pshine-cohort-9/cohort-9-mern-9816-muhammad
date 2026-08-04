import pino, { levels, transport } from "pino";
import PinoPretty from "pino-pretty";

const isDevelopment = process.env.NODE_ENV === 'development'
 
const logger = pino({
    level : "info",
    transport : isDevelopment ? {
        target: "pino-pretty",
        options : {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        },
    }
     :
       undefined,     
})

export default logger