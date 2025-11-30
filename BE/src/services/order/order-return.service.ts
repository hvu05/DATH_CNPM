import { prisma } from '../../config/prisma.config';
import { AppError, ErrorCode } from '../../exeptions';
import { AuthPayload } from '../../types/auth-payload';
import { uploadFile } from '../cloudinary.service';
import * as orderDto from '../../dtos/orders';
import { ReturnOrderImage } from '@prisma/client';
import { map } from 'zod';
/**
 * Khách hàng tạo yêu cầu hoàn trả trên hệ thống | Staff tạo yêu cầu hoàn trả trực tiếp tại cửa hàng
 * @param data
 * @param userPayload
 * @param orderId
 * @param orderItemId
 * @returns
 */
export const createOrderReturn = async (
  data: orderDto.OrderReturnRequest,
  user: AuthPayload,
  orderId: string,
  orderItemId: number,
): Promise<orderDto.OrderReturnResponse> => {
  const { reason, images } = data;
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      order_items: true,
    },
  });
  if (!order) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Không tìm thấy Order');
  }
  let uploads: any[] = [];
  if (images?.length) {
    // Upload tất cả ảnh song song
    uploads = await Promise.all(
      images.map(async (image) => {
        const publicId = `${image.originalname}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}`;

        const { url, public_id } = await uploadFile(
          image.buffer,
          publicId,
          'images/order-return',
        );

        return {
          public_id,
          image_url: url,
        };
      }),
    );
  }
  const [request, orderItem] = await prisma.$transaction([
    prisma.returnOrderRequest.create({
      data: {
        order_id: orderId,
        order_item_id: orderItemId,
        reason: reason,
        images: {
          createMany: {
            data: uploads,
          },
        },
      },
      include: {
        order: true,
        order_item: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        images: true,
      },
    }),
    prisma.orderItem.update({
      where: {
        item_id: {
          id: orderItemId,
          order_id: orderId,
        },
      },
      data: {
        status: orderDto.OrderItemStatus.RETURN_REQUEST,
      },
    }),
  ]);
  if (user.role === 'ADMIN' || user.role === 'STAFF') {
    await confirmReturned(orderId, orderItemId, user);
  }

  return orderDto.mapOrderReturnToDTO(request);
};

/**
 * Staff xác nhận việc trả hàng
 * @param orderId
 * @param orderItemId
 * @param staff
 * @returns
 */
export const confirmReturned = async (
  orderId: string,
  orderItemId: number,
  staff: AuthPayload,
) => {
  const order = await prisma.returnOrderRequest.findFirst({
    where: {
      order_id: orderId,
      order_item_id: orderItemId,
    },
    include: {
      order: true,
    },
  });
  if (!order) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Không tìm thấy Order');
  }
  await prisma.$transaction([
    prisma.returnOrderRequest.update({
      where: {
        order_item_id_order_id: {
          order_item_id: orderItemId,
          order_id: orderId,
        },
      },
      data: {
        approved_by: staff.id,
      },
    }),
    prisma.orderItem.update({
      where: {
        item_id: {
          id: orderItemId,
          order_id: orderId,
        },
      },
      data: {
        status: orderDto.OrderItemStatus.RETURNED,
      },
    }),
  ]);

  console.log(
    `[ORDER REFUNDED] GỬi yêu cầu hoàn tiền của order ${orderId} với số tiền ${order.order.total} đến bộ phần kế toán`,
  );
};

export const getOrderReturnDetail = async (
  orderId: string,
  orderItemId: number,
) => {
  const order = await prisma.returnOrderRequest.findFirst({
    where: {
      order_id: orderId,
      order_item_id: orderItemId,
    },
    include: {
      order: true,
      order_item: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
      images: true,
    },
  });
  if (!order) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Không tìm thấy Order');
  }
  return orderDto.mapOrderReturnToDTO(order);
};
