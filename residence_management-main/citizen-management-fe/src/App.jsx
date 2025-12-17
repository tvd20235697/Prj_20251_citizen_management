import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuanLiHoKhau from "./pages/quanlihokhau";
import QuanLyNhanKhau from "./pages/QuanLyNhanKhau";
import TemporaryResidents from "./pages/TemporaryResidents";
import UserManagement from "./pages/UserManagement";
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/households" element={<QuanLiHoKhau />} />
      <Route path="/households/add" element={<HouseholdAdd />} />
      <Route path="/households/split" element={<SplitHousehold />} />
      <Route path="/households/change-head" element={<ChangeHouseholdHead />} />
      <Route path="/households/by-area" element={<HouseholdByArea />} />
      <Route path="/hokhau/danh-sach" element={<QuanLiHoKhau />} />
      <Route path="/hokhau/them-moi" element={<HouseholdAdd />} />
      <Route path="/hokhau/tim-kiem" element={<HouseholdByArea />} />
      <Route path="/residents" element={<QuanLyNhanKhau />} />
      <Route path="/residents/add" element={<ResidentsAdd />} />
      <Route path="/residents/search" element={<ResidentsSearch />} />
      <Route path="/nhankhau/danh-sach" element={<QuanLyNhanKhau />} />
      <Route path="/nhankhau/them-moi" element={<ResidentsAdd />} />
      <Route path="/nhankhau/tim-kiem" element={<ResidentsSearch />} />
      <Route path="/temporary-residents" element={<TemporaryResidents />} />
      <Route path="/tamtru" element={<TemporaryResidents />} />
      <Route path="/caidat/nguoi-dung" element={<UserManagement />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/tailieu/cap-giay" element={<CapGiay />} />
      <Route path="/caidat/he-thong" element={<SystemSettings />} />
      <Route path="/help" element={<Help />} />
      <Route path="/account" element={<AccountInfo />} />
      <Route path="/account/change-password" element={<ChangePassword />} />
      <Route path="/fees/types" element={<FeeTypesManagement />} />
      <Route path="/fees/periods" element={<CollectionPeriodsManagement />} />
      <Route path="/fees/collection" element={<FeeCollectionManagement />} />
      <Route path="/fees/sanitation" element={<SanitationFeesList />} />
      <Route path="/fees/sanitation/collect" element={<SanitationFeeCollect />} />
      <Route path="/fees/settings/sanitation-rate" element={<SanitationFeeSettings />} />
      <Route path="/donations/campaigns" element={<DonationCampaigns />} />
      <Route path="/donations/campaigns/create" element={<DonationCampaignCreate />} />
      <Route path="/history" element={<ChangeHistory />} />
    </Routes>
  );
}
