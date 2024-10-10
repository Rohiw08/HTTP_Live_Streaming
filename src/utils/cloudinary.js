import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (directoryName) => {
    try {
        // console.log(`videos/${path.basename(directoryName)}`);
        
        const files = fs.readdirSync(directoryName);
        const uploadPromises = files.map(file => {
            console.log(`${directoryName}/${file}`);
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(`${directoryName}/${file}`, {
                    resource_type: "raw",
                    use_filename: true, 
                    unique_filename: false,
                    folder: `videos/${path.basename(directoryName)}`
                }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            });
        });

        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};

export { uploadOnCloudinary };