import { prisma } from "@repo/database";

async function main() {
  const users = await prisma.user.findMany();
  const messages = await prisma.internalMessage.findMany({
    include: {
      sender: true
    }
  });

  console.log("ALL USERS:", JSON.stringify(users, null, 2));
  console.log("INTERNAL MESSAGES:", JSON.stringify(messages, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
