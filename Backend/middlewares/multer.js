import multer from 'multer'
const storage = multer.memoryStorage()

const filerFiles = (req, file, cb) => {
    const typesAllowed = [
        'image/png',
        'image/jpg',
        'image/jpeg'
    ]
    if (typesAllowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(
            new Error ("only png, jpg and jpeg formats are allowed"), false
        )
    }
}

const upload = multer(
    { storage: storage,
      limits: {
        fileSize: 5 * 1024 * 1024
      },
      fileFilter: filerFiles
        
    }

);
export default upload