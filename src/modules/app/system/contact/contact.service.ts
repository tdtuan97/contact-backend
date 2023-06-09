import {ApiValidationException} from '@/common/exceptions/api-validation.exception';
import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Brackets, In, Repository} from 'typeorm';
import TblContact, {PublicStatus} from '@/entities/core/tbl-contact.entity';
import TblContactGroup from '@/entities/core/tbl-contact-group.entity';
import {
    ContactCreateDto,
    ContactPaginateDto,
    ContactShareDto,
    ContactUpdateDto,
} from '@/modules/app/system/contact/contact.dto';
import {ContactResponse} from '@/modules/app/system/contact/contact.class';
import TblContactSharing, {ShareMode} from "@/entities/core/tbl-contact-sharing.entity";
import TblUser from "@/entities/core/tbl-user.entity";

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(TblUser)
        private userRepository: Repository<TblUser>,
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
            is_public,
            type,
            group_id,
            sort_by,
            order_by,
            all,
        } = params;
        let result: ContactResponse[] = [];

        let builder = this.contactRepository
            .createQueryBuilder(TblContact.tableName)
            .select('*')
            .where(TblContact.queryStrAvailable());

        if (parseInt(is_public) === PublicStatus.PUBLIC || parseInt(is_public) === PublicStatus.PRIVATE) {
            builder = builder.andWhere(`is_public = ${is_public}`);
        }

        let sharedIds = [];
        switch (type) {
            case "me":
                builder = builder.andWhere(
                    new Brackets((qb) => {
                        qb.andWhere(`created_user_id = ${userId}`);
                    }),
                );
                break;
            case "shared":
            case "shared-to-me":
                // Get list contact ID from table shared
                sharedIds = await this.findSharedContactIds(userId);
                sharedIds = sharedIds.length > 0 ? sharedIds : [-1]
                builder = builder.andWhere(
                    new Brackets((qb) => {
                        qb.andWhere(`created_user_id <> ${userId}`);
                        qb.andWhere('id IN (:...sharedIds)', {
                            sharedIds: sharedIds,
                        });
                    }),
                );
                break;
            case "all":
            default:
                sharedIds = await this.findSharedContactIds(userId);
                sharedIds = sharedIds.length > 0 ? sharedIds : [-1]
                builder = builder.andWhere(
                    new Brackets((qb) => {
                        qb.orWhere(`created_user_id = ${userId}`);
                        qb.orWhere('id IN (:...sharedIds)', {
                            sharedIds: sharedIds,
                        });
                    }),
                );
                break;
        }

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

        builder = builder.orderBy(sortBy, orderBy)
        if (all !== '1') {
            builder = builder.offset((page - 1) * limit).limit(limit);
        }

        const total = await builder.getCount();
        const list: TblContact[] = await builder.getRawMany();

        // Map relations data
        let groupIds = [];
        let userIds = [];
        list.map((item) => {
            groupIds.push(item.group_id);
            userIds.push(item.created_user_id);
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

        let users = [];
        if (userIds) {
            users = await this.userRepository.find({
                where: {
                    id: In(userIds),
                    ...TblUser.queryAvailable(),
                },
            });
        }

        list.map((item) => {
            let group = groups.find((tmp) => {
                return tmp.id === item.group_id;
            });

            let user = users.find((tmp) => {
                return tmp.id === item.created_user_id;
            });

            result.push({
                id: item.id,
                group_id: item.group_id,
                group_name: group ? group.name : '',
                name: item.name,
                phone_number: item.phone_number,
                email: item.email,
                is_public: item.is_public,
                allow_edit: item.created_user_id === userId,
                created_user_id: item.created_user_id,
                created_user_email: user ? user.email : '',
                created_user_name: user ? user.username : '',
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
        let item = await this.findByAuthor(userId, id);
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
        let user = await this.getUserByUserId(item.created_user_id)

        return {
            id: item.id,
            group_id: groupId,
            group_name: groupName,
            name: item.name,
            phone_number: item.phone_number,
            email: item.email,
            is_public: item.is_public,
            allow_edit: item.created_user_id === userId,
            created_user_id: item.created_user_id,
            created_user_email: user ? user.email : '',
            created_user_name: user ? user.username : '',
            created_at: item.created_at,
            updated_at: item.updated_at,
        };
    }

    /**
     * Get Shared public
     * @param id
     * @returns
     */
    async sharedPublic(id: number): Promise<ContactResponse> {
        let item = await this.findById(id);
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
        let user = await this.getUserByUserId(item.created_user_id)

        return {
            id: item.id,
            group_id: groupId,
            group_name: groupName,
            name: item.name,
            phone_number: item.phone_number,
            email: item.email,
            is_public: item.is_public,
            allow_edit: false,
            created_user_id: item.created_user_id,
            created_user_email: user ? user.email : '',
            created_user_name: user ? user.username : '',
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
        let user = await this.getUserByUserId(item.created_user_id)
        return {
            id: item.id,
            group_id: item.group_id,
            group_name: groupName,
            name: item.name,
            phone_number: item.phone_number,
            email: item.email,
            is_public: item.is_public,
            allow_edit: item.created_user_id === userId,
            created_user_id: item.created_user_id,
            created_user_email: user ? user.email : '',
            created_user_name: user ? user.username : '',
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
        let item = await this.findByAuthor(userId, id);

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
        let user = await this.getUserByUserId(item.created_user_id)

        return {
            id: item.id,
            group_id: item.group_id,
            group_name: groupName,
            name: item.name,
            phone_number: item.phone_number,
            email: item.email,
            is_public: item.is_public,
            allow_edit: item.created_user_id === userId,
            created_user_id: item.created_user_id,
            created_user_email: user ? user.email : "",
            created_user_name: user ? user.username : '',
            created_at: item.created_at,
            updated_at: item.updated_at,
        };
    }

    async getUserByUserId(userId): Promise<TblUser> {
        return await this.userRepository.findOne({
            where: {
                id: userId,
                ...TblUser.queryAvailable(),
            },
        });
    }

    /**
     * Delete
     * @param userId
     * @param id
     * @returns
     */
    async delete(userId: number, id: number): Promise<void> {
        let item = await this.findByAuthor(userId, id);

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
     * @param id
     */
    async findById(id): Promise<TblContact> {
        let builder = this.contactRepository
            .createQueryBuilder(TblContact.tableName)
            .select('*')
            .where(`id = ${id}`)
            .andWhere(TblContact.queryStrAvailable());

        let item = await builder.getRawOne();

        if (!item) {
            throw new ApiValidationException(
                'id',
                `Contact id [${id}] not found`,
            );
        }

        return item;
    }

    /**
     * Find by id
     * @param userId
     * @param id
     */
    async findByAuthor(userId, id): Promise<TblContact> {
        let builder = this.contactRepository
            .createQueryBuilder(TblContact.tableName)
            .select('*')
            .where(`id = ${id}`)
            .andWhere(TblContact.queryStrAvailable());


        let sharedIds = await this.findSharedContactIds(userId);
        if (sharedIds.length > 0){
            builder = builder.andWhere(
                new Brackets((qb) => {
                    qb.orWhere(`created_user_id = ${userId}`);
                    qb.orWhere('id IN (:...sharedIds)', {
                        sharedIds: sharedIds,
                    });
                }),
            );
        }

        let item = await builder.getRawOne();

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
     * Update public status
     * @param userId
     * @param contactId
     * @param publicStatus
     */
    async updatePublicStatus(
        userId: number,
        contactId: number,
        publicStatus: number
    ): Promise<void> {
        await this.findByAuthor(userId, contactId);
        await this.contactRepository.update(
            {
                id: contactId,
            },
            {
                is_public: publicStatus,
            },
        );
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
        await this.findByAuthor(userId, contactId);

        let shareUserIds = [];
        if (dto.user_ids.length > 0) {
            shareUserIds = dto.user_ids;
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
        if (shareUserIds.length > 0) {
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

    async imports(userId, data) {
        // Validate data
        let rows = [];
        data.map((item) => {
            let errors = [];
            if (!this.validateString(item.name)) {
                errors.push('Contact name invalid')
            }

            if (!this.validateString(item.phone_number)) {
                errors.push('Contact Phone number invalid')
            }

            if (!this.validateString(item.email)) {
                errors.push('Contact Email invalid')
            }

            // Parse data is public
            let isPublic = parseInt(item.is_public ?? '0')
            isPublic = (isPublic === 1 || isPublic === 0) ? isPublic : 0;

            rows.push({
                ...item,
                is_public: isPublic,
                errors: errors
            })
        })

        let results = [];
        let count = 0;
        let chunks = this.chunks(rows, 1000);
        for (const contacts of chunks) {
            try {
                let dataInsert = [];
                contacts.map((row) => {
                    let status;
                    let errors = []
                    if (row.errors.length > 0) {
                        status = 'error'
                        errors = row.errors
                    }
                    else {
                        status = 'success'
                        dataInsert.push({
                            name: row.name,
                            phone_number: row.phone_number,
                            email: row.email,
                            is_public: row.is_public,
                            created_user_id: userId,
                            is_deleted: TblContactGroup.NOT_DELETED,
                            is_active: TblContactGroup.IS_ACTIVE,
                        })
                    }
                    results.push({
                        'row': count,
                        'name': row.name ?? "",
                        'errors': errors,
                        'status': status
                    })
                    count++
                })

                let resultInsert = await this.contactRepository
                    .createQueryBuilder()
                    .insert()
                    .values(dataInsert)
                    .execute()

                //console.log(resultInsert.generatedMaps)
            } catch (e) {
                Logger.error(`Import chunk error`, e)
            }
        }

        return results
    }

    /**
     * Split array
     * @param array
     * @param chunkSize
     */
    chunks(array, chunkSize) {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize);
            result.push(chunk);
        }
        return result;
    }

    /**
     * Validate string
     * @param str
     */
    validateString(str) {
        return (typeof str === "string") && (str.length > 0) && (str.length <= 255)
    }

    /**
     * Find shared id
     * @param userId
     */
    async findSharedContactIds(userId){
        let sharedIds = [];
        let rows = await this.contactSharingRepository.find({
            where:{
                user_id: userId,
            }
        })

        rows.map((item) => {
            sharedIds.push(item.contact_id)
        })

        return sharedIds;
    }
}
