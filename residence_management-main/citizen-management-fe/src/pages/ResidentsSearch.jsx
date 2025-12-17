import { useMemo, useState } from "react";
import { Filter, Search, Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";
import { residentRecords } from "../data/residents";

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

  const results = useMemo(() => {
    return residentRecords.filter((resident) => {
      if (form.keyword && !resident.name.toLowerCase().includes(form.keyword.toLowerCase())) return false;
      if (form.cccd && !resident.cccd.includes(form.cccd)) return false;
      if (form.gender && resident.gender !== form.gender) return false;
      if (form.household && !resident.household.toLowerCase().includes(form.household.toLowerCase())) return false;
      if (form.occupation && !resident.occupation.toLowerCase().includes(form.occupation.toLowerCase())) return false;
      if (form.residenceType && resident.residenceType !== form.residenceType) return false;
      if (form.birthFrom && new Date(resident.birthDate) < new Date(form.birthFrom)) return false;
      if (form.birthTo && new Date(resident.birthDate) > new Date(form.birthTo)) return false;
      return true;
    });
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
                  <span className="text-xs text-gray-400">Tự động cập nhật khi thay đổi bộ lọc</span>
                </div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {results.length ? (
                    results.map((resident) => (
                      <div key={resident.id} className="rounded-2xl border border-white/10 p-4 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-semibold">{resident.name}</p>
                          <span className="text-xs text-gray-500">{resident.cccd}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(resident.birthDate).toLocaleDateString("vi-VN")} • {resident.gender} • {resident.household}
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
                    <p className="text-sm text-gray-400">Không có nhân khẩu phù hợp với bộ lọc.</p>
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




