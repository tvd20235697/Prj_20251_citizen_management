import { useState, useEffect } from "react";
import { Filter, Search, Users, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const API_BASE = "http://localhost:8080/api";

export default function ResidentsSearch() {
  const [form, setForm] = useState({
    keyword: "",
    cccd: "",
    birthFrom: "",
    birthTo: "",
    gender: "",
    household: "",
    occupation: "",
    residenceType: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm tìm kiếm từ backend
  const searchResidents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Xây dựng request body theo TimKiemRequest (chỉ có hoTen, soHoKhau, cmnd)
      const searchRequest = {};
      if (form.keyword) searchRequest.hoTen = form.keyword;
      if (form.cccd) searchRequest.cmnd = form.cccd;
      if (form.household) {
        const soHoKhau = parseInt(form.household.replace(/\D/g, ""));
        if (!isNaN(soHoKhau)) searchRequest.soHoKhau = soHoKhau;
      }

      // Nếu không có điều kiện nào, lấy tất cả nhân khẩu
      let data = [];
      if (Object.keys(searchRequest).length > 0) {
        const response = await fetch(`${API_BASE}/nhankhau/tim-kiem`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(searchRequest),
        });

        if (!response.ok) {
          throw new Error(`Lỗi tìm kiếm: ${response.status}`);
        }

        data = await response.json();
      } else {
        // Lấy tất cả nhân khẩu
        const response = await fetch(`${API_BASE}/nhankhau`);
        if (response.ok) {
          data = await response.json();
        }
      }

      const mapped = (Array.isArray(data) ? data : []).map((nk) => ({
        id: nk.maNhanKhau,
        name: nk.hoTen || "",
        gender: nk.gioiTinh || "",
        birthDate: nk.ngaySinh ? (nk.ngaySinh.includes("T") ? nk.ngaySinh.split("T")[0] : nk.ngaySinh) : "",
        cccd: nk.cmnd || "",
        household: nk.soHoKhau ? String(nk.soHoKhau) : "",
        occupation: nk.ngheNghiep || "",
        residenceType: nk.trangThai?.toLowerCase().includes("tam") ? "tam-tru" : 
                      nk.trangThai?.toLowerCase().includes("kinh") ? "kinh-doanh" : "thuong-tru",
      }));

      // Lọc thêm ở frontend theo các điều kiện khác
      let filtered = mapped;
      if (form.gender) {
        filtered = filtered.filter(r => r.gender === form.gender);
      }
      if (form.residenceType) {
        filtered = filtered.filter(r => r.residenceType === form.residenceType);
      }
      if (form.occupation) {
        filtered = filtered.filter(r => 
          r.occupation && r.occupation.toLowerCase().includes(form.occupation.toLowerCase())
        );
      }
      if (form.birthFrom) {
        filtered = filtered.filter(r => {
          if (!r.birthDate) return false;
          return new Date(r.birthDate) >= new Date(form.birthFrom);
        });
      }
      if (form.birthTo) {
        filtered = filtered.filter(r => {
          if (!r.birthDate) return false;
          return new Date(r.birthDate) <= new Date(form.birthTo);
        });
      }

      setResults(filtered);
    } catch (err) {
      console.error("Error searching residents:", err);
      setError(err.message || "Không thể tìm kiếm nhân khẩu");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Tự động tìm kiếm khi form thay đổi (với debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Chỉ tìm kiếm nếu có ít nhất một điều kiện
      const hasCondition = form.keyword || form.cccd || form.gender || form.household || 
                          form.occupation || form.residenceType || form.birthFrom || form.birthTo;
      if (hasCondition) {
        searchResidents();
      } else {
        setResults([]);
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [form]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setForm({
      keyword: "",
      cccd: "",
      birthFrom: "",
      birthTo: "",
      gender: "",
      household: "",
      occupation: "",
      residenceType: "",
    });
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
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Advanced search</p>
                  <h1 className="text-3xl font-semibold text-white">Tìm kiếm nâng cao</h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Lọc nhân khẩu theo nhiều tiêu chí kết hợp, hỗ trợ kiểm tra dữ liệu cư trú tinh gọn.
                  </p>
                </div>
                <button
                  className="px-5 py-3 rounded-xl bg-gray-800 text-gray-200 border border-white/10 hover:bg-gray-700"
                  onClick={() => (window.location.href = "/residents")}
                >
                  ← Quay lại danh sách
                </button>
              </div>

              <section className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 space-y-6 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-300" />
                    Bộ lọc tìm kiếm
                  </h2>
                  <button className="text-sm text-blue-300 hover:text-blue-200" onClick={handleReset}>
                    Reset bộ lọc
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="text-sm text-gray-300">
                    Họ tên
                    <input
                      className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                      value={form.keyword}
                      onChange={(e) => handleChange("keyword", e.target.value)}
                      placeholder="Nhập họ tên"
                    />
                  </label>
                  <label className="text-sm text-gray-300">
                    CCCD
                    <input
                      className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                      value={form.cccd}
                      onChange={(e) => handleChange("cccd", e.target.value)}
                      placeholder="012345678901"
                    />
                  </label>
                  <label className="text-sm text-gray-300">
                    Nơi cư trú (Số hộ khẩu)
                    <input
                      className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                      value={form.household}
                      onChange={(e) => handleChange("household", e.target.value)}
                      placeholder="HK-001"
                    />
                  </label>
                  <label className="text-sm text-gray-300">
                    Nghề nghiệp
                    <input
                      className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                      value={form.occupation}
                      onChange={(e) => handleChange("occupation", e.target.value)}
                      placeholder="Kế toán, công chức..."
                    />
                  </label>
                  <label className="text-sm text-gray-300">
                    Giới tính
                    <select
                      className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                      value={form.gender}
                      onChange={(e) => handleChange("gender", e.target.value)}
                    >
                      <option value="">Tất cả</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </label>
                  <label className="text-sm text-gray-300">
                    Loại cư trú
                    <select
                      className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                      value={form.residenceType}
                      onChange={(e) => handleChange("residenceType", e.target.value)}
                    >
                      <option value="">Tất cả</option>
                      <option value="thuong-tru">Thường trú</option>
                      <option value="tam-tru">Tạm trú</option>
                      <option value="kinh-doanh">Kinh doanh</option>
                    </select>
                  </label>
                  <label className="text-sm text-gray-300">
                    Ngày sinh từ
                    <input
                      type="date"
                      className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                      value={form.birthFrom}
                      onChange={(e) => handleChange("birthFrom", e.target.value)}
                    />
                  </label>
                  <label className="text-sm text-gray-300">
                    Ngày sinh đến
                    <input
                      type="date"
                      className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                      value={form.birthTo}
                      onChange={(e) => handleChange("birthTo", e.target.value)}
                    />
                  </label>
                </div>
              </section>

              <section className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-300" />
                    Kết quả ({results.length})
                  </h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={searchResidents}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang tìm...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Tìm kiếm
                        </>
                      )}
                    </button>
                    <span className="text-xs text-gray-400">Tự động cập nhật khi thay đổi bộ lọc</span>
                  </div>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                      <span className="ml-2 text-gray-400">Đang tìm kiếm...</span>
                    </div>
                  ) : results.length ? (
                    results.map((resident) => (
                      <div key={resident.id} className="rounded-2xl border border-white/10 p-4 flex flex-col gap-1 hover:border-blue-500/30 transition">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-semibold">{resident.name || "—"}</p>
                          <span className="text-xs text-gray-500 font-mono">{resident.cccd || "—"}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {resident.birthDate ? new Date(resident.birthDate).toLocaleDateString("vi-VN") : "—"} • {resident.gender || "—"} • Hộ khẩu {resident.household || "—"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                          <span className="px-2 py-0.5 rounded-full bg-white/5">{resident.occupation || "Chưa cập nhật"}</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-200">
                            {resident.residenceType === "thuong-tru"
                              ? "Thường trú"
                              : resident.residenceType === "tam-tru"
                              ? "Tạm trú"
                              : "Kinh doanh"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-8">
                      {error ? "Có lỗi xảy ra khi tìm kiếm" : "Không có nhân khẩu phù hợp với bộ lọc."}
                    </p>
                  )}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}




