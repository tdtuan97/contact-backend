import {ApiProperty} from '@nestjs/swagger';

export class ImageCaptcha {
    @ApiProperty({
        description: 'svg image in base64 format',
    })
    img: string;

    @ApiProperty({
        description: 'The unique ID corresponding to the verification code',
    })
    id: string;
}

export class LoginToken {
    @ApiProperty({description: 'ID'})
    id: number;

    @ApiProperty({description: 'Email'})
    email: string;

    @ApiProperty({description: 'Username'})
    username: string;

    @ApiProperty({description: 'First name'})
    first_name: string;

    @ApiProperty({description: 'Last name'})
    last_name: string;

    @ApiProperty({description: 'Full name'})
    full_name: string;

    @ApiProperty({description: 'JWT Identity Token'})
    token: string;
}

export class RegisterUser {
    @ApiProperty({description: 'User ID'})
    id: number;
}

