import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';
import { SocketException } from 'src/common/exceptions/socket.exception';
import { IAuthUser } from '../app/contact-app.interface';

@Injectable()
export class WsAuthService {
    constructor(private jwtService: JwtService) {}

    checkAdminAuthToken(
        token: string | string[] | undefined,
    ): IAuthUser | never {
        if (isEmpty(token)) {
            throw new SocketException(11001);
        }
        try {
            // Mount the object on the current request
            return this.jwtService.verify(
                Array.isArray(token) ? token[0] : token,
            );
        } catch (e) {
            // Failed to pass token verification
            throw new SocketException(11001);
        }
    }
}
