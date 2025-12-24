import { HttpException, HttpStatus } from '@nestjs/common';
import { STATUS_CODES } from 'node:http';

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
        error: STATUS_CODES[HttpStatus.UNAUTHORIZED],
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
