import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ReportForm from "./pages/ReportForm";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import Admin from "./pages/Admin";
import AdminList from "./pages/AdminList";
import AdminManage from "./pages/AdminManage";
import Login from "./pages/Login";
import About from "./pages/About";
import Policy from "./pages/Policy";
import NotFound from "./pages/NotFound";
import PublicAdminList from "./pages/PublicAdminList";
import PublicAdminDetail from "./pages/PublicAdminDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/report/:id" element={<ReportDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/list" element={<AdminList />} />
          <Route path="/admin/manage" element={<AdminManage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/contact" element={<About />} />
          <Route path="/admins" element={<PublicAdminList />} />
          <Route path="/admins/:id" element={<PublicAdminDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
