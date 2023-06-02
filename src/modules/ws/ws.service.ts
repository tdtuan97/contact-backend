import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsGateway } from 'src/modules/ws/ws.gateway';
import { RemoteSocket } from 'socket.io';

@Injectable()
export class WsService {
    constructor(private jwtService: JwtService, private wsGateway: WsGateway) {}

    /**
     * Get current online users
     */
    async getOnlineSockets() {
        const onlineSockets = await this.wsGateway.socketServer.fetchSockets();
        return onlineSockets;
    }

    /**
     * Find socketid based on uid
     */
    async findSocketIdByUid(
        uid: number,
    ): Promise<RemoteSocket<unknown, unknown>> {
        const onlineSockets = await this.getOnlineSockets();
        const socket = onlineSockets.find((socket) => {
            const token = socket.handshake.query?.token as string;
            const tokenUid = this.jwtService.verify(token).uid;
            return tokenUid === uid;
        });
        return socket;
    }

    /**
     * Filter out socketid according to uid array
     */
    async filterSocketIdByUidArr(
        uids: number[],
    ): Promise<RemoteSocket<unknown, unknown>[]> {
        const onlineSockets = await this.getOnlineSockets();
        const sockets = onlineSockets.filter((socket) => {
            const token = socket.handshake.query?.token as string;
            const tokenUid = this.jwtService.verify(token).uid;
            return uids.includes(tokenUid);
        });
        return sockets;
    }
}
