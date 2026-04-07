import { Department } from '@activepieces/shared'
import { EntitySchema } from 'typeorm'
import {
    ApIdSchema,
    BaseColumnSchemaPart,
} from '../../database/database-common'

type DepartmentSchema = Department & {
    parent: Department | null
    children: Department[]
}

export const DepartmentEntity = new EntitySchema<DepartmentSchema>({
    name: 'department',
    columns: {
        ...BaseColumnSchemaPart,
        platformId: {
            ...ApIdSchema,
        },
        name: {
            type: String,
            nullable: false,
        },
        nameFA: {
            type: String,
            nullable: false,
        },
        parentId: {
            ...ApIdSchema,
            nullable: true,
        },
        description: {
            type: String,
            nullable: true,
        },
        icon: {
            type: String,
            nullable: true,
        },
        order: {
            type: Number,
            nullable: false,
            default: 0,
        },
    },
    indices: [
        {
            name: 'idx_department_platform_id',
            columns: ['platformId'],
            unique: false,
        },
        {
            name: 'idx_department_parent_id',
            columns: ['parentId'],
            unique: false,
        },
    ],
    relations: {
        parent: {
            type: 'many-to-one',
            target: 'department',
            nullable: true,
            joinColumn: {
                name: 'parentId',
                foreignKeyConstraintName: 'fk_department_parent_id',
            },
        },
        children: {
            type: 'one-to-many',
            target: 'department',
            inverseSide: 'parent',
        },
    },
})
