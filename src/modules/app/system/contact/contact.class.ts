import { PaginatedResponseDto } from '@/common/class/res.class';
import { ApiProperty } from '@nestjs/swagger';

export class ContactPaginateResponse extends PaginatedResponseDto<ContactResponse> {}

export class ContactResponse {
    @ApiProperty({ description: 'Contact ID' })
    id: number;

    @ApiProperty({ description: 'Contact Group ID' })
    group_id: number;

    @ApiProperty({ description: 'User ID' })
    user_id: number;

    @ApiProperty({ description: 'Contact Name' })
    name: string;

    @ApiProperty({ description: 'Contact Phone Number' })
    phone_number: string;

    @ApiProperty({ description: 'Contact Email' })
    email: string;
}
