import { ca } from 'zod/v4/locales';
import { prisma } from '../config/prisma.config';
import { CartCreateRequest } from '../dtos/cart/cart-create.reques';
import { CartResponse } from '../dtos/cart/cart-list-response';
import { AuthPayload } from '../types/auth-payload';

export const createCart = async (
  data: CartCreateRequest,
  user: AuthPayload,
): Promise<CartResponse> => {
  const lastId = await prisma.cartItem.findFirst({
    where: {
      user_id: user.id,
    },
    orderBy: { id: 'desc' },
    select: { id: true },
  });
  const nextId = (lastId?.id ?? 0) + 1;
  const cart = await prisma.cartItem.create({
    data: {
      id: nextId,
      product_id: data.product_id,
      product_variant_id: data.product_variant_id,
      quantity: data.quantity,
      user_id: user.id,
      thumbnail_id: 0,
    },
    include: {
      product_variant: {
        include: {
          product: {
            include: {
              product_image: {
                where: {
                  is_thumbnail: true,
                },
                select: {
                  image_url: true,
                },
              },
            },
          },
        },
      },
    },
  });
  // id: z.number(),
  //     product_id: z.number(),
  //     thumbnail: z.string().optional(),
  //     color: z.string().optional(),
  //     storage: z.string().optional(),
  //     name: z.string(),
  //     price: z.number(),
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
};

export const getCart = async (user: AuthPayload): Promise<CartResponse[]> => {
  const cart = await prisma.cartItem.findMany({
    where: {
      user_id: user.id,
    },
    include: {
      product_variant: {
        include: {
          product: {
            include: {
              product_image: {
                where: {
                  is_thumbnail: true,
                },
                select: {
                  image_url: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!cart) {
    return [];
  }
  return cart.map((item) => ({
    ...item,
    product_variant: {
      id: item.product_variant.id,
      product_id: item.product_variant.product_id,
      color: item.product_variant.color ?? undefined,
      storage: item.product_variant.storage ?? undefined,
      name: item.product_variant.product.name,
      price: item.product_variant.price,
      thumbnail:
        item.product_variant.product?.product_image?.[0]?.image_url ||
        undefined,
    },
    thumbnail: item.product_variant.product.product_image[0].image_url,
  }));
};
