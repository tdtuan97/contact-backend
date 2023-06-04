import { ApiOkResponsePaginated } from '@/common/class/res.class';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@/modules/app/core/decorators/auth-user.decorator';
import { IAuthUser } from '@/modules/app/contact-app.interface';
import {
    ContactPaginateResponse,
    ContactResponse,
} from '@/modules/app/system/contact/contact.class';
import {
    ContactCreateDto,
    ContactPaginateDto,
    ContactUpdateDto,
} from '@/modules/app/system/contact/contact.dto';
import { ContactService } from '@/modules/app/system/contact/contact.service';

@ApiTags('Contact')
@Controller('contacts')
export class ContactController {
    constructor(private contactService: ContactService) {}

    @ApiOperation({
        summary: 'List',
    })
    @ApiOkResponsePaginated(ContactPaginateResponse)
    @Get()
    async paginate(
        @AuthUser() user: IAuthUser,
        @Query() dto: ContactPaginateDto,
    ): Promise<ContactPaginateResponse> {
        let [list, total] = await this.contactService.paginate(user.uid, dto);
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
        summary: 'Detail',
    })
    @ApiOkResponse({ type: ContactResponse })
    @Get(':id')
    async detail(
        @Param() params: any,
        @AuthUser() user: IAuthUser,
    ): Promise<ContactResponse> {
        return await this.contactService.detail(user.uid, params.id);
    }

    @ApiOperation({
        summary: 'Create',
    })
    @ApiOkResponse({ type: ContactResponse })
    @Post('')
    async create(
        @Body() dto: ContactCreateDto,
        @AuthUser() user: IAuthUser,
    ): Promise<ContactResponse> {
        return await this.contactService.create(user.uid, dto);
    }

    @ApiOperation({
        summary: 'Update',
    })
    @ApiOkResponse({ type: ContactResponse })
    @Put(':id')
    async update(
        @Body() dto: ContactUpdateDto,
        @Param() params: any,
        @AuthUser() user: IAuthUser,
    ): Promise<ContactResponse> {
        return await this.contactService.update(user.uid, params.id, dto);
    }

    @ApiOperation({
        summary: 'Delete',
    })
    @Delete(':id')
    async delete(
        @Param() params: any,
        @AuthUser() user: IAuthUser,
    ): Promise<void> {
        await this.contactService.delete(user.uid, params.id);
    }
}
