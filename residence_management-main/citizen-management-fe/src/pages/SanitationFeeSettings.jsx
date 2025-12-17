import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";
import { feeRate } from "../data/fees";

const rateHistory = [
  { year: 2024, rate: 6000, updatedBy: "Nguyễn D", updatedAt: "2024-01-01" },
  { year: 2023, rate: 5000, updatedBy: "Trần E", updatedAt: "2023-01-01" },
  { year: 2022, rate: 5000, updatedBy: "Trần E", updatedAt: "2022-01-01" },
];

export default function SanitationFeeSettings() {
  const navigate = useNavigate();
  const [currentRate, setCurrentRate] = useState(feeRate);
  const [applyYear, setApplyYear] = useState(2024);
  const [saving, setSaving] = useState(false);

  const sortedHistory = useMemo(() => {
    return [...rateHistory].sort((a, b) => b.year - a.year);
  }, []);

  const handleSave = () => {
    if (!currentRate || currentRate <= 0) {
      alert("Vui lòng nhập định mức hợp lệ (lớn hơn 0)");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      alert(`Đã cập nhật định mức phí vệ sinh thành ${currentRate.toLocaleString("vi-VN")} VNĐ/tháng/nhân khẩu (mô phỏng).`);
      setSaving(false);
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100">
      <video className="fixed inset-0 w-full h-full object-cover opacity-30 pointer-events-none" src="/videos/background.mp4" autoPlay loop muted />
      <div className="flex h-screen w-screen relative z-10 bg-black/40 backdrop-blur-sm">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="w-full h-full p-6 md:p-8 space-y-8">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate("/fees/sanitation")} className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Module Thu-Chi</p>
                  <h1 className="text-3xl font-semibold text-white flex items-center gap-3">
                    <Settings className="w-8 h-8 text-blue-300" />
                    Cài Đặt Định Mức Phí Vệ Sinh
                  </h1>
                </div>
              </div>

              <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-8 max-w-4xl mx-auto space-y-8">
                <div className="space-y-4">
                  <label className="block text-sm text-gray-300">
                    Định mức hiện tại
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        type="number"
                        value={currentRate}
                        onChange={(e) => setCurrentRate(Number(e.target.value))}
                        min="0"
                        step="1000"
                        className="flex-1 rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-gray-400 whitespace-nowrap">VNĐ / 1 tháng / 1 nhân khẩu</span>
                    </div>
                  </label>

                  <label className="block text-sm text-gray-300">
                    Áp dụng từ năm
                    <select
                      value={applyYear}
                      onChange={(e) => setApplyYear(Number(e.target.value))}
                      className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Lịch sử thay đổi</h3>
                  <div className="bg-gray-800/60 rounded-xl border border-gray-700 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-400 font-semibold">Năm</th>
                          <th className="px-4 py-3 text-left text-gray-400 font-semibold">Định mức</th>
                          <th className="px-4 py-3 text-left text-gray-400 font-semibold">Người sửa</th>
                          <th className="px-4 py-3 text-left text-gray-400 font-semibold">Ngày cập nhật</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedHistory.map((item, idx) => (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                            <td className="px-4 py-3 text-gray-200 font-medium">{item.year}</td>
                            <td className="px-4 py-3 text-gray-200">{item.rate.toLocaleString("vi-VN")} đ</td>
                            <td className="px-4 py-3 text-gray-200">{item.updatedBy}</td>
                            <td className="px-4 py-3 text-gray-400">{new Date(item.updatedAt).toLocaleDateString("vi-VN")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? "Đang lưu..." : "Lưu"}
                  </button>
                  <button onClick={() => navigate("/fees/sanitation")} className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700">
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

