import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../exceptions/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    res.status(400).json({
      type: 'DOMAIN_ERROR',
      code: exception.code,
      message: exception.message,
    });
  }
}
