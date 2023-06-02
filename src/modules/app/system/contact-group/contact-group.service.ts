import { ApiValidationException } from '@/common/exceptions/api-validation.exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TblContact from "@/entities/core/tbl-contact.entity";
import {ContactPaginateDto} from "@/modules/app/system/contact/contact.dto";
import {ContactResponse} from "@/modules/app/system/contact/contact.class";
import TblContactGroup from "@/entities/core/tbl-contact-group.entity";
import {ContactGroupResponse} from "@/modules/app/system/contact-group/contact-group.class";
import {ContactGroupPaginateDto} from "@/modules/app/system/contact-group/contact-group.dto";

@Injectable()
export class ContactGroupService {
    constructor(
        @InjectRepository(TblContactGroup)
        private contactRepository: Repository<TblContactGroup>,
    ) {}

    /**
     * Paginate
     * @param params
     * @returns
     */
    async paginate(
        params: ContactGroupPaginateDto,
    ): Promise<[ContactGroupResponse[], number]> {
        const { q, limit, page } = params;
        let result: ContactGroupResponse[] = [];

        let builder = this.contactRepository
            .createQueryBuilder(TblContact.tableName)
            .where(TblContact.queryStrAvailable());

        if (q) {
            builder = builder.andWhere('name like :q', { q: `%${q}%` });
        }

        builder = builder
            .orderBy('name', 'ASC')
            .offset((page - 1) * limit)
            .limit(limit);

        const [_, total] = await builder.getManyAndCount();
        const list = await builder.getMany();

        list.map((item) => {
            result.push({
                id: item.id,
                name: item.name,
                description: item.description,
            });
        });

        return [result, total];
    }

    /**
     * Get detail
     * @param id
     * @returns
     */
    async detail(
        id: number,
    ): Promise<ContactGroupResponse> {
        let item = await this.contactRepository.findOne({
            where: {
                id: id,
                ...TblContact.queryAvailable(),
            },
        });

        if (!item) {
            throw new ApiValidationException(
                'id',
                `Contact id [${id}] not found`,
            );
        }

        return {
            id: item.id,
            name: item.name,
            description: item.description,
        };
    }

    /**
     * Get detail
     * @param id
     * @returns
     */
    async create(
        id: number,
    ): Promise<ContactGroupResponse> {
        let item = await this.contactRepository.findOne({
            where: {
                id: id,
                ...TblContact.queryAvailable(),
            },
        });

        if (!item) {
            throw new ApiValidationException(
                'id',
                `Contact id [${id}] not found`,
            );
        }

        return {
            id: item.id,
            name: item.name,
            description: item.description,
        };
    }

    /**
     * Update
     * @param id
     * @returns
     */
    async update(
        id: number,
    ): Promise<ContactGroupResponse> {
        let item = await this.contactRepository.findOne({
            where: {
                id: id,
                ...TblContact.queryAvailable(),
            },
        });

        if (!item) {
            throw new ApiValidationException(
                'id',
                `Contact id [${id}] not found`,
            );
        }

        return {
            id: item.id,
            name: item.name,
            description: item.description,
        };
    }

    /**
     * Delete
     * @param id
     * @returns
     */
    async delete(
        id: number,
    ): Promise<ContactGroupResponse> {
        let item = await this.contactRepository.findOne({
            where: {
                id: id,
                ...TblContact.queryAvailable(),
            },
        });

        if (!item) {
            throw new ApiValidationException(
                'id',
                `Contact id [${id}] not found`,
            );
        }

        return {
            id: item.id,
            name: item.name,
            description: item.description,
        };
    }

}
