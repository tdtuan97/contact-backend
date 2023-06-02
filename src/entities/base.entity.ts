import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseCommonEntity } from '@/entities/base-common.entity';

export abstract class BaseEntity extends BaseCommonEntity {
    public static tableName: string = '';
    public static IS_DELETED = 1;
    public static NOT_DELETED = 0;
    public static IS_ACTIVE = 1;
    public static NOT_ACTIVE = 0;

    @Column({ type: 'tinyint', default: 1 })
    public is_active!: number;

    @Column({ type: 'tinyint', nullable: true, default: 0 })
    public is_deleted!: number;

    @CreateDateColumn({ name: 'created_at' })
    @ApiProperty()
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    @ApiProperty()
    updated_at: Date;

    @Column()
    created_user: string;

    @Column()
    updated_user: string;

    /**
     * Scope query available
     */
    public static queryAvailable() {
        return {
            is_active: this.IS_ACTIVE,
            is_deleted: this.NOT_DELETED,
        };
    }

    /**
     * Query string available
     */
    public static queryStrAvailable() {
        let queries = [
            `${this.tableName}.is_active = ${this.IS_ACTIVE}`,
            `${this.tableName}.is_deleted = ${this.NOT_DELETED}`,
        ];
        return queries.join(' AND ');
    }
}
