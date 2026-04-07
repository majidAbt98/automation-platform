import {
    ApId,
    CompanyMapStats,
    CreateDepartmentProcessRequest,
    DepartmentProcess,
    PrincipalType,
    ProcessPriority,
    ProcessStatus,
    SERVICE_KEY_SECURITY_OPENAPI,
    UpdateDepartmentProcessRequest,
} from '@activepieces/shared'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { securityAccess } from '../../core/security/authorization/fastify-security'
import { departmentProcessService } from './department-process-service'

export const departmentProcessController: FastifyPluginAsyncZod = async (app) => {

    app.get('/stats', GetStatsRequest, async (req) => {
        const platformId = req.principal.platform.id
        return departmentProcessService(req.log).getStats(platformId)
    })

    app.get('/', ListProcessesRequest, async (req) => {
        const platformId = req.principal.platform.id
        return departmentProcessService(req.log).list({
            platformId,
            departmentId: req.query.departmentId,
            status: req.query.status,
            priority: req.query.priority,
        })
    })

    app.post('/', CreateProcessRequestConfig, async (req) => {
        const platformId = req.principal.platform.id
        return departmentProcessService(req.log).create(platformId, req.body)
    })

    app.put('/:id', UpdateProcessRequestConfig, async (req, res) => {
        const platformId = req.principal.platform.id
        const updated = await departmentProcessService(req.log).update(req.params.id, platformId, req.body)
        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).send()
        }
        return updated
    })

    app.delete('/:id', DeleteProcessRequest, async (req, res) => {
        const platformId = req.principal.platform.id
        await departmentProcessService(req.log).delete(req.params.id, platformId)
        return res.status(StatusCodes.NO_CONTENT).send()
    })
}

const GetStatsRequest = {
    schema: {
        tags: ['company-map'],
        description: 'Get company map statistics',
        response: {
            [StatusCodes.OK]: CompanyMapStats,
        },
        security: [SERVICE_KEY_SECURITY_OPENAPI],
    },
    config: {
        security: securityAccess.publicPlatform([PrincipalType.USER, PrincipalType.SERVICE]),
    },
}

const ListProcessesRequest = {
    schema: {
        tags: ['company-map'],
        description: 'List department processes',
        querystring: z.object({
            departmentId: z.string().optional(),
            status: z.nativeEnum(ProcessStatus).optional(),
            priority: z.nativeEnum(ProcessPriority).optional(),
        }),
        response: {
            [StatusCodes.OK]: z.array(DepartmentProcess),
        },
        security: [SERVICE_KEY_SECURITY_OPENAPI],
    },
    config: {
        security: securityAccess.publicPlatform([PrincipalType.USER, PrincipalType.SERVICE]),
    },
}

const CreateProcessRequestConfig = {
    schema: {
        tags: ['company-map'],
        description: 'Create a department process',
        body: CreateDepartmentProcessRequest,
        response: {
            [StatusCodes.OK]: DepartmentProcess,
        },
        security: [SERVICE_KEY_SECURITY_OPENAPI],
    },
    config: {
        security: securityAccess.platformAdminOnly([PrincipalType.USER, PrincipalType.SERVICE]),
    },
}

const UpdateProcessRequestConfig = {
    schema: {
        tags: ['company-map'],
        description: 'Update a department process',
        params: z.object({
            id: ApId,
        }),
        body: UpdateDepartmentProcessRequest,
        response: {
            [StatusCodes.OK]: DepartmentProcess,
        },
        security: [SERVICE_KEY_SECURITY_OPENAPI],
    },
    config: {
        security: securityAccess.platformAdminOnly([PrincipalType.USER, PrincipalType.SERVICE]),
    },
}

const DeleteProcessRequest = {
    schema: {
        tags: ['company-map'],
        description: 'Delete a department process',
        params: z.object({
            id: ApId,
        }),
        response: {
            [StatusCodes.NO_CONTENT]: z.never(),
        },
        security: [SERVICE_KEY_SECURITY_OPENAPI],
    },
    config: {
        security: securityAccess.platformAdminOnly([PrincipalType.USER, PrincipalType.SERVICE]),
    },
}
