import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { EntityPropertyNotFoundError } from 'typeorm';

@Catch(EntityPropertyNotFoundError)
export class EntityPropertyNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityPropertyNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(400).json({
      statusCode: 400,
      message: exception.message,
      error: 'Bad Request',
    });
  }
}
