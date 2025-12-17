import { Pencil } from "lucide-react";

export default function ResidentEditModal({
  open,
  form,
  errors,
  submitting,
  submitError,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-gray-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Pencil className="w-5 h-5 text-yellow-300" />
            Cập nhật thay đổi nhân khẩu
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm text-gray-300">
              Mã nhân khẩu *
              <input
                className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                  errors.maNhanKhau ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                }`}
                value={form.maNhanKhau}
                readOnly
              />
              {errors.maNhanKhau && <span className="text-xs text-red-400">{errors.maNhanKhau}</span>}
            </label>
            <label className="text-sm text-gray-300">
              Loại thay đổi *
              <select
                className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                  errors.loaiThayDoi ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                }`}
                value={form.loaiThayDoi}
                onChange={(e) => onChange("loaiThayDoi", e.target.value)}
              >
                <option value="">Chọn loại thay đổi</option>
                <option value="Chuyen di">Chuyển đi</option>
                <option value="Chuyen den">Chuyển đến</option>
                <option value="Cap nhat">Cập nhật</option>
              </select>
              {errors.loaiThayDoi && <span className="text-xs text-red-400">{errors.loaiThayDoi}</span>}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm text-gray-300">
              Ngày chuyển đi *
              <input
                type="datetime-local"
                className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                  errors.ngayChuyenDi ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                }`}
                value={form.ngayChuyenDi ? form.ngayChuyenDi.slice(0, 16) : ""}
                onChange={(e) => onChange("ngayChuyenDi", e.target.value ? `${e.target.value}:00` : "")}
              />
              {errors.ngayChuyenDi && <span className="text-xs text-red-400">{errors.ngayChuyenDi}</span>}
            </label>
            <label className="text-sm text-gray-300">
              Nơi chuyển *
              <input
                className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                  errors.noiChuyen ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                }`}
                value={form.noiChuyen}
                onChange={(e) => onChange("noiChuyen", e.target.value)}
                placeholder="Hà Nội"
              />
              {errors.noiChuyen && <span className="text-xs text-red-400">{errors.noiChuyen}</span>}
            </label>
          </div>

          <label className="text-sm text-gray-300">
            Nội dung thay đổi *
            <textarea
              className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                errors.noiDungThayDoi ? "border-red-500" : "border-gray-700 focus:border-blue-500"
              }`}
              rows={3}
              value={form.noiDungThayDoi}
              onChange={(e) => onChange("noiDungThayDoi", e.target.value)}
              placeholder="Nhân khẩu chuyển đi thường trú tại Hà Nội"
            />
            {errors.noiDungThayDoi && <span className="text-xs text-red-400">{errors.noiDungThayDoi}</span>}
          </label>

          <label className="text-sm text-gray-300">
            Ghi chú
            <textarea
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
              rows={2}
              value={form.ghiChu}
              onChange={(e) => onChange("ghiChu", e.target.value)}
              placeholder="Chuyển công tác"
            />
          </label>

          {submitError && <p className="text-sm text-red-400">{submitError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 text-gray-200 border border-white/10"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-yellow-500 text-black font-semibold disabled:opacity-70"
            >
              {submitting ? "Đang cập nhật..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

