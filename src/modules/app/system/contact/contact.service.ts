import {ApiValidationException} from '@/common/exceptions/api-validation.exception';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import TblContact from '@/entities/core/tbl-contact.entity';
import TblContactGroup from '@/entities/core/tbl-contact-group.entity';
import {
    ContactCreateDto,
    ContactPaginateDto, ContactShareDto,
    ContactUpdateDto,
} from '@/modules/app/system/contact/contact.dto';
import {ContactResponse} from '@/modules/app/system/contact/contact.class';
import * as console from 'console';
import TblContactSharing, {ShareMode} from "@/entities/core/tbl-contact-sharing.entity";

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(TblContactGroup)
        private contactGroupRepository: Repository<TblContactGroup>,
        @InjectRepository(TblContact)
        private contactRepository: Repository<TblContact>,
        @InjectRepository(TblContactSharing)
        private contactSharingRepository: Repository<TblContactSharing>,
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
        params: ContactPaginateDto,
    ): Promise<[ContactResponse[], number]> {
        const {
            limit,
            page,
            name,
            phone_number,
            email,
            group_id,
            sort_by,
            order_by,
        } = params;
        let result: ContactResponse[] = [];

        let builder = this.contactRepository
            .createQueryBuilder(TblContact.tableName)
            .select('*')
            .where(TblContact.queryStrAvailable())
            .andWhere(`created_user_id = ${userId}`);

        if (name) {
            builder = builder.andWhere('name like :name', {
                name: `%${name}%`,
            });
        }

        if (phone_number) {
            builder = builder.andWhere('phone_number like :phone_number', {
                phone_number: `%${phone_number}%`,
            });
        }

        if (email) {
            builder = builder.andWhere('email like :email', {
                email: `%${email}%`,
            });
        }

        if (group_id) {
            let groupIds = group_id.split(',');
            if (groupIds.length > 0) {
                builder = builder.andWhere('group_id IN (:...groupIds)', {
                    groupIds: groupIds,
                });
            }
        }

        let orderBy;
        let sortBy;
        switch (sort_by) {
            case 'id':
            case 'name':
            case 'email':
            case 'phone_number':
            case 'created_at':
            case 'updated_at':
                sortBy = sort_by;
                break;
            default:
                sortBy = 'id';
                break;
        }
        switch (order_by) {
            case 'ASC':
            case 'DESC':
                orderBy = order_by;
                break;
            default:
                orderBy = 'DESC';
        }

        builder = builder
            .orderBy(sortBy, orderBy)
            .offset((page - 1) * limit)
            .limit(limit);

        const total = await builder.getCount();
        const list: TblContact[] = await builder.getRawMany();

        // Map group
        let groupIds = list.map((item) => {
            return item.group_id;
        });

        let groups = [];
        if (groupIds) {
            groups = await this.contactGroupRepository.find({
                where: {
                    id: In(groupIds),
                    ...TblContactGroup.queryAvailable(),
                },
            });
        }

        list.map((item) => {
            let group = groups.find((group) => {
                return group.id === item.group_id;
            });
            result.push({
                id: item.id,
                group_id: item.group_id,
                group_name: group ? group.name : '',
                name: item.name,
                phone_number: item.phone_number,
                email: item.email,
                created_user_id: item.created_user_id,
                created_at: item.created_at,
                updated_at: item.updated_at,
            });
        });

        return [result, total];
    }

    /**
     * Get detail
     * @param userId
     * @param id
     * @returns
     */
    async detail(userId: number, id: number): Promise<ContactResponse> {
        let item = await this.findById(userId, id);
        let groupId = item.group_id;
        let groupName = '';
        if (groupId) {
            let group = await this.contactGroupRepository.findOne({
                where: {
                    id: groupId,
                    ...TblContactGroup.queryAvailable(),
                },
            });
            groupName = group.name;
        }

        return {
            id: item.id,
            group_id: groupId,
            group_name: groupName,
            name: item.name,
            phone_number: item.phone_number,
            email: item.email,
            created_user_id: item.created_user_id,
            created_at: item.created_at,
            updated_at: item.updated_at,
        };
    }

    /**
     * Get detail
     * @returns
     * @param userId
     * @param dto
     */
    async create(
        userId: number,
        dto: ContactCreateDto,
    ): Promise<ContactResponse> {
        await this.checkContactPhoneNumber(userId, dto.phone_number);
        await this.checkContactEmail(userId, dto.email);

        let groupName = '';
        if (dto.group_id) {
            let group = await this.findGroupById(userId, dto.group_id);
            if (!group) {
                throw new ApiValidationException(
                    'id',
                    `Group ID [${dto.group_id}] not found`,
                );
            }

            groupName = group.name;
        }

        let item = await this.contactRepository.save({
            group_id: dto.group_id ?? null,
            name: dto.name,
            phone_number: dto.phone_number,
            email: dto.email,
            is_deleted: TblContactGroup.NOT_DELETED,
            is_active: TblContactGroup.IS_ACTIVE,
            created_user_id: userId,
        });

        return {
            id: item.id,
            group_id: item.group_id,
            group_name: groupName,
            name: item.name,
            phone_number: item.phone_number,
            email: item.email,
            created_user_id: item.created_user_id,
            created_at: item.created_at,
            updated_at: item.updated_at,
        };
    }

    /**
     * Update
     * @param userId
     * @param id
     * @param dto
     * @returns
     */
    async update(
        userId: number,
        id: number,
        dto: ContactUpdateDto,
    ): Promise<ContactResponse> {
        let item = await this.findById(userId, id);

        if (dto.group_id && dto.group_id !== item.group_id) {
            let checkGroup = await this.findGroupById(userId, dto.group_id);

            if (!checkGroup) {
                throw new ApiValidationException(
                    'id',
                    `Group ID [${dto.group_id}] not found`,
                );
            }
        }

        if (dto.phone_number !== item.phone_number) {
            await this.checkContactPhoneNumber(userId, dto.phone_number);
        }

        if (dto.email !== item.email) {
            await this.checkContactEmail(userId, dto.email);
        }

        item.name = dto.name;
        item.group_id = dto.group_id ?? null;
        item.name = dto.name;
        item.phone_number = dto.phone_number;
        item.email = dto.email;

        await this.contactRepository.save(item);

        let group = await this.findGroupById(userId, item.group_id);
        let groupName = group ? group.name : '';

        return {
            id: item.id,
            group_id: item.group_id,
            group_name: groupName,
            name: item.name,
            phone_number: item.phone_number,
            email: item.email,
            created_user_id: item.created_user_id,
            created_at: item.created_at,
            updated_at: item.updated_at,
        };
    }

    /**
     * Delete
     * @param userId
     * @param id
     * @returns
     */
    async delete(userId: number, id: number): Promise<void> {
        let item = await this.findById(userId, id);

        await this.contactRepository.update(
            {
                id: item.id,
            },
            {
                is_deleted: TblContact.IS_DELETED,
            },
        );
    }

    /**
     * Check phone number
     * @param userId
     * @param phoneNumber
     */
    async checkContactPhoneNumber(userId, phoneNumber) {
        let check = await this.contactRepository.findOne({
            where: {
                phone_number: phoneNumber,
                created_user_id: userId,
                ...TblContact.queryAvailable(),
            },
        });

        if (check) {
            throw new ApiValidationException(
                'phone_number',
                'Phone number already exists.',
            );
        }
    }

    /**
     * Check email
     * @param userId
     * @param email
     */
    async checkContactEmail(userId, email) {
        let check = await this.contactRepository.findOne({
            where: {
                email: email,
                created_user_id: userId,
                ...TblContact.queryAvailable(),
            },
        });

        if (check) {
            throw new ApiValidationException('email', 'Email already exists.');
        }
    }

    /**
     * Find by id
     * @param userId
     * @param id
     */
    async findById(userId, id): Promise<TblContact> {
        let item = await this.contactRepository.findOne({
            where: {
                id: id,
                created_user_id: userId,
                ...TblContact.queryAvailable(),
            },
        });

        if (!item) {
            throw new ApiValidationException(
                'id',
                `Contact id [${id}] not found`,
            );
        }

        return item;
    }

    /**
     * Find Group by id
     * @param userId
     * @param id
     */
    async findGroupById(userId, id): Promise<TblContactGroup> {
        return await this.contactGroupRepository.findOne({
            where: {
                id: id,
                created_user_id: userId,
                ...TblContact.queryAvailable(),
            },
        });
    }

    /**
     * Update
     * @param userId
     * @param contactId
     * @param dto
     * @returns
     */
    async share(
        userId: number,
        contactId: number,
        dto: ContactShareDto,
    ): Promise<void> {
        await this.findById(userId, contactId);

        let shareUserIds = [];
        if (dto.user_id) {
            shareUserIds = dto.user_id.split(',');
            shareUserIds = shareUserIds.filter((tmpId) => {
                tmpId = parseInt(tmpId);
                return !isNaN(tmpId) && tmpId !== userId
            })
            shareUserIds = shareUserIds.filter(function (value, index, array) {
                return array.indexOf(value) === index;
            });
        }

        // Remove all sharing user
        await this.contactSharingRepository.delete({
            contact_id: contactId
        })

        // Sharing current user
        if (shareUserIds.length > 0){
            let dataInsert = shareUserIds.map((tmpId) => {
                return {
                    user_id: tmpId,
                    contact_id: contactId,
                    mode: ShareMode.READ,
                    created_user_id: userId,
                }
            })
            await this.contactSharingRepository
                .createQueryBuilder()
                .insert()
                .values(dataInsert)
                .execute()
        }

    }
}
