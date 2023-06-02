import {
    Body,
    Controller,
    Get,
    Headers,
    HttpStatus,
    Post,
    Query,
    Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { UtilService } from 'src/shared/services/util.service';
import { Authorize } from '../core/decorators/authorize.decorator';
import { LogDisabled } from '../core/decorators/log-disabled.decorator';
import {
    LoginInfoDto,
    RegisterDto,
    UpdatePersonInfoDto,
} from './auth.dto';
import { LoginToken, RegisterUser } from './auth.class';
import { AuthService } from './auth.service';
import { AccountInfo } from '@/modules/app/system/user/user.class';
import { PermissionOptional } from '@/modules/app/core/decorators/permission-optional.decorator';
import { AuthUser } from '@/modules/app/core/decorators/auth-user.decorator';
import { IAuthUser } from '@/modules/app/contact-app.interface';
import { UpdatePasswordDto } from '@/modules/app/system/user/user.dto';
import { UserService } from '@/modules/app/system/user/user.service';
import { ApiException } from '@/common/exceptions/api.exception';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private utils: UtilService,
    ) {}

    @ApiOperation({
        summary: 'Login',
    })
    @ApiOkResponse({ type: LoginToken })
    @Post('login')
    @LogDisabled()
    @Authorize()
    async login(
        @Body() dto: LoginInfoDto,
        @Req() req: FastifyRequest,
        @Headers('user-agent') ua: string,
    ): Promise<LoginToken> {
        const loginData = await this.authService.getLoginSign(
            dto.email,
            dto.password,
            this.utils.getReqIP(req),
            ua,
        );
        return {
            ...loginData
        }
    }

    @ApiOperation({
        summary: 'Register',
    })
    @ApiOkResponse({ type: RegisterUser })
    @Post('register')
    @LogDisabled()
    @Authorize()
    async register(@Body() dto: RegisterDto): Promise<RegisterUser> {
        let id = await this.authService.registerUser(dto);
        return { id };
    }

    @ApiOperation({ summary: 'Get user profile' })
    @ApiOkResponse({ type: AccountInfo })
    @PermissionOptional()
    @Get('profile')
    async profile(
        @AuthUser() user: IAuthUser,
        @Req() req: FastifyRequest,
    ): Promise<AccountInfo> {
        let account = await this.userService.getAccountInfo(
            user.uid,
            this.utils.getReqIP(req),
        );

        if (!account) {
            throw new ApiException(10017, HttpStatus.UNAUTHORIZED);
        }

        return account;
    }

    @ApiOperation({ summary: 'Update profile' })
    @PermissionOptional()
    @Post('update')
    async update(
        @Body() dto: UpdatePersonInfoDto,
        @AuthUser() user: IAuthUser,
    ): Promise<void> {
        await this.userService.updatePersonInfo(user.uid, dto);
    }

    @ApiOperation({ summary: 'Update password' })
    @PermissionOptional()
    @Post('password')
    async password(
        @Body() dto: UpdatePasswordDto,
        @AuthUser() user: IAuthUser,
    ): Promise<void> {
        await this.userService.updatePassword(user.uid, dto);
    }

    @ApiOperation({ summary: 'Logout' })
    @PermissionOptional()
    @Post('logout')
    async logout(@AuthUser() user: IAuthUser): Promise<void> {
        await this.authService.clearLoginStatus(user.uid);
    }
}
