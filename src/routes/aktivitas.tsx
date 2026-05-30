import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LogIn, CheckCircle2, XCircle, UserMinus, Power, PowerOff, Trash2, Search,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { activities, type ActivityItem } from "@/lib/data";

export const Route = createFileRoute("/aktivitas")({
  head: () => ({
    meta: [
      { title: "Aktivitas Sistem — SmartBite Admin" },
      { name: "description", content: "Log aktivitas dan audit trail platform SmartBite." },
    ],
  }),
  component: AktivitasPage,
});

const meta: Record<ActivityItem["type"], { icon: React.ElementType; color: string; label: string }> = {
  login: { icon: LogIn, color: "bg-primary/12 text-primary", label: "Login Admin" },
  approve: { icon: CheckCircle2, color: "bg-success/12 text-success", label: "Approve Seller" },
  reject: { icon: XCircle, color: "bg-destructive/12 text-destructive", label: "Reject Seller" },
  delete_customer: { icon: UserMinus, color: "bg-destructive/12 text-destructive", label: "Delete Customer" },
  open_store: { icon: Power, color: "bg-success/12 text-success", label: "Buka Toko" },
  close_store: { icon: PowerOff, color: "bg-warning/20 text-warning-foreground", label: "Tutup Toko" },
  delete_store: { icon: Trash2, color: "bg-destructive/12 text-destructive", label: "Delete Toko" },
};

function AktivitasPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const filtered = activities.filter((a) => {
    const matchQ = `${a.actor} ${a.description}`.toLowerCase().includes(query.toLowerCase());
    const matchT = type === "all" || a.type === type;
    return matchQ && matchT;
  });

  return (
    <AdminLayout title="Aktivitas Sistem" subtitle="Audit trail seluruh aksi admin">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari aktivitas..." className="h-11 w-full rounded-2xl border border-border bg-card/90 pl-10 pr-4 text-sm outline-none backdrop-blur-md focus:shadow-glow" />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)} className="h-11 rounded-2xl border border-border bg-card/90 px-3 text-sm font-medium outline-none backdrop-blur-md focus:shadow-glow">
          <option value="all">Semua Tipe</option>
          {Object.entries(meta).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <input type="date" className="h-11 rounded-2xl border border-border bg-card/90 px-3 text-sm font-medium outline-none backdrop-blur-md focus:shadow-glow" />
      </div>

      <GlassCard>
        <div className="relative pl-2">
          <div className="absolute left-[1.35rem] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-6">
            {filtered.map((a, i) => {
              const m = meta[a.type];
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="relative flex gap-4"
                >
                  <div className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl ${m.color}`}>
                    <m.icon className="h-[18px] w-[18px]" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{a.actor}</p>
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
