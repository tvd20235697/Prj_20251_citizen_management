import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserLayout from "../components/UserLayout";
import householdService from "../services/household.service";

export default function UserHousehold() {
  const { user } = useAuth();
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHousehold = async () => {
      try {
        setLoading(true);
        setError(null);
        if (user?.householdId) {
          const data = await householdService.getHouseholdByNumber(
            user.householdId
          );
          setHousehold(data);
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch household:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHousehold();
  }, [user?.householdId]);

  return (
    <UserLayout
      title="Hộ khẩu đang ở"
      subtitle="Thông tin hộ khẩu gắn với tài khoản hiện tại"
    >
      <div className="space-y-4">
        {loading && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              Đang tải thông tin hộ khẩu...
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Lỗi: {error}
          </div>
        )}

        {!loading && !household && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Chưa tìm thấy hộ khẩu gắn với tài khoản này (householdId:
            {user?.householdId || "—"}). Vui lòng kiểm tra lại thông tin.
          </div>
        )}

        {household && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Sổ hộ khẩu
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {household.soHoKhau || household.id}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700 border border-emerald-300">
                {household.loaiCuTru === "Thường trú" ||
                household.loaiCuTru === "thuong-tru"
                  ? "Thường trú"
                  : household.loaiCuTru === "Tạm trú" ||
                    household.loaiCuTru === "tam-tru"
                  ? "Tạm trú"
                  : "Khác"}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="text-gray-500 text-xs mb-1">Chủ hộ</p>
                <p className="font-medium text-gray-900">
                  {household.chuHo || household.headName || "—"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Số điện thoại</p>
                <p className="text-gray-900">
                  {household.soDienThoai || household.phone || "—"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500 text-xs mb-1">Địa chỉ</p>
                <p className="text-gray-900">
                  {household.soNhaDuong && household.xa
                    ? `${household.soNhaDuong}, ${household.xa}`
                    : `${household.address || "—"} ${
                        household.ward ? `- ${household.ward}` : ""
                      }`}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Số nhân khẩu</p>
                <p className="text-gray-900">
                  {household.soNhanKhau || household.members || "—"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Xã/Phường</p>
                <p className="text-gray-900">
                  {household.xa || household.area || "—"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Ngày đăng ký</p>
                <p className="text-gray-900">
                  {household.ngayDangKy || household.registeredAt || "—"}
                </p>
              </div>
              {household.ghiChu && (
                <div className="sm:col-span-2">
                  <p className="text-gray-500 text-xs mb-1">Ghi chú</p>
                  <p className="text-gray-900">{household.ghiChu}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
