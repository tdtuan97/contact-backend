import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { isEmpty } from 'lodash';
import { ApiException } from 'src/common/exceptions/api.exception';
import {
    AUTH_USER,
    AUTHORIZE_KEY_METADATA,
} from 'src/modules/app/contact-app.constants';
import { AuthService } from 'src/modules/app/auth/auth.service';

/**
 * admin perm check guard
 */
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Check whether it is an open type. For example, the interface for obtaining the verification code type does not need to be verified. You can add @Authorize to automatically let it go
        const authorize = this.reflector.get<boolean>(
            AUTHORIZE_KEY_METADATA,
            context.getHandler(),
        );
        if (authorize) {
            return true;
        }
        const request = context.switchToHttp().getRequest<FastifyRequest>();
        const url = request.url;
        const path = url.split('?')[0];
        let token = request.headers['authorization'] as string;
        token = token ?? '';
        // Remove prefix for 'Bearer '
        token = token.replace('Bearer ', '');

        if (isEmpty(token)) {
            throw new ApiException(11001, HttpStatus.UNAUTHORIZED);
        }
        try {
            // Mount the object on the current request
            request[AUTH_USER] = this.jwtService.verify(token);
        } catch (e) {
            // Failed to pass token verification
            throw new ApiException(11001, HttpStatus.UNAUTHORIZED);
        }

        if (isEmpty(request[AUTH_USER])) {
            throw new ApiException(11001, HttpStatus.UNAUTHORIZED);
        }
        const pv = await this.authService.getRedisPasswordVersionById(
            request[AUTH_USER].uid,
        );
        if (pv !== `${request[AUTH_USER].pv}`) {
            // Inconsistent password version, password has been changed during login
            throw new ApiException(11002, HttpStatus.UNAUTHORIZED);
        }
        const redisToken = await this.authService.getRedisTokenById(
            request[AUTH_USER].uid,
        );
        if (token !== redisToken) {
            // Inconsistent with redis save
            throw new ApiException(11002, HttpStatus.UNAUTHORIZED);
        }
        /* // Register the annotation, and the Api will release the detection
        const notNeedPerm = this.reflector.get<boolean>(
            PERMISSION_OPTIONAL_KEY_METADATA,
            context.getHandler(),
        );

        // Pass the Token verification identity, judge whether the url that requires permission is required, and pass if no permission is required
        if (notNeedPerm) {
            return true;
        }
        const perms: string = await this.authService.getRedisPermsById(
            request[AUTH_USER].uid,
        );

        // Safety check
        if (isEmpty(perms)) {
            throw new ApiException(11001, HttpStatus.UNAUTHORIZED);
        }
        // Convert sys:user:user etc. to sys/admin/user
        const permArray: string[] = (JSON.parse(perms) as string[]).map((e) => {
            return e.replace(/:/g, '/');
        });

        // Whether the traversal permission includes the url, if not included, there is no access permission
        if (!permArray.includes(path.replace(`/${CONTACT_PREFIX}/`, ''))) {
            throw new ApiException(11003, HttpStatus.FORBIDDEN);
        }*/

        // pass
        return true;
    }
}
