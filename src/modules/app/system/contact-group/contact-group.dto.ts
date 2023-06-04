import { PageOptionsDto } from '@/common/dto/page.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ContactGroupPaginateDto extends PageOptionsDto {
    @ApiProperty({
        description: 'Contact name',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name = '';
}

export class ContactGroupCreateDto {
    @ApiProperty({
        description: 'Group name',
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @ApiProperty({
        description: 'Group description',
    })
    @IsString()
    @MaxLength(255)
    description: string;
}

export class ContactGroupUpdateDto {
    @ApiProperty({
        description: 'Group name',
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @ApiProperty({
        description: 'Group description',
    })
    @IsString()
    @MaxLength(255)
    description: string;
}
