import { prisma } from '../config/prisma.config';
import { CartCreateRequest } from '../dtos/cart/cart-create.reques';
import { CartResponse } from '../dtos/cart/cart-list-response';
import { AuthPayload } from '../types/auth-payload';
import { mapToCartDTO } from '../dtos/cart/helper';

export const createCart = async (
  data: CartCreateRequest,
  user: AuthPayload,
): Promise<CartResponse> => {
  const existing = await prisma.cartItem.findFirst({
    where: {
      user_id: user.id,
      product_id: data.product_id,
      product_variant_id: data.product_variant_id,
    },
    orderBy: { id: 'desc' },
    select: { id: true },
  });
  let cart ; 
  if (existing) {
    cart = await prisma.cartItem.update({
      where: {
        id_user_id: {
          id: existing.id,
          user_id: user.id,
        }
      },
      data: {
        quantity: {
          increment: data.quantity,
        },
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
      }
    });
  }
  else {
    const lastId = await prisma.cartItem.findFirst({
      where: {
        user_id: user.id,
      },
      orderBy: { id: 'desc' },
      select: { id: true },
    })
    const nextId = (lastId?.id ?? 0) + 1;
    cart = await prisma.cartItem.create({
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
  }
  
  // id: z.number(),
  //     product_id: z.number(),
  //     thumbnail: z.string().optional(),
  //     color: z.string().optional(),
  //     storage: z.string().optional(),
  //     name: z.string(),
  //     price: z.number(),
  return mapToCartDTO(cart);
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
  return cart.map(mapToCartDTO);
};

export const deleteCart = async (id: number, user: AuthPayload) => {
  await prisma.cartItem.deleteMany({
    where: {
      id: id,
      user_id: user.id,
    },
  });
  return getCart(user);
};

export const updateCart = async (
  id: number,
  quantity: number,
  user: AuthPayload,
) => {
  const cart = await prisma.cartItem.update({
    where : {
      id_user_id: {
        id: id,
        user_id: user.id
      }
    },
    data: {
      quantity: quantity,
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
    }
  });
  return mapToCartDTO(cart);
};
