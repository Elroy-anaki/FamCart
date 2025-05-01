import multer, { diskStorage } from "multer";

const storage = diskStorage({
    destination: "public/uploads",
    filename: function (req, file, cb) {
        const uniqueSuffix = Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});

function fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg"
        || file.mimetype === "image/jpg"
        || file.mimetype === "image/png") {
        cb(null, true)
    } else cb(null, false)
}


const upload = multer({
    storage, fileFilter, limits: {
        fileSize: 100000000
    }
});


export default upload;
