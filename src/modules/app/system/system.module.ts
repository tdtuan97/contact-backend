import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    ROOT_ROLE_ID,
} from 'src/modules/app/contact-app.constants';
import { WsModule } from 'src/modules/ws/ws.module';
import { rootRoleIdProvider } from '../core/provider/root-role-id.provider';
import {UserController} from './user/user.controller';
import { UserService } from './user/user.service';
import { AllSchemas } from '@/entities/index-core';
import {ContactController} from "@/modules/app/system/contact/contact.controller";
import {ContactService} from "@/modules/app/system/contact/contact.service";
import {ContactGroupService} from "@/modules/app/system/contact-group/contact-group.service";
import {ContactGroupController} from "@/modules/app/system/contact-group/contact-group.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature(AllSchemas, 'default'),
        WsModule,
    ],
    controllers: [
        UserController,
        ContactController,
        ContactGroupController,
    ],
    providers: [
        rootRoleIdProvider(),

        // Core services
        ContactService,
        ContactGroupService,
        UserService,
    ],
    exports: [
        ROOT_ROLE_ID,
        TypeOrmModule,

        UserService,
    ],
})
export class SystemModule {}
