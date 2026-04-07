import {
    ApId,
    CreateDepartmentRequest,
    Department,
    DepartmentWithChildren,
    PrincipalType,
    SERVICE_KEY_SECURITY_OPENAPI,
    UpdateDepartmentRequest,
} from '@activepieces/shared'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { securityAccess } from '../../core/security/authorization/fastify-security'
import { departmentService } from './department-service'

export const departmentController: FastifyPluginAsyncZod = async (app) => {

    app.get('/', ListDepartmentsRequest, async (req) => {
        const platformId = req.principal.platform.id
        return departmentService(req.log).list(platformId)
    })

    app.post('/', CreateDepartmentRequestConfig, async (req) => {
        const platformId = req.principal.platform.id
        return departmentService(req.log).create(platformId, req.body)
    })

    app.put('/:id', UpdateDepartmentRequestConfig, async (req, res) => {
        const platformId = req.principal.platform.id
        const updated = await departmentService(req.log).update(req.params.id, platformId, req.body)
        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).send()
        }
        return updated
    })

    app.delete('/:id', DeleteDepartmentRequest, async (req, res) => {
        const platformId = req.principal.platform.id
        await departmentService(req.log).delete(req.params.id, platformId)
        return res.status(StatusCodes.NO_CONTENT).send()
    })
}

const ListDepartmentsRequest = {
    schema: {
        tags: ['company-map'],
        description: 'List departments as a tree',
        response: {
            [StatusCodes.OK]: z.array(DepartmentWithChildren),
        },
        security: [SERVICE_KEY_SECURITY_OPENAPI],
    },
    config: {
        security: securityAccess.publicPlatform([PrincipalType.USER, PrincipalType.SERVICE]),
    },
}

const CreateDepartmentRequestConfig = {
    schema: {
        tags: ['company-map'],
        description: 'Create a department',
        body: CreateDepartmentRequest,
        response: {
            [StatusCodes.OK]: Department,
        },
        security: [SERVICE_KEY_SECURITY_OPENAPI],
    },
    config: {
        security: securityAccess.platformAdminOnly([PrincipalType.USER, PrincipalType.SERVICE]),
    },
}

const UpdateDepartmentRequestConfig = {
    schema: {
        tags: ['company-map'],
        description: 'Update a department',
        params: z.object({
            id: ApId,
        }),
        body: UpdateDepartmentRequest,
        response: {
            [StatusCodes.OK]: Department,
        },
        security: [SERVICE_KEY_SECURITY_OPENAPI],
    },
    config: {
        security: securityAccess.platformAdminOnly([PrincipalType.USER, PrincipalType.SERVICE]),
    },
}

const DeleteDepartmentRequest = {
    schema: {
        tags: ['company-map'],
        description: 'Delete a department',
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
