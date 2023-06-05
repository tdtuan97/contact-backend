import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseCommonEntity } from '@/entities/base-common.entity';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseTimestampEntity extends BaseCommonEntity {
    @CreateDateColumn({ name: 'created_at' })
    @ApiProperty()
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    @ApiProperty()
    updated_at: Date;

    @Column()
    created_user_id: number;

    @Column()
    updated_user_id: number;
}
