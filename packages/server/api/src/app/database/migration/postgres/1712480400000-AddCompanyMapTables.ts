import { MigrationInterface, QueryRunner } from 'typeorm'

const DEFAULT_PLATFORM_ID = 'REPLACE_WITH_PLATFORM_ID'

export class AddCompanyMapTables1712480400000 implements MigrationInterface {
    name = 'AddCompanyMapTables1712480400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "department" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "platformId" character varying(21) NOT NULL,
                "name" character varying NOT NULL,
                "nameFA" character varying NOT NULL,
                "parentId" character varying(21),
                "description" character varying,
                "icon" character varying,
                "order" integer NOT NULL DEFAULT 0,
                CONSTRAINT "PK_department" PRIMARY KEY ("id"),
                CONSTRAINT "fk_department_parent_id" FOREIGN KEY ("parentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE NO ACTION
            )
        `)

        await queryRunner.query(`
            CREATE INDEX "idx_department_platform_id" ON "department" ("platformId")
        `)

        await queryRunner.query(`
            CREATE INDEX "idx_department_parent_id" ON "department" ("parentId")
        `)

        await queryRunner.query(`
            CREATE TABLE "department_process" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "departmentId" character varying(21) NOT NULL,
                "platformId" character varying(21) NOT NULL,
                "name" character varying NOT NULL,
                "nameFA" character varying NOT NULL,
                "description" character varying,
                "status" character varying NOT NULL,
                "priority" character varying NOT NULL,
                "flowId" character varying(21),
                "discoveredBy" character varying,
                "discoveredAt" TIMESTAMP WITH TIME ZONE,
                "automatedAt" TIMESTAMP WITH TIME ZONE,
                "metadata" jsonb,
                CONSTRAINT "PK_department_process" PRIMARY KEY ("id"),
                CONSTRAINT "fk_department_process_department_id" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `)

        await queryRunner.query(`
            CREATE INDEX "idx_department_process_department_id" ON "department_process" ("departmentId")
        `)

        await queryRunner.query(`
            CREATE INDEX "idx_department_process_platform_id" ON "department_process" ("platformId")
        `)

        await queryRunner.query(`
            CREATE INDEX "idx_department_process_status" ON "department_process" ("status")
        `)

        // Seed 8 default departments
        const departments = [
            { name: 'Order Management', nameFA: 'مدیریت سفارشات', order: 1 },
            { name: 'Inventory', nameFA: 'انبار و موجودی', order: 2 },
            { name: 'Logistics', nameFA: 'لجستیک و ارسال', order: 3 },
            { name: 'Customer Service', nameFA: 'خدمات مشتریان', order: 4 },
            { name: 'Marketing', nameFA: 'بازاریابی', order: 5 },
            { name: 'Finance', nameFA: 'مالی و حسابداری', order: 6 },
            { name: 'HR', nameFA: 'منابع انسانی', order: 7 },
            { name: 'IT/Engineering', nameFA: 'فناوری اطلاعات', order: 8 },
        ]

        for (const dept of departments) {
            const id = generateId()
            await queryRunner.query(`
                INSERT INTO "department" ("id", "platformId", "name", "nameFA", "order")
                VALUES ('${id}', '${DEFAULT_PLATFORM_ID}', '${dept.name}', '${dept.nameFA}', ${dept.order})
            `)
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "idx_department_process_status"')
        await queryRunner.query('DROP INDEX "idx_department_process_platform_id"')
        await queryRunner.query('DROP INDEX "idx_department_process_department_id"')
        await queryRunner.query('DROP TABLE "department_process"')
        await queryRunner.query('DROP INDEX "idx_department_platform_id"')
        await queryRunner.query('DROP INDEX "idx_department_parent_id"')
        await queryRunner.query('DROP TABLE "department"')
    }
}

function generateId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
    let result = ''
    for (let i = 0; i < 21; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}
