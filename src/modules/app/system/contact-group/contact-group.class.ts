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

    @ApiProperty({ description: 'Create user' })
    created_user_id: number;

    @ApiProperty({ description: 'Created date' })
    created_at: Date;

    @ApiProperty({ description: 'Updated date' })
    updated_at: Date;
}
