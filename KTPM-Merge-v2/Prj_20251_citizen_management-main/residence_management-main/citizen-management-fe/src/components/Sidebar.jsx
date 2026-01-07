import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, HelpCircle, Home, UserCheck, Users, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const menuItems = useMemo(() => [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', submenu: null, link: '/dashboard', type: 'single' },
    {
      id: 'residents',
      name: 'Quản lý Nhân khẩu',
      icon: 'Users',
      submenu: [
        { name: 'Danh sách nhân khẩu', link: '/residents', description: 'Xem toàn bộ danh sách nhân khẩu trong phường' },
        { name: 'Thêm nhân khẩu mới', link: '/residents/add', description: 'Đăng ký nhân khẩu mới vào hệ thống' },
        { name: 'Tìm kiếm nâng cao', link: '/residents/search', description: 'Tìm kiếm với nhiều tiêu chí phức tạp' }
      ]
    },
    {
      id: 'households',
      name: 'Quản lý Hộ khẩu',
      icon: 'Home',
      submenu: [
        { name: 'Danh sách hộ khẩu', link: '/households', description: 'Xem toàn bộ hộ khẩu trong phường' },
        { name: 'Thêm hộ khẩu mới', link: '/households/add', description: 'Đăng ký hộ khẩu mới' },
        { name: 'Tách hộ', link: '/households/split', description: 'Tách nhân khẩu từ hộ khẩu gốc để tạo hộ mới' },
        { name: 'Thay đổi chủ hộ', link: '/households/change-head', description: 'Cập nhật chủ hộ mới cho hộ khẩu' },
        { name: 'Tìm kiếm theo tổ DP', link: '/households/by-area', description: 'Xem hộ khẩu theo 7 tổ dân phố' }
      ]
    },
    {
      id: 'temporary',
      name: 'Dân cư Tạm trú',
      icon: 'UserCheck',
      submenu: null,
      link: '/temporary-residents',
      type: 'single'
    },
    {
      id: 'temporary-absence',
      name: 'Dân cư Tạm vắng',
      icon: 'UserCheck',
      submenu: null,
      link: '/tamvang',
      type: 'single'
    },
    {
      id: 'history',
      name: 'Lịch sử thay đổi',
      icon: 'History',
      submenu: null,
      link: '/history',
      type: 'single'
    },
    {
      id: 'fees', name: 'Quản lý Thu - Chi', icon: '💰', submenu: [
        { name: 'Quản lý các loại phí bắt buộc', link: '/fees/types', description: 'Danh sách và quản lý các loại phí bắt buộc' },
        { name: 'Quản lý các đợt thu phí', link: '/fees/periods', description: 'Danh sách và quản lý các đợt thu phí' },
        { name: 'Quản lý thu phí', link: '/fees/collection', description: 'Danh sách và quản lý các khoản thu phí' },
        { name: 'Phí vệ sinh', link: '/fees/sanitation', description: 'Danh sách thu phí vệ sinh' },
        { name: 'Đóng góp tự nguyện', link: '/donations/campaigns', description: 'Các đợt đóng góp' },
      ]
    },
    {
      id: 'tailieu', name: 'Quản lý Tài liệu', icon: '📁', submenu: [
        { name: 'Cấp giấy', link: '/tailieu/cap-giay' },
        { name: 'Upload tài liệu', link: '/tailieu/upload' },
        { name: 'Thư viện file', link: '/tailieu/thu-vien' },
        { name: 'Mẫu biểu', link: '/tailieu/mau-bieu' }
      ]
    },
    {
      id: 'caidat', name: 'Cài đặt', icon: '⚙️', submenu: [
        { name: 'Cài đặt hệ thống', link: '/caidat/he-thong' },
        { name: 'Quản lý người dùng', link: '/caidat/nguoi-dung' }
      ]
    },
    {
      id: 'help',
      name: 'Trợ giúp',
      icon: 'HelpCircle',
      submenu: null,
      link: '/help',
      type: 'single'
    }
  ], []);

  useEffect(() => {
    setExpandedMenus(prev => {
      const next = { ...prev };
      menuItems.forEach(item => {
        if (item.submenu && item.submenu.some(sub => location.pathname.startsWith(sub.link))) {
          next[item.id] = true;
        }
      });
      return next;
    });
  }, [location.pathname, menuItems]);

  const renderIcon = (icon) => {
    if (icon === 'UserCheck') {
      return <UserCheck className="w-5 h-5" />;
    }
    if (icon === 'HelpCircle') {
      return <HelpCircle className="w-5 h-5" />;
    }
    if (icon === 'Home') {
      return <Home className="w-5 h-5" />;
    }
    if (icon === 'Users') {
      return <Users className="w-5 h-5" />;
    }
    if (icon === 'History') {
      return <History className="w-5 h-5" />;
    }
    return <span className="text-xl">{icon}</span>;
  };

  const isPathActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="w-75 min-w-[250px] bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white h-screen overflow-y-auto flex-shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-blue-900">QL</span>
          </div>
          <div>
            <h1 className="text-sm font-bold">Quản lý Dân cư</h1>
            <p className="text-xs text-blue-200">Phường La Khê</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-1">
        {menuItems.filter(item => {
          // Lọc menu theo quyền
          if (item.id === 'temporary-absence' || item.id === 'history') {
            // Chỉ hiển thị cho "Cán bộ quản lý nhân khẩu" và các role cao hơn
            return user && (user.role === 'Cán bộ quản lý nhân khẩu' || 
                           user.role === 'Tổ trưởng' || 
                           user.role === 'Tổ phó');
          }
          return true;
        }).map(item => {
          const hasSubmenu = Array.isArray(item.submenu);
          const activeSubmenu = hasSubmenu && item.submenu.some(sub => isPathActive(sub.link));
          const isActive = !hasSubmenu && item.link ? isPathActive(item.link) : activeSubmenu;

          // Style đồng nhất cho TẤT CẢ các nút - không phân biệt active hay không
          const baseButtonStyle = {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            transition: 'all 0.2s',
            fontSize: '0.875rem',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontWeight: '500',
            fontFamily: 'inherit',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            textDecoration: 'none'
          };

          const hoverStyle = {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.25)'
          };

          return (
            <div key={item.id}>
              {hasSubmenu ? (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.id)}
                    style={baseButtonStyle}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        Object.assign(e.currentTarget.style, hoverStyle);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      }
                    }}
                  >
                    {renderIcon(item.icon)}
                    <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#ffffff', fontWeight: '500' }}>
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-50 font-semibold">{item.badge}</span>
                    )}
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </button>
                  {expandedMenus[item.id] && (
                    <div className="bg-blue-900/40 rounded-xl mt-1 ml-2 border border-blue-800/40 overflow-hidden">
                      {item.submenu.map((subitem) => {
                        const subActive = isPathActive(subitem.link);
                        return (
                          <Link
                            key={subitem.link}
                            to={subitem.link}
                            className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200 border-l-2 ${
                              subActive
                                ? "bg-white/10 text-white border-white font-semibold"
                                : "text-blue-100 border-transparent hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <span className="text-blue-300 text-xs">•</span>
                            <span className="flex-1 truncate">{subitem.name}</span>
                            {subitem.badge && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-50 font-semibold">
                                {subitem.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.link}
                  style={baseButtonStyle}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      Object.assign(e.currentTarget.style, hoverStyle);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }
                  }}
                >
                  {renderIcon(item.icon)}
                  <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#ffffff', fontWeight: '500' }}>
                    {item.name}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
