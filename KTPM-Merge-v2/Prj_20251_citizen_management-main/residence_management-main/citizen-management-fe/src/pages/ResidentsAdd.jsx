import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, CheckCircle2, Home, User } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const initialForm = {
  hoTen: "",
  gioiTinh: "",
  ngaySinh: "",
  soHoKhau: "",
  quanHeVoiChuHo: "",
  ngheNghiep: "",
  trangThai: "Moi sinh",
};

export default function ResidentsAdd() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setSubmitError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.hoTen) newErrors.hoTen = "Vui lòng nhập họ tên";
    if (!formData.gioiTinh) newErrors.gioiTinh = "Chọn giới tính";
    if (!formData.ngaySinh) newErrors.ngaySinh = "Chọn ngày sinh";
    if (!formData.soHoKhau) newErrors.soHoKhau = "Nhập số hộ khẩu";
    if (!formData.quanHeVoiChuHo) newErrors.quanHeVoiChuHo = "Nhập quan hệ với chủ hộ";
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
    setSubmitError("");
    try {
      const res = await fetch("http://localhost:8080/api/nhankhau/them-moi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soHoKhau: formData.soHoKhau,
          hoTen: formData.hoTen,
          gioiTinh: formData.gioiTinh,
          ngaySinh: formData.ngaySinh,
          quanHeVoiChuHo: formData.quanHeVoiChuHo,
          ngheNghiep: formData.ngheNghiep,
          trangThai: formData.trangThai,
        }),
      });
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      alert("Đã tạo nhân khẩu mới thành công.");
      navigate("/residents");
    } catch (err) {
      console.error(err);
      setSubmitError("Không thể thêm nhân khẩu. Vui lòng thử lại.");
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
                  <h1 className="text-3xl font-semibold text-white">Thêm nhân khẩu mới</h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Điền thông tin chi tiết, hệ thống sẽ tự động đồng bộ sang danh sách cư trú và hộ khẩu liên quan.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/residents")}
                  className="px-5 py-3 rounded-xl bg-gray-800 text-gray-200 border border-white/10 hover:bg-gray-700"
                >
                  ← Quay lại danh sách
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-900/80 border border-white/5 rounded-3xl p-6 space-y-5 shadow-2xl shadow-black/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="text-sm text-gray-300">
                      Họ và tên *
                      <input
                        className={`mt-2 w-full rounded-xl bg-gray-800/80 border px-3 py-2 focus:outline-none ${
                          errors.hoTen ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                        }`}
                        value={formData.hoTen}
                        onChange={(e) => handleChange("hoTen", e.target.value)}
                        placeholder="Phạm Văn Cường"
                      />
                      {errors.hoTen && <span className="text-xs text-red-400">{errors.hoTen}</span>}
                    </label>
                    <label className="text-sm text-gray-300">
                      Giới tính *
                      <select
                        className={`mt-2 w-full rounded-xl bg-gray-800/80 border px-3 py-2 focus:outline-none ${
                          errors.gioiTinh ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                        }`}
                        value={formData.gioiTinh}
                        onChange={(e) => handleChange("gioiTinh", e.target.value)}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                      {errors.gioiTinh && <span className="text-xs text-red-400">{errors.gioiTinh}</span>}
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="text-sm text-gray-300">
                          Ngày sinh *
                          <input
                          type="date"
                          className={`mt-2 w-full rounded-xl bg-gray-800/80 border px-3 py-2 focus:outline-none ${
                                errors.ngaySinh ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                          }`}
                          // Hiển thị lại dạng yyyy-MM-dd cho input
                              value={formData.ngaySinh ? formData.ngaySinh.split("T")[0] : ""}
                          onChange={(e) => {
                            const dateValue = e.target.value; // yyyy-MM-dd
                           handleChange("ngaySinh", dateValue + "T00:00:00"); // gửi đúng format API
                            }}
                            />
                          {errors.ngaySinh && <span className="text-xs text-red-400">{errors.ngaySinh}</span>}
                          </label>

                    <label className="text-sm text-gray-300">
                      Số hộ khẩu *
                      <div className="mt-2 flex items-center gap-2 rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2">
                        <Home className="w-4 h-4 text-gray-500" />
                        <input
                          className="bg-transparent flex-1 focus:outline-none text-gray-100"
                          value={formData.soHoKhau}
                          onChange={(e) => handleChange("soHoKhau", e.target.value)}
                          placeholder="2"
                        />
                      </div>
                      {errors.soHoKhau && <span className="text-xs text-red-400">{errors.soHoKhau}</span>}
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="text-sm text-gray-300">
                      Quan hệ với chủ hộ *
                      <input
                        className={`mt-2 w-full rounded-xl bg-gray-800/80 border px-3 py-2 focus:outline-none ${
                          errors.quanHeVoiChuHo ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                        }`}
                        value={formData.quanHeVoiChuHo}
                        onChange={(e) => handleChange("quanHeVoiChuHo", e.target.value)}
                        placeholder="Chủ hộ / Vợ / Con..."
                      />
                      {errors.quanHeVoiChuHo && <span className="text-xs text-red-400">{errors.quanHeVoiChuHo}</span>}
                    </label>
                    <label className="text-sm text-gray-300">
                      Nghề nghiệp
                      <input
                        className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                        value={formData.ngheNghiep}
                        onChange={(e) => handleChange("ngheNghiep", e.target.value)}
                        placeholder="Kỹ sư"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="text-sm text-gray-300">
                      Trạng thái *
                      <select
                        className={`mt-2 w-full rounded-xl bg-gray-800/80 border px-3 py-2 focus:outline-none ${
                          errors.trangThai ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                        }`}
                        value={formData.trangThai}
                        onChange={(e) => handleChange("trangThai", e.target.value)}
                      >
                        <option value="Moi sinh">Mới sinh</option>
                        <option value="Thuong tru">Thường trú</option>
                        <option value="Qua doi">Qua đời</option>
                        <option value="Chuyen di">Chuyển đi</option>
                      </select>
                      {errors.trangThai && <span className="text-xs text-red-400">{errors.trangThai}</span>}
                    </label>
                  </div>

                  {submitError && <p className="text-sm text-red-400">{submitError}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    {submitting ? "Đang xử lý..." : "Lưu nhân khẩu"}
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-6">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-300" />
                      Thông tin nhập liệu
                    </h2>
                    <div className="mt-4 space-y-3 text-sm text-gray-300">
                      <p>
                        <span className="text-gray-500">Họ tên:</span> {formData.hoTen || "—"}
                      </p>
                      <p>
                        <span className="text-gray-500">Giới tính:</span> {formData.gioiTinh || "—"}
                      </p>
                      <p>
                        <span className="text-gray-500">Ngày sinh:</span>{" "}
                        {formData.ngaySinh ? new Date(formData.ngaySinh).toLocaleDateString("vi-VN") : "—"}
                      </p>
                      <p>
                        <span className="text-gray-500">Số hộ khẩu:</span> {formData.soHoKhau || "—"}
                      </p>
                      <p>
                        <span className="text-gray-500">Quan hệ:</span> {formData.quanHeVoiChuHo || "—"}
                      </p>
                      <p>
                        <span className="text-gray-500">Nghề nghiệp:</span> {formData.ngheNghiep || "—"}
                      </p>
                      <p>
                        <span className="text-gray-500">Trạng thái:</span> {
                          formData.trangThai === "Thuong tru" ? "Thường trú" :
                          formData.trangThai === "Moi sinh" ? "Mới sinh" :
                          formData.trangThai === "Qua doi" ? "Qua đời" :
                          formData.trangThai === "Chuyen di" ? "Chuyển đi" :
                          formData.trangThai || "—"
                        }
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-6">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-300" />
                      Yêu cầu gửi lên API
                    </h2>
                    <div className="mt-4 text-xs text-gray-200 bg-gray-800/60 rounded-2xl p-3 border border-white/5">
                      <pre className="whitespace-pre-wrap break-words">{JSON.stringify({
                        soHoKhau: formData.soHoKhau || 2,
                        hoTen: formData.hoTen || "Phạm Văn Cường",
                        gioiTinh: formData.gioiTinh || "Nam",
                        ngaySinh: formData.ngaySinh || "1980-03-20T00:00:00",
                        quanHeVoiChuHo: formData.quanHeVoiChuHo || "Chủ hộ",
                        ngheNghiep: formData.ngheNghiep || "Kỹ sư",
                        trangThai: formData.trangThai || "Moi sinh",
                      }, null, 2)}</pre>
                    </div>
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





