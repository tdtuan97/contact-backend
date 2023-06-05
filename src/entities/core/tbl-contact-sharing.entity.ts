import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import {BaseTimestampEntity} from "@/entities/base-timestamp.entity";

export enum ShareMode {
    READ = 'read',
}

@Entity({ name: 'tbl_contact_sharing' })
export default class TblContactSharing extends BaseTimestampEntity {
    public static tableName: string = 'tbl_contact_sharing';

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    contact_id: number;

    @Column({
        type: 'enum',
        enum: ShareMode,
    })
    mode: string;
}
