import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Admmo.info — Cộng đồng chống lừa đảo Việt Nam.
          </p>
          
          <div className="flex items-center gap-4 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-smooth">
              Giới thiệu
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/policy" className="text-muted-foreground hover:text-primary transition-smooth">
              Chính sách
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-smooth">
              Liên hệ
            </Link>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
              5,231 Báo cáo
            </span>
            <span className="px-3 py-1 rounded-full bg-success/10 text-success font-medium">
              1,024 Đã xác minh
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
