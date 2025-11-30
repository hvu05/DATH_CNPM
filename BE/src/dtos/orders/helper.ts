import { Prisma } from '@prisma/client';
import { OrderResponse } from './order.response';
import { OrderItemResponse } from './order-item.response';
import { toPaymentResponse } from '../payment';
import { OrderReturnResponse } from './order-return.response';
type OrderWithItemPrisma = Prisma.OrderGetPayload<{
  include: {
    payment: true;
    order_items: {
      include: {
        variant: {
          include: {
            product: {
              include: {
                product_image: {
                  where: {
                    is_thumbnail: true;
                  };
                  select: {
                    image_url: true;
                  };
                };
              };
            };
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
    // province: order.province,
    // ward: order.ward,
    // detail: order.detail,
    address: mapAddressToDTO(order),
    note: order.note ?? undefined,
    create_at: order.create_at,
    deliver_at: order.deliver_at ? order.deliver_at : undefined,
    payment: order.payment ? toPaymentResponse(order.payment) : undefined,
    order_items: order.order_items.map(mapOrderItemsToDTO),
  };
};

const mapAddressToDTO = (address: OrderWithItemPrisma | any): any => {
  return {
    id: address.id,
    province: address.province,
    ward: address.ward,
    detail: address.detail,
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
    status: item.status,
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
    thumbnail: variant.product?.product_image?.[0]?.image_url || undefined,
  };
};

const mapProductVariantToDTOForReturn = (
  variant: OrderReturnWithItemPrisma['order_item']['variant'],
) => {
  return {
    id: variant.id,
    product_id: variant.product_id,
    color: variant.color ?? undefined,
    storage: variant.storage ?? undefined,
    name: variant.product.name,
    price: variant.price,
    thumbnail: variant.product?.product_image?.[0]?.image_url || undefined,
  };
};

type OrderReturnWithItemPrisma = Prisma.ReturnOrderRequestGetPayload<{
  include: {
    images: true;
    order: true;
    order_item: {
      include: {
        variant: {
          include: {
            product: {
              include: {
                product_image: {
                  where: {
                    is_thumbnail: true;
                  };
                  select: {
                    image_url: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

export const mapOrderReturnToDTO = (
  request: OrderReturnWithItemPrisma,
): OrderReturnResponse => {
  return {
    create_at: request.create_at,
    update_at: request.update_at,
    order: {
      id: request.order.id,
      user_id: request.order.user_id,
      total: request.order.total,
      status: request.order.status,
      address: mapAddressToDTO(request.order),
      deliver_at: request.order.deliver_at
        ? request.order.deliver_at
        : undefined,
    },
    order_item: {
      id: request.order_item.id,
      price_per_item: request.order_item.price_per_item,
      quantity: request.order_item.quantity,
      product_variant: mapProductVariantToDTOForReturn(
        request.order_item.variant,
      ),
    },
    reason: request.reason,
    images: request.images.map((image) => image.image_url),
  };
};
