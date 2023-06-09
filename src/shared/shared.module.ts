import { HttpModule } from '@nestjs/axios';
import { Global, CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './services/redis.service';
import { UtilService } from './services/util.service';
import { ConfigurationKeyPaths } from '@/config/configuration';
import {ElasticService} from "@/shared/services/elastic.service";
import {ElasticModule} from "@/shared/elastic/elastic.module";

// common provider list
const providers = [UtilService, RedisService, /*ElasticService*/];

/**
 * Global shared module
 */
@Global()
@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        // redis cache
        CacheModule.register(),
        // jwt
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (
                configService: ConfigService<ConfigurationKeyPaths>,
            ) => ({
                secret: configService.get<string>('jwt.secret'),
            }),
            inject: [ConfigService],
        }),
        RedisModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (
                configService: ConfigService<ConfigurationKeyPaths>,
            ) => ({
                host: configService.get<string>('redis.host'),
                port: configService.get<number>('redis.port'),
                password: configService.get<string>('redis.password'),
                db: configService.get<number>('redis.db'),
            }),
            inject: [ConfigService],
        }),

        //ElasticModule
    ],
    providers: [...providers],
    exports: [HttpModule, CacheModule, JwtModule, /*ElasticModule*/ ...providers],
})
export class SharedModule {}
