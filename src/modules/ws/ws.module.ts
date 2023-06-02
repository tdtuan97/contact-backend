import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WsGateway } from './ws.gateway';
import { WsAuthService } from './ws-auth.service';
import { WsService } from './ws.service';

const providers = [WsGateway, WsAuthService, WsService];

/**
 * WebSocket Module
 */
@Module({
    imports: [TypeOrmModule.forFeature([])],
    providers,
    exports: providers,
})
export class WsModule {}
