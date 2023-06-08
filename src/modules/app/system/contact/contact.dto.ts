import { PageOptionsDto } from '@/common/dto/page.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateIf,
} from 'class-validator';

export class ContactPaginateDto extends PageOptionsDto {
    @ApiProperty({
        description: 'Contact Group ID',
    })
    @IsOptional()
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(255, {
        message: 'The maximum length must be less than 255 characters.'
    })
    group_id: string;

    @ApiProperty({
        description: 'Contact name',
    })
    @IsOptional()
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(255, {
        message: 'The maximum length must be less than 255 characters.'
    })
    name: string;

    @ApiProperty({
        description: 'Contact Phone Number',
    })
    @IsOptional()
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(255, {
        message: 'The maximum length must be less than 255 characters.'
    })
    phone_number: string;

    @ApiProperty({
        description: 'Contact Phone Number',
    })
    @IsOptional()
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(255, {
        message: 'The maximum length must be less than 255 characters.'
    })
    email: string;

    @ApiProperty({
        description: 'Is public',
    })
    @IsOptional()
    @IsString()
    is_public: '0' | '1';

    @ApiProperty({
        description: 'Type',
    })
    @IsOptional()
    @IsString()
    type: 'all' | 'me' | 'shared';
}

export class ContactCreateDto {
    @ApiProperty({
        description: 'Contact Group ID',
    })
    @IsOptional()
    @IsNumber()
    @ValidateIf((object, value) => value !== null)
    group_id: number;

    @ApiProperty({
        description: 'Contact name',
    })
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(255, {
        message: 'The maximum length must be less than 255 characters.'
    })
    name: string;

    @ApiProperty({
        description: 'Contact Phone Number',
    })
    @MinLength(8, {
        message: 'Minimum length must be greater than 8 character.'
    })
    @MaxLength(12, {
        message: 'The maximum length must be less than 12 characters.'
    })
    phone_number: string;

    @ApiProperty({
        description: 'Contact Phone Number',
    })
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(255, {
        message: 'The maximum length must be less than 255 characters.'
    })
    email: string;

    @ApiProperty({
        description: 'Is Public',
    })
    @IsNumber()
    is_public: number;
}

export class ContactUpdateDto {
    @ApiProperty({
        description: 'Contact Group ID',
    })
    @IsOptional()
    @IsNumber()
    @ValidateIf((object, value) => value !== null)
    group_id: number;

    @ApiProperty({
        description: 'Contact name',
    })
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(255, {
        message: 'The maximum length must be less than 255 characters.'
    })
    name: string;

    @ApiProperty({
        description: 'Contact Phone Number',
    })
    @IsString()
    @MinLength(8, {
        message: 'Minimum length must be greater than 8 character.'
    })
    @MaxLength(12, {
        message: 'The maximum length must be less than 12 characters.'
    })
    phone_number: string;

    @ApiProperty({
        description: 'Contact Phone Number',
    })
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(255, {
        message: 'The maximum length must be less than 255 characters.'
    })
    email: string;

    @ApiProperty({
        description: 'Is Public',
    })
    @IsNumber()
    is_public: number;
}

export class ContactShareDto {
    @ApiProperty({
        description: 'User ID',
    })
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(255, {
        message: 'The maximum length must be less than 255 characters.'
    })
    user_id: string;
}
