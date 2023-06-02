import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsEmail,
    IsInt,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    Min,
    MinLength,
    ValidateIf,
} from 'class-validator';
import { isEmpty } from 'lodash';
import { PageOptionsDto } from '@/common/dto/page.dto';

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

export class CreateUserDto {
    @ApiProperty({ description: 'Username' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    username: string;

    @ApiProperty({ description: 'Password' })
    @IsString()
    @MinLength(1)
    password: string;

    @ApiProperty({ description: 'First name' })
    @IsString()
    @MinLength(1)
    first_name: string;

    @ApiProperty({ description: 'Last name' })
    @IsString()
    @MinLength(1)
    last_name: string;

    @ApiProperty({ description: 'Email' })
    @IsEmail()
    @MinLength(1)
    email: string;

    @ApiProperty({ description: 'Phone number' })
    @IsString()
    @MinLength(8)
    phone_number: string;

    /*@ApiProperty({description: 'Verification code identification'})
     @IsString()
     captchaId: string;

     @ApiProperty({description: 'Verification code entered by the user'})
     @IsString()
     @MinLength(4)
     @MaxLength(4)
     verifyCode: string;*/
}

export class UpdateUserDto extends CreateUserDto {
    @ApiProperty({
        description: 'User ID',
    })
    @IsInt()
    @Min(0)
    id: number;
}

export class InfoUserDto {
    @ApiProperty({
        description: 'User ID',
    })
    @IsInt()
    @Min(0)
    @Type(() => Number)
    userId: number;
}

export class DeleteUserDto {
    @ApiProperty({
        description: 'List of user IDs to be deleted',
        type: [Number],
    })
    @IsArray()
    @ArrayNotEmpty()
    userIds: number[];
}

export class PageSearchUserDto extends PageOptionsDto {
    @ApiProperty({
        required: false,
        description: 'Department List',
        type: [Number],
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsOptional()
    departmentIds: number[];

    @ApiProperty({
        required: false,
        description: 'User Name',
    })
    @IsString()
    @IsOptional()
    name = '';

    @ApiProperty({
        required: false,
        description: 'Username',
    })
    @IsString()
    @IsOptional()
    username = '';

    @ApiProperty({
        required: false,
        description: 'User phone number',
    })
    @IsString()
    @IsOptional()
    phone = '';

    @ApiProperty({
        required: false,
        description: 'User Remarks',
    })
    @IsString()
    @IsOptional()
    remark = '';
}

export class PasswordUserDto {
    @ApiProperty({
        description: 'Admin ID',
    })
    @IsInt()
    @Min(1)
    userId: number;

    @ApiProperty({
        description: 'changed password',
    })
    @Matches(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
    password: string;
}

export class UserCarModelDto {
    @ApiProperty({
        description: 'Car model ID',
    })
    @IsInt()
    @Min(1)
    car_model_id: number;
}
