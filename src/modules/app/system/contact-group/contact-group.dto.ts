import { PageOptionsDto } from '@/common/dto/page.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ContactGroupPaginateDto extends PageOptionsDto {
    @ApiProperty({
        description: 'Contact name',
    })
    @IsOptional()
    @IsString()
    name = '';
}

export class ContactGroupCreateDto {
    @ApiProperty({
        description: 'Contact name',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Contact description',
    })
    @IsString()
    description: string;
}

export class ContactGroupUpdateDto {
    @ApiProperty({
        description: 'Contact name',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Contact description',
    })
    @IsString()
    description: string;
}
