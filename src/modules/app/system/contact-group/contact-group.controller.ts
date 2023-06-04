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
import {
    ContactGroupPaginateResponse,
    ContactGroupResponse,
} from '@/modules/app/system/contact-group/contact-group.class';
import { ContactGroupService } from '@/modules/app/system/contact-group/contact-group.service';
import {
    ContactGroupCreateDto,
    ContactGroupPaginateDto,
    ContactGroupUpdateDto,
} from '@/modules/app/system/contact-group/contact-group.dto';
import { AuthUser } from '@/modules/app/core/decorators/auth-user.decorator';
import { IAuthUser } from '@/modules/app/contact-app.interface';

@ApiTags('Contact Group')
@Controller('contact-groups')
export class ContactGroupController {
    constructor(private contactGroupService: ContactGroupService) {}

    @ApiOperation({
        summary: 'List',
    })
    @ApiOkResponsePaginated(ContactGroupPaginateResponse)
    @Get()
    async paginate(
        @AuthUser() user: IAuthUser,
        @Query() dto: ContactGroupPaginateDto,
    ): Promise<ContactGroupPaginateResponse> {
        let [list, total] = await this.contactGroupService.paginate(
            user.uid,
            dto,
        );
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
    @ApiOkResponse({ type: ContactGroupResponse })
    @Get(':id')
    async detail(
        @Param() params: any,
        @AuthUser() user: IAuthUser,
    ): Promise<ContactGroupResponse> {
        return await this.contactGroupService.detail(user.uid, params.id);
    }

    @ApiOperation({
        summary: 'Create',
    })
    @ApiOkResponse({ type: ContactGroupResponse })
    @Post('')
    async create(
        @Body() dto: ContactGroupCreateDto,
        @AuthUser() user: IAuthUser,
    ): Promise<ContactGroupResponse> {
        return await this.contactGroupService.create(user.uid, dto);
    }

    @ApiOperation({
        summary: 'Update',
    })
    @ApiOkResponse({ type: ContactGroupResponse })
    @Put(':id')
    async update(
        @Body() dto: ContactGroupUpdateDto,
        @Param() params: any,
        @AuthUser() user: IAuthUser,
    ): Promise<ContactGroupResponse> {
        return await this.contactGroupService.update(user.uid, params.id, dto);
    }

    @ApiOperation({
        summary: 'Delete',
    })
    @Delete(':id')
    async delete(
        @Param() params: any,
        @AuthUser() user: IAuthUser,
    ): Promise<void> {
        await this.contactGroupService.delete(user.uid, params.id);
    }
}
