# Hướng dẫn chuyển đổi từ SQL Server sang MySQL

## 1. Cài đặt MySQL

Đảm bảo bạn đã cài đặt MySQL Server trên máy tính. Nếu chưa có, tải về từ: https://dev.mysql.com/downloads/mysql/

## 2. Tạo Database

Chạy file `database_scripts_mysql.sql` để tạo database và các bảng:

```bash
mysql -u root -p < database_scripts_mysql.sql
```

Hoặc mở MySQL Workbench và chạy script.

## 3. Tạo bảng Yêu cầu thay đổi nhân khẩu

Chạy file `create_yeucau_table_mysql.sql`:

```bash
mysql -u root -p < create_yeucau_table_mysql.sql
```

## 4. Insert dữ liệu mẫu

Chạy file `update_taikhoan_and_insert_data_mysql.sql`:

```bash
mysql -u root -p < update_taikhoan_and_insert_data_mysql.sql
```

## 5. Cấu hình application.properties

File `application.properties` đã được cập nhật với cấu hình MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/household_management?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&characterEncoding=UTF-8&useUnicode=true
spring.datasource.username=root
spring.datasource.password=your_password
```

**Lưu ý:** Thay `your_password` bằng mật khẩu MySQL của bạn.

## 6. Cập nhật Dependencies

File `pom.xml` đã được cập nhật để sử dụng MySQL driver thay vì SQL Server driver.

## 7. Khởi động lại Backend

Sau khi cấu hình xong, khởi động lại backend:

```bash
cd KTPM-fe_be/KTPM-create-payment-function/householdmanagement
.\mvnw.cmd spring-boot:run
```

## Các thay đổi chính:

1. **IDENTITY(1,1)** → **AUTO_INCREMENT**
2. **VARCHAR(MAX)** → **TEXT**
3. **BIT** → **TINYINT(1)**
4. **NUMERIC** → **DECIMAL**
5. **GETDATE()** → **CURRENT_TIMESTAMP** hoặc **CURDATE()**
6. **PRINT** → **SELECT** (hoặc bỏ qua)
7. **IF NOT EXISTS** syntax khác
8. **ON DUPLICATE KEY UPDATE** thay cho **IF NOT EXISTS** trong INSERT

## Tài khoản mẫu:

- **Admin (Tổ trưởng):** admin / 123456
- **Tổ phó:** to_pho / 123456
- **Cán bộ quản lý nhân khẩu:** cb_nhankhau / 123456
- **Cán bộ quản lý thu-chi:** cb_thuchi / 123456
- **User (Chủ hộ):** user1 / 123456, user2 / 123456






