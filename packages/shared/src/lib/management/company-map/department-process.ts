import { z } from 'zod'
import { BaseModelSchema, DateOrString, Nullable } from '../../core/common/base-model'

export enum ProcessStatus {
    DISCOVERED = 'DISCOVERED',
    ANALYZING = 'ANALYZING',
    READY_FOR_AUTOMATION = 'READY_FOR_AUTOMATION',
    AUTOMATED = 'AUTOMATED',
    MONITORING = 'MONITORING',
}

export enum ProcessPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

export const DepartmentProcess = z.object({
    ...BaseModelSchema,
    departmentId: z.string(),
    platformId: z.string(),
    name: z.string(),
    nameFA: z.string(),
    description: Nullable(z.string()),
    status: z.nativeEnum(ProcessStatus),
    priority: z.nativeEnum(ProcessPriority),
    flowId: Nullable(z.string()),
    discoveredBy: Nullable(z.string()),
    discoveredAt: Nullable(DateOrString),
    automatedAt: Nullable(DateOrString),
    metadata: Nullable(z.record(z.unknown())),
})
export type DepartmentProcess = z.infer<typeof DepartmentProcess>

export const CreateDepartmentProcessRequest = z.object({
    departmentId: z.string(),
    name: z.string().min(1),
    nameFA: z.string().min(1),
    description: Nullable(z.string()),
    status: z.nativeEnum(ProcessStatus).default(ProcessStatus.DISCOVERED),
    priority: z.nativeEnum(ProcessPriority).default(ProcessPriority.MEDIUM),
    flowId: Nullable(z.string()),
    metadata: Nullable(z.record(z.unknown())),
})
export type CreateDepartmentProcessRequest = z.infer<typeof CreateDepartmentProcessRequest>

export const UpdateDepartmentProcessRequest = z.object({
    name: z.string().min(1).optional(),
    nameFA: z.string().min(1).optional(),
    description: Nullable(z.string()),
    status: z.nativeEnum(ProcessStatus).optional(),
    priority: z.nativeEnum(ProcessPriority).optional(),
    flowId: Nullable(z.string()),
    metadata: Nullable(z.record(z.unknown())),
})
export type UpdateDepartmentProcessRequest = z.infer<typeof UpdateDepartmentProcessRequest>

export const CompanyMapStats = z.object({
    totalDepartments: z.number(),
    totalProcesses: z.number(),
    byStatus: z.record(z.nativeEnum(ProcessStatus), z.number()),
    byPriority: z.record(z.nativeEnum(ProcessPriority), z.number()),
    byDepartment: z.array(z.object({
        departmentId: z.string(),
        departmentName: z.string(),
        total: z.number(),
        automated: z.number(),
    })),
})
export type CompanyMapStats = z.infer<typeof CompanyMapStats>
