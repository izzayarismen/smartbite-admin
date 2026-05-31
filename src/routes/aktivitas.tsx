import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LogIn, CheckCircle2, XCircle, UserMinus, Power, PowerOff, Trash2, Search,
  Clock, ToggleLeft, ToggleRight, Store, Plus, Pencil, Utensils, Info,
  ShoppingBag, PackageCheck, Ban, PackageOpen, UserCog,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { activities, type ActivityType, type ActivityActor } from "@/lib/data";

export const Route = createFileRoute("/aktivitas")({
  head: () => ({
    meta: [
      { title: "Aktivitas Sistem — SmartBite Admin" },
      { name: "description", content: "Log aktivitas dan audit trail platform SmartBite." },
    ],
  }),
  component: AktivitasPage,
});

const meta: Record<ActivityType, { icon: React.ElementType; color: string; label: string }> = {
  // admin
  login: { icon: LogIn, color: "bg-primary/12 text-primary", label: "Login Admin" },
  approve: { icon: CheckCircle2, color: "bg-success/12 text-success", label: "Approve Seller" },
  reject: { icon: XCircle, color: "bg-destructive/12 text-destructive", label: "Reject Seller" },
  delete_customer: { icon: UserMinus, color: "bg-destructive/12 text-destructive", label: "Hapus Customer" },
  open_store: { icon: Power, color: "bg-success/12 text-success", label: "Buka Toko (Admin)" },
  close_store: { icon: PowerOff, color: "bg-warning/20 text-warning-foreground", label: "Tutup Toko (Admin)" },
  delete_store: { icon: Trash2, color: "bg-destructive/12 text-destructive", label: "Hapus Toko" },
  change_global_hours: { icon: Clock, color: "bg-primary/12 text-primary", label: "Ubah Jam Global" },
  platform_on: { icon: ToggleRight, color: "bg-success/12 text-success", label: "Platform ON" },
  platform_off: { icon: ToggleLeft, color: "bg-destructive/12 text-destructive", label: "Platform OFF" },
  // seller
  seller_open: { icon: Power, color: "bg-success/12 text-success", label: "Buka Toko" },
  seller_close: { icon: PowerOff, color: "bg-warning/20 text-warning-foreground", label: "Tutup Toko" },
  add_menu: { icon: Plus, color: "bg-primary/12 text-primary", label: "Tambah Menu" },
  edit_menu: { icon: Pencil, color: "bg-primary/12 text-primary", label: "Edit Menu" },
  delete_menu: { icon: Utensils, color: "bg-destructive/12 text-destructive", label: "Hapus Menu" },
  update_info: { icon: Info, color: "bg-primary/12 text-primary", label: "Update Toko" },
  seller_change_hours: { icon: Clock, color: "bg-primary/12 text-primary", label: "Ubah Jam" },
  complete_order: { icon: PackageCheck, color: "bg-success/12 text-success", label: "Pesanan Selesai" },
  // customer
  create_order: { icon: ShoppingBag, color: "bg-primary/12 text-primary", label: "Buat Pesanan" },
  cancel_order: { icon: Ban, color: "bg-destructive/12 text-destructive", label: "Batal Pesanan" },
  pickup_order: { icon: PackageOpen, color: "bg-success/12 text-success", label: "Ambil Pesanan" },
  update_profile: { icon: UserCog, color: "bg-primary/12 text-primary", label: "Update Profil" },
};

const actorMeta: Record<ActivityActor, { label: string; badge: string; icon: React.ElementType }> = {
  admin: { label: "Admin", badge: "bg-primary/12 text-primary", icon: UserCog },
  seller: { label: "Penjual", badge: "bg-success/12 text-success", icon: Store },
  customer: { label: "Customer", badge: "bg-warning/20 text-warning-foreground", icon: ShoppingBag },
};

const actorTabs: { key: "all" | ActivityActor; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "admin", label: "Admin" },
  { key: "seller", label: "Penjual" },
  { key: "customer", label: "Customer" },
];

function AktivitasPage() {
  const [query, setQuery] = useState("");
  const [actor, setActor] = useState<"all" | ActivityActor>("all");

  const filtered = activities.filter((a) => {
    const matchQ = `${a.actor} ${a.description}`.toLowerCase().includes(query.toLowerCase());
    const matchA = actor === "all" || a.actorType === actor;
    return matchQ && matchA;
  });

  return (
    <AdminLayout title="Aktivitas Sistem" subtitle="Audit trail admin, penjual & customer">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari aktivitas..." className="h-11 w-full rounded-2xl border border-border bg-card/90 pl-10 pr-4 text-sm outline-none backdrop-blur-md focus:shadow-glow" />
        </div>
        <div className="inline-flex rounded-2xl border border-border bg-card/90 p-1 backdrop-blur-md">
          {actorTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActor(t.key)}
              className="relative rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors"
            >
              {actor === t.key && (
                <motion.span layoutId="actor-tab" className="absolute inset-0 rounded-xl gradient-brand" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              )}
              <span className={`relative z-10 ${actor === t.key ? "text-primary-foreground" : "text-muted-foreground"}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <GlassCard>
        <div className="relative pl-2">
          <div className="absolute left-[1.35rem] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-6">
            {filtered.map((a, i) => {
              const m = meta[a.type];
              const am = actorMeta[a.actorType];
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="relative flex gap-4"
                >
                  <div className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl ${m.color}`}>
                    <m.icon className="h-[18px] w-[18px]" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{a.actor}</p>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${am.badge}`}>
                        <am.icon className="h-3 w-3" />{am.label}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${m.color}`}>{m.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/70">{a.time}</p>
                  </div>
                </motion.div>
              );
            })}
            {filtered.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Tidak ada aktivitas.</p>}
          </div>
        </div>
      </GlassCard>
    </AdminLayout>
  );
}
