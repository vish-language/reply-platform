import { prisma } from "../../../database/prisma.js";

export class WebhookEventRepository {
  static async findByEventId(eventId: string) {
    return( prisma as any).webhookEvent.findUnique({
      where: {
        eventId,
      },
    });
  }

  static async create(data: {
    eventId: string;
    event: string;
  }) {
    return (prisma as any).webhookEvent.create({
      data,
    });
  }
}