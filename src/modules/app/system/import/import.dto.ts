import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class ContactImportDto {
    @ApiProperty({
        description: 'Filename',
    })
    @IsString()
    @MinLength(1, {
        message: "Please upload a CSV file."
    })
    @MaxLength(255, {
        message: "Please upload a CSV file."
    })
    filename: string;
}
