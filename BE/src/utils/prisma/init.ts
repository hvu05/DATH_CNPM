import { initProduct } from './init-product';
import { initUser } from './init-user';
/**
 * Khởi tạo 1 số dữ liệu cơ bản ít thay đổi - chưa hoàn chỉnh
 */
async function main() {
  console.log('Seeding database...');

  await initUser();
  await initProduct(); //? Khởi tạo tạm, vì chưa có product api

  console.log('Seeding finished!');
}

main().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
