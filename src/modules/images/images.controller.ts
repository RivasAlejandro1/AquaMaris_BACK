import { Controller } from "@nestjs/common";
import { ImagesService } from "./images.service";

@Controller()
export class ImagesController{
    constructor(private readonly imagesServices: ImagesService){}

    imagesSeeder(){
        this.imagesServices.imagesSeeder()
    }
}