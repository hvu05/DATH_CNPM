import { prisma } from '../config/prisma.config';
import * as orderDto from '../dtos/orders';
import crypto from 'crypto';
export const createOrder = async (data : orderDto.OrderCreateRequest, user_id : string) => {
  // TODO
  const id = generateIdOrder(user_id, data.province);
  const order = await prisma.order.create({
    data:{
      id : id ,
      user_id : user_id,
      total : 0,
      status : "PENDING",
      province : data.province,
      ward : data.ward,
      detail : data.detail,
      note : data.note
    }
  })
}

export const generateIdOrder = (
  userId: string | number,
  province: string
) => {
  // 1. Ngày theo định dạng YYYYMMDD
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // 20251017

  // 2. Province code (3 ký tự in hoa, bỏ dấu)
  const provincePart = province
    .normalize("NFD") // remove accent
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .slice(0, 3);

  // 3. Random 6 ký tự để tránh trùng
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `ORD-${datePart}-${provincePart}-${randomPart}`;
};
