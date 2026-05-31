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
  { title: "Aktivitas Sistem", url: "/aktivitas", icon: Activity },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  const doLogout = () => {
    setConfirmLogout(false);
    onNavigate?.();
    toast.success("Berhasil keluar");
    setTimeout(() => navigate({ to: "/login" }), 300);
  };

  return (
    <div className="glass-card flex h-full flex-col p-4">
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-brand shadow-glow">
          <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
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
                <item.icon className="h-[18px] w-[18px]" />
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-3 space-y-3">
        <div className="rounded-2xl bg-accent/60 p-4 text-center">
          <p className="text-xs font-semibold text-accent-foreground">Self Pickup Platform</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Kampus & Pujasera</p>
        </div>

        <div className="border-t border-border pt-3">
          <button
            onClick={() => setConfirmLogout(true)}
            className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </div>

      <AnimatePresence>
        {confirmLogout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-foreground/30 p-4 backdrop-blur-sm"
            onClick={() => setConfirmLogout(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-sm p-6 text-center"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-destructive/12 text-destructive">
                <LogOut className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold">Keluar dari Admin?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Anda akan diarahkan ke halaman login SmartBite Admin.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="flex-1 rounded-2xl border border-border py-3 text-sm font-bold transition-colors hover:bg-accent"
                >
                  Batal
                </button>
                <button
                  onClick={doLogout}
                  className="flex-1 rounded-2xl bg-destructive py-3 text-sm font-bold text-destructive-foreground transition-transform hover:scale-[1.02]"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
            className="absolute left-3 top-3 bottom-3 w-[17rem] max-w-[85vw]"
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
