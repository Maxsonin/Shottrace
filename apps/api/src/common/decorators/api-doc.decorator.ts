import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { STATUS_CODES } from 'node:http';
import { ErrorResponseDto } from 'src/common/dto/default-error.dto';

export interface ApiDocResponse<T = any> {
  status: HttpStatus;
  description?: string;
  type?: new () => T;
  example?: T;
  errorExample?: Partial<ErrorResponseDto>;
}

export interface ApiDocConfig<BodyType = any, ResponsesType = any> {
  summary: string;
  description?: string;
  body?: new () => BodyType;
  auth?: boolean;
  bodyExamples?: Record<string, { summary: string; value: BodyType }>;
  responses?: ApiDocResponse<ResponsesType>[];
}
export function ApiDoc(config: ApiDocConfig<any>) {
  const decorators = [
    ApiOperation({ summary: config.summary, description: config.description }),
  ];

  if (config.auth) decorators.push(ApiBearerAuth());

  if (config.body) {
    decorators.push(
      ApiBody({
        type: config.body,
        examples: config.bodyExamples,
      }),
    );
  }

  for (const resp of config.responses ?? []) {
    let description = resp.description ?? STATUS_CODES[resp.status];
    let type = resp.type;
    let example = resp.example;

    // Assign ErrorResponseDto automatically for errors if no type
    if (!type && resp.status >= 400) {
      type = ErrorResponseDto;
    }

    // Merge error defaults + custom overrides
    if (
      resp.status >= 400 &&
      resp.errorExample &&
      Object.keys(resp.errorExample).length > 0
    ) {
      example = {
        statusCode: resp.status,
        ...(STATUS_CODES[resp.status] && { error: STATUS_CODES[resp.status] }),
        ...resp.errorExample,
      } as ErrorResponseDto;
    }

    decorators.push(
      ApiResponse({
        status: resp.status,
        description,
        ...(type && { type }),
        ...(example && { example }),
      }),
    );
  }

  return applyDecorators(...decorators);
}
