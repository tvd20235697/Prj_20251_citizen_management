import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserSidebar from "./UserSidebar";
import NotificationBell from "./NotificationBell";

export default function UserLayout({ children, title, subtitle }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    function onDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm flex-shrink-0 border-b border-gray-200">
          <div className="px-6 md:px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {title || "Cổng thông tin cư dân"}
              </h1>
              {subtitle && (
                <p className="text-gray-600 mt-1 text-sm">{subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <NotificationBell />

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-3 bg-white border border-gray-200 px-3 py-2 rounded-md hover:shadow-sm"
                  aria-expanded={profileOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {user?.fullName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="text-sm text-gray-800">
                    {user?.fullName || "Cư dân"}
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg z-50 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Đăng nhập với</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.email || "—"}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 mt-2"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="w-full h-full p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
