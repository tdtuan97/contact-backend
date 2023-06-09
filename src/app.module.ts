import './polyfill';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
    ConfigurationKeyPaths,
    getConfiguration,
} from './config/configuration';
import { SharedModule } from './shared/shared.module';
import { WsModule } from './modules/ws/ws.module';
import * as path from 'path';
import { LoggerModule } from './shared/logger/logger.module';
import {
    LoggerModuleOptions,
    WinstonLogLevel,
} from './shared/logger/logger.interface';
import { TypeORMLoggerService } from './shared/logger/typeorm-logger.service';
import { LOGGER_MODULE_OPTIONS } from './shared/logger/logger.constants';
import {ContactAppModule} from "@/modules/app/contact-app.module";

@Module({
    imports: [
        // Load ENV
        ConfigModule.forRoot({
            isGlobal: true,
            load: [getConfiguration],
            envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
        }),

        // Default DB Connection
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule, LoggerModule],
            name: 'default',
            useFactory: (
                configService: ConfigService<ConfigurationKeyPaths>,
                loggerOptions: LoggerModuleOptions,
            ) => ({
                autoLoadEntities: true,
                type: configService.get<any>('database.type'),
                host: configService.get<string>('database.host'),
                port: configService.get<number>('database.port'),
                username: configService.get<string>('database.username'),
                password: configService.get<string>('database.password'),
                database: configService.get<string>('database.database'),
                synchronize: configService.get<boolean>('database.synchronize'),
                logging: configService.get('database.logging'),
                timezone: configService.get('database.timezone'),
                // Custom log
                logger: new TypeORMLoggerService(
                    configService.get('database.logging'),
                    loggerOptions,
                ),
            }),
            inject: [ConfigService, LOGGER_MODULE_OPTIONS],
        }),

        // custom logger
        LoggerModule.forRootAsync(
            {
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => {
                    return {
                        level: configService.get<WinstonLogLevel>(
                            'logger.level',
                        ),
                        consoleLevel: configService.get<WinstonLogLevel>(
                            'logger.consoleLevel',
                        ),
                        timestamp:
                            configService.get<boolean>('logger.timestamp'),
                        maxFiles: configService.get<string>('logger.maxFiles'),
                        maxFileSize:
                            configService.get<string>('logger.maxFileSize'),
                        disableConsoleAtProd: configService.get<boolean>(
                            'logger.disableConsoleAtProd',
                        ),
                        dir: configService.get<string>('logger.dir'),
                        errorLogName: configService.get<string>(
                            'logger.errorLogName',
                        ),
                        appLogName:
                            configService.get<string>('logger.appLogName'),
                    };
                },
                inject: [ConfigService],
            },
            // global module
            true,
        ),
        // custom module
        SharedModule,

        // application modules import
        ContactAppModule,

        // Ws Module
        WsModule,
    ],
})
export class AppModule {}
