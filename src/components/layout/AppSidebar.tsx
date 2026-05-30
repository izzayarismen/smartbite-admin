import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShieldCheck,
  Store,
  Users,
  Activity,
  UtensilsCrossed,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Verifikasi Penjual", url: "/verifikasi", icon: ShieldCheck },
  { title: "Manajemen Penjual", url: "/penjual", icon: Store },
  { title: "Customer", url: "/customer", icon: Users },
  { title: "Aktivitas Sistem", url: "/aktivitas", icon: Activity },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <aside className="hidden lg:flex fixed left-4 top-4 bottom-4 z-30 w-64 flex-col">
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

        <div className="rounded-2xl bg-accent/60 p-4 text-center">
          <p className="text-xs font-semibold text-accent-foreground">Self Pickup Platform</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Kampus & Pujasera</p>
        </div>
      </div>
    </aside>
  );
}
