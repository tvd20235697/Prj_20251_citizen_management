import { useMemo, useState, useEffect } from "react";
import { Filter, MapPin, Pencil, Trash2, Users, UserPlus, Key, X, CheckCircle, Clock } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";
import YeuCauXacThucModal from "../components/YeuCauXacThucModal";

const API_BASE = "http://localhost:8080/api";

const typeConfig = {
  "thuong-tru": { label: "Thường trú", className: "bg-emerald-500/10 text-emerald-300 border border-emerald-600/30" },
  "tam-tru": { label: "Tạm trú", className: "bg-amber-500/10 text-amber-200 border border-amber-500/30" },
  "kinh-doanh": { label: "Kinh doanh", className: "bg-blue-500/10 text-blue-200 border border-blue-500/30" },
};

const areas = Array.from({ length: 7 }, (_, i) => i + 1);

export default function QuanLiHoKhau() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ area: "all", type: "all" });
  const [households, setHouseholds] = useState([]);
  const [loadingHouseholds, setLoadingHouseholds] = useState(false);
  const [householdError, setHouseholdError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [detailMode, setDetailMode] = useState("view");
  
  // Quản lý tài khoản chủ hộ (danh sách tài khoản)
  const [accountList, setAccountList] = useState([]);
  const [accountLoading, setAccountLoading] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null); // Tài khoản đang chỉnh sửa
  const [accountForm, setAccountForm] = useState({
    tenDangNhap: "",
    matKhau: "",
    email: "",
  });
  const [accountError, setAccountError] = useState(null);

  // Quản lý yêu cầu xác thực
  const [yeuCauList, setYeuCauList] = useState([]);
  const [yeuCauLoading, setYeuCauLoading] = useState(false);
  const [selectedYeuCau, setSelectedYeuCau] = useState(null);
  const [showYeuCauModal, setShowYeuCauModal] = useState(false);

  // Debug: Log khi showAccountForm thay đổi
  useEffect(() => {
    console.log("showAccountForm changed:", showAccountForm);
    console.log("accountList:", accountList);
  }, [showAccountForm, accountList]);

  // Lấy danh sách hộ khẩu từ backend
  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        setLoadingHouseholds(true);
        setHouseholdError(null);
        const response = await fetch(`${API_BASE}/hokhau`);
        if (!response.ok) {
          throw new Error(`Không thể tải danh sách hộ khẩu (status ${response.status})`);
        }
        const data = await response.json();
        console.log("DEBUG: Dữ liệu hộ khẩu từ backend:", data);
        const mapped = (Array.isArray(data) ? data : []).map((hk) => {
          // Đảm bảo soHoKhau luôn được lấy từ hk.soHoKhau (không dùng hk.id)
          const soHoKhau = hk.soHoKhau != null ? hk.soHoKhau : null;
          if (soHoKhau == null) {
            console.warn("WARNING: Hộ khẩu không có soHoKhau:", hk);
            return null;
          }
          const headName = hk.chuHo && hk.chuHo.trim() !== "" ? hk.chuHo : "Chưa có chủ hộ";
          console.log(`DEBUG: Hộ khẩu ${soHoKhau} - chuHo từ backend: "${hk.chuHo}" -> headName: "${headName}"`);
          return {
            id: soHoKhau != null ? String(soHoKhau) : "",
            soHoKhau: soHoKhau, // Đảm bảo soHoKhau luôn là number hoặc null
            headName: headName,
            address: hk.diaChi || "",
            ward: hk.tenXaPhuong || "",
            area: hk.maXaPhuong || "",
            members: hk.soNhanKhau ?? 0,
            type: "thuong-tru", // Chưa có loại cư trú trong DTO, tạm coi là thường trú
            registeredAt: hk.ngayCap || null,
            note: hk.ghiChu || "",
            phone: "", // Backend hiện chưa có số điện thoại hộ khẩu
          };
        }).filter(hk => hk != null); // Lọc bỏ các hộ khẩu null
        console.log("DEBUG: Dữ liệu đã map:", mapped);
        setHouseholds(mapped);
      } catch (error) {
        console.error("Error fetching households:", error);
        setHouseholdError(error.message || "Không thể tải danh sách hộ khẩu");
        setHouseholds([]);
      } finally {
        setLoadingHouseholds(false);
      }
    };

    fetchHouseholds();
  }, []);

  // Fetch yêu cầu chờ xác thực cho hộ khẩu hiện tại
  const fetchYeuCauChoXacThuc = async (soHoKhau, accountList) => {
    if (!soHoKhau) {
      setYeuCauList([]);
      return;
    }
    
    try {
      setYeuCauLoading(true);
      const response = await fetch(`${API_BASE}/yeucau/trang-thai/CHO_XAC_THUC`);
      if (response.ok) {
        const data = await response.json();
        const allYeuCau = Array.isArray(data) ? data : [];
        
        // Lấy danh sách mã tài khoản của chủ hộ
        const maTaiKhoanList = accountList.map(acc => acc.maTaiKhoan);
        
        // Lọc yêu cầu: chỉ lấy những yêu cầu có soHoKhau trùng và maTaiKhoan nằm trong danh sách tài khoản của chủ hộ
        const filteredYeuCau = allYeuCau.filter(yc => {
          const ycSoHoKhau = yc.soHoKhau;
          const ycMaTaiKhoan = yc.maTaiKhoan;
          
          // Kiểm tra soHoKhau trùng
          const soHoKhauMatch = ycSoHoKhau != null && Number(ycSoHoKhau) === Number(soHoKhau);
          
          // Kiểm tra maTaiKhoan nằm trong danh sách tài khoản của chủ hộ
          const maTaiKhoanMatch = ycMaTaiKhoan != null && maTaiKhoanList.includes(ycMaTaiKhoan);
          
          return soHoKhauMatch && maTaiKhoanMatch;
        });
        
        console.log("fetchYeuCauChoXacThuc: soHoKhau:", soHoKhau, "accountList:", accountList);
        console.log("fetchYeuCauChoXacThuc: All yeu cau:", allYeuCau.length, "Filtered:", filteredYeuCau.length);
        
        setYeuCauList(filteredYeuCau);
      }
    } catch (error) {
      console.error("Error fetching yeu cau:", error);
      setYeuCauList([]);
    } finally {
      setYeuCauLoading(false);
    }
  };

  const filteredHouseholds = useMemo(() => {
    return households.filter((household) => {
      const matchesSearch =
        household.id.toLowerCase().includes(search.toLowerCase()) ||
        household.headName.toLowerCase().includes(search.toLowerCase()) ||
        household.address.toLowerCase().includes(search.toLowerCase());
      const matchesArea =
        filters.area === "all"
          ? true
          : Number(filters.area) === Number(household.area || 0);
      const matchesType = filters.type === "all" ? true : filters.type === household.type;
      return matchesSearch && matchesArea && matchesType;
    });
  }, [search, filters, households]);

  const stats = useMemo(() => {
    const total = households.length;
    const residents = households.reduce((sum, item) => sum + (item.members || 0), 0);
    const thuongTru = households.filter((item) => item.type === "thuong-tru").length;
    return [
      { label: "Tổng hộ khẩu", value: total, description: "Toàn phường La Khê" },
      { label: "Thường trú", value: thuongTru, description: "Hộ cư trú ổn định" },
      { label: "Tổng nhân khẩu", value: residents, description: "Số nhân khẩu đã khai báo" },
    ];
  }, [households]);

  // Lấy danh sách tài khoản của chủ hộ theo mã nhân khẩu
  const fetchAccountList = async (soHoKhau) => {
    if (!soHoKhau) {
      console.log("fetchAccountList: soHoKhau is null/undefined");
      return;
    }
    try {
      setAccountLoading(true);
      setAccountError(null);
      console.log("fetchAccountList: Fetching accounts for soHoKhau:", soHoKhau);
      
      // Bước 1: Lấy mã nhân khẩu của chủ hộ
      const maNhanKhau = await getChuHoMaNhanKhau(soHoKhau);
      if (!maNhanKhau) {
        console.log("fetchAccountList: Không tìm thấy chủ hộ, không có tài khoản");
        setAccountList([]);
        setAccountLoading(false);
        return;
      }
      
      console.log("fetchAccountList: maNhanKhau của chủ hộ:", maNhanKhau);
      
      // Bước 2: Lấy danh sách tài khoản theo mã nhân khẩu
      const response = await fetch(`${API_BASE}/taikhoan/nhan-khau/${maNhanKhau}`);
      console.log("fetchAccountList: Response status:", response.status);
      
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        console.log("fetchAccountList: Content-Type:", contentType);
        
        if (contentType && contentType.includes("application/json")) {
          try {
            const data = await response.json();
            console.log("fetchAccountList: Parsed data:", data);
            
            // Đảm bảo data là mảng
            const accounts = Array.isArray(data) ? data : (data ? [data] : []);
            console.log("fetchAccountList: Setting accountList:", accounts);
            setAccountList(accounts);
            
            // Sau khi có danh sách tài khoản, fetch yêu cầu cho hộ khẩu này
            await fetchYeuCauChoXacThuc(soHoKhau, accounts);
          } catch (parseError) {
            console.error("fetchAccountList: Error parsing JSON:", parseError);
            setAccountList([]);
            await fetchYeuCauChoXacThuc(soHoKhau, []);
          }
        } else {
          console.log("fetchAccountList: Response is not JSON");
          setAccountList([]);
          await fetchYeuCauChoXacThuc(soHoKhau, []);
        }
      } else {
        console.log("fetchAccountList: Response not OK, status:", response.status);
        const errorText = await response.text().catch(() => "");
        console.log("fetchAccountList: Error response:", errorText);
        setAccountList([]);
        await fetchYeuCauChoXacThuc(soHoKhau, []);
      }
    } catch (error) {
      console.error("fetchAccountList: Error fetching account list:", error);
      setAccountError("Không thể tải danh sách tài khoản");
      setAccountList([]);
      await fetchYeuCauChoXacThuc(soHoKhau, []);
    } finally {
      setAccountLoading(false);
    }
  };

  const openDetail = (household, mode = "view") => {
    setSelected(household);
    setDetailMode(mode);
    // Reset yêu cầu khi mở hộ khẩu mới
    setYeuCauList([]);
    
    // Lấy thông tin tài khoản nếu có số hộ khẩu
    let soHoKhau;
    if (household.soHoKhau !== undefined && household.soHoKhau !== null) {
      soHoKhau = typeof household.soHoKhau === 'number' ? household.soHoKhau : parseInt(household.soHoKhau);
    } else if (household.id) {
      const parsed = parseInt(household.id.replace(/\D/g, ""));
      soHoKhau = isNaN(parsed) ? null : parsed;
    }
    
    if (soHoKhau && !isNaN(soHoKhau)) {
      // Fetch danh sách tài khoản, hàm này sẽ tự động fetch yêu cầu sau khi có accountList
      fetchAccountList(soHoKhau);
    }
  };

  const closeDetail = () => {
    setSelected(null);
    setAccountList([]);
    setYeuCauList([]);
    setShowAccountForm(false);
    setEditingAccount(null);
    setAccountForm({ tenDangNhap: "", matKhau: "", email: "" });
    setAccountError(null);
  };

  // Hàm refresh danh sách hộ khẩu
  const refreshHouseholdList = async () => {
    try {
      const response = await fetch(`${API_BASE}/hokhau`);
      if (response.ok) {
        const data = await response.json();
        const mapped = (Array.isArray(data) ? data : []).map((hk) => {
          const soHoKhau = hk.soHoKhau;
          if (!soHoKhau) return null;
          const headName = hk.chuHo && hk.chuHo.trim() !== "" ? hk.chuHo : "Chưa có chủ hộ";
          return {
            id: String(soHoKhau),
            soHoKhau: soHoKhau,
            headName: headName,
            address: hk.diaChi || "",
            ward: hk.tenXaPhuong || "",
            area: hk.maXaPhuong || "",
            members: hk.soNhanKhau ?? 0,
            type: "thuong-tru",
            registeredAt: hk.ngayCap || null,
            note: hk.ghiChu || "",
            phone: "",
          };
        }).filter(hk => hk != null);
        setHouseholds(mapped);
      }
    } catch (error) {
      console.error("Error refreshing household list:", error);
    }
  };

  const handleDelete = async (household) => {
    // Lấy mã sổ hộ khẩu (soHoKhau) - chỉ dùng soHoKhau, không dùng id
    const soHoKhau = household.soHoKhau;
    
    if (!soHoKhau || (typeof soHoKhau !== 'number' && isNaN(Number(soHoKhau)))) {
      alert("Không thể xác định mã sổ hộ khẩu để xóa. Vui lòng thử lại.");
      console.error("Invalid soHoKhau:", household);
      return;
    }

    const soHoKhauNumber = typeof soHoKhau === 'number' ? soHoKhau : Number(soHoKhau);
    
    if (!confirm(`Bạn chắc chắn muốn xóa hộ khẩu có mã số: ${soHoKhauNumber}?\n\nLưu ý: Chỉ có thể xóa hộ khẩu khi không còn nhân khẩu nào.`)) {
      return;
    }

    try {
      console.log("Xóa hộ khẩu với mã số:", soHoKhauNumber);
      
      // Gọi API xóa theo mã sổ hộ khẩu
      const response = await fetch(`${API_BASE}/hokhau/${soHoKhauNumber}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseText = await response.text();
      console.log("Response status:", response.status, "Response:", responseText);
      
      if (response.ok) {
        // Xóa thành công
        alert(`Xóa hộ khẩu có mã số ${soHoKhauNumber} thành công!`);
        await refreshHouseholdList();
        
        // Đóng detail nếu đang mở
        if (selected && selected.soHoKhau === soHoKhauNumber) {
          closeDetail();
        }
      } else {
        // Xóa thất bại
        if (response.status === 404) {
          // Hộ khẩu không tồn tại - refresh danh sách
          alert(`Hộ khẩu có mã số ${soHoKhauNumber} không tồn tại. Đang làm mới danh sách...`);
          await refreshHouseholdList();
        } else if (response.status === 400) {
          // Lỗi validation (ví dụ: còn nhân khẩu)
          alert(responseText || `Không thể xóa hộ khẩu có mã số ${soHoKhauNumber}.`);
        } else {
          alert(`Lỗi khi xóa hộ khẩu: ${responseText || response.status}`);
        }
      }
    } catch (error) {
      console.error("Error deleting household:", error);
      alert("Có lỗi xảy ra khi xóa hộ khẩu: " + error.message);
    }
  };

  const handleUpdate = async () => {
    if (!selected) return;

    // Lấy mã sổ hộ khẩu (soHoKhau) - chỉ dùng soHoKhau, không dùng id
    const soHoKhau = selected.soHoKhau;
    
    if (!soHoKhau || (typeof soHoKhau !== 'number' && isNaN(Number(soHoKhau)))) {
      alert("Không thể xác định mã sổ hộ khẩu để cập nhật.");
      console.error("Invalid soHoKhau:", selected);
      return;
    }

    const soHoKhauNumber = typeof soHoKhau === 'number' ? soHoKhau : Number(soHoKhau);

    try {
      // Lấy giá trị từ form
      const updateData = {
        diaChi: selected.address || "",
        ghiChu: selected.note || "",
        maXaPhuong: selected.area && selected.area !== "" ? (isNaN(Number(selected.area)) ? null : Number(selected.area)) : null,
      };

      console.log("Cập nhật hộ khẩu với mã số:", soHoKhauNumber, "data:", updateData);
      
      const response = await fetch(`${API_BASE}/hokhau/${soHoKhauNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const responseText = await response.text();
      console.log("Response status:", response.status, "Response:", responseText);
      
      if (response.ok) {
        // Cập nhật thành công
        alert(`Cập nhật hộ khẩu có mã số ${soHoKhauNumber} thành công!`);
        await refreshHouseholdList();
        
        // Cập nhật selected với dữ liệu mới
        const fetchResponse = await fetch(`${API_BASE}/hokhau/${soHoKhauNumber}`);
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          const updated = {
            id: String(data.soHoKhau),
            soHoKhau: data.soHoKhau,
            headName: data.chuHo && data.chuHo.trim() !== "" ? data.chuHo : "Chưa có chủ hộ",
            address: data.diaChi || "",
            ward: data.tenXaPhuong || "",
            area: data.maXaPhuong || "",
            members: data.soNhanKhau ?? 0,
            type: "thuong-tru",
            registeredAt: data.ngayCap || null,
            note: data.ghiChu || "",
            phone: "",
          };
          setSelected(updated);
        }
        
        setDetailMode("view");
      } else {
        // Cập nhật thất bại
        if (response.status === 404) {
          alert(`Hộ khẩu có mã số ${soHoKhauNumber} không tồn tại. Đang làm mới danh sách...`);
          await refreshHouseholdList();
        } else {
          alert(responseText || `Cập nhật hộ khẩu thất bại (${response.status})`);
        }
      }
    } catch (error) {
      console.error("Error updating household:", error);
      alert(error.message || "Có lỗi xảy ra khi cập nhật hộ khẩu");
    }
  };

  // Lấy mã nhân khẩu của chủ hộ từ hộ khẩu
  const getChuHoMaNhanKhau = async (soHoKhau) => {
    try {
      console.log("Fetching chu ho for soHoKhau:", soHoKhau);
      const response = await fetch(`${API_BASE}/nhankhau/ho-khau/${soHoKhau}`);
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const nhanKhauList = await response.json();
        console.log("Nhan khau list:", nhanKhauList);
        
        if (!Array.isArray(nhanKhauList) || nhanKhauList.length === 0) {
          console.warn("No residents found for household:", soHoKhau);
          console.warn("Hộ khẩu này chưa có nhân khẩu nào. Vui lòng thêm nhân khẩu trước.");
          return null;
        }
        
        console.log("Total residents found:", nhanKhauList.length);
        console.log("Residents:", nhanKhauList.map(nk => ({
          maNhanKhau: nk.maNhanKhau,
          hoTen: nk.hoTen,
          quanHeVoiChuHo: nk.quanHeVoiChuHo
        })));
        
        const chuHo = nhanKhauList.find(nk => 
          nk.quanHeVoiChuHo === "Chủ hộ" || 
          nk.quanHeVoiChuHo === "Ch? h?" || // Xử lý lỗi encoding
          nk.quanHeVoiChuHo === "Chu ho" || // Không dấu
          (nk.quanHeVoiChuHo && nk.quanHeVoiChuHo.toLowerCase().includes("chủ hộ")) ||
          (nk.quanHeVoiChuHo && nk.quanHeVoiChuHo.toLowerCase().includes("chu ho"))
        );
        
        console.log("Chu ho found:", chuHo);
        if (!chuHo) {
          console.warn("Không tìm thấy chủ hộ trong danh sách nhân khẩu. Danh sách quan hệ:", 
            nhanKhauList.map(nk => nk.quanHeVoiChuHo));
        }
        return chuHo ? chuHo.maNhanKhau : null;
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
      }
    } catch (error) {
      console.error("Error fetching chu ho:", error);
    }
    return null;
  };

  // Tạo hoặc cập nhật tài khoản
  const handleSaveAccount = async () => {
    // Validation
    if (!accountForm.tenDangNhap || accountForm.tenDangNhap.trim() === "") {
      setAccountError("Vui lòng nhập tên đăng nhập");
      return;
    }

    if (!accountForm.email || accountForm.email.trim() === "") {
      setAccountError("Vui lòng nhập email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(accountForm.email)) {
      setAccountError("Email không hợp lệ");
      return;
    }

      if (!editingAccount && (!accountForm.matKhau || accountForm.matKhau.trim() === "")) {
        setAccountError("Vui lòng nhập mật khẩu");
        return;
      }

    if (accountForm.matKhau && accountForm.matKhau.length < 6) {
      setAccountError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setAccountLoading(true);
      setAccountError(null);

      // Lấy số hộ khẩu - ưu tiên soHoKhau, sau đó mới dùng id
      let soHoKhau;
      if (selected.soHoKhau !== undefined && selected.soHoKhau !== null) {
        soHoKhau = typeof selected.soHoKhau === 'number' ? selected.soHoKhau : parseInt(selected.soHoKhau);
      } else if (selected.id !== undefined && selected.id !== null) {
        if (typeof selected.id === 'number') {
          soHoKhau = selected.id;
        } else if (typeof selected.id === 'string') {
          // Thử parse số từ string (ví dụ: "HK001" -> 1, hoặc "1" -> 1)
          const parsed = parseInt(selected.id.replace(/\D/g, ""));
          soHoKhau = isNaN(parsed) ? null : parsed;
        } else {
          soHoKhau = selected.id;
        }
      }

      if (!soHoKhau || isNaN(soHoKhau)) {
        setAccountError("Không thể xác định số hộ khẩu. Vui lòng thử lại.");
        setAccountLoading(false);
        return;
      }

      console.log("Creating account for soHoKhau:", soHoKhau, "selected:", selected);
      
      const maNhanKhau = await getChuHoMaNhanKhau(soHoKhau);

      if (!maNhanKhau) {
        setAccountError(`Không tìm thấy chủ hộ cho hộ khẩu số ${soHoKhau}. Vui lòng:\n1. Kiểm tra xem hộ khẩu này có nhân khẩu nào chưa\n2. Đảm bảo có ít nhất một nhân khẩu với quan hệ "Chủ hộ"\n3. Nếu chưa có, vui lòng thêm nhân khẩu cho hộ khẩu này trước khi tạo tài khoản.`);
        setAccountLoading(false);
        return;
      }

      console.log("Using maNhanKhau:", maNhanKhau);

      if (editingAccount) {
        // Cập nhật tài khoản
        const updateData = {
          maNhanKhau: maNhanKhau,
          tenDangNhap: accountForm.tenDangNhap,
          email: accountForm.email,
          vaiTro: "User",
          trangThai: "DANG_HOAT_DONG",
        };
        if (accountForm.matKhau) {
          updateData.matKhau = accountForm.matKhau;
        }

        const response = await fetch(`${API_BASE}/taikhoan/${editingAccount.maTaiKhoan}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Cập nhật tài khoản thất bại");
        }

        alert("Cập nhật tài khoản thành công!");
        
        // Refresh danh sách tài khoản sau khi cập nhật
        console.log("Refreshing account list after update for soHoKhau:", soHoKhau);
        await fetchAccountList(soHoKhau);
        
        // Đợi một chút để đảm bảo backend đã cập nhật
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Refresh lại một lần nữa để chắc chắn
        await fetchAccountList(soHoKhau);
      } else {
        // Tạo tài khoản mới
        const createData = {
          maNhanKhau: maNhanKhau,
          tenDangNhap: accountForm.tenDangNhap,
          matKhau: accountForm.matKhau,
          email: accountForm.email,
          vaiTro: "User",
          trangThai: "DANG_HOAT_DONG",
        };

        console.log("=== FRONTEND: BẮT ĐẦU TẠO TÀI KHOẢN ===");
        console.log("Creating account with data:", JSON.stringify(createData, null, 2));
        
        const response = await fetch(`${API_BASE}/taikhoan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createData),
        });

        console.log("Create account response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          let errorText = "Tạo tài khoản thất bại";
          try {
            errorText = await response.text();
            console.error("=== FRONTEND: ERROR RESPONSE ===");
            console.error("Status:", response.status);
            console.error("Error response body:", errorText);
            // Nếu là JSON, parse nó
            if (errorText.startsWith("{")) {
              try {
                const errorJson = JSON.parse(errorText);
                errorText = errorJson.message || errorJson.error || errorText;
              } catch (parseError) {
                // Nếu không parse được JSON, dùng text gốc
                console.error("Cannot parse error JSON:", parseError);
              }
            }
          } catch (e) {
            console.error("Error reading error response:", e);
            errorText = `Lỗi ${response.status}: ${response.statusText}`;
          }
          console.error("=== FRONTEND: CREATE ACCOUNT FAILED ===");
          console.error("Status:", response.status);
          console.error("Error:", errorText);
          throw new Error(errorText || `Lỗi ${response.status}: Không thể tạo tài khoản`);
        }

        const result = await response.json();
        console.log("=== FRONTEND: ACCOUNT CREATED ===");
        console.log("Account created successfully:", JSON.stringify(result, null, 2));
        
        if (!result || !result.maTaiKhoan) {
          console.error("ERROR: Response không có maTaiKhoan!");
          throw new Error("Tạo tài khoản thành công nhưng không nhận được dữ liệu phản hồi");
        }
        
        console.log("maTaiKhoan:", result.maTaiKhoan);
        alert("Tạo tài khoản thành công! Mã tài khoản: " + result.maTaiKhoan);
      }

      // Refresh danh sách tài khoản - dùng lại soHoKhau đã lấy ở trên
      console.log("Refreshing account list for soHoKhau:", soHoKhau);
      await fetchAccountList(soHoKhau);
      
      // Đợi một chút để đảm bảo backend đã cập nhật
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh lại một lần nữa để chắc chắn
      await fetchAccountList(soHoKhau);
      
      setShowAccountForm(false);
      setEditingAccount(null);
      setAccountForm({ tenDangNhap: "", matKhau: "", email: "" });
    } catch (error) {
      console.error("Error saving account:", error);
      setAccountError(error.message || "Có lỗi xảy ra");
    } finally {
      setAccountLoading(false);
    }
  };

  // Xóa tài khoản
  const handleDeleteAccount = async (account) => {
    if (!account || !confirm(`Bạn chắc chắn muốn xóa tài khoản "${account.tenDangNhap}"?`)) {
      return;
    }

    try {
      setAccountLoading(true);
      setAccountError(null);

      const response = await fetch(`${API_BASE}/taikhoan/${account.maTaiKhoan}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Xóa tài khoản thất bại");
      }

      alert("Xóa tài khoản thành công!");
      
      // Refresh danh sách tài khoản
      let soHoKhau;
      if (selected.soHoKhau !== undefined && selected.soHoKhau !== null) {
        soHoKhau = typeof selected.soHoKhau === 'number' ? selected.soHoKhau : parseInt(selected.soHoKhau);
      } else if (selected.id) {
        const parsed = parseInt(selected.id.replace(/\D/g, ""));
        soHoKhau = isNaN(parsed) ? null : parsed;
      }
      
      if (soHoKhau && !isNaN(soHoKhau)) {
        await fetchAccountList(soHoKhau);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setAccountError(error.message || "Có lỗi xảy ra khi xóa tài khoản");
    } finally {
      setAccountLoading(false);
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
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Module</p>
                  <h1 className="text-3xl font-semibold text-white">Quản lý Hộ khẩu</h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Theo dõi, tra cứu và thao tác nhanh với dữ liệu hộ khẩu của 7 tổ dân phố trong phường La Khê.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => (window.location.href = "/households/add")}
                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium"
                  >
                    + Thêm hộ khẩu mới
                  </button>
                  <button
                    onClick={() => (window.location.href = "/households/by-area")}
                    className="px-5 py-3 rounded-xl bg-gray-800 text-gray-200 border border-white/10 hover:bg-gray-700"
                  >
                    Tìm kiếm theo tổ
                  </button>
                </div>
              </div>

              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((card) => (
                  <div key={card.label} className="bg-gray-900/80 border border-white/5 rounded-2xl p-6 shadow-lg shadow-black/30">
                    <p className="text-sm text-gray-400 uppercase tracking-wide">{card.label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                  </div>
                ))}
              </section>

              <section className="bg-gray-900/80 border border-white/5 rounded-3xl shadow-2xl shadow-black/40">
                <div className="p-6 border-b border-white/5 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-800/80 px-3 py-2 rounded-xl flex-1 min-w-[220px]">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm số hộ khẩu, chủ hộ, địa chỉ..."
                        className="bg-transparent text-sm focus:outline-none flex-1"
                      />
                    </div>
                    <select
                      className="bg-gray-800/80 text-sm px-3 py-2 rounded-xl border border-gray-700 text-gray-100"
                      value={filters.area}
                      onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                    >
                      <option value="all">Tất cả tổ dân phố</option>
                      {areas.map((area) => (
                        <option key={area} value={area}>
                          Tổ dân phố {area}
                        </option>
                      ))}
                    </select>
                    <select
                      className="bg-gray-800/80 text-sm px-3 py-2 rounded-xl border border-gray-700 text-gray-100"
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                      <option value="all">Tất cả loại hộ</option>
                      <option value="thuong-tru">Thường trú</option>
                      <option value="tam-tru">Tạm trú</option>
                      <option value="kinh-doanh">Kinh doanh</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 text-gray-400 uppercase">
                      <tr>
                        <th className="px-6 py-4 text-left">Số hộ khẩu</th>
                        <th className="px-6 py-4 text-left">Chủ hộ</th>
                        <th className="px-6 py-4 text-left">Tổ / Địa chỉ</th>
                        <th className="px-6 py-4 text-left">Loại hộ</th>
                        <th className="px-6 py-4 text-left">Nhân khẩu</th>
                        <th className="px-6 py-4 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingHouseholds ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                            Đang tải dữ liệu hộ khẩu...
                          </td>
                        </tr>
                      ) : householdError ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-red-400">
                            {householdError}
                          </td>
                        </tr>
                      ) : filteredHouseholds.length ? (
                        filteredHouseholds.map((household) => {
                          const typeStyle = typeConfig[household.type];
                          return (
                            <tr key={household.id} className="border-b border-white/5 hover:bg-white/5 transition">
                              <td className="px-6 py-4 font-semibold text-white">{household.id}</td>
                              <td className="px-6 py-4 text-gray-200">{household.headName}</td>
                              <td className="px-6 py-4 text-gray-300">
                                <p className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-blue-300" />Tổ {household.area}
                                </p>
                                <p className="text-xs text-gray-500">{household.address}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${typeStyle.className}`}>
                                  {typeStyle.label}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-200">
                                  <Users className="w-3.5 h-3.5" />
                                  {household.members} người
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                  <button
                                    className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-200 border border-blue-400/30"
                                    onClick={() => openDetail(household, "view")}
                                  >
                                    Xem
                                  </button>
                                  <button
                                    className="px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-200 border border-yellow-400/30"
                                    onClick={() => openDetail(household, "edit")}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300 border border-red-400/30"
                                    onClick={() => handleDelete(household)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                            Không có dữ liệu phù hợp
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 text-sm text-gray-400 border-t border-white/5">
                  Hiển thị {filteredHouseholds.length} trên {households.length} hộ khẩu
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={closeDetail} />
          <div className="relative w-full max-w-md bg-gray-950 border-l border-white/10 h-full overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Chi tiết hộ khẩu</p>
                <h3 className="text-2xl font-semibold text-white">{selected.headName}</h3>
                <p className="text-xs text-gray-400">{selected.id} • Tổ dân phố {selected.area}</p>
              </div>
              <button onClick={closeDetail} className="text-gray-400 hover:text-white text-xl">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-gray-400 text-xs uppercase mb-2">Địa chỉ</p>
                {detailMode === "edit" ? (
                  <input
                    type="text"
                    value={selected.address || ""}
                    onChange={(e) => setSelected({ ...selected, address: e.target.value })}
                    className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Nhập địa chỉ"
                  />
                ) : (
                  <p className="text-white font-semibold mt-1">{selected.address || "—"}</p>
                )}
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-gray-400 text-xs uppercase mb-2">Tổ dân phố</p>
                {detailMode === "edit" ? (
                  <select
                    value={selected.area || ""}
                    onChange={(e) => setSelected({ ...selected, area: e.target.value })}
                    className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Chọn tổ dân phố</option>
                    {areas.map((area) => (
                      <option key={area} value={area}>
                        Tổ dân phố {area}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-white font-semibold mt-1">Tổ {selected.area || "—"}</p>
                )}
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-gray-400 text-xs uppercase">Loại hộ</p>
                <p className="text-white font-semibold mt-1">{typeConfig[selected.type]?.label || "—"}</p>
                {selected.registeredAt && (
                  <p className="text-gray-500 text-xs mt-1">
                    Đăng ký: {new Date(selected.registeredAt).toLocaleDateString("vi-VN")}
                  </p>
                )}
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-gray-400 text-xs uppercase">Số nhân khẩu</p>
                <p className="text-white font-semibold mt-1">{selected.members || 0} người</p>
              </div>

              {/* Phần quản lý tài khoản chủ hộ */}
              <div className="rounded-2xl border border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-yellow-400" />
                    <p className="text-gray-400 text-xs uppercase">Tài khoản đăng nhập chủ hộ</p>
                    {accountList.length > 0 && (
                      <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                        {accountList.length}
                      </span>
                    )}
                  </div>
                  {!showAccountForm && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingAccount(null);
                        setAccountForm({ tenDangNhap: "", matKhau: "", email: "" });
                        setShowAccountForm(true);
                      }}
                      className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-500 text-white rounded-lg cursor-pointer"
                      type="button"
                    >
                      + Tạo tài khoản
                    </button>
                  )}
                </div>

                {/* Debug info */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-2 text-xs text-gray-500">
                    Debug: showAccountForm={String(showAccountForm)}, accountList.length={accountList.length}, accountLoading={String(accountLoading)}
                  </div>
                )}

                {accountLoading ? (
                  <p className="text-gray-500 text-sm mt-3">Đang tải...</p>
                ) : accountError && !showAccountForm ? (
                  <div className="mt-3">
                    <p className="text-red-400 text-sm">{accountError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountError(null);
                        setShowAccountForm(true);
                      }}
                      className="mt-2 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                    >
                      Thử lại
                    </button>
                  </div>
                ) : showAccountForm ? (
                  <div className="space-y-3 mt-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Tên đăng nhập</label>
                      <input
                        type="text"
                        value={accountForm.tenDangNhap}
                        onChange={(e) => setAccountForm({ ...accountForm, tenDangNhap: e.target.value })}
                        className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        placeholder="Nhập tên đăng nhập"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        {editingAccount ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
                      </label>
                      <input
                        type="password"
                        value={accountForm.matKhau}
                        onChange={(e) => setAccountForm({ ...accountForm, matKhau: e.target.value })}
                        className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        placeholder={editingAccount ? "Nhập mật khẩu mới" : "Nhập mật khẩu"}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={accountForm.email}
                        onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                        className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        placeholder="Nhập email"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Save account button clicked");
                          handleSaveAccount();
                        }}
                        disabled={accountLoading}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {accountLoading ? "Đang xử lý..." : editingAccount ? "Cập nhật" : "Tạo tài khoản"}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Cancel button clicked");
                          setShowAccountForm(false);
                          setEditingAccount(null);
                          setAccountForm({ tenDangNhap: "", matKhau: "", email: "" });
                          setAccountError(null);
                        }}
                        disabled={accountLoading}
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm disabled:opacity-50"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : accountList.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {accountList.map((account) => (
                      <div key={account.maTaiKhoan} className="bg-gray-900/50 rounded-lg p-3 border border-white/5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Tên đăng nhập:</span>
                              <span className="text-white font-semibold">{account.tenDangNhap}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Email:</span>
                              <span className="text-white">{account.email || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Trạng thái:</span>
                              <span className={`${account.trangThai === "DANG_HOAT_DONG" ? "text-green-400" : "text-yellow-400"}`}>
                                {account.trangThai === "DANG_HOAT_DONG" ? "Đang hoạt động" : account.trangThai || "—"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Mã tài khoản:</span>
                              <span className="text-gray-300 text-xs">#{account.maTaiKhoan}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditingAccount(account);
                                setAccountForm({
                                  tenDangNhap: account.tenDangNhap || "",
                                  matKhau: "",
                                  email: account.email || "",
                                });
                                setShowAccountForm(true);
                              }}
                              className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded"
                              title="Sửa"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(account)}
                              className="px-2 py-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded"
                              title="Xóa"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mt-2">Chưa có tài khoản đăng nhập</p>
                )}
              </div>

              {/* Phần xác thực yêu cầu */}
              <div className="rounded-2xl border border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <p className="text-gray-400 text-xs uppercase">Yêu cầu chờ xác thực</p>
                  </div>
                  {yeuCauList.length > 0 && (
                    <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded-full">
                      {yeuCauList.length}
                    </span>
                  )}
                </div>

                {yeuCauLoading ? (
                  <p className="text-gray-500 text-sm">Đang tải...</p>
                ) : yeuCauList.length === 0 ? (
                  <p className="text-gray-500 text-sm">Không có yêu cầu nào chờ xác thực</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {yeuCauList.map((yc) => (
                      <div
                        key={yc.maYeuCau}
                        className="bg-gray-900/50 rounded-lg p-3 border border-white/5 hover:border-yellow-500/30 cursor-pointer transition"
                        onClick={() => {
                          setSelectedYeuCau(yc);
                          setShowYeuCauModal(true);
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-white text-xs font-semibold">{yc.loaiYeuCauLabel}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {yc.hoTenChuHo} • Hộ khẩu {yc.soHoKhau}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {yc.ngayTao ? new Date(yc.ngayTao).toLocaleString("vi-VN") : ""}
                            </p>
                          </div>
                          <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs uppercase text-gray-400 block mb-2">Ghi chú</label>
                <textarea
                  disabled={detailMode === "view"}
                  value={selected.note || ""}
                  onChange={(e) => setSelected({ ...selected, note: e.target.value })}
                  className="w-full rounded-2xl bg-gray-900 border border-white/10 text-gray-100 p-3 min-h-[120px] focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  placeholder="Nhập ghi chú..."
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {detailMode === "edit" ? (
                <>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-semibold" onClick={handleUpdate}>
                    Lưu thay đổi
                  </button>
                  <button className="flex-1 bg-gray-800 text-gray-300 border border-gray-700 py-3 rounded-2xl" onClick={() => setDetailMode("view")}>
                    Huỷ
                  </button>
                </>
              ) : (
                <button className="flex-1 bg-gray-800 text-gray-200 border border-gray-700 py-3 rounded-2xl" onClick={() => setDetailMode("edit")}>
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal xác thực yêu cầu */}
      <YeuCauXacThucModal
        yeuCau={selectedYeuCau}
        isOpen={showYeuCauModal}
        onClose={() => {
          setShowYeuCauModal(false);
          setSelectedYeuCau(null);
        }}
        onUpdate={() => {
          // Refresh yêu cầu sau khi xác thực
          if (selected) {
            let soHoKhau;
            if (selected.soHoKhau !== undefined && selected.soHoKhau !== null) {
              soHoKhau = typeof selected.soHoKhau === 'number' ? selected.soHoKhau : parseInt(selected.soHoKhau);
            } else if (selected.id) {
              const parsed = parseInt(selected.id.replace(/\D/g, ""));
              soHoKhau = isNaN(parsed) ? null : parsed;
            }
            
            if (soHoKhau && !isNaN(soHoKhau)) {
              fetchYeuCauChoXacThuc(soHoKhau, accountList);
            }
          }
        }}
      />
    </div>
  );
}

