import { Controller, Injectable, Module } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reservation } from "src/entity/Reservation.entity";
import { Repository } from "typeorm";

@Injectable()
export class reservationRepository {
    constructor( @InjectRepository(Reservation) private readonly reservationRepositoryDB: Repository<Reservation>){}


    async createReservation (){

        const entrance = new Date();
        const exit = new Date();
        return  await this.reservationRepositoryDB.save({entrance, exit, statePay: "asasf"})
    }
    async getAllReservation (){
        return  await this.reservationRepositoryDB.find()
    }
}