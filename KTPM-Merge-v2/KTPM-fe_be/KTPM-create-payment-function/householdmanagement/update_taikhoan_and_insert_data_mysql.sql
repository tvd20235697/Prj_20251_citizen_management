-- =============================================
-- SCRIPT CẬP NHẬT BẢNG TAIKHOAN VÀ INSERT DỮ LIỆU MẪU - MySQL
-- =============================================

USE household_management;

-- =============================================
-- 1. CẬP NHẬT BẢNG TAIKHOAN
-- =============================================

-- Kiểm tra và thêm cột MANHANKHAU nếu chưa có
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'household_management' 
  AND TABLE_NAME = 'TAIKHOAN' 
  AND COLUMN_NAME = 'MANHANKHAU';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE TAIKHOAN ADD COLUMN MANHANKHAU INT NULL',
    'SELECT "Cột MANHANKHAU đã tồn tại" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm Foreign Key cho MANHANKHAU nếu chưa có
SET @fk_exists = 0;
SELECT COUNT(*) INTO @fk_exists 
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = 'household_management' 
  AND TABLE_NAME = 'TAIKHOAN' 
  AND CONSTRAINT_NAME = 'FK_TAIKHOAN_NHANKHAU';

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE TAIKHOAN ADD CONSTRAINT FK_TAIKHOAN_NHANKHAU FOREIGN KEY (MANHANKHAU) REFERENCES NHANKHAU(MANHANKHAU)',
    'SELECT "Foreign Key FK_TAIKHOAN_NHANKHAU đã tồn tại" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Kiểm tra và thêm cột EMAIL nếu chưa có
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'household_management' 
  AND TABLE_NAME = 'TAIKHOAN' 
  AND COLUMN_NAME = 'EMAIL';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE TAIKHOAN ADD COLUMN EMAIL VARCHAR(100) NULL',
    'SELECT "Cột EMAIL đã tồn tại" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Tạo unique index cho EMAIL (chỉ áp dụng cho giá trị không null)
SET @idx_exists = 0;
SELECT COUNT(*) INTO @idx_exists 
FROM INFORMATION_SCHEMA.STATISTICS 
WHERE TABLE_SCHEMA = 'household_management' 
  AND TABLE_NAME = 'TAIKHOAN' 
  AND INDEX_NAME = 'IX_TAIKHOAN_EMAIL';

SET @sql = IF(@idx_exists = 0,
    'CREATE UNIQUE INDEX IX_TAIKHOAN_EMAIL ON TAIKHOAN(EMAIL)',
    'SELECT "Index IX_TAIKHOAN_EMAIL đã tồn tại" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Kiểm tra và thêm cột TRANGTHAI nếu chưa có
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'household_management' 
  AND TABLE_NAME = 'TAIKHOAN' 
  AND COLUMN_NAME = 'TRANGTHAI';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE TAIKHOAN ADD COLUMN TRANGTHAI VARCHAR(50) DEFAULT ''CHO_KICH_HOAT''',
    'SELECT "Cột TRANGTHAI đã tồn tại" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Cập nhật TRANGTHAI mặc định cho các bản ghi cũ (nếu chưa có giá trị)
UPDATE TAIKHOAN 
SET TRANGTHAI = 'DANG_HOAT_DONG' 
WHERE TRANGTHAI IS NULL;

-- =============================================
-- 2. INSERT DỮ LIỆU MẪU - CÁN BỘ VÀ TÀI KHOẢN ADMIN
-- =============================================

-- Kiểm tra và tạo Xã/Phường mẫu nếu chưa có
INSERT INTO THANHPHO (MATHANHPHO, TENTHANHPHO) 
VALUES (1, 'Hà Nội')
ON DUPLICATE KEY UPDATE TENTHANHPHO = TENTHANHPHO;

INSERT INTO QUANHUYEN (MAQUANHUYEN, TENQUANHUYEN, MATHANHPHO) 
VALUES (1, 'Quận Hà Đông', 1)
ON DUPLICATE KEY UPDATE TENQUANHUYEN = TENQUANHUYEN;

INSERT INTO XAPHUONG (MAXAPHUONG, TENXAPHUONG, MAQUANHUYEN) 
VALUES (1, 'Phường La Khê', 1)
ON DUPLICATE KEY UPDATE TENXAPHUONG = TENXAPHUONG;

-- Insert Cán bộ mẫu
INSERT INTO CANBO (MACANBO, HOTEN, CHUCVU, MAXAPHUONG)
VALUES (1, 'Nguyễn Văn A', 'Tổ trưởng', 1)
ON DUPLICATE KEY UPDATE HOTEN = HOTEN;

INSERT INTO CANBO (MACANBO, HOTEN, CHUCVU, MAXAPHUONG)
VALUES (2, 'Trần Thị B', 'Tổ phó', 1)
ON DUPLICATE KEY UPDATE HOTEN = HOTEN;

INSERT INTO CANBO (MACANBO, HOTEN, CHUCVU, MAXAPHUONG)
VALUES (3, 'Lê Văn C', 'Cán bộ quản lý nhân khẩu', 1)
ON DUPLICATE KEY UPDATE HOTEN = HOTEN;

INSERT INTO CANBO (MACANBO, HOTEN, CHUCVU, MAXAPHUONG)
VALUES (4, 'Phạm Thị D', 'Cán bộ quản lý thu-chi', 1)
ON DUPLICATE KEY UPDATE HOTEN = HOTEN;

-- Insert Tài khoản Admin mẫu
-- Tài khoản Tổ trưởng
INSERT INTO TAIKHOAN (MACANBO, TENDANGNHAP, MATKHAU, VAITRO, EMAIL, TRANGTHAI)
SELECT 1, 'admin', '123456', 'Tổ trưởng', 'admin@example.com', 'DANG_HOAT_DONG'
WHERE NOT EXISTS (
    SELECT 1 FROM TAIKHOAN WHERE TENDANGNHAP = 'admin' OR EMAIL = 'admin@example.com'
);

-- Tài khoản Tổ phó
INSERT INTO TAIKHOAN (MACANBO, TENDANGNHAP, MATKHAU, VAITRO, EMAIL, TRANGTHAI)
SELECT 2, 'to_pho', '123456', 'Tổ phó', 'topho@example.com', 'DANG_HOAT_DONG'
WHERE NOT EXISTS (
    SELECT 1 FROM TAIKHOAN WHERE TENDANGNHAP = 'to_pho' OR EMAIL = 'topho@example.com'
);

-- Tài khoản Cán bộ quản lý nhân khẩu
INSERT INTO TAIKHOAN (MACANBO, TENDANGNHAP, MATKHAU, VAITRO, EMAIL, TRANGTHAI)
SELECT 3, 'cb_nhankhau', '123456', 'Cán bộ quản lý nhân khẩu', 'cbnhankhau@example.com', 'DANG_HOAT_DONG'
WHERE NOT EXISTS (
    SELECT 1 FROM TAIKHOAN WHERE TENDANGNHAP = 'cb_nhankhau' OR EMAIL = 'cbnhankhau@example.com'
);

-- Tài khoản Cán bộ quản lý thu-chi
INSERT INTO TAIKHOAN (MACANBO, TENDANGNHAP, MATKHAU, VAITRO, EMAIL, TRANGTHAI)
SELECT 4, 'cb_thuchi', '123456', 'Cán bộ quản lý thu-chi', 'cbthuchi@example.com', 'DANG_HOAT_DONG'
WHERE NOT EXISTS (
    SELECT 1 FROM TAIKHOAN WHERE TENDANGNHAP = 'cb_thuchi' OR EMAIL = 'cbthuchi@example.com'
);

-- =============================================
-- 3. INSERT DỮ LIỆU MẪU - HỘ KHẨU VÀ NHÂN KHẨU
-- =============================================

-- Tạo Hộ khẩu mẫu
INSERT INTO HOKHAU (SOHOKHAU, DIACHI, MAXAPHUONG, NGAYCAP, GHICHU)
VALUES (1, 'Số 123, Đường ABC, Phường La Khê', 1, CURDATE(), 'Hộ khẩu mẫu')
ON DUPLICATE KEY UPDATE DIACHI = DIACHI;

INSERT INTO HOKHAU (SOHOKHAU, DIACHI, MAXAPHUONG, NGAYCAP, GHICHU)
VALUES (2, 'Số 456, Đường XYZ, Phường La Khê', 1, CURDATE(), 'Hộ khẩu mẫu 2')
ON DUPLICATE KEY UPDATE DIACHI = DIACHI;

-- Tạo Nhân khẩu mẫu (Chủ hộ)
INSERT INTO NHANKHAU (MANHANKHAU, SOHOKHAU, HOTEN, GIOITINH, NGAYSINH, NGHENGHIEP, QUANHEVOICHUHO, TRANGTHAI, CMND)
VALUES (1, 1, 'Nguyễn Văn Chủ Hộ', 'Nam', '1980-01-15', 'Kinh doanh', 'Chủ hộ', 'Thường trú', '001234567890')
ON DUPLICATE KEY UPDATE HOTEN = HOTEN;

INSERT INTO NHANKHAU (MANHANKHAU, SOHOKHAU, HOTEN, GIOITINH, NGAYSINH, NGHENGHIEP, QUANHEVOICHUHO, TRANGTHAI, CMND)
VALUES (2, 2, 'Trần Thị Chủ Hộ', 'Nữ', '1985-05-20', 'Giáo viên', 'Chủ hộ', 'Thường trú', '001234567891')
ON DUPLICATE KEY UPDATE HOTEN = HOTEN;

-- Tạo Nhân khẩu thành viên
INSERT INTO NHANKHAU (MANHANKHAU, SOHOKHAU, HOTEN, GIOITINH, NGAYSINH, NGHENGHIEP, QUANHEVOICHUHO, TRANGTHAI, CMND)
VALUES (3, 1, 'Nguyễn Thị Vợ', 'Nữ', '1982-03-10', 'Nội trợ', 'Vợ', 'Thường trú', '001234567892')
ON DUPLICATE KEY UPDATE HOTEN = HOTEN;

INSERT INTO NHANKHAU (MANHANKHAU, SOHOKHAU, HOTEN, GIOITINH, NGAYSINH, NGHENGHIEP, QUANHEVOICHUHO, TRANGTHAI, CMND)
VALUES (4, 1, 'Nguyễn Văn Con', 'Nam', '2010-07-25', 'Học sinh', 'Con', 'Thường trú', NULL)
ON DUPLICATE KEY UPDATE HOTEN = HOTEN;

-- =============================================
-- 4. INSERT TÀI KHOẢN USER (CHỦ HỘ)
-- =============================================

-- Tài khoản cho Chủ hộ 1
INSERT INTO TAIKHOAN (MANHANKHAU, TENDANGNHAP, MATKHAU, VAITRO, EMAIL, TRANGTHAI)
SELECT 1, 'user1', '123456', 'User', 'user1@example.com', 'DANG_HOAT_DONG'
WHERE NOT EXISTS (
    SELECT 1 FROM TAIKHOAN WHERE TENDANGNHAP = 'user1' OR (MANHANKHAU = 1 AND MANHANKHAU IS NOT NULL)
);

-- Tài khoản cho Chủ hộ 2
INSERT INTO TAIKHOAN (MANHANKHAU, TENDANGNHAP, MATKHAU, VAITRO, EMAIL, TRANGTHAI)
SELECT 2, 'user2', '123456', 'User', 'user2@example.com', 'DANG_HOAT_DONG'
WHERE NOT EXISTS (
    SELECT 1 FROM TAIKHOAN WHERE TENDANGNHAP = 'user2' OR (MANHANKHAU = 2 AND MANHANKHAU IS NOT NULL)
);

-- =============================================
-- 5. INSERT DỮ LIỆU MẪU - LOẠI PHÍ VÀ ĐỢT THU
-- =============================================

-- Loại phí mẫu
INSERT INTO LOAIPHI (TENLOAIPHI, MOTA, BATBUOC, DINHMUC)
VALUES ('Phí vệ sinh', 'Phí vệ sinh hàng tháng', 1, 50000.00)
ON DUPLICATE KEY UPDATE MOTA = MOTA;

INSERT INTO LOAIPHI (TENLOAIPHI, MOTA, BATBUOC, DINHMUC)
VALUES ('Phí an ninh', 'Phí an ninh khu vực', 1, 30000.00)
ON DUPLICATE KEY UPDATE MOTA = MOTA;

-- Đợt thu mẫu
INSERT INTO DOTTHU (MADOTTHU, TENDOTTHU, NGAYBATDAU, NGAYKETTHUC)
VALUES (1, 'Đợt thu tháng 1/2024', '2024-01-01', '2024-01-31')
ON DUPLICATE KEY UPDATE TENDOTTHU = TENDOTTHU;

-- =============================================
-- 6. KIỂM TRA DỮ LIỆU ĐÃ INSERT
-- =============================================

SELECT 'Tổng số tài khoản' AS Loai, COUNT(*) AS SoLuong FROM TAIKHOAN
UNION ALL
SELECT 'Tài khoản Admin (có MACANBO)' AS Loai, COUNT(*) AS SoLuong FROM TAIKHOAN WHERE MACANBO IS NOT NULL
UNION ALL
SELECT 'Tài khoản User (có MANHANKHAU)' AS Loai, COUNT(*) AS SoLuong FROM TAIKHOAN WHERE MANHANKHAU IS NOT NULL;

SELECT 
    MATAIKHOAN,
    CASE 
        WHEN MACANBO IS NOT NULL THEN 'Admin'
        WHEN MANHANKHAU IS NOT NULL THEN 'User'
        ELSE 'Không xác định'
    END AS LoaiTaiKhoan,
    TENDANGNHAP,
    VAITRO,
    EMAIL,
    TRANGTHAI
FROM TAIKHOAN
ORDER BY MATAIKHOAN;

SELECT '========================================' AS '';
SELECT 'HOÀN TẤT CẬP NHẬT VÀ INSERT DỮ LIỆU' AS '';
SELECT '========================================' AS '';
SELECT '' AS '';
SELECT 'THÔNG TIN ĐĂNG NHẬP:' AS '';
SELECT '-------------------' AS '';
SELECT 'Admin (Tổ trưởng):' AS '';
SELECT '  - Tên đăng nhập: admin' AS '';
SELECT '  - Mật khẩu: 123456' AS '';
SELECT '' AS '';
SELECT 'Tổ phó:' AS '';
SELECT '  - Tên đăng nhập: to_pho' AS '';
SELECT '  - Mật khẩu: 123456' AS '';
SELECT '' AS '';
SELECT 'Cán bộ quản lý nhân khẩu:' AS '';
SELECT '  - Tên đăng nhập: cb_nhankhau' AS '';
SELECT '  - Mật khẩu: 123456' AS '';
SELECT '' AS '';
SELECT 'Cán bộ quản lý thu-chi:' AS '';
SELECT '  - Tên đăng nhập: cb_thuchi' AS '';
SELECT '  - Mật khẩu: 123456' AS '';
SELECT '' AS '';
SELECT 'User (Chủ hộ):' AS '';
SELECT '  - Tên đăng nhập: user1' AS '';
SELECT '  - Mật khẩu: 123456' AS '';
SELECT '' AS '';
SELECT '  - Tên đăng nhập: user2' AS '';
SELECT '  - Mật khẩu: 123456' AS '';






