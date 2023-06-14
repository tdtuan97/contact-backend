import {ApiValidationException} from '@/common/exceptions/api-validation.exception';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import TblContactGroup from '@/entities/core/tbl-contact-group.entity';
import {ContactGroupResponse} from '@/modules/app/system/contact-group/contact-group.class';
import {
    ContactGroupCreateDto,
    ContactGroupPaginateDto,
    ContactGroupUpdateDto,
} from '@/modules/app/system/contact-group/contact-group.dto';
import * as console from 'console';
import {ElasticsearchService} from "@nestjs/elasticsearch";
import {PostSearchBody, PostSearchResult} from "@/shared/elastic/elastic.interface";

@Injectable()
export class ContactGroupService {
    constructor(
        @InjectRepository(TblContactGroup)
        private contactGroupRepository: Repository<TblContactGroup>,
        private readonly elasticsearchService: ElasticsearchService
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
        params: ContactGroupPaginateDto,
    ): Promise<[ContactGroupResponse[], number]> {
        const {
            name,
            description,
            limit,
            page,
            all
        } = params;
        let result: ContactGroupResponse[] = [];

        /*let test = await this.elasticsearchService.search<PostSearchResult>({
            index: 'kibana_sample_data_ecommerce',
            body: {
                query: {
                    multi_match: {
                        query: '',
                        //fields: []
                    }
                }
            }
        })
        console.log(test)*/

        let builder = this.contactGroupRepository
            .createQueryBuilder(TblContactGroup.tableName)
            .select('*')
            .where(TblContactGroup.queryStrAvailable())
            .andWhere(`created_user_id = ${userId}`);

        if (name) {
            builder = builder.andWhere('name like :name', {
                name: `%${name}%`,
            });
        }

        if (description) {
            builder = builder.andWhere('description like :description', {
                description: `%${description}%`,
            });
        }

        builder = builder.orderBy('name', 'ASC');

        if (all !== '1') {
            builder = builder.offset((page - 1) * limit).limit(limit);
        }

        const total = await builder.getCount();
        const list: TblContactGroup[] = await builder.getRawMany();

        list.map((item) => {
            result.push({
                id: item.id,
                name: item.name,
                description: item.description,
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
    async detail(userId: number, id: number): Promise<ContactGroupResponse> {
        let item = await this.findById(userId, id);

        return {
            id: item.id,
            name: item.name,
            description: item.description,
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
        dto: ContactGroupCreateDto,
    ): Promise<ContactGroupResponse> {
        await this.checkContactGroupName(userId, dto.name);

        let item = await this.contactGroupRepository.save({
            name: dto.name,
            description: dto.description,
            is_deleted: TblContactGroup.NOT_DELETED,
            is_active: TblContactGroup.IS_ACTIVE,
            created_user_id: userId,
        });

        return {
            id: item.id,
            name: item.name,
            description: item.description,
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
        dto: ContactGroupUpdateDto,
    ): Promise<ContactGroupResponse> {
        let item = await this.findById(userId, id);

        if (dto.name !== item.name) {
            await this.checkContactGroupName(userId, dto.name);
        }

        item.name = dto.name;
        item.description = dto.description;
        await this.contactGroupRepository.save(item);

        return {
            id: item.id,
            name: item.name,
            description: item.description,
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

        await this.contactGroupRepository.update(
            {
                id: item.id,
            },
            {
                is_deleted: TblContactGroup.IS_DELETED,
            },
        );
    }

    /**
     * Check contact group name
     * @param userId
     * @param name
     */
    async checkContactGroupName(userId, name) {
        let check = await this.contactGroupRepository.findOne({
            where: {
                name: name,
                created_user_id: userId,
                ...TblContactGroup.queryAvailable(),
            },
        });

        if (check) {
            throw new ApiValidationException(
                'name',
                `Group name already exists.`,
            );
        }
    }

    /**
     * Find contact by id
     * @param userId
     * @param id
     */
    async findById(userId, id): Promise<TblContactGroup> {
        let item = await this.contactGroupRepository.findOne({
            where: {
                id: id,
                created_user_id: userId,
                ...TblContactGroup.queryAvailable(),
            },
        });

        if (!item) {
            throw new ApiValidationException(
                'id',
                `Group id [${id}] not found`,
            );
        }

        return item;
    }
}
