import { prisma } from "../../config/prisma.config";
/**
 * Khởi tạo 1 số dữ liệu cơ bản ít thay đổi - chưa hoàn chỉnh
 */
async function main() {
  console.log("Seeding database...");

  // Roles
  const roles = ["CUSTOMER", "STAFF", "ADMIN"];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Categories
  const categories = ["Laptop", "Phone", "Tablet"];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Brands
  const brands = ["Apple", "Samsung", "Dell"];
  for (const name of brands) {
    await prisma.brand.upsert({
      where: { name },
      update: {},
      create: { name,
        category_id : 2,
        description : "Description"
       },
    });
  }

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
