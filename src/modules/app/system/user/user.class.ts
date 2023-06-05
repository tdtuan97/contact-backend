import { ApiProperty } from '@nestjs/swagger';
import {PaginatedResponseDto} from "@/common/class/res.class";

export class AccountInfo {
    @ApiProperty()
    id: number;

    @ApiProperty()
    username: string;

    @ApiProperty()
    first_name: string;

    @ApiProperty()
    last_name: string;

    @ApiProperty()
    full_name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    login_ip: string;
}

export class UserResponse {
    @ApiProperty({ description: 'User ID' })
    id: number;

    @ApiProperty({ description: 'User name' })
    username: string;

    @ApiProperty({ description: 'First name' })
    first_name: string;

    @ApiProperty({ description: 'Last name' })
    last_name: string;

    @ApiProperty({ description: 'Full name' })
    full_name: string;

    @ApiProperty({ description: 'Email' })
    email: string;

    @ApiProperty({ description: 'Created date' })
    created_at: Date;

    @ApiProperty({ description: 'Updated date' })
    updated_at: Date;
}

export class UserPaginateResponse extends PaginatedResponseDto<UserResponse> {}