import { BaseEntity } from '@/entities/base.entity';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

export enum PublicStatus {
    PUBLIC = 1,
    PRIVATE = 0,
}
@Entity({ name: 'tbl_contact' })
export default class TblContact extends BaseEntity {
    public static tableName: string = 'tbl_contact';

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    group_id: number;

    @Column()
    name: string;

    @Column()
    phone_number: string;

    @Column()
    email: string;

    @Column({ type: 'tinyint', nullable: true, default: 0 })
    public is_public: number;
}
