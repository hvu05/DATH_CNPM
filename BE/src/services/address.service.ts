import { AddressCreateRequest, AddressListResponse } from "../dtos/users";
import { prisma } from "../config/prisma.config";

export const createAddress = async (data : AddressCreateRequest, id? : string) : Promise<AddressListResponse> => {
  const user = await prisma.user.findUnique({where: {id}}) ;
  if(!user) throw new Error("Không tìm thấy User") ;
  
  const lastAddress = await prisma.address.findFirst({
    where: { user_id: id },
    orderBy: { id: "desc" },  // Sắp xếp theo id giảm dần để lấy lớn nhất
  });
  const nextId = (lastAddress?.id ?? 0) + 1;
 
  await prisma.address.create({
    data: {
      id: nextId,
      province: data.province,
      ward: data.ward,
      detail: data.detail,
      user : {
        connect : {
          id : user.id
        }
      }
    },
  });
  const allAddresses = await prisma.address.findMany({
    where: { user_id: user.id },
    select: {
      id: true,
      province: true,
      ward: true,
      detail: true
    },
    orderBy: { id: "asc" }, // sắp xếp tăng dần cho đẹp
  });

   return {
    user_id: user.id,
    addresses: allAddresses,
  };
}

export const getAddressList = async (user_id: string) : Promise<AddressListResponse> => {
  const addresses = await prisma.address.findMany({
    where: { user_id: user_id },
    select: {
      id: true,
      province: true,
      ward: true,
      detail: true
    },
    orderBy: { id: "asc" }, // sắp xếp tăng dần cho đẹp
  });
  return {
    user_id: user_id,
    addresses
  }
}

export const updateAddress = async (id: number, user_id: string, data: AddressCreateRequest) => {
  await prisma.address.update({
    where: {
      id_user_id: {
        id: id,
        user_id: user_id
      }
    },
    data: {
      province: data.province,
      ward: data.ward,
      detail: data.detail,
    },
  });
  return getAddressList(user_id);
}

export const deleteAddress = async (id: number, user_id: string) => {
  await prisma.address.delete({
    where: {
      id_user_id: {
        id: id,
        user_id: user_id
      }
    }
  });
  return getAddressList(user_id);
}