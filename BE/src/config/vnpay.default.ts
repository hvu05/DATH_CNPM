// {
//   "vnp_TmnCode":"",
//   "vnp_HashSecret":"",
//   "vnp_Url":"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
//   "vnp_Api":"https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
//   "vnp_ReturnUrl": "http://localhost:8888/order/vnpay_return"
// }

import { VNPay, ignoreLogger, HashAlgorithm } from "vnpay";
//? Hardcode vnpay
export const vnpay = new VNPay({
  tmnCode: "43QFYXL3",
  secureSecret: "YL9UW56TK7COSV2V3U4092VR5S4UAMLM",
  vnpayHost: "https://sandbox.vnpayment.vn",
  testMode: true,
  hashAlgorithm: HashAlgorithm.SHA512,
  loggerFn: ignoreLogger
})
