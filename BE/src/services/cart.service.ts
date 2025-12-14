import { prisma } from '../config/prisma.config';
import { CartCreateRequest } from '../dtos/cart/cart-create.reques';
import { CartResponse } from '../dtos/cart/cart-list-response';
import { AuthPayload } from '../types/auth-payload';
import { Prisma, CartItem } from '@prisma/client';

type CartItemWithDetails = Prisma.CartItemGetPayload<{
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
            };
          };
        };
      };
    };
  };
}>;

export const createCart = async (
  data: CartCreateRequest,
  user: AuthPayload,
): Promise<CartResponse> => {
  let existingItem = await prisma.cartItem.findFirst({
    where: {
      user_id: user.id,
      product_variant_id: data.product_variant_id,
      product_id: data.product_id,
    },
  });

  let cartResult: CartItemWithDetails;

  if (existingItem) {
    cartResult = (await prisma.cartItem.update({
      where: {
        id_user_id: { 
            id: existingItem.id,
            user_id: user.id,
        }
      },
      data: {
        quantity: existingItem.quantity + data.quantity, 
      },
      include: {
        product_variant: {
          include: {
            product: {
              include: {
                product_image: {
                  where: { is_thumbnail: true },
                  select: { image_url: true },
                },
              },
            },
          },
        },
      },
    })) as CartItemWithDetails;

  } else {
    const lastId = await prisma.cartItem.findFirst({
      where: {
        user_id: user.id,
      },
      orderBy: { id: 'desc' },
      select: { id: true },
    });
    const nextId = (lastId?.id ?? 0) + 1;

    cartResult = (await prisma.cartItem.create({
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
                  where: { is_thumbnail: true },
                  select: { image_url: true },
                },
              },
            },
          },
        },
      },
    })) as CartItemWithDetails;
  }

  return {
    ...cartResult,
    product_variant: {
      id: cartResult.product_variant.id,
      product_id: cartResult.product_variant.product_id,
      color: cartResult.product_variant.color ?? undefined,
      storage: cartResult.product_variant.storage ?? undefined,
      name: `${cartResult.product_variant.product.name} (${cartResult.product_variant.color} - ${cartResult.product_variant.storage})`,
      price: cartResult.product_variant.price,
      thumbnail:
        cartResult.product_variant.product?.product_image?.[0]?.image_url ||
        undefined,
    },
    thumbnail: cartResult.product_variant.product.product_image[0].image_url,
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
      name: `${item.product_variant.product.name} (${item.product_variant.color} - ${item.product_variant.storage})`,
      price: item.product_variant.price,
      thumbnail:
        item.product_variant.product?.product_image?.[0]?.image_url ||
        undefined,
    },
    thumbnail: item.product_variant.product.product_image[0].image_url,
  }));
};

export const updateCart = async (
  data: CartCreateRequest,
  user: AuthPayload,
): Promise<CartResponse> => {
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      user_id: user.id,
      product_variant_id: data.product_variant_id,
      product_id: data.product_id,
    },
  });

  if (!existingItem) {
    throw new Error('Không tìm thấy sản phẩm trong giỏ hàng để cập nhật.');
  }

  const updatedCart = await prisma.cartItem.update({
    // LỖI: where: { id: existingItem.id } -> SỬA THÀNH:
    where: {
      id_user_id: { // Dùng tên của unique constraint phức hợp
        id: existingItem.id,
        user_id: user.id,
      },
    },
    data: {
      quantity: data.quantity,
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

  // Ánh xạ lại về CartResponse
  return {
    ...updatedCart,
    product_variant: {
      id: updatedCart.product_variant.id,
      product_id: updatedCart.product_variant.product_id,
      color: updatedCart.product_variant.color ?? undefined,
      storage: updatedCart.product_variant.storage ?? undefined,
      name: updatedCart.product_variant.product.name,
      price: updatedCart.product_variant.price,
      thumbnail:
        updatedCart.product_variant.product?.product_image?.[0]?.image_url ||
        undefined,
    },
    thumbnail: updatedCart.product_variant.product.product_image[0].image_url,
  };
};

export const removeCartItem = async (
  variantId: number,
  user: AuthPayload,
): Promise<CartResponse[]> => {
  // 1. Tìm CartItem ID để xóa
  const itemToDelete = await prisma.cartItem.findFirst({
    where: {
      user_id: user.id,
      product_variant_id: variantId,
    },
    select: { id: true },
  });

  if (!itemToDelete) {
    return getCart(user); 
  }

  // 2. Xóa CartItem
  await prisma.cartItem.delete({
    // LỖI: where: { id: itemToDelete.id } -> SỬA THÀNH:
    where: {
      id_user_id: { // Dùng tên của unique constraint phức hợp
        id: itemToDelete.id,
        user_id: user.id, // Phải có user_id
      },
    },
  });

  // 3. Trả về giỏ hàng mới
  return getCart(user);
};