import {CallHandler, ExecutionContext, NestInterceptor} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Observable} from 'rxjs';
import {FastifyReply} from 'fastify';
import {map} from 'rxjs/operators';
import {TRANSFORM_KEEP_KEY_METADATA} from '../contants/decorator.contants';
import {ResponseDto} from '../class/res.class';

/**
 * Process the returned interface results uniformly, and add the @Keep decorator if not required
 */
export class ApiTransformInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) {
    }

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                const keep = this.reflector.get<boolean>(
                    TRANSFORM_KEEP_KEY_METADATA,
                    context.getHandler(),
                );
                if (keep) {
                    return data;
                } else {
                    const response = context.switchToHttp().getResponse<FastifyReply>();
                    response.header('Content-Type', 'application/json; charset=utf-8');
                    return new ResponseDto(200, data);
                }
            }),
        );
    }
}
