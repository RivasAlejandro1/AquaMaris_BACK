import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enum/Role.enum';

export const RolesAdmin = (...roles: Role[]) => SetMetadata('roles', roles);
