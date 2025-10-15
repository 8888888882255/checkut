import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-smooth">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M8.28 4.22a9.96 9.96 0 000 15.56m7.44-15.56a9.96 9.96 0 010 15.56"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Admmo.info
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Các nút hiển thị trên desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="hero"
                size="default"
                onClick={() => navigate("/")}
                className="whitespace-nowrap"
              >
                🚨 Danh Sách Admin
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => navigate("/policy")}
                className="whitespace-nowrap"
              >
                Chính Sách
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => navigate("/about")}
                className="whitespace-nowrap"
              >
                Giới Thiệu
              </Button>
            </div>

            {/* Nút dark mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl border border-gray-300 dark:border-gray-600"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>


            {/* Nút menu mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden rounded-xl border border-gray-300 dark:border-gray-600"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>

          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="mt-3 flex justify-center md:hidden animate-fade-in">
            <div className="w-[90%] max-w-[320px] flex flex-col gap-2 p-4 border border-gray-300 rounded-2xl shadow-md bg-white">
              <Button
                variant="hero"
                size="default"
                onClick={() => {
                  navigate("/");
                  setMenuOpen(false);
                }}
              >
                🚨 Danh Sách Admin
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/policy");
                  setMenuOpen(false);
                }}
              >
                Chính Sách
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/about");
                  setMenuOpen(false);
                }}
              >
                Giới Thiệu
              </Button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
