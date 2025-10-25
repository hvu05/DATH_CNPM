import { vnpay } from "../config/vnpay.default"
import { ProductCode, VnpLocale, dateFormat } from "vnpay";

export const getPaymentUrl = async (total: number, order_id: string) => {
    return vnpay.buildPaymentUrl({
        vnp_Amount: total,
        vnp_TxnRef: order_id,
        vnp_OrderInfo: `Thanh toan don hang ${order_id}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: process.env.REDIRECT_VNPAY_URL || "",
        vnp_CreateDate: dateFormat(new Date()),
        // vnp_ExpireDate: dateFormat(new Date(Date.now() + 5 * 60 * 60)),
        vnp_Locale: VnpLocale.VN,
        vnp_IpAddr: "127.0.0.1"
    })
}