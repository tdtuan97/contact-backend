import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { CONTACT_PREFIX } from './modules/app/contact-app.constants';
import { ConfigurationKeyPaths } from '@/config/configuration';

export function setupSwagger(app: INestApplication): void {
    const configService: ConfigService<ConfigurationKeyPaths> =
        app.get(ConfigService);

    // Enabled by default
    const enable = configService.get<boolean>('swagger.enable', true);

    // Determine whether to enable
    if (!enable) {
        return;
    }

    const swaggerConfig = new DocumentBuilder()
        .setTitle(configService.get<string>('swagger.title'))
        .setDescription(configService.get<string>('swagger.desc'))
        // JWT authentication
        .addSecurity(CONTACT_PREFIX, {
            description: 'Background management interface authorization',
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
        })
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup(
        configService.get<string>('swagger.path', '/swagger-api'),
        app,
        document,
    );
}
