import { Body, Controller, Get, Post, Delete, Param } from '@nestjs/common';
import {
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { CONTACT_PREFIX } from '../../contact-app.constants';
import { UserService } from './user.service';

@ApiSecurity(CONTACT_PREFIX)
@ApiTags('User Module')
@Controller('users')
export class UserController {
    constructor(
        private userService: UserService, //private menuService: SysMenuService,
    ) {}
}
