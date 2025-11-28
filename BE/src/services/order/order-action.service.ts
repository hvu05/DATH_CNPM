import { prisma } from "../../config/prisma.config";
import { AppError, ErrorCode } from "../../exeptions";
import * as orderDto from "../../dtos/orders";
import { PaymentMethod, PaymentStatus } from "../../dtos/payment";
import { InventoryType } from "../../dtos/inventory/enum";

const updateHandler = async (
  orderId: string,
  data: orderDto.OrderStatus,
): Promise<orderDto.OrderResponse> => {
  try {
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: data,
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
    return orderDto.mapOrderToDTO(updatedOrder);
  } catch (error: any) {
    if (
      error.code === 'P2025' ||
      (error instanceof Error &&
        error.message.includes('Record to update not found'))
    ) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Không tìm thấy Order');
    }
    throw new AppError(ErrorCode.BAD_REQUEST, 'Không thành công');
  }
};
// /**
//  * Staff xác nhận đơn hàng
//  * @param orderId 
//  * @returns 
//  */
// export const confirm = async (orderId: string) => {
//   const order = await prisma.order.findFirst({
//     where: {
//       id: orderId,
//     },
//   });
//   if (!order) {
//     throw new AppError(ErrorCode.NOT_FOUND, 'Không tìm thấy Order');
//   }
//   if (order.status !== orderDto.OrderStatus.PENDING) {
//     throw new AppError(ErrorCode.BAD_REQUEST, 'Trang thai khong hop le');
//   }
//   return updateHandler(orderId, orderDto.OrderStatus.CONFIRMED);
// };

/**
 * Khách hàng hoặc Staff huỷ đơn hàng (Trước khi vận chuyển)
 * @param orderId 
 * @param userId 
 * @returns 
 */
export const cancel = async (orderId: string, userId?: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      order_items: {
        include: {
          variant: true,
        },
      },
    },
  });
  if (!order) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Không tìm thấy Order');
  }
  if (
    order.status !== orderDto.OrderStatus.PENDING 
    &&
    order.status !== orderDto.OrderStatus.PROCESSING
  ) {
    throw new AppError(ErrorCode.BAD_REQUEST, 'Không thể huỷ đơn hàng');
  }
  if (userId && order.user_id !== userId) {
    throw new AppError(
      ErrorCode.FORBIDDEN,
      'Người dùng không có quyền chỉnh sửa đơn hàng của người khác',
    );
  }
  await prisma.$transaction(
    order.order_items.flatMap((item) => [
      prisma.payment.update({
        where: {
          order_id: orderId,
        },
        data: {
          payment_status: PaymentStatus.FAILED,
        },
      }),
      prisma.orderItem.update({
          where: {
            item_id: {
              id: item.id,
              order_id: orderId
            }
          },
          data: {
            status: orderDto.OrderItemStatus.CANCELLED,
          },
        }),
        prisma.productVariant.update({
          where: {
            variant_id: {
              product_id: item.variant.product_id,
              id: item.variant.id,
            },
          },
          data: {
            quantity: { increment: item.quantity },
          },
        }),
    ]
    ),
  );
  return updateHandler(orderId, orderDto.OrderStatus.CANCELLED);
};

// /**
//  * Bắt đầu đóng gói hàng
//  * @param orderId 
//  * @returns 
//  */
// export const process = async (orderId: string) => {
//   const order = await prisma.order.findFirst({
//     where: {
//       id: orderId,
//     },
//   });
//   if (!order) {
//     throw new AppError(ErrorCode.NOT_FOUND, 'Không tìm thấy Order');
//   }
//   if (order.status !== orderDto.OrderStatus.CONFIRMED) {
//     throw new AppError(ErrorCode.BAD_REQUEST, 'Trang thai khong hop le');
//   }
//   return updateHandler(orderId, orderDto.OrderStatus.PROCESSING);
// };

/**
 * Đã giao cho đơn vị vận chuyển
 * @param orderId 
 * @returns 
 */
export const deliver = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      order_items: {
        include: {
          variant: true,
        },
      },
    }
  });
  if (!order) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Không tìm thấy Order');
  }
  await prisma.inventoryLog.createMany({
    data: order.order_items.map((item) => ({
      product_id: item.variant.product_id,
      product_variant_id: item.variant.id,
      quantity: item.quantity,
      type: InventoryType.OUT,
      reason: `Xuất hàng cho đơn hàng ${orderId}`,
    })),
  }) 
  if (order.status !== orderDto.OrderStatus.PROCESSING) {
    throw new AppError(ErrorCode.BAD_REQUEST, 'Trang thai khong hop le');
  }
  return updateHandler(orderId, orderDto.OrderStatus.DELIVERING);
};

/**
 * Bên vận chuyển confirm, hiện tại thì do staff làm thủ công
 * @param orderId 
 * @returns 
 */
export const complete = async (orderId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      payment: true
    }
  });
  if (!order) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Không tìm thấy Order');
  }
  if (order.status !== orderDto.OrderStatus.DELIVERING) {
    throw new AppError(ErrorCode.BAD_REQUEST, 'Trang thai khong hop le');
  }
  await prisma.orderItem.updateMany({
    where: {
      order_id: orderId,
    },
    data: {
      status: orderDto.OrderItemStatus.COMPLETED,
    },
  });
  if (order.payment?.method == PaymentMethod.VNPAY) {
    await prisma.payment.update({
      where: {
        order_id: orderId
      },
      data: {
        payment_status: PaymentStatus.SUCCESS
      }
    })
  }
  return updateHandler(orderId, orderDto.OrderStatus.COMPLETED);
};

/**
 * ! Chưa xác định được nghiệp vụ
 * ? May be: Staff hoàn trả tiền cho khách hàng trên hệ thống
 * @param orderId
 * @param order_item_id
 * @returns
 */
export const refunded = async (orderId: string, order_item_id: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
  });
  if (!order) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Không tìm thấy Order');
  }
  if (
    order.status !== orderDto.OrderStatus.RETURNED &&
    order.status !== orderDto.OrderStatus.COMPLETED
  ) {
    throw new AppError(ErrorCode.BAD_REQUEST, 'Trang thai khong hop le');
  }
  return updateHandler(orderId, orderDto.OrderStatus.REFUNDED);
};


