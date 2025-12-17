"use client";
import ClockBadge from "../components/ClockBadge";

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const MenuIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);
const XIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
const MountainIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);
const ChevronDownIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const BellIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);
const AvatarIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 200 200"
    width="200"
    height="200"
    className={className}
  >
    <g clipPath="url(#cs_clip_1_flower-1)">
      <mask
        id="cs_mask_1_flower-1"
        style={{
          maskType: "alpha",
        }}
        width="200"
        height="186"
        x="0"
        y="7"
        maskUnits="userSpaceOnUse"
      >
        <path
          fill="#fff"
          d="M150.005 128.863c66.681 38.481-49.997 105.828-49.997 28.861 0 76.967-116.658 9.62-49.997-28.861-66.681 38.481-66.681-96.207 0-57.727-66.681-38.48 49.997-105.827 49.997-28.86 0-76.967 116.657-9.62 49.997 28.86 66.66-38.48 66.66 96.208 0 57.727z"
        ></path>
      </mask>
      <g mask="url(#cs_mask_1_flower-1)">
        <path fill="#fff" d="M200 0H0v200h200V0z"></path>
        <path
          fill="url(#paint0_linear_748_4711)"
          d="M200 0H0v200h200V0z"
        ></path>
        <g filter="url(#filter0_f_748_4711)">
          <path fill="#FF58E4" d="M130 0H69v113h61V0z"></path>
          <path
            fill="#0CE548"
            fillOpacity="0.35"
            d="M196 91H82v102h114V91z"
          ></path>
          <path
            fill="#FFE500"
            fillOpacity="0.74"
            d="M113 80H28v120h85V80z"
          ></path>
        </g>
      </g>
    </g>
    <defs>
      <filter
        id="filter0_f_748_4711"
        width="278"
        height="310"
        x="-27"
        y="-55"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feGaussianBlur
          result="effect1_foregroundBlur_748_4711"
          stdDeviation="27.5"
        ></feGaussianBlur>
      </filter>
      <linearGradient
        id="paint0_linear_748_4711"
        x1="186.5"
        x2="37"
        y1="37"
        y2="186.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#0E6FFF" stopOpacity="0.51"></stop>
        <stop offset="1" stopColor="#00F0FF" stopOpacity="0.59"></stop>
      </linearGradient>
      <clipPath id="cs_clip_1_flower-1">
        <path fill="#fff" d="M0 0H200V200H0z"></path>
      </clipPath>
    </defs>
    <g
      style={{
        mixBlendMode: "overlay",
      }}
      mask="url(#cs_mask_1_flower-1)"
    >
      <path
        fill="gray"
        stroke="transparent"
        d="M200 0H0v200h200V0z"
        filter="url(#cs_noise_1_flower-1)"
      ></path>
    </g>
    <defs>
      <filter
        id="cs_noise_1_flower-1"
        width="100%"
        height="100%"
        x="0%"
        y="0%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          baseFrequency="0.6"
          numOctaves="5"
          result="out1"
          seed="4"
        ></feTurbulence>
        <feComposite
          in="out1"
          in2="SourceGraphic"
          operator="in"
          result="out2"
        ></feComposite>
        <feBlend
          in="SourceGraphic"
          in2="out2"
          mode="overlay"
          result="out3"
        ></feBlend>
      </filter>
    </defs>
  </svg>
);
const initialNotifications = [
  {
    id: 1,
    title: "Gia hạn tạm trú",
    description: "Trịnh Văn Tài còn 5 ngày trước khi hết hạn.",
    time: "5 phút trước",
    read: false,
    link: "/temporary-residents",
  },
  {
    id: 2,
    title: "User mới được tạo",
    description: "Tài khoản canbo.thuphi cần kích hoạt.",
    time: "20 phút trước",
    read: false,
    link: "/caidat/nguoi-dung",
  },
  {
    id: 3,
    title: "Báo cáo tuần",
    description: "Sẵn sàng tải về tại mục Báo cáo.",
    time: "Hôm qua",
    read: true,
    link: "/baocao/danso",
  },
];

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [notifications, setNotifications] = useState(initialNotifications);
  const avatarDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);
  const headerRef = useRef(null);

  const unreadCount = notifications.filter((noti) => !noti.read).length;

  const navLinks = [
    {
      label: "Hộ khẩu",
      dropdown: [
        {
          href: "#",
          label: "Danh sách hộ khẩu",
        },
        {
          href: "#",
          label: "Tách hộ khẩu",
        },
        {
          href: "#",
          label: "Lịch sử thay đổi hộ khẩu",
        },
      ],
    },
    {
      label: "Thống kê",
      dropdown: [
        {
          href: "#",
          label: "Thu phí",
        },
        {
          href: "#",
          label: "Đóng góp",
        },
      ],
    },
  ];
  const avatarDropdownLinks = [
    {
      href: "#",
      label: "Profile",
    },
    {
      href: "#",
      label: "Settings",
    },
    {
      href: "#",
      label: "Logout",
    },
  ];
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setIsAvatarOpen(false);
        setIsNotificationsOpen(false);
        setIsMenuOpen(false);
      } else {
        if (
          avatarDropdownRef.current &&
          !avatarDropdownRef.current.contains(event.target)
        ) {
          setIsAvatarOpen(false);
        }
        if (
          notificationsDropdownRef.current &&
          !notificationsDropdownRef.current.contains(event.target)
        ) {
          setIsNotificationsOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const toggleMobileDropdown = (label) => {
    setOpenMobileDropdown(openMobileDropdown === label ? null : label);
  };

  const handleNotificationClick = (notification) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item
      )
    );
    if (notification.link) {
      navigate(notification.link);
    }
    setIsNotificationsOpen(false);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <header
      ref={headerRef}
      className="bg-black/80 backdrop-blur-sm w-full border-b border-gray-800"
    >
      {/* dùng w-full thay vì container */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative w-full">
          {/* LEFT: logo + menu */}
          <div className="flex items-center gap-10">
            {}
            <a href="#" className="flex items-center gap-2 shrink-0">
              <MountainIcon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Residence Management
              </span>
            </a>

            {}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label} className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === link.label ? null : link.label
                        )
                      }
                      className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300 focus:outline-none"
                    >
                      {link.label}
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform duration-300 ${
                          openDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`absolute top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg transition-opacity duration-300 ${
                        openDropdown === link.label
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                      }`}
                    >
                      {link.dropdown.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                )
              )}
            </nav>
          </div>

          {/* CENTER: CLOCK BADGE (bán nguyệt) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0">
            <ClockBadge />
          </div>

          {/* RIGHT: Noti + Avatar */}
          <div className="flex items-center gap-4">
            {}
            <div
              className="relative hidden sm:block"
              ref={notificationsDropdownRef}
            >
              <button
                onClick={() => {
                  setIsNotificationsOpen((s) => !s);
                  setOpenDropdown(null);
                  setIsAvatarOpen(false);
                }}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none relative"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <div
                className={`absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg transition-opacity duration-300 ${
                  isNotificationsOpen
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                }`}
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Thông báo
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {unreadCount} thông báo chưa đọc
                    </p>
                  </div>
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-500 hover:text-blue-400"
                  >
                    Đánh dấu tất cả đã đọc
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex flex-col gap-1 ${
                        notification.read ? "bg-transparent" : "bg-blue-50/70 dark:bg-blue-500/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {notification.description}
                      </p>
                      <span className="text-[11px] text-gray-400">{notification.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {}
            <div className="relative hidden sm:block" ref={avatarDropdownRef}>
              <button
                onClick={() => {
                  setIsAvatarOpen((s) => !s);
                  setOpenDropdown(null);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 focus:outline-none"
              >
                <AvatarIcon className="h-9 w-9" />
              </button>
              <div
                className={`absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg transition-opacity duration-300 ${
                  isAvatarOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                {avatarDropdownLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {}
      {isMenuOpen && (
        <div
          className="md:hidden border-t border-gray-200 dark:border-gray-800"
          id="mobile-menu"
        >
          <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label}>
                  <button
                    onClick={() => toggleMobileDropdown(link.label)}
                    className="w-full flex justify-between items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded-md text-base font-medium"
                  >
                    {link.label}
                    <ChevronDownIcon
                      className={`h-5 w-5 transition-transform duration-300 ${
                        openMobileDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openMobileDropdown === link.label && (
                    <div className="pl-4 pt-2 space-y-1">
                      {link.dropdown.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 block px-3 py-2 rounded-md text-sm font-medium"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                >
                  {link.label}
                </a>
              )
            )}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <AvatarIcon className="h-10 w-10" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                      Tom Cook
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      tom@example.com
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                {avatarDropdownLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;
