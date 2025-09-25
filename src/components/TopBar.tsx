import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, Menu, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

interface TopBarProps {
  onMenuToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuToggle }) => {
  const { user: currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const { t, i18n } = useTranslation();

  // Handle outside click for menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
      if (
        langRef.current &&
        !langRef.current.contains(event.target as Node)
      ) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Change language + direction
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.dir = lng === "ar" ? "rtl" : "ltr";
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t("topbar.searchPlaceholder")}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64 transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>

          {/* Language switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((prev) => !prev)}
              className="flex items-center px-3 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              {i18n.language === "ar" ? "العربية 🇸🇦" : "English 🇬🇧"}
              <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => changeLanguage("en")}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  English 🇬🇧
                </button>
                <button
                  onClick={() => changeLanguage("ar")}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  العربية 🇸🇦
                </button>
              </div>
            )}
          </div>

          {/* User info and menu */}
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {currentUser?.role?.replace("_", " ")}
                </p>
              </div>
              <img
                src={currentUser?.avatar || "https://i.pravatar.cc/150?img=1"}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full"
              />
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={logout}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("topbar.logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
