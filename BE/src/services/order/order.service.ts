import { prisma } from '../../config/prisma.config';
import * as orderDto from '../../dtos/orders';
import crypto from 'crypto';
import { AppError, ErrorCode } from '../../exeptions';
import { createPayment } from '../payment.service';
import { PaymentMethod } from '../../dtos/payment';


//! Tạm dùng được
export const createOrder = async (
  data: orderDto.OrderCreateRequest,
  user_id: string,
): Promise<orderDto.OrderResponse & { url?: string }> => {
  const id = generateIdOrder(data.province);
  // TODO: Cần tối ưu
  //? 1. Get 1 list variants
  const variants = await Promise.all(
    data.items.map(async (item) => await getVariant(item, prisma)),
  );

  //? 2. Calculate total
  const total = variants.reduce((sum, variant, i) => {
    return sum + variant.price * data.items[i].quantity;
  }, 0);
  const status = data.method !== PaymentMethod.COD ? orderDto.OrderStatus.PENDING : orderDto.OrderStatus.PROCESSING;
  //? 3. Create order
  const order = await prisma.order.create({
    data: {
      id: id,
      user_id: user_id,
      total: total,
      status: status,
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
            status: orderDto.OrderItemStatus.PENDING,
          })),
        },
      },
    },
    include: {
      payment: true,
      order_items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
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
  const payment = await createPayment({ order_id: order.id, payment_method: data.method }, user_id);
  return { ...orderDto.mapOrderToDTO(order), url: payment.url };
};

export const getOrdersByUser = async (
  userId: string,
): Promise<orderDto.OrdersUserListResponse> => {
  const orders = await prisma.order.findMany({
    where: {
      user_id: userId,
    },
    include: {
      payment: true,
      user: true,
      order_items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
  let user
  if (orders.length > 0) {
    user = orders[0].user
  }
  else {
    user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId
      }
    })
  }
  return {
    count: orders.length,
    user: orders[0].user,
    orders: orders.map(orderDto.mapOrderToDTO),
  };
};

export const getAllOrders = async (
  query: orderDto.OrderListQuery,
): Promise<orderDto.OrderListResponse> => {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    status,
    start_date,
    end_date,
    min_price,
    max_price,
    search,
  } = query;

  let where: any = {};
  if (status) {
    where.status = status;
  }

  if (start_date || end_date) {
    where.create_at = {};
    if (start_date) {
      where.create_at.gte = new Date(start_date);
    }
    if (end_date) {
      const endDate = new Date(end_date);
      endDate.setDate(endDate.getDate() + 1);
      where.create_at.lte = endDate;
    }
  }

  if (min_price || max_price) {
    where.total = {};
    if (min_price) {
      where.total.gte = min_price;
    }
    if (max_price) {
      where.total.lte = max_price;
    }
  }

  if (search) {
    where.OR = [
      { id: { contains: search, mode: 'insensitive' } },
      { product: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }
  const [totalOrders, orders] = await prisma.$transaction([
    // Đếm tổng số bản ghi (Không áp dụng phân trang)
    prisma.order.count({ where }),

    // Truy vấn danh sách đơn hàng
    prisma.order.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit, // Offset
      take: limit, // Limit
      include: {
        payment: true,
        order_items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    count: totalOrders,
    orders: orders.map(orderDto.mapOrderToDTO),
  };
};


/**
 * generate order_id theo định dạng 'ORD-yyymmdd-HCM-123456'
 * @param province
 * @returns
 */
const generateIdOrder = (province: string) => {
  // 1. Ngày theo định dạng YYYYMMDD
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // 20251017

  // 2. Province code (3 ký tự in hoa, bỏ dấu)
  const provincePart = province
    .normalize('NFD') // bỏ dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .split(/\s+/) // tách theo khoảng trắng
    .map((word) => word[0]) // lấy chữ cái đầu mỗi từ
    .join('');

  // 3. Random 6 ký tự để tránh trùng
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();

  return `ORD-${datePart}-${provincePart}-${randomPart}`;
};

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
