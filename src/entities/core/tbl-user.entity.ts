import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
} from 'typeorm';
import {BaseEntity} from '../base.entity';

@Entity({name: 'tbl_user'})
export default class TblUser extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column()
    public first_name: string;

    @Column()
    public last_name: string;

    @Column({nullable: true, default: ''})
    public address: string;

    /**
     * Get full name
     */
    public getFullName(){
        return this.first_name + ' ' + this.last_name
    }
}
