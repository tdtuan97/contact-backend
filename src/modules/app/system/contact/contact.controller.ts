import { ApiOkResponsePaginated } from '@/common/class/res.class';
import { Controller, Get, Param, Query } from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import {ContactPaginateResponse, ContactResponse} from "@/modules/app/system/contact/contact.class";
import {ContactService} from "@/modules/app/system/contact/contact.service";
import {ContactPaginateDto} from "@/modules/app/system/contact/contact.dto";

@ApiTags('Contact')
@Controller('contacts')
export class ContactController {
    constructor(private contactService: ContactService) {}

    @ApiOperation({
        summary: 'Contact list',
    })
    @ApiOkResponsePaginated(ContactPaginateResponse)
    @Get()
    async getListChargeStation(
        @Query() dto: ContactPaginateDto,
    ): Promise<ContactPaginateResponse> {
        let [list, total] =
            await this.contactService.getListChargeStation(dto);
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
        summary: 'Contact detail',
    })
    @ApiOkResponse({ type: ContactResponse })
    @Get(':id')
    async getDetailChargeStation(
        @Param() params: any,
    ): Promise<ContactResponse> {
        return await this.contactService.getDetailChargeStation(
            params.id,
        );
    }
}
