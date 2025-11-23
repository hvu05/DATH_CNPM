USE project1;
-- USER TABLE
INSERT INTO User( id, full_name, email, password, phone, role_id, is_active, avatar, update_at, create_at )
values 
( 1, 'admin', 'admin@gmail.com', '123456', '0123456789', 3, 1, null, '2025-11-10 12:00:01', '2025-11-10 12:00:01' ),
( 2, 'seller', 'seller@gmail.com', '123456', '0123456789', 2, 1, null, '2025-11-11 12:00:01', '2025-11-11 12:00:01' ),
( 3, 'customer', 'customer@gmail.com', '123456', '0123456789', 1, 1, null, '2025-11-12 12:00:01', '2025-11-12 12:00:01' ),
( 4, 'test4', 'test4@gmail.com', '123456', '0123456789', 1, 1, null, '2025-11-13 12:00:01', '2025-11-13 12:00:01' ),
( 5, 'test5', 'test5@gmail.com', '123456', '0123456789', 1, 1, null, '2025-11-14 12:00:01', '2025-11-14 12:00:01' );
-- Order table
USE project1;
INSERT INTO `Order`( id, user_id, total, `status`, create_at, ward, detail, note, deliver_at, province )
-- 1000 -> 1 san pham
values
( 1, 5, 1000, 'PENDING', '2025-10-10 12:00:01', 'Pho Cuong', 'detail cai j', 'note cai gi', '2025-12-10 12:00:01', 'Quang Ngai' ),
( 2, 4, 2000, 'RETURN_REQUEST', '2025-10-11 12:00:02', 'Pho Quang', 'detail cai j', 'note cai gi', '2025-12-10 12:00:01', 'Quang Ngai' ), 
( 3, 3, 3000, 'PROCESSING', '2025-10-10 12:00:01', 'Pho Cuong', 'detail cai j', 'note cai gi', '2025-12-10 12:00:01', 'Quang Ngai' ), 
( 4, 2, 1000, 'DELIVERING', '2025-10-14 12:00:01', 'Pho Thanh', 'detail cai j', 'note cai gi', '2025-12-10 12:00:01', 'Quang Ngai' ), 
( 5, 1, 1000, 'COMPLETED', '2025-10-15 12:00:01', 'New York', 'detail cai j', 'note cai gi', '2025-12-10 12:00:01', 'Quang Ngai' ),
( 6, 1, 1000, 'RETURN_REQUEST', '2025-10-15 12:00:01', 'New York', 'detail cai j', 'note cai gi', '2025-12-10 12:00:01', 'Quang Ngai' );
-- Product table
USE project1; 
INSERT INTO `Product`( id, name, description, quantity, brand_id, is_active, series_id, category_id, create_at, update_at ) values
( 10, 'Macbook1', 'desc', 1000, 1, 1, 1, 1, '2025-10-11 11:00:01', '2025-10-11 11:00:01' ), 
( 11, 'Macbook2', 'desc', 2000, 1, 1, 2, 1, '2025-10-11 11:00:02', '2025-10-11 11:00:02' ),
( 12, 'Dell3', 'desc', 3000, 3, 1, 2, 1, '2025-10-11 11:00:03', '2025-10-11 11:00:03' ),
( 13, 'Dell4', 'desc', 4000, 3, 1, 1, 1, '2025-10-11 11:00:02', '2025-10-11 11:00:02' ),
( 14, 'Asus5', 'desc', 5000, 2, 1, 2, 1, '2025-10-11 11:00:02', '2025-10-11 11:00:02' );
-- Product variant
USE project1;
INSERT INTO `ProductVariant`(id, product_id, color, storage, import_price, price, quantity, create_at)
values
(1, 10, 'black', '512 MB', 500,1000, 500, '2025-10-10 12:00:01'),
(2, 10, 'white', '12 GB', 400, 1000, 500, '2025-10-10 12:00:02'),
(1, 11, 'black', '64 GB', 100, 1000, 1000, '2025-10-12 12:00:01'),
(2, 11, 'white', '24 GB', 100, 1000, 1000, '2025-10-12 12:00:01'),
(1, 12, 'black', '24 GB', 100, 1000, 3000, '2025-10-13 12:00:01');
-- Order item table
Use project1;
INSERT INTO `OrderItem`(id, order_id, product_id, product_variant_id, quantity, price_per_item, `status`)
values
-- Order 1: PENDING
(1, 1, 10, 1, 1, 1000, 'PENDING'),
-- Order 4: DELIVERING
(2, 4, 10, 2, 1, 1000, 'DELIVERING'),
-- Order 5: COMPLETED
(3, 5, 11, 1, 1, 1000, 'COMPLETED'),
-- Order 2: RETURN_REQUEST
(4, 2, 12, 1, 1, 1000, 'RETURN_REQUEST'),
(5, 2, 11, 2, 1, 1000, 'RETURN_REQUEST'),
-- Order 3: PROCESSING
(6, 3, 10, 1, 1, 1000, 'PROCESSING'),
(7, 3, 10, 2, 1, 1000, 'PROCESSING'),
(8, 3, 11, 1, 1, 1000, 'PROCESSING'),
-- Order 6: RETURN_REQUEST
(9, 6, 11, 1, 1, 1000, 'RETURN_REQUEST');
-- Payment table
USE project1;
INSERT INTO `Payment`(id, order_id, amount, method, payment_status, transaction_code, create_at, update_at, user_id)
values
(1, 1, 1000, 'COD', 'PENDING', 'cod1', '2025-12-30 12:00:01', '2025-12-30 12:00:02', 5),
(2, 4, 1000, 'VNPAY', 'SUCCESS', 'vnpay2', '2025-12-30 12:00:02', '2025-12-30 12:00:02', 2),
(3, 5, 1000, 'VNPAY', 'FAILED', 'vnpay3', '2025-12-30 12:00:03', '2025-12-30 12:00:03', 1),
(4, 2, 2000, 'VNPAY', 'SUCCESS', 'vnpay4', '2025-12-30 12:00:04', '2025-12-30 12:00:04', 4),
(5, 3, 3000, 'VNPAY', 'SUCCESS', 'vnpay5', '2025-12-30 12:00:05', '2025-12-30 12:00:05', 3),
(6, 6, 1000, 'COD', 'SUCCESS', 'cod6', '2025-12-30 12:00:05', '2025-12-30 12:00:05', 1);