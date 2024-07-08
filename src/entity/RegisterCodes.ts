import { User } from "./User.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RegisterCode {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: "int" })
    code: number

    @ManyToOne(() => User, (user) => user.registerCode)
    user: User

    @Column({ type: 'boolean', default: false })
    checked: boolean
}