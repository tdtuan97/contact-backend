import { ApiValidationException } from '@/common/exceptions/api-validation.exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TblContact from "@/entities/core/tbl-contact.entity";
import {ContactPaginateDto} from "@/modules/app/system/contact/contact.dto";
import {ContactResponse} from "@/modules/app/system/contact/contact.class";

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(TblContact)
        private contactRepository: Repository<TblContact>,
    ) {}

    /**
     * Get list Charge Station with Pagination and search by name
     * @param params
     * @returns
     */
    async getListChargeStation(
        params: ContactPaginateDto,
    ): Promise<[ContactResponse[], number]> {
        const { q, limit, page } = params;
        let result: ContactResponse[] = [];

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
                group_id: item.group_id,
                user_id: item.user_id,
                name: item.name,
                phone_number: item.phone_number,
                email: item.email,
            });
        });

        return [result, total];
    }

    /**
     * Get detail charge station by id
     * @param id
     * @returns
     */
    async getDetailChargeStation(
        id: number,
    ): Promise<ContactResponse> {
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
            group_id: item.group_id,
            user_id: item.user_id,
            name: item.name,
            phone_number: item.phone_number,
            email: item.email,
        };
    }
}
