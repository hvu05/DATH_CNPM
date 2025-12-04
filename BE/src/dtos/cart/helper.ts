import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.config";

type CartItemPrisma = Prisma.CartItemGetPayload<{
  include: {
    product_variant: {
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
            }
          };
        };
      };
    };
  };
}>

export const mapToCartDTO = (cart: CartItemPrisma) => {
  return {
    ...cart,
    product_variant: {
      id: cart.product_variant.id,
      product_id: cart.product_variant.product_id,
      color: cart.product_variant.color ?? undefined,
      storage: cart.product_variant.storage ?? undefined,
      name: cart.product_variant.product.name,
      price: cart.product_variant.price,
      thumbnail:
        cart.product_variant.product?.product_image?.[0]?.image_url ||
        undefined,
    },
    thumbnail: cart.product_variant.product.product_image[0].image_url,
  };
}