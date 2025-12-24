import { HttpStatus } from '@nestjs/common';

import { SignInDto, SignUpDto, UserDto } from '@repo/api';

import { ApiDocConfig } from '../common/decorators/api-doc.decorator';
import { TestUsers } from '../config/test-user';

export const SignInDocs: ApiDocConfig<SignInDto, UserDto> = {
  summary: 'Sign in',
  description: 'Sign in with email and password',
  body: SignInDto,
  bodyExamples: {
    ValidCredentials: {
      summary: 'Correct email & password',
      value: {
        email: TestUsers.default.email,
        password: TestUsers.default.password,
      },
    },
  },
  responses: [
    {
      status: HttpStatus.OK,
      description: 'Successful login',
      type: UserDto,
      example: {
        id: TestUsers.default.id,
        email: TestUsers.default.email,
        username: TestUsers.default.username,
      },
    },
    {
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid credentials',
      errorExample: { message: 'Invalid credentials' },
    },
  ],
};

export const SignUpDocs: ApiDocConfig<SignUpDto, UserDto> = {
  summary: 'Sign up',
  description: 'Register a new user with email, username, and password',
  body: SignUpDto,
  bodyExamples: {
    ValidData: {
      summary: 'Valid registration data',
      value: {
        email: 'newuser@example.com', // can use any non-conflicting email
        username: 'newuser',
        password: 'NewUser123!',
      },
    },
    EmailAlreadyExists: {
      summary: 'Email already registered',
      value: {
        email: TestUsers.default.email,
        username: TestUsers.default.username,
        password: TestUsers.default.password,
      },
    },
  },
  responses: [
    {
      status: HttpStatus.CREATED,
      description: 'User successfully created',
      type: UserDto,
      example: {
        id: 'new-user-id1',
        email: 'newuser@example.com',
        username: 'newuser',
      },
    },
    {
      status: HttpStatus.CONFLICT,
      description: 'Email or username already registered',
    },
  ],
};

export const RefreshDocs: ApiDocConfig<null, UserDto> = {
  summary: 'Refresh access token',
  description: 'Use a valid refresh token (cookie) to get a new access token',
  auth: true,
  responses: [
    {
      status: HttpStatus.OK,
      description: 'Refresh successful, returns user info',
      type: UserDto,
      example: {
        id: TestUsers.default.id,
        email: TestUsers.default.email,
        username: TestUsers.default.username,
      },
    },
    {
      status: HttpStatus.UNAUTHORIZED,
      description: 'Refresh token missing, invalid, or expired',
      errorExample: {
        message: 'Invalid credentials',
      },
    },
  ],
};
