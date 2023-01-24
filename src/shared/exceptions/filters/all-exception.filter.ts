import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AppException } from '../app.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const parsedException = {
      status: 400,
      message: '',
      description: '',
    };

    if (exception instanceof AppException) {
      parsedException.status = exception.status;
      parsedException.message = exception.message;
      parsedException.description = exception.description;
    } else if (exception instanceof BadRequestException) {
      parsedException.status = exception.getStatus();
      parsedException.message = 'Falha na validação dos dados';
      parsedException.description =
        //@ts-ignore
        exception.getResponse()?.message?.join('; ');
    } else if (exception instanceof NotFoundException) {
      parsedException.status = exception.getStatus();
      parsedException.message = exception.name;
      parsedException.description =
        //@ts-ignore
        exception.getResponse()?.message;
    } else if (exception instanceof UnauthorizedException) {
      parsedException.status = 401;
      parsedException.message = 'Sem Autorização';
      parsedException.description =
        'Você não tem autorização para executar essa ação';
    } else if (exception instanceof Error) {
      parsedException.status = 500;
      parsedException.message = 'Internal Server Error';
      parsedException.description = exception.message;

      const customError = `message: ${exception.message} stack: ${exception.stack}`;

      console.log('Error Not Caught: ', customError);
    }

    response.status(parsedException.status).json({
      statusCode: parsedException.status,
      message: parsedException.message,
      description: parsedException.description,
      timestamp: new Date().toISOString(),
    });
  }
}
