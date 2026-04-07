import { z } from 'zod'
import { BaseModelSchema, DateOrString, Nullable } from '../../core/common/base-model'

export const Department = z.object({
    ...BaseModelSchema,
    platformId: z.string(),
    name: z.string(),
    nameFA: z.string(),
    parentId: Nullable(z.string()),
    description: Nullable(z.string()),
    icon: Nullable(z.string()),
    order: z.number(),
})
export type Department = z.infer<typeof Department>

export const DepartmentWithChildren = Department.extend({
    children: z.array(z.lazy(() => DepartmentWithChildren)).optional(),
    processCount: z.number().optional(),
    automatedCount: z.number().optional(),
})
export type DepartmentWithChildren = z.infer<typeof DepartmentWithChildren>

export const CreateDepartmentRequest = z.object({
    name: z.string().min(1),
    nameFA: z.string().min(1),
    parentId: Nullable(z.string()),
    description: Nullable(z.string()),
    icon: Nullable(z.string()),
    order: z.number().default(0),
})
export type CreateDepartmentRequest = z.infer<typeof CreateDepartmentRequest>

export const UpdateDepartmentRequest = z.object({
    name: z.string().min(1).optional(),
    nameFA: z.string().min(1).optional(),
    parentId: Nullable(z.string()),
    description: Nullable(z.string()),
    icon: Nullable(z.string()),
    order: z.number().optional(),
})
export type UpdateDepartmentRequest = z.infer<typeof UpdateDepartmentRequest>
