import { Prisma } from '@prisma/client';
import { OrderResponse } from './order.response';
import { OrderItemResponse } from './order-item.response';
type OrderWithItemPrisma = Prisma.OrderGetPayload<{
  include: {
    order_items: {
      include: {
        variant: {
          include: {
            product: true;
          };
        };
      };
    };
  };
}>;


export const mapOrderToDTO = (order: OrderWithItemPrisma): OrderResponse => {
  return {
    id: order.id,
    user_id: order.user_id,
    total: order.total,
    status: order.status,
    province: order.province,
    ward: order.ward,
    detail: order.detail,
    note: order.note ?? undefined,
    create_at: order.create_at,
    deliver_at: order.deliver_at ? order.deliver_at : undefined,
    order_items: order.order_items.map(mapOrderItemsToDTO),
  };
};

const mapOrderItemsToDTO = (
  item: OrderWithItemPrisma['order_items'][number],
): OrderItemResponse => {
  return {
    id: item.id,
    price_per_item: item.price_per_item,
    quantity: item.quantity,
    product_variant: mapProductVariantToDTO(item.variant),
  };
};

const mapProductVariantToDTO = (
  variant: OrderWithItemPrisma['order_items'][number]['variant'],
) => {
  return {
    id: variant.id,
    product_id: variant.product_id,
    color: variant.color ?? undefined,
    storage: variant.storage ?? undefined,
    name: variant.product.name,
    price: variant.price,
  };
};
