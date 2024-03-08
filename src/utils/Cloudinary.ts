import { v2 as cloudinary } from "cloudinary";
import Env from "./Env/Env";

export const uploadToCloudinary = (
    file: Express.Multer.File
): Promise<string> => {
    cloudinary.config({
        cloud_name: Env.EXPRESS_CLOUDINARY_CLOUD_NAME,
        api_key: Env.EXPRESS_CLOUDINARY_API_KEY,
        api_secret: Env.EXPRESS_CLOUDINARY_API_SECRET,
    });

    return new Promise((resolve, reject) => {
        const opt = { folder: Env.EXPRESS_CLOUDINARY_FOLDER };

        cloudinary.uploader.upload(file.path, opt, function (error, result) {
            if (error) {
                return reject(error);
            }
            return resolve(result.secure_url);
        });
    });
};