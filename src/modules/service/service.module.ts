import { Module } from "@nestjs/common";
import { ServiceService } from "./service.service";
import { ServiceController } from "./service.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Service } from "src/entity/Service.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Service])],
    providers:[ServiceService],
    controllers: [ServiceController]
})
export class ServiceModule{}