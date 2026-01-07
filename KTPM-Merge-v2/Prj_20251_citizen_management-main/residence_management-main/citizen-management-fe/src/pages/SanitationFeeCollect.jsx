import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Save } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";
import { householdRecords } from "../data/households";
import { feeRate } from "../data/fees";

export default function SanitationFeeCollect() {
  const navigate = useNavigate();
  const [year, setYear] = useState(2024);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [searchHousehold, setSearchHousehold] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split("T")[0]);
  const [collector, setCollector] = useState("Nguyễn Thị D - Kế toán");
  const [note, setNote] = useState("");

  const householdOptions = useMemo(() => {
    return householdRecords.filter((h) =>
      h.headName.toLowerCase().includes(searchHousehold.toLowerCase()) ||
      h.id.toLowerCase().includes(searchHousehold.toLowerCase())
    );
  }, [searchHousehold]);

  const requiredAmount = selectedHousehold ? feeRate * 12 * selectedHousehold.members : 0;

  const handleSave = () => {
    if (!selectedHousehold || !paidAmount || !paidDate) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    alert(`Đã lưu phiếu thu phí vệ sinh cho ${selectedHousehold.headName} (mô phỏng).`);
    navigate("/fees/sanitation");
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
                    <FileText className="w-8 h-8 text-blue-300" />
                    Lập Phiếu Thu Phí Vệ Sinh
                  </h1>
                </div>
              </div>

              <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-8 max-w-3xl mx-auto space-y-6">
                <label className="block text-sm text-gray-300">
                  Năm thu *
                  <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100">
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                  </select>
                </label>

                <label className="block text-sm text-gray-300">
                  Chọn hộ gia đình *
                  <div className="mt-2 space-y-2">
                    <input
                      value={searchHousehold}
                      onChange={(e) => setSearchHousehold(e.target.value)}
                      placeholder="🔍 Tìm theo tên/số HK..."
                      className="w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100"
                    />
                    {searchHousehold && householdOptions.length > 0 && (
                      <div className="bg-gray-800 rounded-xl border border-gray-700 max-h-48 overflow-y-auto">
                        {householdOptions.map((h) => (
                          <button
                            key={h.id}
                            onClick={() => {
                              setSelectedHousehold(h);
                              setSearchHousehold(h.headName);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-700 text-gray-200"
                          >
                            <p className="font-semibold">{h.headName} - {h.id}</p>
                            <p className="text-xs text-gray-400">{h.address}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedHousehold && (
                    <div className="mt-2 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                      <p className="text-sm text-blue-200">Hộ: {selectedHousehold.headName} - Số HK: {selectedHousehold.id}</p>
                      <p className="text-xs text-gray-400">Địa chỉ: {selectedHousehold.address}</p>
                      <p className="text-xs text-gray-400">Số nhân khẩu: {selectedHousehold.members} người</p>
                    </div>
                  )}
                </label>

                {selectedHousehold && (
                  <>
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-lg font-semibold text-emerald-200">Số tiền phải nộp: {requiredAmount.toLocaleString("vi-VN")} VNĐ</p>
                      <p className="text-xs text-gray-400 mt-1">({feeRate.toLocaleString("vi-VN")} × 12 tháng × {selectedHousehold.members} người)</p>
                    </div>

                    <label className="block text-sm text-gray-300">
                      Số tiền nộp *
                      <input
                        type="number"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value)}
                        placeholder="Nhập số tiền..."
                        className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100"
                      />
                      <label className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <input type="checkbox" checked={paidAmount === String(requiredAmount)} onChange={(e) => e.target.checked && setPaidAmount(String(requiredAmount))} />
                        Nộp đủ ({requiredAmount.toLocaleString("vi-VN")} VNĐ)
                      </label>
                    </label>

                    <label className="block text-sm text-gray-300">
                      Ngày nộp *
                      <input
                        type="date"
                        value={paidDate}
                        onChange={(e) => setPaidDate(e.target.value)}
                        className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100"
                      />
                    </label>

                    <label className="block text-sm text-gray-300">
                      Người thu
                      <input
                        value={collector}
                        onChange={(e) => setCollector(e.target.value)}
                        className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100"
                      />
                    </label>

                    <label className="block text-sm text-gray-300">
                      Ghi chú
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100"
                      />
                    </label>

                    <div className="flex gap-3 pt-4">
                      <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        Lưu và In biên lai
                      </button>
                      <button onClick={() => navigate("/fees/sanitation")} className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700">
                        Hủy
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

