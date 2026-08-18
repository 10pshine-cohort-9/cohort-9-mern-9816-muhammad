import multer from 'multer'
//import {storage} from '../config/Cloudinary.js'

//const upload = multer({storage: storage})
const storage = multer.memoryStorage()
const upload = multer({ storage: storage});
export default upload