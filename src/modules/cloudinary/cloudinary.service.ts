import { Injectable } from "@nestjs/common";
import { UploadApiResponse, v2 } from "cloudinary";
import { error } from "console";
import toStream = require("buffer-to-stream")


@Injectable()
export class CloudinaryService {


    async uploudImage(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream(
                { resource_type: "auto"},
                (error, result) => {
                    if(error){ reject(error)}
                    else{ resolve(result)}
                }
            )

            toStream(file.buffer).pipe(upload)
        })
    }
}