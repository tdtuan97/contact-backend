import {HttpStatus, Logger, UnprocessableEntityException, ValidationPipe} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { ApiTransformInterceptor } from './common/interceptors/api-transform.interceptor';
import { setupSwagger } from './setup-swagger';
import { LoggerService } from './shared/logger/logger.service';

const SERVER_PORT = process.env.SERVER_PORT;
const PREFIX = process.env.PREFIX ?? '';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
            bufferLogs: true,
        },
    );
    app.enableCors();
    // Endpoint prefix
    app.setGlobalPrefix(PREFIX);
    // custom logger
    app.useLogger(app.get(LoggerService));
    // validate
    app.useGlobalPipes(
        new ValidationPipe({
            transform           : true,
            whitelist           : true,
            forbidNonWhitelisted: true,
            exceptionFactory    : (errors: ValidationError[]) => {
                let results      = {};
                let errorDetails = errors.filter((item) => !!item.constraints);
                // Get first error
                errorDetails.map((item) => {
                    results[item.property] = Object.values(item.constraints);
                });

                return new UnprocessableEntityException(results);
            },
        }),
    );

    // exception
    app.useGlobalFilters(
        new ApiExceptionFilter(app.get(LoggerService)),
    );

    // api interceptor
    app.useGlobalInterceptors(new ApiTransformInterceptor(new Reflector()));

    // swagger
    setupSwagger(app);

    // start
    await app.listen(SERVER_PORT, '0.0.0.0');
    const serverUrl = await app.getUrl();

    Logger.log(
        `The API service has been started, please visit: ${serverUrl}${PREFIX}`,
    );
    Logger.log(
        `API documentation has been generated, please visit: ${serverUrl}/${process.env.SWAGGER_PATH}/`,
    );
}

bootstrap();
