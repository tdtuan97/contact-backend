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

export class ContactImportDto {
    @ApiProperty({
        description: 'Filename',
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    filename: string;
}
