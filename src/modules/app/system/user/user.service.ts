import {HttpStatus, Inject, Injectable} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm';
import {camelCase, isEmpty} from 'lodash';
import {ApiException} from 'src/common/exceptions/api.exception';
import {UtilService} from 'src/shared/services/util.service';
import {Brackets, EntityManager, In, Not, Repository} from 'typeorm';
import {RedisService} from 'src/shared/services/redis.service';
import {AccountInfo, UserResponse} from './user.class';
import {UpdatePasswordDto, UpdateUserInfoDto, UserByContactPaginateDto, UserPaginateDto} from './user.dto';
import TblUser from '@/entities/core/tbl-user.entity';
import {ApiValidationException} from '@/common/exceptions/api-validation.exception';
import {RegisterDto} from '@/modules/app/auth/auth.dto';
import TblContactSharing from "@/entities/core/tbl-contact-sharing.entity";
import * as console from "console";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(TblUser)
        private userRepository: Repository<TblUser>,
        @InjectRepository(TblContactSharing)
        private contactSharingRepository: Repository<TblContactSharing>,
        private redisService: RedisService,
        @InjectEntityManager() private entityManager: EntityManager,
        private util: UtilService,
    ) {
    }

    /**
     * Paginate
     * @param userId
     * @param params
     * @returns
     */
    async paginate(
        userId: number,
        params: UserPaginateDto,
    ): Promise<[UserResponse[], number]> {
        const {
            limit,
            page,
            all,
            keyword,
            contact_id
        } = params;
        let result: UserResponse[] = [];

        let builder = this.userRepository
            .createQueryBuilder(TblUser.tableName)
            .select('*')
            .where(TblUser.queryStrAvailable())
            .andWhere(`id != ${userId}`)

        if (keyword) {
            builder = builder.andWhere(
                new Brackets((qb) => {
                    qb.orWhere('username LIKE :username', {
                        username: `%${keyword}%`,
                    });
                    qb.orWhere('email LIKE :email', {
                        email: `%${keyword}%`,
                    });
                }),
            );
        }

        let sharedIds = [];
        if (contact_id) {
            sharedIds = await this.findSharedUserIds(contact_id)
        }

        builder = builder.orderBy('email', 'ASC');

        if (all !== '1') {
            builder = builder.offset((page - 1) * limit).limit(limit);
        }

        const total = await builder.getCount();
        const list: TblUser[] = await builder.getRawMany();

        list.map((item) => {
            let checkShared = sharedIds.find((tmpId) => {
                return tmpId === item.id
            })
            result.push({
                id: item.id,
                username: item.username,
                first_name: item.first_name,
                last_name: item.last_name,
                email: item.email,
                full_name: item.first_name + ' ' + item.last_name,
                is_shared: !!checkShared,
                created_at: item.created_at,
                updated_at: item.updated_at,
            });
        });

        return [result, total];
    }

    /**
     * Find enabled users by username
     */
    async findUserById(id: number): Promise<TblUser | undefined> {
        return await this.userRepository.findOne({
            where: {
                id: id,
                ...TblUser.queryAvailable(),
            },
        });
    }

    /**
     * Find enabled users by email
     */
    async findUserByEmail(email: string): Promise<TblUser | undefined> {
        return await this.userRepository.findOne({
            where: {
                email: email,
                ...TblUser.queryAvailable(),
            },
        });
    }

    /**
     * Find enabled users by username
     */
    async findUserByUserName(username: string): Promise<TblUser | undefined> {
        return await this.userRepository.findOne({
            where: {
                username: username,
                ...TblUser.queryAvailable(),
            },
        });
    }

    /**
     * Register user
     * @param registerDto
     */
    async registerUser(registerDto: RegisterDto): Promise<TblUser | null> {
        let username = registerDto.username;
        let password = Buffer.from(
            registerDto.password ?? '',
            'base64',
        ).toString('utf-8');

        // Check duplicate email
        let exists = await this.userRepository.findOne({
            where: {email: registerDto.email},
        });
        if (!isEmpty(exists)) {
            throw new ApiValidationException(
                'email',
                'The email already exists',
            );
        }

        exists = await this.userRepository.findOne({
            where: {username: username},
        });
        if (!isEmpty(exists)) {
            throw new ApiValidationException(
                'username',
                'The username already exists',
            );
        }

        // Encrypt password
        const {hash, salt} = this.util.bcryptHash(password);

        // Run transaction
        let result = null;
        await this.entityManager.transaction(async (manager) => {
            result = manager.create(TblUser, {
                username: username,
                email: registerDto.email,
                password: hash,
                salt: salt,
                first_name: registerDto.first_name,
                last_name: registerDto.last_name,
                address: registerDto.address,
                is_active: TblUser.IS_ACTIVE,
            });
            await manager.save(result);
        });

        return result;
    }

    /**
     * Get user information
     * @param uid user id
     * @param ip login ip
     */
    async getAccountInfo(uid: number, ip?: string): Promise<AccountInfo> {
        const user: TblUser = await this.userRepository.findOne({
            where: {
                id: uid,
                ...TblUser.queryAvailable(),
            },
        });
        if (isEmpty(user)) {
            return null;
        }

        return {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.first_name.trim() + ' ' + user.last_name.trim(),
            email: user.email,
            address: user.address,
            login_ip: ip,
        };
    }

    /**
     * update personal information
     */
    async updatePersonInfo(
        uid: number,
        info: UpdateUserInfoDto,
    ): Promise<void> {
        await this.userRepository.update(uid, info);
    }

    /**
     * change user password
     */
    async updatePassword(uid: number, dto: UpdatePasswordDto): Promise<void> {
        const user = await this.userRepository.findOne({where: {id: uid}});
        if (isEmpty(user)) {
            throw new ApiException(10017, HttpStatus.UNAUTHORIZED);
        }
        const comparePassword = this.util.md5(
            `${dto.current_password}${user.salt}`,
        );
        // The original password is inconsistent and cannot be changed
        if (user.password !== comparePassword) {
            throw new ApiValidationException(
                'current_password',
                'The current password incorrect',
            );
        }
        const password = this.util.md5(`${dto.new_password}${user.salt}`);
        await this.userRepository.update({id: uid}, {password});
        await this.upgradePasswordV(user.id);
    }

    /**
     * Find user information
     * @param id user id
     */
    async info(
        id: number,
    ): Promise<TblUser & { roles: number[]; departmentName: string }> {
        const user: any = await this.userRepository.findOne({where: {id}});
        if (isEmpty(user)) {
            throw new ApiException(10017);
        }

        delete user.password;
        return {...user};
    }

    /**
     * Delete users based on a list of ids
     */
    async delete(userIds: number[]): Promise<void | never> {
        const rootUserId = await this.findRootUserId();
        if (userIds.includes(rootUserId)) {
            throw new Error('can not delete root user!');
        }
        await this.userRepository.delete(userIds);
    }

    /**
     * List the number of users according to the department ID: remove the super administrator
     */
    async count(uid: number, deptIds: number[]): Promise<number> {
        const queryAll: boolean = isEmpty(deptIds);
        const rootUserId = await this.findRootUserId();
        if (queryAll) {
            return await this.userRepository.count({
                where: {id: Not(In([rootUserId, uid]))},
            });
        }
        return await this.userRepository.count({
            where: {
                id: Not(In([rootUserId, uid])),
            },
        });
    }

    /**
     * Find the user ID of Hypertube
     */
    async findRootUserId(): Promise<number> {
        return 1;
    }

    /**
     * disable user
     */
    async forbidden(uid: number): Promise<void> {
        await this.redisService.getRedis().del(`user:passwordVersion:${uid}`);
        await this.redisService.getRedis().del(`user:token:${uid}`);
        await this.redisService.getRedis().del(`user:perms:${uid}`);
    }

    /**
     * Upgrade user version password
     */
    async upgradePasswordV(id: number): Promise<void> {
        // user:passwordVersion:${param.id}
        const v = await this.redisService
            .getRedis()
            .get(`user:passwordVersion:${id}`);
        if (!isEmpty(v)) {
            await this.redisService
                .getRedis()
                .set(`user:passwordVersion:${id}`, parseInt(v) + 1);
        }
    }

    /**
     * Find user ids
     * @param contactId
     */
    async findSharedUserIds(contactId){
        let ids = [];
        let rows = await this.contactSharingRepository.find({
            where:{
                contact_id: contactId,
            }
        })

        rows.map((item) => {
            ids.push(item.user_id)
        })

        return ids;
    }
}
