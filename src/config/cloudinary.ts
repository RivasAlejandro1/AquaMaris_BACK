import { v2 } from "cloudinary";
/* import path from "path"; */
import { config as dotenvConfig } from "dotenv";
dotenvConfig({path: "./src/config/.env"});

export const CloudinaryConfig ={
    provide: "CLOUDINARY",
    useFactory: () => {
        return v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
    }
}