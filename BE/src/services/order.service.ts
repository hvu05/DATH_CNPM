import { prisma } from '../config/prisma.config';
import * as orderDto from '../dtos/orders';
import crypto from 'crypto';
import { AppError, ErrorCode } from '../exeptions';

//! Tạm dùng được
export const createOrder = async (
  data: orderDto.OrderCreateRequest,
  user_id: string,
) => {
  const id = generateIdOrder(data.province);
  // TODO: Cần tối ưu
  //? 1. Get 1 list variants
  const variants = await Promise.all(
    data.items.map(async (item) => await getVariant(item, prisma)),
  );

  //? 2. Calculate total
  const total = variants.reduce((sum, variant, i) => {
    return sum + variant.price * data.items[i].quantity;
  },0);

  //? 3. Create order
  const order = await prisma.order.create({
    data: {
      id: id,
      user_id: user_id,
      total: total,
      status: 'PENDING',
      province: data.province,
      ward: data.ward,
      detail: data.detail,
      note: data.note,
      order_items: {
        createMany: {
          data: data.items.map((item, index) => ({
            id: index + 1,
            product_id: item.product_id,
            product_variant_id: item.product_variant_id,
            price_per_item: variants[index].price,
            quantity: item.quantity,
          })),
        },
      },
    },
    include: {
      order_items: true,
    },
  });

  //? 4. Cập nhật tồn kho
  await Promise.all(
    data.items.map((item, i) =>
      prisma.productVariant.update({
        where: {
          variant_id: {
            product_id: item.product_id,
            id: item.product_variant_id,
          },
        },
        data: { quantity: { decrement: item.quantity } },
      }),
    ),
  );
  return order;
};

export const getOrdersOfUser = async (user_id: string) => {
  return await prisma.order.findMany({
    where: {
      user_id: user_id,
    },
    include: {
      order_items: true,
      payment: true,
    },
  });
};

/**
 * generate order_id theo định dạng 'ORD-yyymmdd-HCM-123456'o
 * @param province 
 * @returns 
 */
const generateIdOrder = (province: string) => {
  // 1. Ngày theo định dạng YYYYMMDD
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // 20251017

  // 2. Province code (3 ký tự in hoa, bỏ dấu)
  const provincePart = province
    .normalize('NFD')                    // bỏ dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .split(/\s+/)                        // tách theo khoảng trắng
    .map(word => word[0])                // lấy chữ cái đầu mỗi từ
    .join('');

  // 3. Random 6 ký tự để tránh trùng
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();

  return `ORD-${datePart}-${provincePart}-${randomPart}`;
};

// const calculateTotalItemPrice = async (item: orderDto.OrderItemCreateRequest) => {
//   // const product = await prisma.product.findUnique({
//   //   where: {
//   //     id: item.product_id,
//   //   },
//   // })
//   // if (!product) throw new AppError(ErrorCode.NOT_FOUND, "Không tìm thấy Product");
//   const productVariant = await prisma.productVariant.findUnique({
//     where: {
//       variant_id: {
//         product_id: item.product_id,
//         id : item.product_variant_id
//       }
//     },
//   })
//   if (!productVariant) throw new AppError(ErrorCode.NOT_FOUND, "Không tìm thấy Product Variant");
//   if (productVariant.quantity < item.quantity) throw new AppError(ErrorCode.BAD_REQUEST, "Không đủ số lượng");
//   return productVariant.price * item.quantity
// }

const getVariant = async (
  item: orderDto.OrderItemCreateRequest,
  prismaInstance: any = prisma,
) => {
  const productVariant = await prismaInstance.productVariant.findUnique({
    where: {
      variant_id: {
        product_id: item.product_id,
        id: item.product_variant_id,
      },
    },
  });
  if (!productVariant)
    throw new AppError(ErrorCode.NOT_FOUND, 'Không tìm thấy Product Variant');
  if (productVariant.quantity < item.quantity)
    throw new AppError(ErrorCode.BAD_REQUEST, 'Không đủ số lượng');
  return productVariant;
};
