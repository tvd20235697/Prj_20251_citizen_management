-- =============================================
-- SCRIPT CẬP NHẬT BẢNG TAIKHOAN VÀ INSERT DỮ LIỆU MẪU
-- =============================================

USE household_management;
GO

-- =============================================
-- 1. CẬP NHẬT BẢNG TAIKHOAN
-- =============================================

-- Kiểm tra và thêm cột MANHANKHAU nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('TAIKHOAN') AND name = 'MANHANKHAU')
BEGIN
    ALTER TABLE TAIKHOAN
    ADD MANHANKHAU INT NULL;
    
    PRINT 'Đã thêm cột MANHANKHAU vào bảng TAIKHOAN';
END
ELSE
BEGIN
    PRINT 'Cột MANHANKHAU đã tồn tại';
END
GO

-- Thêm Foreign Key cho MANHANKHAU nếu chưa có
IF NOT EXISTS (
    SELECT * FROM sys.foreign_keys 
    WHERE name = 'FK_TAIKHOAN_NHANKHAU' 
    AND parent_object_id = OBJECT_ID('TAIKHOAN')
)
BEGIN
    ALTER TABLE TAIKHOAN
    ADD CONSTRAINT FK_TAIKHOAN_NHANKHAU 
        FOREIGN KEY (MANHANKHAU) 
        REFERENCES NHANKHAU(MANHANKHAU);
    
    PRINT 'Đã thêm Foreign Key FK_TAIKHOAN_NHANKHAU';
END
ELSE
BEGIN
    PRINT 'Foreign Key FK_TAIKHOAN_NHANKHAU đã tồn tại';
END
GO

-- Kiểm tra và thêm cột EMAIL nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('TAIKHOAN') AND name = 'EMAIL')
BEGIN
    ALTER TABLE TAIKHOAN
    ADD EMAIL VARCHAR(100) NULL;
    
    -- Tạo unique constraint cho EMAIL (chỉ áp dụng cho giá trị không null)
    CREATE UNIQUE INDEX IX_TAIKHOAN_EMAIL ON TAIKHOAN(EMAIL) WHERE EMAIL IS NOT NULL;
    
    PRINT 'Đã thêm cột EMAIL vào bảng TAIKHOAN';
END
ELSE
BEGIN
    PRINT 'Cột EMAIL đã tồn tại';
END
GO

-- Kiểm tra và thêm cột TRANGTHAI nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('TAIKHOAN') AND name = 'TRANGTHAI')
BEGIN
    ALTER TABLE TAIKHOAN
    ADD TRANGTHAI VARCHAR(50) DEFAULT 'CHO_KICH_HOAT';
    
    PRINT 'Đã thêm cột TRANGTHAI vào bảng TAIKHOAN';
END
ELSE
BEGIN
    PRINT 'Cột TRANGTHAI đã tồn tại';
END
GO

-- Cập nhật TRANGTHAI mặc định cho các bản ghi cũ (nếu chưa có giá trị)
UPDATE TAIKHOAN 
SET TRANGTHAI = 'DANG_HOAT_DONG' 
WHERE TRANGTHAI IS NULL;
GO

-- =============================================
-- 2. INSERT DỮ LIỆU MẪU - CÁN BỘ VÀ TÀI KHOẢN ADMIN
-- =============================================

-- Kiểm tra và tạo Xã/Phường mẫu nếu chưa có
IF NOT EXISTS (SELECT * FROM XAPHUONG WHERE MAXAPHUONG = 1)
BEGIN
    -- Tạo Thành phố mẫu
    IF NOT EXISTS (SELECT * FROM THANHPHO WHERE MATHANHPHO = 1)
    BEGIN
        SET IDENTITY_INSERT THANHPHO ON;
        INSERT INTO THANHPHO (MATHANHPHO, TENTHANHPHO) VALUES (1, N'Hà Nội');
        SET IDENTITY_INSERT THANHPHO OFF;
    END
    
    -- Tạo Quận/Huyện mẫu
    IF NOT EXISTS (SELECT * FROM QUANHUYEN WHERE MAQUANHUYEN = 1)
    BEGIN
        SET IDENTITY_INSERT QUANHUYEN ON;
        INSERT INTO QUANHUYEN (MAQUANHUYEN, TENQUANHUYEN, MATHANHPHO) VALUES (1, N'Quận Hà Đông', 1);
        SET IDENTITY_INSERT QUANHUYEN OFF;
    END
    
    -- Tạo Xã/Phường mẫu
    SET IDENTITY_INSERT XAPHUONG ON;
    INSERT INTO XAPHUONG (MAXAPHUONG, TENXAPHUONG, MAQUANHUYEN) VALUES (1, N'Phường La Khê', 1);
    SET IDENTITY_INSERT XAPHUONG OFF;
    PRINT 'Đã tạo Xã/Phường mẫu';
END
GO

-- Insert Cán bộ mẫu
IF NOT EXISTS (SELECT * FROM CANBO WHERE MACANBO = 1)
BEGIN
    SET IDENTITY_INSERT CANBO ON;
    INSERT INTO CANBO (MACANBO, HOTEN, CHUCVU, MAXAPHUONG)
    VALUES (1, N'Nguyễn Văn A', N'Tổ trưởng', 1);
    SET IDENTITY_INSERT CANBO OFF;
    PRINT 'Đã tạo Cán bộ Tổ trưởng';
END
GO

IF NOT EXISTS (SELECT * FROM CANBO WHERE MACANBO = 2)
BEGIN
    SET IDENTITY_INSERT CANBO ON;
    INSERT INTO CANBO (MACANBO, HOTEN, CHUCVU, MAXAPHUONG)
    VALUES (2, N'Trần Thị B', N'Tổ phó', 1);
    SET IDENTITY_INSERT CANBO OFF;
    PRINT 'Đã tạo Cán bộ Tổ phó';
END
GO

IF NOT EXISTS (SELECT * FROM CANBO WHERE MACANBO = 3)
BEGIN
    SET IDENTITY_INSERT CANBO ON;
    INSERT INTO CANBO (MACANBO, HOTEN, CHUCVU, MAXAPHUONG)
    VALUES (3, N'Lê Văn C', N'Cán bộ quản lý nhân khẩu', 1);
    SET IDENTITY_INSERT CANBO OFF;
    PRINT 'Đã tạo Cán bộ quản lý nhân khẩu';
END
GO

IF NOT EXISTS (SELECT * FROM CANBO WHERE MACANBO = 4)
BEGIN
    SET IDENTITY_INSERT CANBO ON;
    INSERT INTO CANBO (MACANBO, HOTEN, CHUCVU, MAXAPHUONG)
    VALUES (4, N'Phạm Thị D', N'Cán bộ quản lý thu-chi', 1);
    SET IDENTITY_INSERT CANBO OFF;
    PRINT 'Đã tạo Cán bộ quản lý thu-chi';
END
GO

-- Insert Tài khoản Admin mẫu
-- Tài khoản Tổ trưởng
IF NOT EXISTS (SELECT * FROM TAIKHOAN WHERE TENDANGNHAP = 'admin' OR EMAIL = 'admin@example.com')
BEGIN
    -- Kiểm tra xem cán bộ có tồn tại không
    IF EXISTS (SELECT * FROM CANBO WHERE MACANBO = 1)
    BEGIN
        INSERT INTO TAIKHOAN (MACANBO, TENDANGNHAP, MATKHAU, VAITRO, EMAIL, TRANGTHAI)
        VALUES (1, 'admin', '123456', 'Tổ trưởng', 'admin@example.com', 'DANG_HOAT_DONG');
        PRINT 'Đã tạo tài khoản admin (Tổ trưởng)';
    END
    ELSE
    BEGIN
        PRINT 'Cảnh báo: Không tìm thấy Cán bộ với MACANBO = 1, không thể tạo tài khoản admin';
    END
END
ELSE
BEGIN
    PRINT 'Tài khoản admin đã tồn tại';
END
GO

-- Tài khoản Tổ phó
IF NOT EXISTS (SELECT * FROM TAIKHOAN WHERE TENDANGNHAP = 'to_pho' OR EMAIL = 'topho@example.com')
BEGIN
    IF EXISTS (SELECT * FROM CANBO WHERE MACANBO = 2)
    BEGIN
        INSERT INTO TAIKHOAN (MACANBO, TENDANGNHAP, MATKHAU, VAITRO, EMAIL, TRANGTHAI)
        VALUES (2, 'to_pho', '123456', 'Tổ phó', 'topho@example.com', 'DANG_HOAT_DONG');
        PRINT 'Đã tạo tài khoản Tổ phó';
    END
END
ELSE
BEGIN
    PRINT 'Tài khoản Tổ phó đã tồn tại';
END
GO

-- Tài khoản Cán bộ quản lý nhân khẩu
IF NOT EXISTS (SELECT * FROM TAIKHOAN WHERE TENDANGNHAP = 'cb_nhankhau' OR EMAIL = 'cbnhankhau@example.com')
BEGIN
    IF EXISTS (SELECT * FROM CANBO WHERE MACANBO = 3)
    BEGIN
        INSERT INTO TAIKHOAN (MACANBO, TENDANGNHAP, MATKHAU, VAITRO, EMAIL, TRANGTHAI)
        VALUES (3, 'cb_nhankhau', '123456', 'Cán bộ quản lý nhân khẩu', 'cbnhankhau@example.com', 'DANG_HOAT_DONG');
        PRINT 'Đã tạo tài khoản Cán bộ quản lý nhân khẩu';
    END
END
ELSE
BEGIN
    PRINT 'Tài khoản Cán bộ quản lý nhân khẩu đã tồn tại';
END
GO

-- Tài khoản Cán bộ quản lý thu-chi
IF NOT EXISTS (SELECT * FROM TAIKHOAN WHERE TENDANGNHAP = 'cb_thuchi' OR EMAIL = 'cbthuchi@example.com')
BEGIN
    IF EXISTS (SELECT * FROM CANBO WHERE MACANBO = 4)
    BEGIN
        INSERT INTO TAIKHOAN (MACANBO, TENDANGNHAP, MATKHAU, VAITRO, EMAIL, TRANGTHAI)
        VALUES (4, 'cb_thuchi', '123456', 'Cán bộ quản lý thu-chi', 'cbthuchi@example.com', 'DANG_HOAT_DONG');
        PRINT 'Đã tạo tài khoản Cán bộ quản lý thu-chi';
    END
END
ELSE
BEGIN
    PRINT 'Tài khoản Cán bộ quản lý thu-chi đã tồn tại';
END
GO

-- =============================================
-- 3. INSERT DỮ LIỆU MẪU - HỘ KHẨU VÀ NHÂN KHẨU
-- =============================================

-- Tạo Hộ khẩu mẫu
IF NOT EXISTS (SELECT * FROM HOKHAU WHERE SOHOKHAU = 1)
BEGIN
    SET IDENTITY_INSERT HOKHAU ON;
    INSERT INTO HOKHAU (SOHOKHAU, DIACHI, MAXAPHUONG, NGAYCAP, GHICHU)
    VALUES (1, N'Số 123, Đường ABC, Phường La Khê', 1, GETDATE(), N'Hộ khẩu mẫu');
    SET IDENTITY_INSERT HOKHAU OFF;
    PRINT 'Đã tạo Hộ khẩu mẫu';
END
GO

IF NOT EXISTS (SELECT * FROM HOKHAU WHERE SOHOKHAU = 2)
BEGIN
    SET IDENTITY_INSERT HOKHAU ON;
    INSERT INTO HOKHAU (SOHOKHAU, DIACHI, MAXAPHUONG, NGAYCAP, GHICHU)
    VALUES (2, N'Số 456, Đường XYZ, Phường La Khê', 1, GETDATE(), N'Hộ khẩu mẫu 2');
    SET IDENTITY_INSERT HOKHAU OFF;
    PRINT 'Đã tạo Hộ khẩu mẫu 2';
END
GO

-- Tạo Nhân khẩu mẫu (Chủ hộ)
IF NOT EXISTS (SELECT * FROM NHANKHAU WHERE MANHANKHAU = 1)
BEGIN
    SET IDENTITY_INSERT NHANKHAU ON;
    INSERT INTO NHANKHAU (MANHANKHAU, SOHOKHAU, HOTEN, GIOITINH, NGAYSINH, NGHENGHIEP, QUANHEVOICHUHO, TRANGTHAI, CMND)
    VALUES (1, 1, N'Nguyễn Văn Chủ Hộ', N'Nam', '1980-01-15', N'Kinh doanh', N'Chu ho', N'Thường trú', '001234567890');
    SET IDENTITY_INSERT NHANKHAU OFF;
    PRINT 'Đã tạo Nhân khẩu chủ hộ 1';
END
GO

IF NOT EXISTS (SELECT * FROM NHANKHAU WHERE MANHANKHAU = 2)
BEGIN
    SET IDENTITY_INSERT NHANKHAU ON;
    INSERT INTO NHANKHAU (MANHANKHAU, SOHOKHAU, HOTEN, GIOITINH, NGAYSINH, NGHENGHIEP, QUANHEVOICHUHO, TRANGTHAI, CMND)
    VALUES (2, 2, N'Trần Thị Chủ Hộ', N'Nữ', '1985-05-20', N'Giáo viên', N'Chu ho', N'Thường trú', '001234567891');
    SET IDENTITY_INSERT NHANKHAU OFF;
    PRINT 'Đã tạo Nhân khẩu chủ hộ 2';
END
GO

-- Tạo Nhân khẩu thành viên
IF NOT EXISTS (SELECT * FROM NHANKHAU WHERE MANHANKHAU = 3)
BEGIN
    SET IDENTITY_INSERT NHANKHAU ON;
    INSERT INTO NHANKHAU (MANHANKHAU, SOHOKHAU, HOTEN, GIOITINH, NGAYSINH, NGHENGHIEP, QUANHEVOICHUHO, TRANGTHAI, CMND)
    VALUES (3, 1, N'Nguyễn Thị Vợ', N'Nữ', '1982-03-10', N'Nội trợ', N'Vợ', N'Thường trú', '001234567892');
    SET IDENTITY_INSERT NHANKHAU OFF;
    PRINT 'Đã tạo Nhân khẩu thành viên';
END
GO

IF NOT EXISTS (SELECT * FROM NHANKHAU WHERE MANHANKHAU = 4)
BEGIN
    SET IDENTITY_INSERT NHANKHAU ON;
    INSERT INTO NHANKHAU (MANHANKHAU, SOHOKHAU, HOTEN, GIOITINH, NGAYSINH, NGHENGHIEP, QUANHEVOICHUHO, TRANGTHAI, CMND)
    VALUES (4, 1, N'Nguyễn Văn Con', N'Nam', '2010-07-25', N'Học sinh', N'Con', N'Thường trú', NULL);
    SET IDENTITY_INSERT NHANKHAU OFF;
    PRINT 'Đã tạo Nhân khẩu con';
END
GO

-- =============================================
-- 4. INSERT TÀI KHOẢN USER (CHỦ HỘ)
-- =============================================

-- Tài khoản cho Chủ hộ 1
IF NOT EXISTS (SELECT * FROM TAIKHOAN WHERE TENDANGNHAP = 'user1' OR (MANHANKHAU = 1 AND MANHANKHAU IS NOT NULL))
BEGIN
    INSERT INTO TAIKHOAN (MANHANKHAU, TENDANGNHAP, MATKHAU, VAITRO, EMAIL, TRANGTHAI)
    VALUES (1, 'user1', '123456', 'User', 'user1@example.com', 'DANG_HOAT_DONG');
    PRINT 'Đã tạo tài khoản user1 (Chủ hộ 1)';
END
GO

-- Tài khoản cho Chủ hộ 2
IF NOT EXISTS (SELECT * FROM TAIKHOAN WHERE TENDANGNHAP = 'user2' OR (MANHANKHAU = 2 AND MANHANKHAU IS NOT NULL))
BEGIN
    INSERT INTO TAIKHOAN (MANHANKHAU, TENDANGNHAP, MATKHAU, VAITRO, EMAIL, TRANGTHAI)
    VALUES (2, 'user2', '123456', 'User', 'user2@example.com', 'DANG_HOAT_DONG');
    PRINT 'Đã tạo tài khoản user2 (Chủ hộ 2)';
END
GO

-- =============================================
-- 5. INSERT DỮ LIỆU MẪU - LOẠI PHÍ VÀ ĐỢT THU
-- =============================================

-- Loại phí mẫu (kiểm tra theo TENLOAIPHI vì có unique constraint)
-- Sử dụng TRY-CATCH để xử lý lỗi duplicate key
BEGIN TRY
    IF NOT EXISTS (SELECT * FROM LOAIPHI WHERE LTRIM(RTRIM(TENLOAIPHI)) = N'Phí vệ sinh')
    BEGIN
        INSERT INTO LOAIPHI (TENLOAIPHI, MOTA, BATBUOC, DINHMUC)
        VALUES (N'Phí vệ sinh', N'Phí vệ sinh hàng tháng', 1, 50000.00);
        PRINT 'Đã tạo Loại phí vệ sinh';
    END
    ELSE
    BEGIN
        PRINT 'Loại phí vệ sinh đã tồn tại';
    END
END TRY
BEGIN CATCH
    IF ERROR_NUMBER() = 2627 -- Duplicate key error
    BEGIN
        PRINT 'Loại phí vệ sinh đã tồn tại (bắt bởi CATCH)';
    END
    ELSE
    BEGIN
        PRINT 'Lỗi khi tạo Loại phí vệ sinh: ' + ERROR_MESSAGE();
    END
END CATCH
GO

BEGIN TRY
    IF NOT EXISTS (SELECT * FROM LOAIPHI WHERE LTRIM(RTRIM(TENLOAIPHI)) = N'Phí an ninh')
    BEGIN
        INSERT INTO LOAIPHI (TENLOAIPHI, MOTA, BATBUOC, DINHMUC)
        VALUES (N'Phí an ninh', N'Phí an ninh khu vực', 1, 30000.00);
        PRINT 'Đã tạo Loại phí an ninh';
    END
    ELSE
    BEGIN
        PRINT 'Loại phí an ninh đã tồn tại';
    END
END TRY
BEGIN CATCH
    IF ERROR_NUMBER() = 2627 -- Duplicate key error
    BEGIN
        PRINT 'Loại phí an ninh đã tồn tại (bắt bởi CATCH)';
    END
    ELSE
    BEGIN
        PRINT 'Lỗi khi tạo Loại phí an ninh: ' + ERROR_MESSAGE();
    END
END CATCH
GO

-- Đợt thu mẫu
IF NOT EXISTS (SELECT * FROM DOTTHU WHERE MADOTTHU = 1)
BEGIN
    SET IDENTITY_INSERT DOTTHU ON;
    INSERT INTO DOTTHU (MADOTTHU, TENDOTTHU, NGAYBATDAU, NGAYKETTHUC)
    VALUES (1, N'Đợt thu tháng 1/2024', '2024-01-01', '2024-01-31');
    SET IDENTITY_INSERT DOTTHU OFF;
    PRINT 'Đã tạo Đợt thu mẫu';
END
GO

-- =============================================
-- 6. KIỂM TRA DỮ LIỆU ĐÃ INSERT
-- =============================================

PRINT '========================================';
PRINT 'KIỂM TRA DỮ LIỆU ĐÃ INSERT';
PRINT '========================================';

-- Đếm số lượng tài khoản
SELECT 
    'Tổng số tài khoản' AS Loai,
    COUNT(*) AS SoLuong
FROM TAIKHOAN
UNION ALL
SELECT 
    'Tài khoản Admin (có MACANBO)' AS Loai,
    COUNT(*) AS SoLuong
FROM TAIKHOAN
WHERE MACANBO IS NOT NULL
UNION ALL
SELECT 
    'Tài khoản User (có MANHANKHAU)' AS Loai,
    COUNT(*) AS SoLuong
FROM TAIKHOAN
WHERE MANHANKHAU IS NOT NULL;

-- Hiển thị danh sách tài khoản
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

PRINT '========================================';
PRINT 'HOÀN TẤT CẬP NHẬT VÀ INSERT DỮ LIỆU';
PRINT '========================================';
PRINT '';
PRINT 'THÔNG TIN ĐĂNG NHẬP:';
PRINT '-------------------';
PRINT 'Admin (Tổ trưởng):';
PRINT '  - Tên đăng nhập: admin';
PRINT '  - Mật khẩu: 123456';
PRINT '';
PRINT 'Tổ phó:';
PRINT '  - Tên đăng nhập: to_pho';
PRINT '  - Mật khẩu: 123456';
PRINT '';
PRINT 'Cán bộ quản lý nhân khẩu:';
PRINT '  - Tên đăng nhập: cb_nhankhau';
PRINT '  - Mật khẩu: 123456';
PRINT '';
PRINT 'Cán bộ quản lý thu-chi:';
PRINT '  - Tên đăng nhập: cb_thuchi';
PRINT '  - Mật khẩu: 123456';
PRINT '';
PRINT 'User (Chủ hộ):';
PRINT '  - Tên đăng nhập: user1';
PRINT '  - Mật khẩu: 123456';
PRINT '';
PRINT '  - Tên đăng nhập: user2';
PRINT '  - Mật khẩu: 123456';
PRINT '';

