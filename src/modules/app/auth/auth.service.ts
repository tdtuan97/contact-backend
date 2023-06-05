import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';
import { UtilService } from 'src/shared/services/util.service';
import { RedisService } from 'src/shared/services/redis.service';
import { UserService } from '../system/user/user.service';
import { RegisterDto } from './auth.dto';
import { ApiValidationException } from '@/common/exceptions/api-validation.exception';

@Injectable()
export class AuthService {
    constructor(
        private redisService: RedisService,
        private userService: UserService,
        private util: UtilService,
        private jwtService: JwtService,
    ) {}

    /**
     * Register user
     * @param params
     */
    async registerUser(params: RegisterDto): Promise<number> {
        let user = await this.userService.registerUser(params);
        return user.id;
    }

    /**
     * Get login JWT
     * If null is returned, the account password is incorrect and the user does not exist
     */
    async getLoginSign(
        email: string,
        password: string,
        ip: string,
        ua: string,
    ) {
        password = Buffer.from(password ?? '', 'base64').toString('utf-8');
        const user = await this.userService.findUserByEmail(email);
        if (isEmpty(user)) {
            throw new ApiValidationException(
                'email',
                'Not found email',
            );
        }

        const comparePassword = this.util.bcryptCompare(
            password,
            user.password,
        );
        if (!comparePassword) {
            throw new ApiValidationException('password', 'Invalid password');
        }

        const jwtSign = this.jwtService.sign(
            {
                uid: parseInt(user.id.toString()),
                pv: 1,
                username: user.username,
                email: user.email,
            },
            {
                expiresIn: '24h',
            },
        );
        await this.redisService
            .getRedis()
            .set(`user:passwordVersion:${user.id}`, 1);
        // Token set expiration time 24 hours
        await this.redisService
            .getRedis()
            .set(`user:token:${user.id}`, jwtSign, 'EX', 60 * 60 * 24);

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.getFullName(),
            token: jwtSign,
        };
    }

    /**
     * Clear login status information
     */
    async clearLoginStatus(uid: number): Promise<void> {
        await this.userService.forbidden(uid);
    }

    async getRedisPasswordVersionById(id: number): Promise<string> {
        return this.redisService.getRedis().get(`user:passwordVersion:${id}`);
    }

    async getRedisTokenById(id: number): Promise<string> {
        return this.redisService.getRedis().get(`user:token:${id}`);
    }

    async getRedisPermsById(id: number): Promise<string> {
        return this.redisService.getRedis().get(`user:perms:${id}`);
    }
}
