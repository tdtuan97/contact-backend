import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthService } from './ws-auth.service';
import { EVENT_OFFLINE, EVENT_ONLINE } from './ws.event';

/**
 * Admin WebSocket gateway, without permission verification, Socket side only performs notification related operations
 */
@WebSocketGateway()
export class WsGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    @WebSocketServer()
    private wss: Server;

    get socketServer(): Server {
        return this.wss;
    }

    constructor(private wsAuthService: WsAuthService) {}

    /**
     * OnGatewayInit
     */
    afterInit() {
        console.log('Init ws server');
    }

    /**
     * OnGatewayConnection
     */
    async handleConnection(client: Socket): Promise<void> {
        try {
            this.wsAuthService.checkAdminAuthToken(
                client.handshake?.query?.token,
            );
        } catch (e) {
            // no auth
            client.disconnect();
            return;
        }

        // broadcast online
        client.broadcast.emit(EVENT_ONLINE);
    }

    /**
     * OnGatewayDisconnect
     */
    async handleDisconnect(client: Socket): Promise<void> {
        // TODO
        client.broadcast.emit(EVENT_OFFLINE);
    }
}
