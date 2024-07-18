import { HttpException, HttpStatus } from '@nestjs/common';

export class UserIsLockedException extends HttpException {
  constructor() {
    super('Este usuario se encuentra bloqueado por favor contacte con el hotel', HttpStatus.FORBIDDEN);
  }
}
