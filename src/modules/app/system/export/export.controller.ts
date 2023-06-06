import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import {AuthUser} from '@/modules/app/core/decorators/auth-user.decorator';
import {IAuthUser} from '@/modules/app/contact-app.interface';
import {
    ContactResponse,
} from '@/modules/app/system/contact/contact.class';
import {ContactService} from '@/modules/app/system/contact/contact.service';
import {ContactExportDto} from "@/modules/app/system/export/export.dto";
import {Parser} from '@json2csv/plainjs';
import * as console from "console";
import * as fs from "fs";
import {UtilService} from "@/shared/services/util.service";

@ApiTags('Export')
@Controller('export')
export class ExportController {
    constructor(
        private contactService: ContactService,
        private utilService: UtilService,
    ) {
    }

    @ApiOperation({
        summary: 'Export',
    })
    @ApiOkResponse({type: ContactResponse})
    @Get('contacts')
    async exportContacts(
        @Query() dto: ContactExportDto,
        @AuthUser() user: IAuthUser,
    ) {
        let [list, count] = await this.contactService.paginate(user.uid, dto);

        const parser = new Parser({
            fields: [
                'id',
                'group_id',
                'group_name',
                'phone_number',
                'email',
                'is_public',
                'created_user_id',
                'created_user_email',
                'created_user_name',
                'created_at',
                'updated_at'
            ],
        });

        const json = [];
        list.map((item) => {
            json.push({
                id: item.id ? item.id.toString() : '',
                group_id: item.group_id ? item.group_id.toString() : '',
                group_name: item.group_name ? item.group_name.toString() : '',
                phone_number: item.phone_number ? item.phone_number.toString() : '',
                email: item.email ? item.email.toString() : '',
                is_public: item.is_public ? item.is_public.toString() : '',
                created_user_id: item.created_user_id ? item.created_user_id.toString() : '',
                created_user_email: item.created_user_email ? item.created_user_email.toString() : '',
                created_user_name: item.created_user_name ? item.created_user_name.toString() : '',
                created_at: item.created_at ? item.created_at.toString() : '',
                updated_at: item.updated_at ? item.updated_at.toString() : ''
            });
        });

        let csvContent = parser.parse(json);
        let filename = `public/export_contact_${this.utilService.generateRandomValue(10)}.csv`
        await fs.writeFile(filename, csvContent, err => {
            if (err) {
                console.error(err);
            }
        });

        return {
            filename: filename
        }
    }
}
