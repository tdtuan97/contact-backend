import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PageOptionsDto {
    @ApiProperty({
        description: 'The number of records',
        required: false,
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly limit: number = 10;

    @ApiProperty({
        description: 'The current page contains the quantity',
        required: false,
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly page: number = 1;
}
