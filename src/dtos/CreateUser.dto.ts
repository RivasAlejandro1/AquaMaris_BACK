import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsNumberString,
} from 'class-validator';
import { MembershipStatus } from '../enum/MembershipStatus.enum';
import { Role } from '../enum/Role.enum';

/**
 * Datos para la creación de un nuevo usuario.
 */
export class CreateUserDto {
  /**
   * Nombre del usuario.
   * @example "Juan Pérez"
   */
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  /**
   * Correo electrónico del usuario.
   * @example "juan.perez@gmail.com"
   */
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 100)
  email: string;

  /**
   * Contraseña del usuario.
   * @example "password123"
   */
  @IsString()
  @IsNotEmpty()
  password: string;

   /**
   * Confirmación de la contraseña del usuario.
   * @example "password123"
   */
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  /**
   * Rol del usuario.
   * @example "USER"
   */
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  /**
   * Número de teléfono del usuario (opcional).
   * @example 1234567890
   */
  @IsNumberString()
  @IsOptional()
  phone: string;

   /**
   * País del usuario (opcional).
   * @example "Colombia"
   */
  @IsString()
  @IsOptional()
  @Length(1, 255)
  country: string;

  /**
   * URL de la foto del usuario (opcional).
   * @example "https://imgs.search.brave.com/eGEt0FkkX704C_R3ZoFnVU1F1ThPI21v2mIsDL_s4pc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c29sdmV0aWMuY29t/L3VwbG9hZHMvbW9u/dGhseV8wNl8yMDE2/L3Bvc3QtODIxLTAt/MzkzMTEyMDAtMTQ2/NzMxNzA0MS5qcGc"
   */
  @IsString()
  @IsOptional()
  user_photo: string;

  /**
   * Estado de la membresía del usuario (opcional).
   * @example "DISABLED"
   */
  @IsOptional()
  @IsEnum(MembershipStatus)
  membership_status: MembershipStatus;
}
