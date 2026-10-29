
import { prisma } from "../src/database/prisma.js";

async function main() {
  // Create or update plans safely
  const plans = [
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
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {
        price: plan.price,
        maxReviews: plan.maxReviews,
        maxReplies: plan.maxReplies,
      },
      create: plan,
    });
  }

  console.log("Plans seeded successfully");

  // Find FREE plan
  const freePlan = await prisma.plan.findUnique({
    where: { name: "FREE" },
  });

  if (!freePlan) {
    throw new Error("FREE plan missing after seeding");
  }

  // An organization may not exist on a fresh database.
  // Registration should create its subscription when it creates
  // the organization.
  const organization = await prisma.organization.findFirst();

  if (!organization) {
    console.log(
      "No organization found; skipping subscription and usage seeding."
    );
    return;
  }

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

  console.log("Subscription and usage seed completed");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
