import multer from "multer"
import path from 'path';
import fs from 'fs'


function createStorage(outDir: string) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, `../../images/${outDir}`))
            if (!fs.existsSync(path.join(__dirname, `../../images/${outDir}`))) {
                fs.mkdirSync((path.join(__dirname, `../../images/${outDir}`)))
            }
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, `${uniqueSuffix}-${file.originalname}`)
        },

    })
    return storage
}

export const upload = multer({
    storage: createStorage('products'),
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});

export const uploadAvatar = multer({
    storage: createStorage('users'),
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});






// Check file type
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Images Only!'));
    }
}
