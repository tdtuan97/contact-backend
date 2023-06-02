import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { SocketException } from 'src/common/exceptions/socket.exception';
import { WsAuthService } from './ws-auth.service';

@Injectable()
export class WsGuard implements CanActivate {
    constructor(private wsAuthService: WsAuthService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const client = context.switchToWs().getClient<Socket>();
        const token = client?.handshake?.query?.token;
        try {
            // Mount the object on the current request
            this.wsAuthService.checkAdminAuthToken(token);
            return true;
        } catch (e) {
            // close
            client.disconnect();
            // Failed to pass token verification
            throw new SocketException(11001);
        }
    }
}
