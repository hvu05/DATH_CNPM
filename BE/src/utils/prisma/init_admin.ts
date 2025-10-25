import { prisma } from '../../config/prisma.config';
import { createUser } from '../../services/user.service';
export async function main() {
  console.log('Seeding admin...');
  const role = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  if (!role) return;
  const admin = await prisma.user.findFirst({
    where: {
      role: role,
    },
  });
  if (admin) return;

  const data = {
    full_name: 'Admin',
    email: 'admin@localhost',
    password: '12345678',
    role: role.name,
    is_active: true,
  };
  await createUser(data);
  console.log('Admin seeded.');
}
