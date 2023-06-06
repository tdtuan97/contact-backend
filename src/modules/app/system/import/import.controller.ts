import {
    Body,
    Controller, Get,
    Param,
    Post, Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import {ContactService} from '@/modules/app/system/contact/contact.service';

import {
    Logger,
    Req,
    Res,
} from '@nestjs/common';
import * as fs from 'fs';
import * as console from "console";
import {UtilService} from "@/shared/services/util.service";
import {AuthUser} from "@/modules/app/core/decorators/auth-user.decorator";
import {IAuthUser} from "@/modules/app/contact-app.interface";
import {ContactImportDto} from "@/modules/app/system/import/import.dto";
import {Parser} from "@json2csv/plainjs";
import {parse} from 'csv-parse';

const logger = new Logger('FileController');

@ApiTags('Import')
@Controller('import')
export class ImportController {
    constructor(
        private contactService: ContactService,
        private utilService: UtilService,
    ) {
    }

    @ApiOperation({
        summary: 'Import contacts',
    })
    @Post('contacts')
    async importContacts(
        @Body() dto: ContactImportDto,
        @AuthUser() user: IAuthUser,
    ) {
        let filename = dto.filename
        let filepath = `public/${filename}`
        let csvData = [];
        let headers = [
            'name',
            'phone_number',
            'email',
            'is_public',
        ]
        /*fs.createReadStream(filepath)
           .pipe(parse({
               delimiter: ',',
               columns: headers,
           }))
           .on('data', function(row) {
               csvData.push(row);
           })
           .on('end',function() {
               //do something with csvData
               console.log(csvData);
           });*/

        csvData = await new Promise(function (resolve, reject) {
            //hash.on('end', () => resolve(hash.read()));
            //fd.on('error', reject); // or something like that. might need to close `hash`
            fs.createReadStream(filepath)
                .pipe(parse({
                    delimiter: ',',
                    columns: headers,
                }))
                .on('data', function (row) {
                    csvData.push(row);
                })
                .on('end', function () {
                    //do something with csvData
                    //console.log(csvData);
                    resolve(csvData)
                });
        });
        csvData.shift()
        let results = await this.contactService.imports(user.uid, csvData)
        //console.log(results)
    }

    @Post('upload')
    async upload(@Req() req: any, @Res() reply: any) {
        const mp = req.multipart(
            async (field: any, file: any, filename: any, encoding: any, mimeType: any) => {
                console.log('save file from request ---- ', field, filename, mimeType);
                file.on('limit', () => logger.error('SIZE_LIMITED'));

                let newFileName = `public/import_contact_${this.utilService.generateRandomValue(10)}.csv`
                const data = await this.stream2buffer(file)
                await fs.writeFile(newFileName, data.toString('utf-8'), err => {
                    if (err) {
                        console.error(err);
                    }
                });
                reply.code(200).send({
                    "code": 200,
                    "message": "",
                    "data": {
                        "filename": newFileName.replace('public/', '')
                    }
                });
            },

            (error: any) => {
                if (error) {
                    logger.error(error);
                    reply.code(500).send();
                }
            },
        );
    }

    async stream2buffer(stream: any): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            const _buf = Array<any>();
            stream.on("data", chunk => _buf.push(chunk));
            stream.on("end", () => resolve(Buffer.concat(_buf)));
            stream.on("error", err => reject(`error converting stream - ${err}`));
        });
    }
}
