import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, Plus, UserPlus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";
import { residentPool } from "../data/households";

const householdTypes = [
  { value: "thuong-tru", label: "Hộ thường trú" },
  { value: "tam-tru", label: "Hộ tạm trú" },
  { value: "kinh-doanh", label: "Hộ kinh doanh" },
];

export default function HouseholdAdd() {
  const [formData, setFormData] = useState({
    bookNumber: "",
    headId: "",
    address: "",
    area: "",
    type: "thuong-tru",
    note: "",
  });
  const [members, setMembers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const headOptions = useMemo(
    () =>
      residentPool.map((resident) => ({
        value: resident.id,
        label: `${resident.name} (${resident.cccd})`,
      })),
    []
  );

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleMember = (residentId) => {
    setMembers((prev) =>
      prev.includes(residentId) ? prev.filter((id) => id !== residentId) : [...prev, residentId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bookNumber || !formData.headId || !formData.address || !formData.area) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }
    setSubmitted(true);
    alert("Hộ khẩu mới đã được tạo (mô phỏng).");
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
                  <h1 className="text-3xl font-semibold text-white">Thêm hộ khẩu mới</h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Điền thông tin hộ khẩu, chọn chủ hộ từ danh sách nhân khẩu và phân loại theo tổ dân phố / loại hộ.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ bookNumber: "", headId: "", address: "", area: "", type: "thuong-tru", note: "" })}
                  className="px-5 py-3 rounded-xl bg-gray-800 text-gray-200 border border-white/10 hover:bg-gray-700"
                >
                  Reset form
                </button>
              </div>

              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-900/80 border border-white/5 rounded-3xl p-6 shadow-2xl shadow-black/40">
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="text-sm text-gray-300">
                        Số hộ khẩu *
                        <input
                          type="text"
                          className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                          value={formData.bookNumber}
                          onChange={(e) => handleChange("bookNumber", e.target.value)}
                          placeholder="Ví dụ: HK-011"
                        />
                      </label>
                      <label className="text-sm text-gray-300">
                        Tổ dân phố *
                        <select
                          className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                          value={formData.area}
                          onChange={(e) => handleChange("area", e.target.value)}
                        >
                          <option value="">Chọn tổ dân phố</option>
                          {Array.from({ length: 7 }, (_, i) => (
                            <option key={i} value={i + 1}>
                              Tổ dân phố {i + 1}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="text-sm text-gray-300">
                      Chọn chủ hộ *
                      <select
                        className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                        value={formData.headId}
                        onChange={(e) => handleChange("headId", e.target.value)}
                      >
                        <option value="">-- Chọn nhân khẩu --</option>
                        {headOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="text-sm text-gray-300">
                      Địa chỉ cụ thể *
                      <input
                        type="text"
                        className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Số nhà, ngõ, đường..."
                      />
                    </label>

                    <div>
                      <p className="text-sm text-gray-300 mb-2">Loại hộ</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {householdTypes.map((type) => (
                          <label
                            key={type.value}
                            className={`rounded-2xl border px-4 py-3 cursor-pointer text-sm ${
                              formData.type === type.value
                                ? "border-blue-500 bg-blue-500/10 text-white"
                                : "border-gray-700 bg-gray-800/60 text-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              className="hidden"
                              checked={formData.type === type.value}
                              onChange={() => handleChange("type", type.value)}
                            />
                            {type.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <label className="text-sm text-gray-300">
                      Ghi chú
                      <textarea
                        className="mt-2 w-full rounded-2xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500 min-h-[120px]"
                        value={formData.note}
                        onChange={(e) => handleChange("note", e.target.value)}
                        placeholder="Thông tin bổ sung, tình trạng cư trú..."
                      />
                    </label>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-200">Thêm thành viên trong hộ khẩu</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                        {residentPool.map((resident) => (
                          <label
                            key={resident.id}
                            className={`rounded-2xl border px-4 py-3 flex flex-col gap-1 cursor-pointer ${
                              members.includes(resident.id)
                                ? "border-emerald-500 bg-emerald-500/10 text-white"
                                : "border-gray-700 bg-gray-800/50 text-gray-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={members.includes(resident.id)}
                              onChange={() => toggleMember(resident.id)}
                            />
                            <span className="font-semibold">{resident.name}</span>
                            <span className="text-xs text-gray-400">{resident.cccd}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" /> Tạo hộ khẩu
                    </button>
                  </form>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-blue-300" />
                      Thông tin tổng quan
                    </h2>
                    <div className="mt-4 space-y-3 text-sm text-gray-300">
                      <p>
                        <span className="text-gray-400">Chủ hộ:</span> {headOptions.find((o) => o.value === formData.headId)?.label || "—"}
                      </p>
                      <p>
                        <span className="text-gray-400">Số hộ khẩu:</span> {formData.bookNumber || "—"}
                      </p>
                      <p>
                        <span className="text-gray-400">Tổ dân phố:</span> {formData.area ? `Tổ ${formData.area}` : "—"}
                      </p>
                      <p>
                        <span className="text-gray-400">Loại hộ:</span> {householdTypes.find((h) => h.value === formData.type)?.label}
                      </p>
                      <p>
                        <span className="text-gray-400">Thành viên:</span> {members.length} người
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-900/80 border border-green-500/30 rounded-3xl p-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-green-300" />
                      Checklist tạo hộ
                    </h2>
                    <ul className="mt-4 space-y-3 text-sm text-gray-200">
                      {[
                        { label: "Thông tin chủ hộ", done: !!formData.headId },
                        { label: "Địa chỉ và tổ dân phố", done: !!formData.address && !!formData.area },
                        { label: "Loại hộ", done: !!formData.type },
                        { label: "Danh sách thành viên", done: members.length > 0 },
                      ].map((item) => (
                        <li key={item.label} className="flex items-center gap-2">
                          <CheckCircle2 className={`w-4 h-4 ${item.done ? "text-green-400" : "text-gray-600"}`} />
                          <span className={item.done ? "text-white" : "text-gray-500"}>{item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {submitted && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 text-sm text-emerald-100">
                      Hộ khẩu mới đã được lưu trong hệ thống (mô phỏng). Bạn có thể quay lại danh sách để kiểm tra.
                    </div>
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




