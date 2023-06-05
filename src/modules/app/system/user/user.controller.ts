import {Controller, Get, Query} from '@nestjs/common';
import {
    ApiOperation,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { CONTACT_PREFIX } from '../../contact-app.constants';
import { UserService } from './user.service';
import {ApiOkResponsePaginated} from "@/common/class/res.class";
import {AuthUser} from "@/modules/app/core/decorators/auth-user.decorator";
import {IAuthUser} from "@/modules/app/contact-app.interface";
import {UserPaginateResponse} from "@/modules/app/system/user/user.class";
import {UserPaginateDto} from "@/modules/app/system/user/user.dto";

@ApiSecurity(CONTACT_PREFIX)
@ApiTags('User Module')
@Controller('users')
export class UserController {
    constructor(
        private userService: UserService, //private menuService: SysMenuService,
    ) {}

    @ApiOperation({
        summary: 'List',
    })
    @ApiOkResponsePaginated(UserPaginateResponse)
    @Get()
    async paginate(
        @AuthUser() user: IAuthUser,
        @Query() dto: UserPaginateDto,
    ): Promise<UserPaginateResponse> {
        let [list, total] = await this.userService.paginate(
            user.uid,
            dto,
        );
        return {
            list,
            pagination: {
                total,
                page: dto.page,
                size: dto.limit,
            },
        };
    }
}
