import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { departmentController } from './department/department-controller'
import { departmentProcessController } from './department-process/department-process-controller'

export const companyMapModule: FastifyPluginAsyncZod = async (app) => {
    await app.register(departmentController, { prefix: '/v1/company-map/departments' })
    await app.register(departmentProcessController, { prefix: '/v1/company-map/processes' })
}
