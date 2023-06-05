import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {IsInt, IsString, Min} from 'class-validator';

export class PageOptionsDto {
    @ApiProperty({
        description: 'The number of records',
        required: false,
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly limit: number = 15;

    @ApiProperty({
        description: 'The current page contains the quantity',
        required: false,
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly page: number = 1;

    @ApiProperty({
        description: 'Sort by',
        required: false,
        default: 'id',
    })
    @Type(() => String)
    @IsString()
    readonly sort_by: string = 'id';

    @ApiProperty({
        description: 'Order by',
        required: false,
        default: 'DESC',
    })
    @Type(() => String)
    @IsString()
    readonly order_by: string = 'DESC';
}
