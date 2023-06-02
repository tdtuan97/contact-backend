import { PaginatedResponseDto } from '@/common/class/res.class';
import { ApiProperty } from '@nestjs/swagger';

export class ContactGroupPaginateResponse extends PaginatedResponseDto<ContactGroupResponse> {}

export class ContactGroupResponse {
    @ApiProperty({ description: 'Group ID' })
    id: number;

    @ApiProperty({ description: 'Group Name' })
    name: string;

    @ApiProperty({ description: 'Group description' })
    description: string;
}
