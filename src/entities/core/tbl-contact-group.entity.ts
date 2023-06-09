import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
} from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'tbl_contact_group' })
export default class TblContactGroup extends BaseEntity {
    public static tableName: string = 'tbl_contact_group';

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;
}
