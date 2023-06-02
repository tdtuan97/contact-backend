import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ROOT_ROLE_ID } from 'src/modules/app/contact-app.constants';
import { ConfigurationKeyPaths } from '@/config/configuration';

/**
 * Provide direct access to RootRoleId using @Inject(ROOT_ROLE_ID)
 */
export function rootRoleIdProvider(): FactoryProvider {
    return {
        provide: ROOT_ROLE_ID,
        useFactory: (configService: ConfigService<ConfigurationKeyPaths>) => {
            return configService.get<number>('rootRoleId', 1);
        },
        inject: [ConfigService],
    };
}
