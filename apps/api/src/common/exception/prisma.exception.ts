import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import { ErrorResponseDto } from '../dto/default-error.dto';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace';

// Map Prisma error codes to HTTP status codes and a generic error message
export const errorMap: Record<string, { status: number; message: string }> = {
  P2000: { status: HttpStatus.BAD_REQUEST, message: 'Invalid data provided' }, // 400 Bad Request
  P2002: { status: HttpStatus.CONFLICT, message: 'Resource already exists' }, // 409 Conflict
  P2025: { status: HttpStatus.NOT_FOUND, message: 'Resource not found' }, // 404 Not Found
  // Add any other prisma error codes you want to handle...
};

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { code } = exception;
    const { status, message } = errorMap[code] ?? {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };

    const errorResponse: ErrorResponseDto = {
      statusCode: status,
      ...(STATUS_CODES[status] && { error: STATUS_CODES[status] }),
      message,
    };

    response.status(status).json(errorResponse);
  }
}
