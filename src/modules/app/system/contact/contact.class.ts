import { PaginatedResponseDto } from '@/common/class/res.class';
import { ApiProperty } from '@nestjs/swagger';

export class ContactPaginateResponse extends PaginatedResponseDto<ContactResponse> {}

export class ContactResponse {
    @ApiProperty({ description: 'Contact ID' })
    id: number;

    @ApiProperty({ description: 'Group ID' })
    group_id: number;

    @ApiProperty({ description: 'Group Name' })
    group_name: string;

    @ApiProperty({ description: 'Contact Name' })
    name: string;

    @ApiProperty({ description: 'Contact Phone Number' })
    phone_number: string;

    @ApiProperty({ description: 'Contact Email' })
    email: string;

    @ApiProperty({ description: 'Create user' })
    created_user_id: number;

    @ApiProperty({ description: 'Created date' })
    created_at: Date;

    @ApiProperty({ description: 'Updated date' })
    updated_at: Date;
}
