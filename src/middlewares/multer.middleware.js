import multer from 'multer';
import {v4 as uuidv4} from "uuid"

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "./videos");
    },
    filename: (req, file, cb) => {
        const filename = uuidv4();
        const prx = file.originalname.split(".");
        cb(null, `${filename}.${prx[1]}`);
    }
});

export default multer({ storage });