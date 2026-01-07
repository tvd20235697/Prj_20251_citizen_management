import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import UserLayout from "../components/UserLayout";
import { DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";

const API_BASE = "http://localhost:8080/api";

export default function UserPayment() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feeTypes, setFeeTypes] = useState([]);
  const [collectionPeriods, setCollectionPeriods] = useState([]);
  const [payments, setPayments] = useState([]);
  const [household, setHousehold] = useState(null);

  useEffect(() => {
    if (user?.householdId || user?.soHoKhau) {
      fetchPaymentData();
    }
  }, [user]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const soHoKhau = user?.householdId || user?.soHoKhau;
      if (!soHoKhau) {
        throw new Error("Không tìm thấy số hộ khẩu");
      }

      // Lấy thông tin hộ khẩu
      try {
        const householdRes = await fetch(`${API_BASE}/hokhau/${soHoKhau}`);
        if (householdRes.ok) {
          const householdData = await householdRes.json();
          setHousehold(householdData);
        }
      } catch (err) {
        console.error("Error fetching household:", err);
      }

      // Lấy danh sách loại phí
      const feeTypesRes = await fetch(`${API_BASE}/loai-phi`);
      if (feeTypesRes.ok) {
        const feeTypesData = await feeTypesRes.json();
        setFeeTypes(feeTypesData || []);
      }

      // Lấy danh sách đợt thu
      const periodsRes = await fetch(`${API_BASE}/dot-thu`);
      if (periodsRes.ok) {
        const periodsData = await periodsRes.json();
        setCollectionPeriods(periodsData || []);
      }

      // Lấy danh sách các khoản đã đóng phí
      const paymentsRes = await fetch(`${API_BASE}/thu-phi`);
      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        // Lọc chỉ lấy các khoản phí của hộ khẩu này
        const householdPayments = (paymentsData || []).filter(
          (p) => p.soHoKhau === Number(soHoKhau)
        );
        setPayments(householdPayments);
      }
    } catch (err) {
      console.error("Error fetching payment data:", err);
      setError(err.message || "Không thể tải dữ liệu phí");
    } finally {
      setLoading(false);
    }
  };

  // Tính toán các khoản phí cần đóng
  const calculateFeesToPay = () => {
    if (!feeTypes.length || !collectionPeriods.length) {
      return [];
    }

    const feesToPay = [];

    // Duyệt qua từng loại phí và đợt thu
    feeTypes.forEach((feeType) => {
      collectionPeriods.forEach((period) => {
        // Kiểm tra xem đã đóng chưa
        const alreadyPaid = payments.find(
          (p) =>
            p.maLoai === feeType.maLoaiPhi &&
            p.maDotThu === period.maDotThu &&
            p.soHoKhau === Number(user?.householdId || user?.soHoKhau)
        );

        if (!alreadyPaid) {
          feesToPay.push({
            loaiPhi: feeType,
            dotThu: period,
            soTien: feeType.mucPhi || 0,
            trangThai: "CHUA_DONG",
          });
        } else {
          feesToPay.push({
            loaiPhi: feeType,
            dotThu: period,
            soTien: alreadyPaid.soTien || feeType.mucPhi || 0,
            trangThai: "DA_DONG",
            ngayDong: alreadyPaid.ngayDong,
            maThuPhi: alreadyPaid.maThuPhi,
          });
        }
      });
    });

    return feesToPay;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const feesToPay = calculateFeesToPay();
  const unpaidFees = feesToPay.filter((f) => f.trangThai === "CHUA_DONG");
  const paidFees = feesToPay.filter((f) => f.trangThai === "DA_DONG");
  const totalUnpaid = unpaidFees.reduce((sum, f) => sum + (f.soTien || 0), 0);
  const totalPaid = paidFees.reduce((sum, f) => sum + (f.soTien || 0), 0);

  if (loading) {
    return (
      <UserLayout
        title="Đóng phí"
        subtitle="Xem và quản lý các khoản phí cần đóng"
      >
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            Đang tải dữ liệu phí...
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout
        title="Đóng phí"
        subtitle="Xem và quản lý các khoản phí cần đóng"
      >
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Lỗi: {error}
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout
      title="Đóng phí"
      subtitle="Xem và quản lý các khoản phí cần đóng cho hộ khẩu"
    >
      <div className="space-y-6">
        {/* Thông tin hộ khẩu */}
        {household && (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Số hộ khẩu</p>
                <p className="text-lg font-semibold text-gray-900">
                  {household.soHoKhau}
                </p>
              </div>
              {household.chuHo && (
                <div>
                  <p className="text-sm text-gray-500">Chủ hộ</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {household.chuHo}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <p className="text-sm font-medium text-amber-800">
                Chưa đóng
              </p>
            </div>
            <p className="text-2xl font-bold text-amber-900">
              {unpaidFees.length} khoản
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Tổng: {formatCurrency(totalUnpaid)}
            </p>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">
                Đã đóng
              </p>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {paidFees.length} khoản
            </p>
            <p className="text-sm text-green-700 mt-1">
              Tổng: {formatCurrency(totalPaid)}
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-800">
                Tổng cộng
              </p>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {feesToPay.length} khoản
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Tổng: {formatCurrency(totalUnpaid + totalPaid)}
            </p>
          </div>
        </div>

        {/* Danh sách phí chưa đóng */}
        {unpaidFees.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="bg-amber-50 border-b border-amber-200 p-4">
              <h3 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Các khoản phí chưa đóng ({unpaidFees.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Loại phí
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Đợt thu
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Số tiền
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {unpaidFees.map((fee, index) => (
                    <tr
                      key={`${fee.loaiPhi.maLoaiPhi}-${fee.dotThu.maDotThu}`}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-900">
                        {fee.loaiPhi.tenLoaiPhi || "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {fee.dotThu.tenDotThu || "—"}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">
                        {formatCurrency(fee.soTien)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-300">
                          <Clock className="w-3 h-3" />
                          Chưa đóng
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                  <tr>
                    <td
                      colSpan={2}
                      className="py-3 px-4 font-semibold text-gray-900"
                    >
                      Tổng cộng
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900">
                      {formatCurrency(totalUnpaid)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Danh sách phí đã đóng */}
        {paidFees.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="bg-green-50 border-b border-green-200 p-4">
              <h3 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Các khoản phí đã đóng ({paidFees.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Loại phí
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Đợt thu
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Số tiền
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Ngày đóng
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paidFees.map((fee, index) => (
                    <tr
                      key={`${fee.loaiPhi.maLoaiPhi}-${fee.dotThu.maDotThu}`}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-900">
                        {fee.loaiPhi.tenLoaiPhi || "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {fee.dotThu.tenDotThu || "—"}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">
                        {formatCurrency(fee.soTien)}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {formatDate(fee.ngayDong)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                          <CheckCircle className="w-3 h-3" />
                          Đã đóng
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                  <tr>
                    <td
                      colSpan={2}
                      className="py-3 px-4 font-semibold text-gray-900"
                    >
                      Tổng cộng
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900">
                      {formatCurrency(totalPaid)}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Không có phí nào */}
        {feesToPay.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Hiện tại không có khoản phí nào cần đóng.
            </p>
          </div>
        )}

        {/* Thông báo */}
        {unpaidFees.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900 mb-1">
                  Lưu ý về việc đóng phí
                </p>
                <p className="text-sm text-amber-800">
                  Bạn có {unpaidFees.length} khoản phí chưa đóng với tổng số tiền{" "}
                  {formatCurrency(totalUnpaid)}. Vui lòng liên hệ với cán bộ quản lý
                  để thực hiện đóng phí.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

