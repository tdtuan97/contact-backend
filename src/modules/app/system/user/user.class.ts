import { ApiProperty } from '@nestjs/swagger';
import TblUser from '@/entities/core/tbl-user.entity';

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

export class PageSearchUserInfo {
    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    departmentId: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    headImg: string;

    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    nickName: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    remark: string;

    @ApiProperty()
    status: number;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    departmentName: string;

    @ApiProperty({
        type: [String],
    })
    roleNames: string[];
}

export class UserDetailInfo extends TblUser {
    @ApiProperty({
        description: 'Association role',
    })
    roles: number[];

    @ApiProperty({
        description: 'Related department name',
    })
    departmentName: string;
}

export class AddUserCarModelResponse {
    @ApiProperty({ description: 'Car model ID' })
    id: number;
}

export class UserCarModelResponse {
    @ApiProperty({ description: 'Car model ID' })
    id: string;

    @ApiProperty({ description: 'Car model name' })
    name: string;

    @ApiProperty({ description: 'Car model image URL' })
    image_url: string;

    @ApiProperty({ description: 'Car model release date' })
    release_date: number;

    @ApiProperty({ description: 'Car series ID' })
    series_id: number;

    @ApiProperty({ description: 'Car series name' })
    series_name: string;

    @ApiProperty({ description: 'Car brand ID' })
    brand_id: number;

    @ApiProperty({ description: 'Car brand name' })
    brand_name: string;
}
