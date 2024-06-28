import { Module } from "@nestjs/common";
import { HotelService } from "./hotel.service";
import { HotelController } from "./hotel.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Hotel } from "src/entity/Hotel.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Hotel])],
    providers: [HotelService],
    controllers: [HotelController]
}) export class HotelModule{}