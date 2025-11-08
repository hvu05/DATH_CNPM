import { prisma } from "../../config/prisma.config";
import { genSalt, hashSync } from 'bcrypt-ts';

/**
 * Hash password sử dụng bcrypt
 */
const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return hashSync(password, salt);
};

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
      create: {
        name,
        category_id: 2,
        description: "Description"
      },
    });
  }

  // Users - Create 20 sample users
  console.log("Creating sample users...");

  const sampleUsers = [
    { full_name: "Nguyễn Văn An", email: "an.nguyen@example.com", phone: "0901234567", role: "CUSTOMER" },
    { full_name: "Trần Thị Bình", email: "binh.tran@example.com", phone: "0912345678", role: "CUSTOMER" },
    { full_name: "Lê Văn Cường", email: "cuong.le@example.com", phone: "0923456789", role: "CUSTOMER" },
    { full_name: "Phạm Thị Dung", email: "dung.pham@example.com", phone: "0934567890", role: "CUSTOMER" },
    { full_name: "Hoàng Văn Em", email: "em.hoang@example.com", phone: "0945678901", role: "CUSTOMER" },
    { full_name: "Đỗ Thị Giang", email: "giang.do@example.com", phone: "0956789012", role: "STAFF" },
    { full_name: "Vũ Văn Hùng", email: "hung.vu@example.com", phone: "0967890123", role: "CUSTOMER" },
    { full_name: "Bùi Thị Lan", email: "lan.bui@example.com", phone: "0978901234", role: "CUSTOMER" },
    { full_name: "Đinh Văn Minh", email: "minh.dinh@example.com", phone: "0989012345", role: "STAFF" },
    { full_name: "Ngô Thị Nga", email: "nga.ngo@example.com", phone: "0990123456", role: "CUSTOMER" },
    { full_name: "Ông Văn Phúc", email: "phuc.ong@example.com", phone: "0901234876", role: "CUSTOMER" },
    { full_name: "Phan Thị Quỳnh", email: "quynh.phan@example.com", phone: "0912345987", role: "CUSTOMER" },
    { full_name: "Tô Văn Rạng", email: "rang.to@example.com", phone: "0923456098", role: "STAFF" },
    { full_name: "Đào Thị Sương", email: "suong.dao@example.com", phone: "0934567109", role: "CUSTOMER" },
    { full_name: "Trương Văn Tài", email: "tai.truong@example.com", phone: "0945678210", role: "CUSTOMER" },
    { full_name: "Vương Thị Uyên", email: "uyen.vuong@example.com", phone: "0956789321", role: "CUSTOMER" },
    { full_name: "Yên Văn Vinh", email: "vinh.yen@example.com", phone: "0967890432", role: "CUSTOMER" },
    { full_name: "Lâm Thị Xuân", email: "xuan.lam@example.com", phone: "0978901543", role: "ADMIN" },
    { full_name: "Mai Văn Yến", email: "yen.mai@example.com", phone: "0989012654", role: "CUSTOMER" },
    { full_name: "Nông Thị Zizi", email: "zizi.nong@example.com", phone: "0990123765", role: "CUSTOMER" }
  ];

  // Get role IDs
  const customerRole = await prisma.role.findUnique({ where: { name: "CUSTOMER" } });
  const staffRole = await prisma.role.findUnique({ where: { name: "STAFF" } });
  const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });

  // Create users with hashed passwords
  const defaultPassword = "123456";
  const hashedPassword = await hashPassword(defaultPassword);

  for (const user of sampleUsers) {
    let roleId = customerRole?.id;
    if (user.role === "STAFF") roleId = staffRole?.id;
    if (user.role === "ADMIN") roleId = adminRole?.id;

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        full_name: user.full_name,
        email: user.email,
        password: hashedPassword,
        phone: user.phone,
        role_id: roleId!,
        is_active: true
      }
    });
  }

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
