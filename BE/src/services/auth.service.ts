import { prisma } from '../config/prisma.config';
import { compareSync } from 'bcrypt-ts' ;
import { JwtPayload } from 'jsonwebtoken';

import * as authDto from '../dtos/auth';
import { AppError } from '../exeptions/app-error';
import { ErrorCode } from '../exeptions/error-status';
import { generateToken } from '../utils/jwt.utils';
import { generateOTP } from '../utils/otp.utils';
import { transporter } from '../config/nodemailer.config';
import { createUser } from './user.service';
import { UserResponse } from '../dtos/users';

/**
 * Đăng nhập với email và password
 * @param data LoginRequest { email : string, password : string}
 * @returns LoginResponse { access_token : string, refresh_token : string}
 */
export const login = async (data : authDto.LoginRequest) : Promise<authDto.LoginResponse> => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
    include: {
      role: true,
    },
  }) ;
  if(!user) throw new AppError(ErrorCode.NOT_FOUND,`Người dùng với email ${data.email} khong ton tai`);
  const isPasswordValid = compareSync(data.password, user.password);
  if(!isPasswordValid) throw new AppError(ErrorCode.BAD_REQUEST, "Mat khau khong dung");
  const payload : JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role.name,
    full_name: user.full_name,
  };
  const access_token = generateToken(payload);
  const refresh_token = generateToken({ id: user.id }, "7d");
  return { access_token: access_token, refresh_token: refresh_token };
}

/**
 * Người dùng đăng ký tài khoản với otp đã đuoc gửi tới email
 * @param data RegisterRequest
 * @returns UserResponse
*/
export const register = async (data : authDto.RegisterRequest) : Promise<UserResponse>=> {
  const {otp_code, ...userData} = data;
  const otpEntity = await prisma.otp.findUnique({
    where: {
      email: userData.email
    }
  })
  if(!otpEntity) throw new AppError(ErrorCode.NOT_FOUND, "Không tìm thấy OTP");
  
  if(otpEntity.code !== otp_code){
    const newLimit = otpEntity.limit - 1 ;
    if (newLimit <= 0) {
      await prisma.otp.delete({
        where: {
          id: otpEntity.id
        }
      })
      throw new AppError(ErrorCode.BAD_REQUEST, "OTP đã hết lượt sử dụng");
    }

    await prisma.otp.update({
      where: {
        id: otpEntity.id
      },
      data: {
        limit: newLimit
      }
    })
    throw new AppError(ErrorCode.BAD_REQUEST, "OTP không hợp lệ");
  }

  if(otpEntity.expire_at.getTime() < Date.now()){
    await prisma.otp.delete({
      where: {
        id: otpEntity.id
      }
    })
    throw new AppError(ErrorCode.BAD_REQUEST, "OTP đã hết hạn sử dụng");
  }
  const user : UserResponse = await createUser(userData);
  return user;
}

/**
 * 
 * @param email
 */
export const sendOtpForRegister = async (email : string) : Promise<void> => {
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  })
  if(user) throw new AppError(ErrorCode.CONFLICT,'User already exists');
  const otpCode = generateOTP();
  const otp = await prisma.otp.create({
    data: {
      email: email,
      code: otpCode,
      expire_at : new Date(Date.now() + 5 * 60 * 1000)
    }
  })

  //? Có thể sẽ tách ra làm 1 service riêng
  const mailOptions = {
    to: email, //? Có thể sẽ kiểm tra xem email có tồn tại không
    subject: "OTP Verification",
    text: `Your OTP for verification is ${otpCode}`,  
  };
  console.log(`[OTP] OTP sẽ được gửi tới email ${email} với mã : [ ${otpCode} ]`);

  //? Không chờ gửi mail thành công / Gửi mail bất đồng bộ
  transporter.sendMail(mailOptions);

}