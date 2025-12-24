import { TestUsers } from '../src/config/test-user';
import { hash } from '../src/common/utils/hash.util';
import { PrismaClient } from './client/generated/client';
import { isDev } from '../src/common/utils/env.util';

const prisma = new PrismaClient();

async function main() {
  if (isDev) {
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
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
