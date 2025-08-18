import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/*
run `npx prisma db seed` to create the admin user
 */

async function main() {
  const email = "test@gmail.com";
  const plainTextPassword = "test-pass";
  const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

  await prisma.user.deleteMany({ where: { role: "ADMIN" } });

  const admin = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Admin user created successfully:`, admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
