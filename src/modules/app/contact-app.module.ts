import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthModule } from './auth/auth.module';
import { SystemModule } from './system/system.module';

/**
 * Admin module, all APIs need to add /admin prefix
 */
@Module({
    imports: [
        AuthModule,
        SystemModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
    exports: [SystemModule],
})
export class ContactAppModule {}
