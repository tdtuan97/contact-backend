import { ApiOkResponsePaginated } from '@/common/class/res.class';
import {Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import {ContactPaginateDto} from "@/modules/app/system/contact/contact.dto";
import {
    ContactGroupPaginateResponse,
    ContactGroupResponse
} from "@/modules/app/system/contact-group/contact-group.class";
import {ContactGroupService} from "@/modules/app/system/contact-group/contact-group.service";

@ApiTags('Contact')
@Controller('contact-groups')
export class ContactGroupController {
    constructor(private contactGroupService: ContactGroupService) {}

    @ApiOperation({
        summary: 'Contact group list',
    })
    @ApiOkResponsePaginated(ContactGroupPaginateResponse)
    @Get()
    async paginate(
        @Query() dto: ContactPaginateDto,
    ): Promise<ContactGroupPaginateResponse> {
        let [list, total] =
            await this.contactGroupService.paginate(dto);
        return {
            list,
            pagination: {
                total,
                page: dto.page,
                size: dto.limit,
            },
        };
    }

    @ApiOperation({
        summary: 'Contact group detail',
    })
    @ApiOkResponse({ type: ContactGroupResponse })
    @Get(':id')
    async detail(
        @Param() params: any,
    ): Promise<ContactGroupResponse> {
        return await this.contactGroupService.detail(
            params.id,
        );
    }

    @ApiOperation({
        summary: 'Contact group create',
    })
    @ApiOkResponse({ type: ContactGroupResponse })
    @Post('')
    async create(
        @Param() params: any,
    ): Promise<ContactGroupResponse> {
        return await this.contactGroupService.detail(
            params.id,
        );
    }

    @ApiOperation({
        summary: 'Contact group update',
    })
    @ApiOkResponse({ type: ContactGroupResponse })
    @Put(':id')
    async update(
        @Param() params: any,
    ): Promise<ContactGroupResponse> {
        return await this.contactGroupService.detail(
            params.id,
        );
    }

    @ApiOperation({
        summary: 'Contact group delete',
    })
    @ApiOkResponse({ type: ContactGroupResponse })
    @Delete(':id')
    async delete(
        @Param() params: any,
    ): Promise<ContactGroupResponse> {
        return await this.contactGroupService.detail(
            params.id,
        );
    }
}
