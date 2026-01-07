import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Home, Users, History, User, DollarSign } from 'lucide-react';

export default function UserSidebar() {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const menuItems = useMemo(() => [
    { 
      id: 'home', 
      name: 'Trang chủ', 
      icon: Home, 
      submenu: null, 
      link: '/user/home', 
      type: 'single' 
    },
    {
      id: 'household',
      name: 'Hộ khẩu',
      icon: Home,
      submenu: null,
      link: '/user/household',
      type: 'single'
    },
    {
      id: 'members',
      name: 'Nhân khẩu trong hộ',
      icon: Users,
      submenu: null,
      link: '/user/members',
      type: 'single'
    },
    {
      id: 'payment',
      name: 'Đóng phí',
      icon: DollarSign,
      submenu: null,
      link: '/user/payment',
      type: 'single'
    },
    {
      id: 'history',
      name: 'Lịch sử biến động',
      icon: History,
      submenu: null,
      link: '/user/history',
      type: 'single'
    },
    {
      id: 'profile',
      name: 'Tài khoản',
      icon: User,
      submenu: null,
      link: '/user/profile',
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

  const isPathActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="w-75 min-w-[250px] bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white h-screen overflow-y-auto flex-shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-blue-900">CD</span>
          </div>
          <div>
            <h1 className="text-sm font-bold">Cổng thông tin cư dân</h1>
            <p className="text-xs text-blue-200">Tổ dân phố 7, phường La Khê</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-1">
        {menuItems.map(item => {
          const hasSubmenu = Array.isArray(item.submenu);
          const activeSubmenu = hasSubmenu && item.submenu.some(sub => isPathActive(sub.link));
          const isActive = !hasSubmenu && item.link ? isPathActive(item.link) : activeSubmenu;

          const baseClasses = "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 text-sm";
          const stateClasses = isActive
            ? "bg-white/15 text-white font-semibold shadow-md"
            : "text-blue-100 hover:bg-white/10 hover:text-white";

          const IconComponent = item.icon;

          return (
            <div key={item.id}>
              {hasSubmenu ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`${baseClasses} ${stateClasses}`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="flex-1 text-left truncate">{item.name}</span>
                    {item.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-50 font-semibold">{item.badge}</span>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${expandedMenus[item.id] ? "rotate-0" : "-rotate-90"}`}
                    />
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
                  className={`${baseClasses} ${stateClasses}`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="flex-1 text-left truncate">{item.name}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

