import { prisma } from "../../../database/prisma.js";
export class WebhookEventRepository {
    static async findByEventId(eventId) {
        return prisma.webhookEvent.findUnique({
            where: {
                eventId,
            },
        });
    }
    static async create(data) {
        return prisma.webhookEvent.create({
            data,
        });
    }
}
//# sourceMappingURL=webhook-event.repository.js.map