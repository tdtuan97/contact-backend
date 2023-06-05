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
    @MinLength(1)
    @MaxLength(255)
    group_id: string;

    @ApiProperty({
        description: 'Contact name',
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @ApiProperty({
        description: 'Contact Phone Number',
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    phone_number: string;

    @ApiProperty({
        description: 'Contact Phone Number',
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    email: string;
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
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @ApiProperty({
        description: 'Contact Phone Number',
    })
    @MinLength(8)
    @MaxLength(12)
    phone_number: string;

    @ApiProperty({
        description: 'Contact Phone Number',
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    email: string;
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
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @ApiProperty({
        description: 'Contact Phone Number',
    })
    @IsString()
    @MinLength(8)
    @MaxLength(12)
    phone_number: string;

    @ApiProperty({
        description: 'Contact Phone Number',
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    email: string;
}

export class ContactShareDto {
    @ApiProperty({
        description: 'User ID',
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    user_id: string;
}
