import { Column } from 'typeorm';
import { BaseCommonEntity } from '@/entities/base-common.entity';

export abstract class BaseSoftDeleteEntity extends BaseCommonEntity {
    @Column({ type: 'tinyint', default: 1 })
    public is_active!: number;

    @Column({ type: 'tinyint', nullable: true, default: 0 })
    public is_deleted!: number;
}
