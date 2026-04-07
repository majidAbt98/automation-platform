import {
    apId,
    CompanyMapStats,
    CreateDepartmentProcessRequest,
    DepartmentProcess,
    ProcessPriority,
    ProcessStatus,
    UpdateDepartmentProcessRequest,
} from '@activepieces/shared'
import { FastifyBaseLogger } from 'fastify'
import { repoFactory } from '../../core/db/repo-factory'
import { DepartmentProcessEntity } from './department-process-entity'

export const departmentProcessRepo = repoFactory(DepartmentProcessEntity)

type ListParams = {
    platformId: string
    departmentId?: string
    status?: ProcessStatus
    priority?: ProcessPriority
}

export const departmentProcessService = (_log: FastifyBaseLogger) => ({

    async list(params: ListParams): Promise<DepartmentProcess[]> {
        const { platformId, departmentId, status, priority } = params
        const repo = departmentProcessRepo()
        const qb = repo.createQueryBuilder('dp')
            .where('dp.platformId = :platformId', { platformId })
            .orderBy('dp.created', 'ASC')
        if (departmentId) {
            qb.andWhere('dp.departmentId = :departmentId', { departmentId })
        }
        if (status) {
            qb.andWhere('dp.status = :status', { status })
        }
        if (priority) {
            qb.andWhere('dp.priority = :priority', { priority })
        }
        return qb.getMany()
    },

    async create(platformId: string, request: CreateDepartmentProcessRequest): Promise<DepartmentProcess> {
        const process: DepartmentProcess = {
            id: apId(),
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            platformId,
            departmentId: request.departmentId,
            name: request.name,
            nameFA: request.nameFA,
            description: request.description ?? null,
            status: request.status ?? ProcessStatus.DISCOVERED,
            priority: request.priority ?? ProcessPriority.MEDIUM,
            flowId: request.flowId ?? null,
            discoveredBy: null,
            discoveredAt: null,
            automatedAt: null,
            metadata: request.metadata ?? null,
        }
        return departmentProcessRepo().save(process)
    },

    async update(id: string, platformId: string, request: UpdateDepartmentProcessRequest): Promise<DepartmentProcess | null> {
        const existing = await departmentProcessRepo().findOneBy({ id, platformId })
        if (!existing) {
            return null
        }
        const updated = {
            ...existing,
            ...Object.fromEntries(
                Object.entries(request).filter(([, v]) => v !== undefined),
            ),
        }
        // If status changed to AUTOMATED and automatedAt not set, record the time
        if (request.status === ProcessStatus.AUTOMATED && !existing.automatedAt) {
            updated.automatedAt = new Date().toISOString()
        }
        return departmentProcessRepo().save(updated)
    },

    async delete(id: string, platformId: string): Promise<void> {
        await departmentProcessRepo().delete({ id, platformId })
    },

    async getStats(platformId: string): Promise<CompanyMapStats> {
        const processes = await departmentProcessRepo().find({ where: { platformId } })

        const byStatus: Record<string, number> = {}
        const byPriority: Record<string, number> = {}
        const departmentMap: Record<string, { total: number, automated: number, name: string }> = {}

        for (const p of processes) {
            // Count by status
            byStatus[p.status] = (byStatus[p.status] ?? 0) + 1

            // Count by priority
            byPriority[p.priority] = (byPriority[p.priority] ?? 0) + 1

            // Count by department
            if (!departmentMap[p.departmentId]) {
                departmentMap[p.departmentId] = { total: 0, automated: 0, name: '' }
            }
            departmentMap[p.departmentId].total += 1
            if (p.status === ProcessStatus.AUTOMATED) {
                departmentMap[p.departmentId].automated += 1
            }
        }

        // Get department names
        const { departmentRepo } = await import('../department/department-service')
        const departments = await departmentRepo().find({ where: { platformId } })
        for (const dept of departments) {
            if (departmentMap[dept.id]) {
                departmentMap[dept.id].name = dept.name
            }
        }

        const byDepartment = Object.entries(departmentMap).map(([departmentId, data]) => ({
            departmentId,
            departmentName: data.name,
            total: data.total,
            automated: data.automated,
        }))

        return {
            totalDepartments: departments.length,
            totalProcesses: processes.length,
            byStatus: byStatus as Record<ProcessStatus, number>,
            byPriority: byPriority as Record<ProcessPriority, number>,
            byDepartment,
        }
    },
})
