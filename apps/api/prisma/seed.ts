import { prisma } from "../src/database/prisma.js";

async function main() {
  await prisma.plan.createMany({
    data: [
      {
        name: "FREE",
        price: 0,
        maxReviews: 50,
        maxReplies: 50,
      },

      {
        name: "STARTER",
        price: 29,
        maxReviews: 500,
        maxReplies: 500,
      },

      {
        name: "PRO",
        price: 99,
        maxReviews: 5000,
        maxReplies: 5000,
      },
    ],
  });

  await prisma.plan.upsert({
    where: {
      name: "FREE",
    },
    update: {},
    create: {
      name: "FREE",
      price: 0,
      maxReviews: 50,
      maxReplies: 50,
    },
  });

  await prisma.plan.upsert({
    where: {
      name: "STARTER",
    },
    update: {},
    create: {
      name: "STARTER",
      price: 29,
      maxReviews: 500,
      maxReplies: 500,
    },
  });

  await prisma.plan.upsert({
    where: {
      name: "PRO",
    },
    update: {},
    create: {
      name: "PRO",
      price: 99,
      maxReviews: 5000,
      maxReplies: 5000,
    },
  });

  // Find FREE plan

  const freePlan = await prisma.plan.findUnique({
    where: {
      name: "FREE",
    },
  });

  if (!freePlan) {
    throw new Error("FREE plan missing");
  }

  // Find existing organization

  const organization = await prisma.organization.findFirst();

  if (!organization) {
    throw new Error("No organization found");
  }

  // Create subscription

  await prisma.subscription.upsert({
    where: {
      organizationId: organization.id,
    },

    update: {},

    create: {
      organizationId: organization.id,

      planId: freePlan.id,

      status: "TRIAL",
    },
  });

  // Create monthly usage

  const month = new Date().toISOString().slice(0, 7);

  await prisma.usage.upsert({
    where: {
      organizationId_month: {
        organizationId: organization.id,

        month,
      },
    },

    update: {},

    create: {
      organizationId: organization.id,

      month,

      reviewsProcessed: 0,

      aiRepliesGenerated: 0,
    },
  });

  console.log("Subscription seed completed");
}

main();
