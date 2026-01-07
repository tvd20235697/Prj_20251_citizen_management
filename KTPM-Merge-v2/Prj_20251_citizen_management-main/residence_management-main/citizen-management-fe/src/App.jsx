import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuanLiHoKhau from "./pages/quanlihokhau";
import QuanLyNhanKhau from "./pages/QuanLyNhanKhau";
import TemporaryResidents from "./pages/TemporaryResidents";
import TemporaryAbsence from "./pages/TemporaryAbsence";
import UserManagement from "./pages/UserManagement";
import UserAccountManagement from "./pages/UserAccountManagement";
import SystemSettings from "./pages/SystemSettings";
import Help from "./pages/Help";
import CapGiay from "./pages/CapGiay";
import HouseholdAdd from "./pages/HouseholdAdd";
import HouseholdByArea from "./pages/HouseholdByArea";
import ResidentsAdd from "./pages/ResidentsAdd";
import ResidentsSearch from "./pages/ResidentsSearch";
import AccountInfo from "./pages/AccountInfo";
import ChangePassword from "./pages/ChangePassword";
import SanitationFeesList from "./pages/SanitationFeesList";
import SanitationFeeCollect from "./pages/SanitationFeeCollect";
import DonationCampaigns from "./pages/DonationCampaigns";
import DonationCampaignCreate from "./pages/DonationCampaignCreate";
import SanitationFeeSettings from "./pages/SanitationFeeSettings";
import ChangeHouseholdHead from "./pages/ChangeHouseholdHead";
import FeeTypesManagement from "./pages/FeeTypesManagement";
import FeeCollectionManagement from "./pages/FeeCollectionManagement";
import CollectionPeriodsManagement from "./pages/CollectionPeriodsManagement";
import SplitHousehold from "./pages/SplitHousehold";
import ChangeHistory from "./pages/ChangeHistory";
// User pages
import UserHome from "./user/pages/UserHome";
import UserHousehold from "./user/pages/UserHousehold";
import UserMembers from "./user/pages/UserMembers";
import UserHistory from "./user/pages/UserHistory";
import UserProfile from "./user/pages/UserProfile";
import UserPayment from "./user/pages/UserPayment";

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  try {
    const { user, loading, canAccessPage } = useAuth();
    const location = window.location.pathname;

    if (loading) {
      return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to={user.role === "User" ? "/user/home" : "/dashboard"} replace />;
    }

    if (!canAccessPage(location)) {
      return <Navigate to={user.role === "User" ? "/user/home" : "/dashboard"} replace />;
    }

    return children;
  } catch (error) {
    console.error("ProtectedRoute error:", error);
    return <Navigate to="/login" replace />;
  }
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      
      {/* User Routes */}
      <Route
        path="/user/home"
        element={
          <ProtectedRoute allowedRoles={["User"]}>
            <UserHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/household"
        element={
          <ProtectedRoute allowedRoles={["User"]}>
            <UserHousehold />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/members"
        element={
          <ProtectedRoute allowedRoles={["User"]}>
            <UserMembers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/history"
        element={
          <ProtectedRoute allowedRoles={["User"]}>
            <UserHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute allowedRoles={["User"]}>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/payment"
        element={
          <ProtectedRoute allowedRoles={["User"]}>
            <UserPayment />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu", "Cán bộ quản lý thu-chi"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/households"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <QuanLiHoKhau />
          </ProtectedRoute>
        }
      />
      <Route
        path="/households/add"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <HouseholdAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/households/split"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <SplitHousehold />
          </ProtectedRoute>
        }
      />
      <Route
        path="/households/change-head"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <ChangeHouseholdHead />
          </ProtectedRoute>
        }
      />
      <Route
        path="/households/by-area"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <HouseholdByArea />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hokhau/danh-sach"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <QuanLiHoKhau />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hokhau/them-moi"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <HouseholdAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hokhau/tim-kiem"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <HouseholdByArea />
          </ProtectedRoute>
        }
      />
      <Route
        path="/residents"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <QuanLyNhanKhau />
          </ProtectedRoute>
        }
      />
      <Route
        path="/residents/add"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <ResidentsAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/residents/search"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <ResidentsSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nhankhau/danh-sach"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <QuanLyNhanKhau />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nhankhau/them-moi"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <ResidentsAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nhankhau/tim-kiem"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <ResidentsSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/temporary-residents"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <TemporaryResidents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tamtru"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <TemporaryResidents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tamvang"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <TemporaryAbsence />
          </ProtectedRoute>
        }
      />
      <Route
        path="/temporary-absence"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <TemporaryAbsence />
          </ProtectedRoute>
        }
      />
      <Route
        path="/caidat/nguoi-dung"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó"]}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó"]}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/user-accounts"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <UserAccountManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tailieu/cap-giay"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <CapGiay />
          </ProtectedRoute>
        }
      />
      <Route
        path="/caidat/he-thong"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu", "Cán bộ quản lý thu-chi"]}>
            <SystemSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu", "Cán bộ quản lý thu-chi", "User"]}>
            <Help />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu", "Cán bộ quản lý thu-chi"]}>
            <AccountInfo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/change-password"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu", "Cán bộ quản lý thu-chi"]}>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fees/types"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý thu-chi"]}>
            <FeeTypesManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fees/periods"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý thu-chi"]}>
            <CollectionPeriodsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fees/collection"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý thu-chi"]}>
            <FeeCollectionManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fees/sanitation"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý thu-chi"]}>
            <SanitationFeesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fees/sanitation/collect"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý thu-chi"]}>
            <SanitationFeeCollect />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fees/settings/sanitation-rate"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý thu-chi"]}>
            <SanitationFeeSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donations/campaigns"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý thu-chi"]}>
            <DonationCampaigns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donations/campaigns/create"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý thu-chi"]}>
            <DonationCampaignCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute allowedRoles={["Tổ trưởng", "Tổ phó", "Cán bộ quản lý nhân khẩu"]}>
            <ChangeHistory />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
