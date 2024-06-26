import {SetMetadata} from '@nestjs/common'
import {Roles} from '../enum/Role.enum'

export const RolesAdmin = (...roles:Roles[])=> SetMetadata('roles', roles)