import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../../entity/User.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "src/dtos/CreateUser.dto";
import { Role } from "../../enum/Role.enum";
import { MembershipStatus } from "../../enum/MembershipStatus.enum";
import * as bcrypt from 'bcrypt';
import { MailType } from "../../enum/MailType.dto";
import { BadRequestException } from "@nestjs/common";
import { MailService } from "../mail/mail.service";

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue(null),
        verify: jest.fn().mockResolvedValue(null),
    }),
}));

describe('Auth Service', () => {
    let service: AuthService;
    let userRepository: Repository<User>;
    let jwtService: JwtService;
    let mailService: MailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mockToken')
                    }
                },
                {
                    provide: MailService,
                    useValue: {
                        sendMail: jest.fn().mockResolvedValue(null)
                    }
                }
            ]
        }).compile();

        service = module.get<AuthService>(AuthService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        jwtService = module.get<JwtService>(JwtService);
        mailService = module.get<MailService>(MailService);
    });

    describe('signUp', () => {
        it('should create a new user and send a welcome email', async () => {
            const createUserData: CreateUserDto = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
                confirmPassword: 'password',
                phone: 1234567890,
                country: 'Test Country',
                user_photo: 'photo_url',
                role: Role.USER,
                membership_status: MembershipStatus.DISABLED,
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            const mockUser: Partial<User> = {
                id: '',
                name: createUserData.name,
                email: createUserData.email,
                password: 'hashedPassword',
                phone: createUserData.phone,
                country: createUserData.country,
                user_photo: createUserData.user_photo,
                role: Role.USER,
                booking: [],
                status: true,
                date_start: new Date(),
                is_locked: false,
            };

            jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser as User);

            const result = await service.signUp(createUserData);

            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { email: createUserData.email },
            });

            expect(bcrypt.hash).toHaveBeenCalledWith(createUserData.password, 10);
            expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                name: createUserData.name,
                email: createUserData.email,
                password: 'hashedPassword',
                role: Role.USER,
                phone: createUserData.phone,
                country: createUserData.country,
                user_photo: createUserData.user_photo,
                membership_status: MembershipStatus.DISABLED,
            }));
            expect(mailService.sendMail).toHaveBeenCalledWith({
                to: createUserData.email,
                subject: "Bienvenido a AquaMaris Hotel's",
                name: createUserData.name,
                type: MailType.REGISTER,
                email: createUserData.email,
            });
            expect(result).toEqual({
                name: createUserData.name,
                email: createUserData.email,
                phone: createUserData.phone,
                country: createUserData.country,
                user_photo: createUserData.user_photo,
                role: createUserData.role,  
                membership_status: createUserData.membership_status     
            });
        });

        it('should throw BadRequestException if passwords do not match', async () => {
            const createUserData: CreateUserDto = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
                confirmPassword: 'differentPassword',
                phone: 1234567890,
                country: 'Test Country',
                user_photo: 'photo_url',
                role: Role.USER,
                membership_status: MembershipStatus.DISABLED,
            };

            await expect(service.signUp(createUserData)).rejects.toThrow(
                BadRequestException,
            );
        });
    });
});