import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ShieldCheck,
  Store,
  Users,
  Activity,
  UtensilsCrossed,
  LogOut,
  X,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Verifikasi Penjual", url: "/verifikasi", icon: ShieldCheck },
  { title: "Manajemen Penjual", url: "/penjual", icon: Store },
  { title: "Customer", url: "/customer", icon: Users },
  // { title: "Aktivitas Sistem", url: "/aktivitas", icon: Activity },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  const doLogout = () => {
    // Menghapus token dari localstorage
    localStorage.removeItem("token"); 
    
    setConfirmLogout(false);
    onNavigate?.();
    toast.success("Berhasil keluar");
    
    // Redirect ke halaman login
    setTimeout(() => navigate({ to: "/login" }), 300);
  };

  return (
    <div className="glass-card flex h-full flex-col p-4">
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-brand shadow-glow">
          <img src="/logo.png" alt="logo" />
        </div>
        <div>
          <p className="text-base font-extrabold leading-tight">SmartBite</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1.5">
        {items.map((item) => {
          const active = isActive(item.url);
          return (
            <Link
              key={item.url}
              to={item.url}
              onClick={onNavigate}
              className="relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-colors"
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-2xl gradient-brand shadow-glow"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 flex items-center gap-3 ${
                  active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-3 space-y-3">
        <div className="border-t border-border pt-3">
          <button
            onClick={doLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden lg:flex fixed left-4 top-4 bottom-4 z-30 w-64 flex-col">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "-105%" }}
            animate={{ x: 0 }}
            exit={{ x: "-105%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute left-3 top-3 bottom-3 w-68 max-w-[85vw]"
          >
            <button
              onClick={onClose}
              className="absolute -right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-card text-muted-foreground shadow-soft"
              aria-label="Tutup menu"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}