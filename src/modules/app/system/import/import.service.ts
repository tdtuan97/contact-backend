import {ApiValidationException} from '@/common/exceptions/api-validation.exception';
import {Injectable} from '@nestjs/common';
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
import * as console from "console";

@Injectable()
export class ImportService {

}
