const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const SEED_PASSWORD = 'Password123';

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hotel.com' },
    update: {},
    create: {
      name: 'Hotel Admin',
      email: 'admin@hotel.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@hotel.com' },
    update: {},
    create: {
      name: 'Hotel Staff',
      email: 'staff@hotel.com',
      password: hashedPassword,
      role: 'STAFF',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@hotel.com' },
    update: {},
    create: {
      name: 'Hotel Customer',
      email: 'customer@hotel.com',
      password: hashedPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('\n✔ Seed complete! Users created:');
  console.log(`  🔑 Admin    — ${admin.email}   (password: ${SEED_PASSWORD})`);
  console.log(`  👷 Staff    — ${staff.email}   (password: ${SEED_PASSWORD})`);
  console.log(`  🧑 Customer — ${customer.email} (password: ${SEED_PASSWORD})`);
  console.log('');
}

main()
  .catch((err) => {
    console.error('✘ Seed error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
