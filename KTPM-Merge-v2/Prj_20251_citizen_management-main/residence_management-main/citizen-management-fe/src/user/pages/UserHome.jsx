import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserLayout from "../components/UserLayout";

export default function UserHome() {
  const { user } = useAuth();

  return (
    <UserLayout
      title="Trang chủ"
      subtitle="Xin chào, quản lý thông tin hộ khẩu và nhân khẩu của bạn"
    >
      <div className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
        <section className="space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Xin chào, {user?.fullName || "cư dân"} 👋
          </h1>
          <p className="text-gray-600 text-sm">
            Đây là khu vực dành cho tài khoản cư dân. Bạn có thể xem thông tin
            hộ khẩu đang ở, các nhân khẩu trong hộ, lịch sử biến động và quản
            lý tài khoản cá nhân.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/user/household"
              className="rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-500 hover:shadow-md transition"
            >
              <h2 className="font-semibold mb-1 text-gray-900">Hộ khẩu của tôi</h2>
              <p className="text-sm text-gray-600">
                Xem thông tin sổ hộ khẩu, địa chỉ cư trú hiện tại.
              </p>
            </Link>

            <Link
              to="/user/members"
              className="rounded-xl border border-gray-200 bg-white p-4 hover:border-emerald-500 hover:shadow-md transition"
            >
              <h2 className="font-semibold mb-1 text-gray-900">Nhân khẩu trong hộ</h2>
              <p className="text-sm text-gray-600">
                Danh sách các thành viên trong hộ khẩu của bạn.
              </p>
            </Link>

            <Link
              to="/user/history"
              className="rounded-xl border border-gray-200 bg-white p-4 hover:border-amber-500 hover:shadow-md transition"
            >
              <h2 className="font-semibold mb-1 text-gray-900">Lịch sử biến động</h2>
              <p className="text-sm text-gray-600">
                Theo dõi các lần đăng ký tạm trú, chuyển đến, chuyển đi...
              </p>
            </Link>

            <Link
              to="/user/profile"
              className="rounded-xl border border-gray-200 bg-white p-4 hover:border-fuchsia-500 hover:shadow-md transition"
            >
              <h2 className="font-semibold mb-1 text-gray-900">Tài khoản & mật khẩu</h2>
              <p className="text-sm text-gray-600">
                Xem thông tin tài khoản và đổi mật khẩu đăng nhập.
              </p>
            </Link>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="font-semibold mb-2 text-sm text-gray-900">
              Thông tin tài khoản nhanh
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="text-gray-500">Họ tên: </span>
                {user?.fullName || "—"}
              </p>
              <p>
                <span className="text-gray-500">Email: </span>
                {user?.email || "—"}
              </p>
              <p>
                <span className="text-gray-500">Mã cán bộ: </span>
                {user?.maCanBo || "Không phải tài khoản cán bộ"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-emerald-50 p-4 text-sm text-gray-800">
            <p className="font-semibold mb-1 text-gray-900">Lưu ý</p>
            <p className="text-gray-700">
              Dữ liệu hiển thị trên khu vực cư dân được lấy từ cùng nguồn dữ
              liệu với hệ thống quản lý của cán bộ, chỉ giới hạn lại theo đúng
              hộ khẩu và nhân khẩu liên quan tới tài khoản của bạn.
            </p>
          </div>
        </aside>
      </div>
    </UserLayout>
  );
}


