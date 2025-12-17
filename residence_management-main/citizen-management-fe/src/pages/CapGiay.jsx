import { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

export default function CapGiay() {
  const [form, setForm] = useState({
    loaiGiay: "Giấy tạm trú",
    hoTen: "",
    ngaySinh: "",
    soCCCD: "",
    diaChi: "",
    lyDo: "",
    tuNgay: "",
    denNgay: "",
    ghiChu: "",
    toTruong: "",
  });
  const previewRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handlePrint = async () => {
    // Try to use html2canvas + jsPDF if available, otherwise fallback to window.print
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).jsPDF;
      const element = previewRef.current;
      if (!element) return alert("Không tìm thấy nội dung để in");
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${form.loaiGiay.replaceAll(" ", "_")}_${form.hoTen || "khach"}.pdf`);
    } catch (e) {
      console.warn(e);
      // Fallback
      window.print();
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="flex h-screen w-screen relative z-10">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="w-full h-full p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-600">Tổ trưởng / Cấp giấy</p>
                  <h1 className="text-3xl font-semibold text-gray-900">Cấp giấy - Mẫu biểu</h1>
                  <p className="text-gray-500 mt-1">Điền thông tin rồi xuất file PDF cho người dân.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow">
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <label className="text-sm text-gray-700">
                      Loại giấy
                      <select name="loaiGiay" value={form.loaiGiay} onChange={handleChange} className="mt-2 w-full rounded-md border p-2">
                        <option>Giấy tạm trú</option>
                        <option>Giấy tạm vắng</option>
                        <option>Giấy xác nhận cư trú</option>
                        <option>Giấy cấp phép kinh doanh</option>
                        <option>Giấy tách hộ</option>
                        <option>Giấy tờ khác</option>
                      </select>
                    </label>

                    <label className="text-sm text-gray-7">
                      Họ và tên
                      <input name="hoTen" value={form.hoTen} onChange={handleChange} className="mt-2 w-full rounded-md border p-2" />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-sm text-gray-700">
                        Ngày sinh
                        <input name="ngaySinh" value={form.ngaySinh} onChange={handleChange} type="date" className="mt-2 w-full rounded-md border p-2" />
                      </label>
                      <label className="text-sm text-gray-700">
                        Số CCCD
                        <input name="soCCCD" value={form.soCCCD} onChange={handleChange} className="mt-2 w-full rounded-md border p-2" />
                      </label>
                    </div>

                    <label className="text-sm text-gray-700">
                      Địa chỉ
                      <input name="diaChi" value={form.diaChi} onChange={handleChange} className="mt-2 w-full rounded-md border p-2" />
                    </label>

                    <label className="text-sm text-gray-700">
                      Lý do / Ghi chú
                      <textarea name="lyDo" value={form.lyDo} onChange={handleChange} className="mt-2 w-full rounded-md border p-2" rows={3} />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-sm text-gray-700">
                        Từ ngày
                        <input name="tuNgay" value={form.tuNgay} onChange={handleChange} type="date" className="mt-2 w-full rounded-md border p-2" />
                      </label>
                      <label className="text-sm text-gray-700">
                        Đến ngày
                        <input name="denNgay" value={form.denNgay} onChange={handleChange} type="date" className="mt-2 w-full rounded-md border p-2" />
                      </label>
                    </div>

                    <label className="text-sm text-gray-700">
                      Tổ trưởng (ký tên)
                      <input name="toTruong" value={form.toTruong} onChange={handleChange} className="mt-2 w-full rounded-md border p-2" />
                    </label>

                    <div className="flex gap-3 mt-4">
                      <button type="button" onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">Xuất PDF</button>
                      <button type="button" onClick={() => setForm({ loaiGiay: "Giấy tạm trú", hoTen: "", ngaySinh: "", soCCCD: "", diaChi: "", lyDo: "", tuNgay: "", denNgay: "", ghiChu: "", toTruong: "" })} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Xóa</button>
                    </div>
                  </form>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow">
                  <p className="text-sm text-gray-500 mb-4">Xem trước mẫu giấy sẽ xuất (A4)</p>
                  <div ref={previewRef} className="p-6 border border-gray-200 rounded-md bg-white text-black">
                    {form.loaiGiay === "Giấy cấp phép kinh doanh" ? (
                      <div>
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-bold">{form.loaiGiay}</h3>
                          <p className="text-sm">UBND Phường La Khê</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><strong>Tên hộ kinh doanh / Doanh nghiệp:</strong> {form.hoTen || "......................................"}</p>
                          <p><strong>Loại hình KD:</strong> {form.lyDo || "......................................"}</p>
                          <p><strong>Địa chỉ đăng ký:</strong> {form.diaChi || "......................................"}</p>
                          <p><strong>Ngày cấp:</strong> {form.tuNgay || "..."}</p>
                          <p><strong>Ghi chú:</strong> {form.ghiChu || "......................................"}</p>
                        </div>
                        <div className="mt-8 text-right text-sm">Tổ trưởng: <strong>{form.toTruong || "(ký tên)"}</strong></div>
                      </div>
                    ) : form.loaiGiay === "Giấy tách hộ" ? (
                      <div>
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-bold">{form.loaiGiay}</h3>
                          <p className="text-sm">UBND Phường La Khê</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><strong>Hộ khẩu gốc:</strong> {form.diaChi || "......................................"}</p>
                          <p><strong>Người tách:</strong> {form.hoTen || "......................................"}</p>
                          <p><strong>Lý do tách:</strong> {form.lyDo || "......................................"}</p>
                        </div>
                        <div className="mt-8 text-right text-sm">Tổ trưởng: <strong>{form.toTruong || "(ký tên)"}</strong></div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-bold">{form.loaiGiay}</h3>
                          <p className="text-sm">UBND Phường La Khê</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><strong>Họ tên:</strong> {form.hoTen || "......................................"}</p>
                          <p><strong>Ngày sinh:</strong> {form.ngaySinh || "........"}</p>
                          <p><strong>Số CCCD:</strong> {form.soCCCD || "..............."}</p>
                          <p><strong>Địa chỉ:</strong> {form.diaChi || "......................................"}</p>
                          <p><strong>Lý do:</strong> {form.lyDo || "......................................"}</p>
                          <p><strong>Thời hạn:</strong> {form.tuNgay || "..."} - {form.denNgay || "..."}</p>
                        </div>
                        <div className="mt-6 text-right text-sm">Tổ trưởng: <strong>{form.toTruong || "(ký tên)"}</strong></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
