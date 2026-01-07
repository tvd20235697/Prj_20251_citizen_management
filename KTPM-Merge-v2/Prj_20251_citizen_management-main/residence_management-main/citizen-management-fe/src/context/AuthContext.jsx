import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const API_BASE = "http://localhost:8080/api";

// Normalize vai trò để xử lý lỗi encoding (dấu ? thay vì dấu tiếng Việt)
function normalizeRole(role) {
  if (!role) return role;
  // Thay thế các pattern bị lỗi encoding phổ biến
  return role
    .replace(/T\? phó/g, 'Tổ phó')
    .replace(/T\? tr\?\?ng/g, 'Tổ trưởng')
    .replace(/Cán b\? qu\?n lý nhân kh\?u/g, 'Cán bộ quản lý nhân khẩu')
    .replace(/Cán b\? qu\?n lý thu-chi/g, 'Cán bộ quản lý thu-chi');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem có thông tin user trong localStorage không
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error("Error parsing saved user:", e);
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (tenDangNhapHoacEmail, matKhau) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenDangNhapHoacEmail,
          matKhau,
        }),
      });

      if (!response.ok) {
        throw new Error("Đăng nhập thất bại");
      }

      const userData = await response.json();
      
      // Xác định vai trò và điều hướng
      const userInfo = {
        ...userData,
        fullName: userData.hoTen || userData.tenDangNhap,
        email: userData.email,
        role: normalizeRole(userData.vaiTro), // Normalize vai trò
        maTaiKhoan: userData.maTaiKhoan,
        maCanBo: userData.maCanBo,
        maNhanKhau: userData.maNhanKhau,
        soHoKhau: userData.soHoKhau,
        householdId: userData.soHoKhau,
      };

      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));

      // Điều hướng dựa trên vai trò (normalize để xử lý lỗi encoding)
      const normalizedRole = normalizeRole(userData.vaiTro);
      if (normalizedRole === "User") {
        navigate("/user/home");
      } else {
        navigate("/dashboard");
      }

      return userInfo;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const hasRole = (allowedRoles) => {
    if (!user) return false;
    const normalizedUserRole = normalizeRole(user.role);
    return allowedRoles.some(allowedRole => {
      const normalizedAllowedRole = normalizeRole(allowedRole);
      return normalizedUserRole === normalizedAllowedRole;
    });
  };

  const hasAnyRole = (allowedRoles) => {
    if (!user) return false;
    const normalizedUserRole = normalizeRole(user.role);
    return allowedRoles.some((role) => {
      const normalizedRoleValue = normalizeRole(role);
      return normalizedUserRole === normalizedRoleValue;
    });
  };

  // Kiểm tra quyền truy cập trang
  const canAccessPage = (pagePath) => {
    if (!user) return false;

    const role = normalizeRole(user.role);

    // User chỉ có thể truy cập các trang /user/*
    if (role === "User") {
      return pagePath.startsWith("/user");
    }

    // Admin roles
    if (role === "Tổ trưởng" || role === "Tổ phó") {
      return true; // Toàn quyền
    }

    if (role === "Cán bộ quản lý nhân khẩu") {
      const allowedPages = [
        "/dashboard",
        "/residents",
        "/nhankhau",
        "/households",
        "/hokhau",
        "/temporary-residents",
        "/tamtru",
        "/tamvang",
        "/history",
        "/admin/user-accounts",
        "/help",
        "/caidat/he-thong",
        "/account",
      ];
      return allowedPages.some((page) => pagePath.startsWith(page));
    }

    if (role === "Cán bộ quản lý thu-chi") {
      const allowedPages = [
        "/dashboard",
        "/fees",
        "/donations",
        "/sanitation",
        "/help",
        "/caidat/he-thong",
        "/account",
      ];
      return allowedPages.some((page) => pagePath.startsWith(page));
    }

    return false;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    canAccessPage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

