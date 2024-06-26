import { Module } from "@nestjs/common";
import { ReservationController } from "./reservartion.controller";
import { ReservationService } from "./reservartion.service";
import { reservationRepository } from "./reservartion.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reservation } from "src/entity/Reservation.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Reservation])],
    controllers: [ReservationController],
    providers: [ReservationService, reservationRepository]
})
export class ReservationModule {
}