import { PageOptionsDto } from '@/common/dto/page.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ContactGroupPaginateDto extends PageOptionsDto {
    @ApiProperty({
        required: false,
        description: 'Query string',
        type: String,
        example: 'q=xxxx',
    })
    @IsOptional()
    @IsString()
    q = '';
}
