import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Home, Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const API_BASE = "http://localhost:8080/api";

export default function ChangeHouseholdHead() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    soHoKhau: "",
    maNhanKhauMoi: "",
    noiDungThayDoi: "",
    ghiChu: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [householdResidents, setHouseholdResidents] = useState([]);
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [householdError, setHouseholdError] = useState("");

  useEffect(() => {
    const fetchHouseholdResidents = async () => {
      if (!formData.soHoKhau || formData.soHoKhau.trim() === "") {
        setHouseholdResidents([]);
        setHouseholdError("");
        return;
      }

      try {
        setLoadingResidents(true);
        setHouseholdError("");
        const res = await fetch(`${API_BASE}/nhankhau/ho-khau/${formData.soHoKhau}`);
        if (!res.ok) {
          if (res.status === 404) {
            setHouseholdError("Không tìm thấy hộ khẩu này");
          } else {
            throw new Error(`API lỗi: ${res.status}`);
          }
          setHouseholdResidents([]);
          return;
        }
        const data = await res.json();
        const normalized = (data || []).map((item) => ({
          maNhanKhau: item.maNhanKhau ?? "",
          hoTen: item.hoTen ?? "",
          gioiTinh: item.gioiTinh ?? "",
          ngaySinh: item.ngaySinh ?? "",
          cmnd: item.cmnd ?? "",
          quanHeVoiChuHo: item.quanHeVoiChuHo ?? "",
          trangThai: item.trangThai ?? "",
          ngheNghiep: item.ngheNghiep ?? "",
        }));
        setHouseholdResidents(normalized);
        if (normalized.length === 0) {
          setHouseholdError("Hộ khẩu này chưa có nhân khẩu nào");
        }
      } catch (err) {
        console.error(err);
        setHouseholdError("Không thể tải danh sách nhân khẩu. Vui lòng thử lại.");
        setHouseholdResidents([]);
      } finally {
        setLoadingResidents(false);
      }
    };

    // Debounce để tránh gọi API quá nhiều khi user đang gõ
    const timeoutId = setTimeout(() => {
      fetchHouseholdResidents();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.soHoKhau]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    // Reset maNhanKhauMoi khi đổi số hộ khẩu
    if (key === "soHoKhau") {
      setFormData((prev) => ({ ...prev, maNhanKhauMoi: "" }));
    }
  };

  const selectedResident = householdResidents.find(
    (r) => r.maNhanKhau.toString() === formData.maNhanKhauMoi
  );

  const validate = () => {
    const newErrors = {};
    if (!formData.soHoKhau) newErrors.soHoKhau = "Vui lòng nhập số hộ khẩu";
    if (!formData.maNhanKhauMoi) newErrors.maNhanKhauMoi = "Vui lòng chọn nhân khẩu mới";
    if (!formData.noiDungThayDoi) newErrors.noiDungThayDoi = "Vui lòng nhập nội dung thay đổi";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/nhankhau/thay-doi-chu-ho`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soHoKhau: Number(formData.soHoKhau),
          maNhanKhauMoi: Number(formData.maNhanKhauMoi),
          noiDungThayDoi: formData.noiDungThayDoi,
          ghiChu: formData.ghiChu || "",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API lỗi: ${res.status}`);
      }

      alert("Thay đổi chủ hộ thành công!");
      navigate("/households");
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100">
      <video
        className="fixed inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
        src="/videos/background.mp4"
        autoPlay
        loop
        muted
      />
      <div className="flex h-screen w-screen relative z-10 bg-black/35 backdrop-blur-sm">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="w-full h-full p-6 md:p-8 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Workflow</p>
                  <h1 className="text-3xl font-semibold text-white">Thay đổi chủ hộ</h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Cập nhật thông tin chủ hộ mới cho hộ khẩu. Vui lòng chọn nhân khẩu từ danh sách.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/households")}
                  className="px-5 py-3 rounded-xl bg-gray-800 text-gray-200 border border-white/10 hover:bg-gray-700 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại danh sách
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-900/80 border border-white/5 rounded-3xl p-6 space-y-5 shadow-2xl shadow-black/40">
                  <label className="text-sm text-gray-300">
                    Số hộ khẩu *
                    <div className="mt-2 flex items-center gap-2 rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2">
                      <Home className="w-4 h-4 text-gray-500" />
                      <input
                        type="number"
                        className={`bg-transparent flex-1 focus:outline-none text-gray-100 ${
                          errors.soHoKhau ? "border-red-500" : ""
                        }`}
                        value={formData.soHoKhau}
                        onChange={(e) => handleChange("soHoKhau", e.target.value)}
                        placeholder="Nhập số hộ khẩu"
                      />
                    </div>
                    {errors.soHoKhau && <span className="text-xs text-red-400">{errors.soHoKhau}</span>}
                  </label>

                  {/* Bảng danh sách nhân khẩu trong hộ */}
                  {formData.soHoKhau && (
                    <div className="bg-gray-800/50 border border-white/5 rounded-2xl overflow-hidden">
                      <div className="p-4 border-b border-white/5 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-300" />
                        <h3 className="text-lg font-semibold text-white">
                          Danh sách nhân khẩu trong hộ khẩu {formData.soHoKhau}
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        {loadingResidents ? (
                          <div className="p-8 text-center text-gray-400">Đang tải danh sách nhân khẩu...</div>
                        ) : householdError ? (
                          <div className="p-8 text-center text-red-400">{householdError}</div>
                        ) : householdResidents.length === 0 ? (
                          <div className="p-8 text-center text-gray-400">Chưa có nhân khẩu nào trong hộ khẩu này</div>
                        ) : (
                          <table className="w-full text-sm">
                            <thead className="bg-white/5 text-gray-400 uppercase">
                              <tr>
                                <th className="px-4 py-3 text-left">Chọn</th>
                                <th className="px-4 py-3 text-left">Họ tên</th>
                                <th className="px-4 py-3 text-left">Giới tính</th>
                                <th className="px-4 py-3 text-left">Ngày sinh</th>
                                <th className="px-4 py-3 text-left">Quan hệ với chủ hộ</th>
                                <th className="px-4 py-3 text-left">Nghề nghiệp</th>
                              </tr>
                            </thead>
                            <tbody>
                              {householdResidents.map((resident) => {
                                const isSelected = formData.maNhanKhauMoi === resident.maNhanKhau.toString();
                                return (
                                  <tr
                                    key={resident.maNhanKhau}
                                    className={`border-b border-white/5 hover:bg-white/5 transition cursor-pointer ${
                                      isSelected ? "bg-blue-500/20" : ""
                                    }`}
                                    onClick={() => handleChange("maNhanKhauMoi", resident.maNhanKhau.toString())}
                                  >
                                    <td className="px-4 py-3">
                                      <div className="flex items-center justify-center">
                                        <div
                                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            isSelected
                                              ? "bg-blue-500 border-blue-500"
                                              : "border-gray-600 hover:border-blue-400"
                                          }`}
                                        >
                                          {isSelected && (
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-white font-semibold">{resident.hoTen}</td>
                                    <td className="px-4 py-3 text-gray-300">{resident.gioiTinh}</td>
                                    <td className="px-4 py-3 text-gray-300">
                                      {resident.ngaySinh
                                        ? new Date(resident.ngaySinh).toLocaleDateString("vi-VN")
                                        : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-gray-300">{resident.quanHeVoiChuHo}</td>
                                    <td className="px-4 py-3 text-gray-300">{resident.ngheNghiep || "—"}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>
                      {errors.maNhanKhauMoi && (
                        <div className="p-4 border-t border-white/5">
                          <span className="text-xs text-red-400">{errors.maNhanKhauMoi}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <label className="text-sm text-gray-300">
                    Nội dung thay đổi *
                    <textarea
                      className={`mt-2 w-full rounded-xl bg-gray-800/80 border px-3 py-2 focus:outline-none ${
                        errors.noiDungThayDoi
                          ? "border-red-500"
                          : "border-gray-700 focus:border-blue-500"
                      }`}
                      rows={4}
                      value={formData.noiDungThayDoi}
                      onChange={(e) => handleChange("noiDungThayDoi", e.target.value)}
                      placeholder="Ví dụ: Thay đổi chủ hộ do chủ hộ cũ qua đời"
                    />
                    {errors.noiDungThayDoi && (
                      <span className="text-xs text-red-400">{errors.noiDungThayDoi}</span>
                    )}
                  </label>

                  <label className="text-sm text-gray-300">
                    Ghi chú
                    <textarea
                      className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                      rows={3}
                      value={formData.ghiChu}
                      onChange={(e) => handleChange("ghiChu", e.target.value)}
                      placeholder="Ví dụ: Chủ hộ mới là vợ của chủ hộ cũ"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    {submitting ? "Đang xử lý..." : "Xác nhận thay đổi chủ hộ"}
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-6">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Home className="w-5 h-5 text-blue-300" />
                      Thông tin nhập liệu
                    </h2>
                    <div className="mt-4 space-y-3 text-sm text-gray-300">
                      <p>
                        <span className="text-gray-500">Số hộ khẩu:</span> {formData.soHoKhau || "—"}
                      </p>
                      <p>
                        <span className="text-gray-500">Chủ hộ mới:</span>{" "}
                        {selectedResident ? selectedResident.hoTen : "—"}
                      </p>
                      {selectedResident && (
                        <p>
                          <span className="text-gray-500">Mã nhân khẩu:</span> {selectedResident.maNhanKhau}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-6">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-300" />
                      Checklist
                    </h2>
                    <ul className="mt-4 space-y-3 text-sm text-gray-200">
                      {[
                        { label: "Số hộ khẩu", done: !!formData.soHoKhau },
                        { label: "Chọn nhân khẩu mới", done: !!formData.maNhanKhauMoi },
                        { label: "Nội dung thay đổi", done: !!formData.noiDungThayDoi },
                      ].map((item) => (
                        <li key={item.label} className="flex items-center gap-2">
                          <CheckCircle2
                            className={`w-4 h-4 ${item.done ? "text-green-400" : "text-gray-600"}`}
                          />
                          <span className={item.done ? "text-white" : "text-gray-500"}>{item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>

    </div>
  );
}

