import { Department, DepartmentProcess } from '@activepieces/shared'
import { EntitySchema } from 'typeorm'
import {
    ApIdSchema,
    BaseColumnSchemaPart,
} from '../../database/database-common'

type DepartmentProcessSchema = DepartmentProcess & {
    department: Department
}

export const DepartmentProcessEntity = new EntitySchema<DepartmentProcessSchema>({
    name: 'department_process',
    columns: {
        ...BaseColumnSchemaPart,
        departmentId: {
            ...ApIdSchema,
            nullable: false,
        },
        platformId: {
            ...ApIdSchema,
            nullable: false,
        },
        name: {
            type: String,
            nullable: false,
        },
        nameFA: {
            type: String,
            nullable: false,
        },
        description: {
            type: String,
            nullable: true,
        },
        status: {
            type: String,
            nullable: false,
        },
        priority: {
            type: String,
            nullable: false,
        },
        flowId: {
            ...ApIdSchema,
            nullable: true,
        },
        discoveredBy: {
            type: String,
            nullable: true,
        },
        discoveredAt: {
            type: 'timestamp with time zone',
            nullable: true,
        },
        automatedAt: {
            type: 'timestamp with time zone',
            nullable: true,
        },
        metadata: {
            type: 'jsonb',
            nullable: true,
        },
    },
    indices: [
        {
            name: 'idx_department_process_department_id',
            columns: ['departmentId'],
            unique: false,
        },
        {
            name: 'idx_department_process_platform_id',
            columns: ['platformId'],
            unique: false,
        },
        {
            name: 'idx_department_process_status',
            columns: ['status'],
            unique: false,
        },
    ],
    relations: {
        department: {
            type: 'many-to-one',
            target: 'department',
            onDelete: 'CASCADE',
            joinColumn: {
                name: 'departmentId',
                foreignKeyConstraintName: 'fk_department_process_department_id',
            },
        },
    },
})
