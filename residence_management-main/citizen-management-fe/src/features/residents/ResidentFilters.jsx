import { Search } from "lucide-react";

export default function ResidentFilters({
  search,
  onSearch,
  gender,
  onGender,
  residenceType,
  onResidenceType,
  perPage,
  onPerPage,
  perPageOptions,
}) {
  return (
    <div className="p-6 border-b border-white/5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-800/80 px-3 py-2 rounded-xl flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên, CCCD..."
            className="bg-transparent text-sm focus:outline-none flex-1"
          />
        </div>
        <select
          className="bg-gray-800/80 text-sm px-3 py-2 rounded-xl border border-gray-700 text-gray-100"
          value={gender}
          onChange={(e) => onGender(e.target.value)}
        >
          <option value="all">Giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
        <select
          className="bg-gray-800/80 text-sm px-3 py-2 rounded-xl border border-gray-700 text-gray-100"
          value={residenceType}
          onChange={(e) => onResidenceType(e.target.value)}
        >
          <option value="all">Loại cư trú</option>
          <option value="thuong-tru">Thường trú</option>
          <option value="tam-tru">Tạm trú</option>
          <option value="kinh-doanh">Kinh doanh</option>
        </select>
        <select
          className="bg-gray-800/80 text-sm px-3 py-2 rounded-xl border border-gray-700 text-gray-100"
          value={perPage}
          onChange={(e) => onPerPage(Number(e.target.value))}
        >
          {perPageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} dòng / trang
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

