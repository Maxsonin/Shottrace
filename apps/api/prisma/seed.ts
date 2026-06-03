import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from '../src/shared/utils/hash.util';
import { TestUsers } from '../test/fixtures/test-user';

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const { email, username, password } = TestUsers.default;
  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: await hash(password),
      },
    });
    console.log(`✅ Test user created: ${email}`);
  } else {
    console.log('ℹ Test user already exists, skipping');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
