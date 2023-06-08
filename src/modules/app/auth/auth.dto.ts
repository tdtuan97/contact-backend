import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Optional } from '@nestjs/common';

export class LoginInfoDto {
    @ApiProperty({ description: 'Email' })
    @IsEmail({}, {
        message: 'Email invalid'
    })
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(100, {
        message: 'The maximum length must be less than 100 characters.'
    })
    email: string;

    @ApiProperty({ description: 'Password' })
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    password: string;
}

export class RegisterDto {
    @ApiProperty({ description: 'Username' })
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(100, {
        message: 'The maximum length must be less than 100 characters.'
    })
    username: string;

    @ApiProperty({ description: 'Password' })
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(100, {
        message: 'The maximum length must be less than 100 characters.'
    })
    password: string;

    @ApiProperty({ description: 'First name' })
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(100, {
        message: 'The maximum length must be less than 100 characters.'
    })
    first_name: string;

    @ApiProperty({ description: 'Last name' })
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(100, {
        message: 'The maximum length must be less than 100 characters.'
    })
    last_name: string;

    @ApiProperty({ description: 'Email' })
    @IsEmail()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(100, {
        message: 'The maximum length must be less than 100 characters.'
    })
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
