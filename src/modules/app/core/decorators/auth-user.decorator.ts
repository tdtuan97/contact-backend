import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AUTH_USER } from '../../contact-app.constants';

export const AuthUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        // auth guard will mount this
        const user = request[AUTH_USER];

        return data ? user?.[data] : user;
    },
);
