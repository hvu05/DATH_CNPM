
## 1️⃣ Environment Files

### Tạo file `.env` theo mẫu sau

```env
PORT=8080
DATABASE_URL=mysql://<user>:<password>@<port>/<your-db-name>
CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@<your-cloud-name>
IMAGE_SIZE = 5
MAIL_USER = <your-email>
MAIL_PASS = 
```
### Cách lấy `CLOUDINARY_URL`  
```
[→](https://cloudinary.com/documentation/developer_onboarding_faq_find_credentials)
```
### Cách lấy `MAIL_PASS` 
```
1. Manage your Google Account → Security → 2-Step Verification → Enable
2. Truy cập (https://myaccount.google.com/apppasswords)
3. Chọn email --- nên dùng email ít sử dụng
4. Nhập Appname
5. Copy password và paste vào `MAIL_PASS`
```
## 2️⃣ Cho lần đầu chạy

### Cách 1: Sử dụng script tự động (Linux mới chơi được) 
```bash
# Chạy script setup một lần
./setup.sh

# Khởi động server
./start.sh
```

### Cách 2: Thủ công
```bash
  npm install
  npm run prisma:remigrate
  npm run db:seed
  npm run dev
```

## 3️⃣ Các lần chạy tiếp theo
```bash
# Khởi động server development
./start.sh
# hoặc
npm run dev
```

