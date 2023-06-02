import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEmail,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Optional } from '@nestjs/common';

export class LoginInfoDto {
    @ApiProperty({ description: 'Email' })
    @IsEmail()
    @MinLength(1)
    @MaxLength(100)
    email: string;

    @ApiProperty({ description: 'Password' })
    @IsString()
    @MinLength(1)
    password: string;
}

export class RegisterDto {
    @ApiProperty({ description: 'Username' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    username: string;

    @ApiProperty({ description: 'Password' })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    password: string;

    @ApiProperty({ description: 'First name' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    first_name: string;

    @ApiProperty({ description: 'Last name' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    last_name: string;

    @ApiProperty({ description: 'Email' })
    @IsEmail()
    @MinLength(1)
    @MaxLength(100)
    email: string;

/*    @ApiProperty({ description: 'Phone number' })
    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    phone_number: string;*/

    @ApiProperty({ description: 'Address' })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    address: string;
}

export class UpdatePersonInfoDto {
    @ApiProperty({ description: 'Nick name', required: false })
    @IsString()
    @Optional()
    nickName: string;

    @ApiProperty({ description: 'Mail', required: false })
    @IsString()
    @Optional()
    email: string;

    @ApiProperty({ description: 'Phone', required: false })
    @IsString()
    @Optional()
    phone: string;

    @ApiProperty({ description: 'Remark', required: false })
    @IsString()
    @Optional()
    remark: string;
}
