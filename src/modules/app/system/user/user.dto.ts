import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail, IsEnum,
    IsOptional,
    IsString,
    Matches, MaxLength,
    MinLength,
    ValidateIf,
} from 'class-validator';
import { isEmpty } from 'lodash';
import {PageOptionsDto} from "@/common/dto/page.dto";

export class UpdateUserInfoDto {
    @ApiProperty({
        required: false,
        description: 'User nickname',
    })
    @IsString()
    @IsOptional()
    nickName: string;

    @ApiProperty({
        required: false,
        description: 'User mailbox',
    })
    @IsEmail()
    @ValidateIf((o) => !isEmpty(o.email))
    email: string;

    @ApiProperty({
        required: false,
        description: 'User phone number',
    })
    @IsString()
    @IsOptional()
    phone: string;

    @ApiProperty({
        required: false,
        description: 'User Remarks',
    })
    @IsString()
    @IsOptional()
    remark: string;
}

export class UpdatePasswordDto {
    @ApiProperty({
        description: 'Current password',
    })
    @IsString()
    @MinLength(6)
    @Matches(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
    current_password: string;

    @ApiProperty({
        description: 'New password',
    })
    @MinLength(6)
    @Matches(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
    new_password: string;
}

export class UserPaginateDto extends PageOptionsDto {
    @ApiProperty({
        description: 'Keyword',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    keyword = '';
}
