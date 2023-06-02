import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class WsRedisIoAdapter extends IoAdapter {
    private adapterConstructor: ReturnType<typeof createAdapter>;

    constructor(
        private app: INestApplicationContext,
        private configService: ConfigService,
    ) {
        super(app);
    }

    async connectToRedis(): Promise<void> {
        const redisHost = this.configService.get<string>('REDIS_HOST');
        const redisPort = this.configService.get<number>('REDIS_PORT');
        const redisPassword = this.configService.get<string>('REDIS_PASSWORD');
        const pubClient = createClient({
            url: `redis://${redisHost}:${redisPort}`,
            password: redisPassword,
        });
        const subClient = pubClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]);
        this.adapterConstructor = createAdapter(pubClient, subClient);
    }

    createIOServer(port: number, options?: ServerOptions) {
        port = this.configService.get<number>('WS_PORT');
        options.path = this.configService.get<string>('WS_PATH');
        //options.namespace = '/admin';
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}
