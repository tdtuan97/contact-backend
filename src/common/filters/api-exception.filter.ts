import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { LoggerService } from 'src/shared/logger/logger.service';
import { ApiException } from '../exceptions/api.exception';
import { ResponseDto, ResponseErrorDto } from '../class/res.class';

/**
 * Exception takeover, unified exception return data
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
    constructor(private logger: LoggerService) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();

        // check api exception
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;
        // set json response
        response.header('Content-Type', 'application/json; charset=utf-8');
        // prod env will not return internal error message
        const code =
            exception instanceof ApiException
                ? (exception as ApiException).getErrorCode()
                : status;
        let message = 'The server is abnormal, please try again later';
        // Prompt 500 type error in development mode, block 500 internal error prompt in production mode
        // if (isDev() || status < 500) {
        message =
            exception instanceof HttpException
                ? exception.message
                : `${exception}`;
        // }

        if (code === HttpStatus.UNPROCESSABLE_ENTITY) {
            let errors =
                exception instanceof HttpException
                    ? exception.getResponse()
                    : {};
            const result = new ResponseErrorDto(code, errors, message);
            response.status(status).send(result);
        }

        // Record error 500
        if (status >= 500) {
            this.logger.error(exception, ApiExceptionFilter.name);
        }
        const result = new ResponseDto(code, null, message);
        response.status(status).send(result);
    }
}
