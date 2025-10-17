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