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
import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { MailService } from "../mail/mail.service";
import { RegisterCode } from "src/entity/RegisterCodes";
import { LoginUserDto } from "src/dtos/LoginUser.dto";

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

        it('should throw BadRequestException if the email already exists', async () => {
            const createUserData: CreateUserDto = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
                confirmPassword: 'password',
                phone: 123456789,
                country: 'Test Country',
                user_photo: 'photo_url',
                role: Role.USER,
                membership_status: MembershipStatus.DISABLED
            }


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

            const mockRegisterCode: RegisterCode = {
                id: 'mock-id',
                code: 123456,
                user: mockUser as User,
                checked: false,
            };


            const existingUser: User = {
                id: 'existing-user-id',
                name: 'Existing User',
                email: 'test@example.com',
                password: 'hashedPassword',
                phone: 123456789,
                country: 'Test Country',
                user_photo: 'photo_url',
                role: Role.USER,
                booking: [],
                status: true,
                date_start: new Date(),
                is_locked: false,
                membership_status: MembershipStatus.DISABLED,
                suscription_id: '',
                comments: [],
                registerCode: mockRegisterCode
            }

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser)

            await expect(service.signUp(createUserData)).rejects.toThrow(
                BadRequestException,
            )

            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { email: createUserData.email }
            })
        })
    });
    describe('login', () => {
        it('should authenticate a user and return an access token', async () => {
            const signInData: LoginUserDto = {
                email: 'test@example.com',
                password: 'password',
            };

            const mockUser: Partial<User> = {
                id: 'user-id',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: Role.USER,
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.login(signInData);

            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { email: signInData.email },
            });

            expect(bcrypt.compare).toHaveBeenCalledWith(signInData.password, mockUser.password);
            expect(jwtService.sign).toHaveBeenCalledWith({
                id: mockUser.id,
                email: mockUser.email,
                sub: mockUser.id,
                role: mockUser.role,
            });
            expect(result).toEqual({
                message: "User Logged succesfully",
                token: 'mockToken',
                userData: {
                    email: "test@example.com",
                    id: 'user-id',
                    role: Role.USER
                }
            });
        })

        it('should throw BadRequestException if credentials are invalid', async () => {
            const loginData: LoginUserDto = {
                email: 'test@example.com',
                password: 'wrongPassword'
            }

            const mockUser: Partial<User> = {
                id: 'user-id',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: Role.USER
            }

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false)

            await expect(service.login(loginData)).rejects.toThrow(BadRequestException)

            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { email: loginData.email }
            })

            expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password)
        })
        it('should throw UnauthorizedException si el usuario no existe', async () => {
            const signInData: LoginUserDto = {
                email: "nonexistent@example.com",
                password: "password"
            }

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null)

            await expect(service.login(signInData)).rejects.toThrow(NotFoundException)

            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { email: signInData.email }
            })
        })
    })
});