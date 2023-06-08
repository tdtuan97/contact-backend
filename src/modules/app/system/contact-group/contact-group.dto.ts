import { PageOptionsDto } from '@/common/dto/page.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class ContactGroupPaginateDto extends PageOptionsDto {
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
    name = '';

    @ApiProperty({
        description: 'Contact description',
    })
    @IsOptional()
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(255, {
        message: 'The maximum length must be less than 255 characters.'
    })
    description = '';
}

export class ContactGroupCreateDto {
    @ApiProperty({
        description: 'Group name',
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
        description: 'Group description',
    })
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(255, {
        message: 'The maximum length must be less than 255 characters.'
    })
    description: string;
}

export class ContactGroupUpdateDto {
    @ApiProperty({
        description: 'Group name',
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
        description: 'Group description',
    })
    @IsString()
    @MinLength(1, {
        message: 'Minimum length must be greater than 1 character.'
    })
    @MaxLength(255, {
        message: 'The maximum length must be less than 255 characters.'
    })
    description: string;
}
