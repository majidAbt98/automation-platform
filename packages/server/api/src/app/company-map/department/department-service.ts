import {
    apId,
    CreateDepartmentRequest,
    Department,
    DepartmentWithChildren,
    UpdateDepartmentRequest,
} from '@activepieces/shared'
import { FastifyBaseLogger } from 'fastify'
import { repoFactory } from '../../core/db/repo-factory'
import { DepartmentEntity } from './department-entity'

export const departmentRepo = repoFactory(DepartmentEntity)

export const departmentService = (_log: FastifyBaseLogger) => ({

    async list(platformId: string): Promise<DepartmentWithChildren[]> {
        const all = await departmentRepo().find({
            where: { platformId },
            order: { order: 'ASC' },
        })
        return buildTree(all, null)
    },

    async create(platformId: string, request: CreateDepartmentRequest): Promise<Department> {
        const department: Department = {
            id: apId(),
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            platformId,
            name: request.name,
            nameFA: request.nameFA,
            parentId: request.parentId ?? null,
            description: request.description ?? null,
            icon: request.icon ?? null,
            order: request.order ?? 0,
        }
        return departmentRepo().save(department)
    },

    async update(id: string, platformId: string, request: UpdateDepartmentRequest): Promise<Department | null> {
        const existing = await departmentRepo().findOneBy({ id, platformId })
        if (!existing) {
            return null
        }
        const updated = {
            ...existing,
            ...Object.fromEntries(
                Object.entries(request).filter(([, v]) => v !== undefined),
            ),
        }
        return departmentRepo().save(updated)
    },

    async delete(id: string, platformId: string): Promise<void> {
        await departmentRepo().delete({ id, platformId })
    },
})

function buildTree(
    all: Department[],
    parentId: string | null,
): DepartmentWithChildren[] {
    return all
        .filter((d) => d.parentId === parentId)
        .map((d) => ({
            ...d,
            children: buildTree(all, d.id),
        }))
}
