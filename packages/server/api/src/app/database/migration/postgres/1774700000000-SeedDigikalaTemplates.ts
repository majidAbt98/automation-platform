import { MigrationInterface, QueryRunner } from 'typeorm'

const TEMPLATES = [
    {
        id: 'digikala-tpl-001',
        name: 'اعلان سفارش جدید برای مشتری',
        summary: 'ارسال پیامک تایید سفارش به مشتری هنگام ثبت سفارش جدید',
        description: 'هنگامی که سفارش جدیدی در دیجی‌کالا ثبت می‌شود، این اتوماسیون به‌صورت خودکار پیامک تایید همراه با شماره پیگیری و جزئیات سفارش را برای مشتری ارسال می‌کند.',
        author: 'digikala-platform-team',
        tags: JSON.stringify([
            { title: 'سفارشات', color: '#EF394E' },
            { title: 'اعلان', color: '#00BFA5' },
        ]),
        categories: JSON.stringify(['COMMERCE', 'CUSTOMER_SERVICE']),
        pieces: JSON.stringify(['@activepieces/piece-digikala']),
        type: 'OFFICIAL',
        status: 'PUBLISHED',
        blogUrl: null,
        metadata: null,
        platformId: null,
        flows: JSON.stringify([
            {
                displayName: 'اعلان سفارش جدید',
                trigger: {
                    name: 'trigger',
                    displayName: 'سفارش جدید',
                    type: 'PIECE_TRIGGER',
                    settings: {
                        pieceName: '@activepieces/piece-digikala',
                        pieceVersion: '~0.1.0',
                        triggerName: 'new_order',
                        input: {},
                    },
                    nextAction: {
                        name: 'send_notification',
                        displayName: 'ارسال پیامک به مشتری',
                        type: 'PIECE',
                        settings: {
                            pieceName: '@activepieces/piece-digikala',
                            pieceVersion: '~0.1.0',
                            actionName: 'send_notification',
                            input: {
                                channel: 'SMS',
                                recipientId: '{{trigger.customerId}}',
                                message: 'سفارش شما با شماره {{trigger.id}} با موفقیت ثبت شد. مبلغ: {{trigger.totalAmount}} ریال',
                                subject: 'تایید سفارش دیجی‌کالا',
                            },
                        },
                        nextAction: undefined,
                    },
                },
            },
        ]),
        tables: JSON.stringify([]),
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
    },
    {
        id: 'digikala-tpl-002',
        name: 'هشدار کمبود موجودی',
        summary: 'ارسال اعلان به تیم انبار هنگام کاهش موجودی محصول',
        description: 'وقتی موجودی یک محصول به زیر حد آستانه تعریف‌شده می‌رسد، این فلو به‌صورت خودکار به تیم انبار اطلاع می‌دهد تا اقدام به تامین موجودی کنند.',
        author: 'digikala-platform-team',
        tags: JSON.stringify([
            { title: 'موجودی', color: '#EF394E' },
            { title: 'انبار', color: '#FF9800' },
            { title: 'هشدار', color: '#F44336' },
        ]),
        categories: JSON.stringify(['COMMERCE', 'INVENTORY']),
        pieces: JSON.stringify(['@activepieces/piece-digikala']),
        type: 'OFFICIAL',
        status: 'PUBLISHED',
        blogUrl: null,
        metadata: null,
        platformId: null,
        flows: JSON.stringify([
            {
                displayName: 'هشدار کمبود موجودی',
                trigger: {
                    name: 'trigger',
                    displayName: 'هشدار موجودی پایین',
                    type: 'PIECE_TRIGGER',
                    settings: {
                        pieceName: '@activepieces/piece-digikala',
                        pieceVersion: '~0.1.0',
                        triggerName: 'low_stock_alert',
                        input: { threshold: 10 },
                    },
                    nextAction: {
                        name: 'notify_warehouse',
                        displayName: 'اعلان به تیم انبار',
                        type: 'PIECE',
                        settings: {
                            pieceName: '@activepieces/piece-digikala',
                            pieceVersion: '~0.1.0',
                            actionName: 'send_notification',
                            input: {
                                channel: 'IN_APP',
                                recipientId: 'warehouse-team',
                                subject: 'هشدار کمبود موجودی',
                                message: 'محصول {{trigger.productName}} (SKU: {{trigger.sku}}) به {{trigger.currentStock}} عدد رسیده است. لطفاً اقدام به تامین موجودی نمایید.',
                            },
                        },
                        nextAction: undefined,
                    },
                },
            },
        ]),
        tables: JSON.stringify([]),
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
    },
    {
        id: 'digikala-tpl-003',
        name: 'به‌روزرسانی وضعیت سفارش پس از ارسال',
        summary: 'تغییر خودکار وضعیت سفارش به "ارسال شده" و اعلان به مشتری',
        description: 'این اتوماسیون وضعیت سفارش را به "ارسال شده" تغییر داده و اطلاعات رهگیری مرسوله را از طریق پیامک برای مشتری ارسال می‌کند.',
        author: 'digikala-platform-team',
        tags: JSON.stringify([
            { title: 'لجستیک', color: '#2196F3' },
            { title: 'سفارشات', color: '#EF394E' },
        ]),
        categories: JSON.stringify(['COMMERCE', 'LOGISTICS']),
        pieces: JSON.stringify(['@activepieces/piece-digikala']),
        type: 'OFFICIAL',
        status: 'PUBLISHED',
        blogUrl: null,
        metadata: null,
        platformId: null,
        flows: JSON.stringify([
            {
                displayName: 'به‌روزرسانی وضعیت ارسال',
                trigger: {
                    name: 'trigger',
                    displayName: 'سفارش جدید (تایید شده)',
                    type: 'PIECE_TRIGGER',
                    settings: {
                        pieceName: '@activepieces/piece-digikala',
                        pieceVersion: '~0.1.0',
                        triggerName: 'new_order',
                        input: { status: 'CONFIRMED' },
                    },
                    nextAction: {
                        name: 'update_status',
                        displayName: 'به‌روزرسانی وضعیت به ارسال شده',
                        type: 'PIECE',
                        settings: {
                            pieceName: '@activepieces/piece-digikala',
                            pieceVersion: '~0.1.0',
                            actionName: 'update_order_status',
                            input: {
                                orderId: '{{trigger.id}}',
                                status: 'SHIPPED',
                                note: 'سفارش به انبار ارسال شده',
                            },
                        },
                        nextAction: {
                            name: 'notify_customer',
                            displayName: 'اعلان وضعیت ارسال به مشتری',
                            type: 'PIECE',
                            settings: {
                                pieceName: '@activepieces/piece-digikala',
                                pieceVersion: '~0.1.0',
                                actionName: 'send_notification',
                                input: {
                                    channel: 'SMS',
                                    recipientId: '{{trigger.customerId}}',
                                    subject: 'سفارش شما ارسال شد',
                                    message: 'سفارش {{trigger.id}} شما ارسال شد. برای پیگیری مرسوله اقدام نمایید.',
                                },
                            },
                            nextAction: undefined,
                        },
                    },
                },
            },
        ]),
        tables: JSON.stringify([]),
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
    },
    {
        id: 'digikala-tpl-004',
        name: 'بررسی موجودی قبل از تایید سفارش',
        summary: 'بررسی موجودی انبار و رد یا تایید خودکار سفارش',
        description: 'هنگام ثبت سفارش جدید، موجودی محصولات مربوطه بررسی شده و در صورت کافی بودن موجودی، سفارش تایید می‌شود؛ در غیر این صورت وضعیت سفارش به "در انتظار موجودی" تغییر می‌کند.',
        author: 'digikala-platform-team',
        tags: JSON.stringify([
            { title: 'موجودی', color: '#FF9800' },
            { title: 'سفارشات', color: '#EF394E' },
            { title: 'اتوماسیون', color: '#9C27B0' },
        ]),
        categories: JSON.stringify(['COMMERCE', 'INVENTORY', 'ORDER_MANAGEMENT']),
        pieces: JSON.stringify(['@activepieces/piece-digikala']),
        type: 'OFFICIAL',
        status: 'PUBLISHED',
        blogUrl: null,
        metadata: null,
        platformId: null,
        flows: JSON.stringify([
            {
                displayName: 'بررسی موجودی و تایید سفارش',
                trigger: {
                    name: 'trigger',
                    displayName: 'سفارش جدید',
                    type: 'PIECE_TRIGGER',
                    settings: {
                        pieceName: '@activepieces/piece-digikala',
                        pieceVersion: '~0.1.0',
                        triggerName: 'new_order',
                        input: { status: 'PENDING_PAYMENT' },
                    },
                    nextAction: {
                        name: 'check_inventory',
                        displayName: 'بررسی موجودی محصول',
                        type: 'PIECE',
                        settings: {
                            pieceName: '@activepieces/piece-digikala',
                            pieceVersion: '~0.1.0',
                            actionName: 'get_inventory',
                            input: {
                                sku: '{{trigger.items[0].sku}}',
                            },
                        },
                        nextAction: {
                            name: 'confirm_order',
                            displayName: 'تایید سفارش',
                            type: 'PIECE',
                            settings: {
                                pieceName: '@activepieces/piece-digikala',
                                pieceVersion: '~0.1.0',
                                actionName: 'update_order_status',
                                input: {
                                    orderId: '{{trigger.id}}',
                                    status: 'CONFIRMED',
                                    note: 'تایید خودکار - موجودی کافی است',
                                },
                            },
                            nextAction: undefined,
                        },
                    },
                },
            },
        ]),
        tables: JSON.stringify([]),
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
    },
]

export class SeedDigikalaTemplates1774700000000 implements MigrationInterface {
    name = 'SeedDigikalaTemplates1774700000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        for (const template of TEMPLATES) {
            // Check if template already exists to avoid duplicate seeding
            const exists = await queryRunner.query(
                `SELECT id FROM "template" WHERE id = $1`,
                [template.id],
            )
            if (exists.length > 0) {
                continue
            }

            await queryRunner.query(
                `INSERT INTO "template" (
                    "id", "created", "updated", "name", "summary", "description",
                    "author", "tags", "categories", "pieces", "type", "status",
                    "blogUrl", "metadata", "platformId", "flows", "tables"
                ) VALUES (
                    $1, $2, $3, $4, $5, $6,
                    $7, $8, $9, $10, $11, $12,
                    $13, $14, $15, $16, $17
                )`,
                [
                    template.id,
                    template.created,
                    template.updated,
                    template.name,
                    template.summary,
                    template.description,
                    template.author,
                    template.tags,
                    template.categories,
                    template.pieces,
                    template.type,
                    template.status,
                    template.blogUrl,
                    template.metadata,
                    template.platformId,
                    template.flows,
                    template.tables,
                ],
            )
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const ids = TEMPLATES.map((t) => t.id)
        for (const id of ids) {
            await queryRunner.query(`DELETE FROM "template" WHERE id = $1`, [id])
        }
    }
}
