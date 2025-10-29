import { vnpay } from "../config/vnpay.default"
import { ProductCode, VerifyReturnUrl, VnpLocale, dateFormat } from "vnpay";
import { VnpayQuery } from "../dtos/payment/vnpay-query.request";
import { AppError, ErrorCode } from "../exeptions";

export const getPaymentUrl = async (total: number, order_id: string, payment_id: string) => {
    return vnpay.buildPaymentUrl({
        vnp_Amount: total,
        vnp_TxnRef: payment_id,
        vnp_OrderInfo: `Thanh toan don hang ${order_id}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: process.env.REDIRECT_VNPAY_URL || "",
        vnp_CreateDate: dateFormat(new Date()),
        // vnp_ExpireDate: dateFormat(new Date(Date.now() + 5 * 60 * 60)),
        vnp_Locale: VnpLocale.VN,
        vnp_IpAddr: "127.0.0.1",
    })
}

export const verifyHash = ( query: VnpayQuery): VerifyReturnUrl => {
    const verify = vnpay.verifyReturnUrl(query)
    if (!verify.isSuccess) {
        console.log("vnpay verify return false");
        throw new AppError(ErrorCode.BAD_REQUEST, verify.message);
    }
    return verify
}