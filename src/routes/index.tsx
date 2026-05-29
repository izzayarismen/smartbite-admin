import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Receipt, CheckCircle2, Users, Store, TrendingUp, TrendingDown, Trophy,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, Cell,
} from "recharts";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { dailySales, monthlySales, topMenus, peakHours } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SmartBite Admin" },
      { name: "description", content: "Pusat monitoring platform SmartBite Self Pickup untuk kampus & pujasera." },
    ],
  }),
  component: Dashboard,
});

const kpis = [
  { label: "Transaksi Hari Ini", value: "1.284", growth: 12.4, up: true, icon: Receipt, trend: [30, 45, 38, 60, 72, 58, 84] },
  { label: "Pesanan Selesai", value: "1.156", growth: 8.1, up: true, icon: CheckCircle2, trend: [20, 35, 30, 48, 55, 62, 70] },
  { label: "Customer Aktif", value: "8.942", growth: 4.7, up: true, icon: Users, trend: [40, 42, 50, 48, 55, 60, 64] },
  { label: "Penjual Aktif", value: "126", growth: 2.3, up: false, icon: Store, trend: [60, 58, 55, 52, 54, 50, 48] },
];

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const chart = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={44}>
      <AreaChart data={chart} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={`spark-${up}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={up ? "#0B61F4" : "#ef4444"} stopOpacity={0.35} />
            <stop offset="100%" stopColor={up ? "#0B61F4" : "#ef4444"} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={up ? "#0B61F4" : "#ef4444"} strokeWidth={2} fill={`url(#spark-${up})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const tooltipStyle = {
  borderRadius: 16,
  border: "1px solid rgba(11,97,244,0.15)",
  boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  fontSize: 12,
} as const;

function Dashboard() {
  const maxPeak = Math.max(...peakHours.map((p) => p.value));
  return (
    <AdminLayout title="Dashboard" subtitle="Pusat monitoring platform SmartBite">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <GlassCard key={k.label} delay={i * 0.06} hover>
            <div className="flex items-start justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-brand text-primary-foreground shadow-glow">
                <k.icon className="h-5 w-5" />
              </div>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${k.up ? "bg-success/12 text-success" : "bg-destructive/12 text-destructive"}`}>
                {k.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {k.growth}%
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">{k.label}</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">{k.value}</p>
            <div className="mt-2"><Sparkline data={k.trend} up={k.up} /></div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <GlassCard delay={0.1} className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Penjualan Harian</h2>
              <p className="text-sm text-muted-foreground">Jumlah transaksi 7 hari terakhir</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dailySales} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2773F5" />
                  <stop offset="100%" stopColor="#8FB6FA" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
              <Tooltip cursor={{ fill: "rgba(11,97,244,0.05)" }} contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="url(#barGrad)" radius={[8, 8, 0, 0]} maxBarSize={42} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard delay={0.16}>
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Menu Terlaris</h2>
          </div>
          <div className="space-y-3">
            {topMenus.map((m, i) => (
              <div key={m.name} className="flex items-center gap-3 rounded-2xl bg-accent/40 p-3">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-bold ${i === 0 ? "gradient-brand text-primary-foreground" : "bg-card text-primary"}`}>
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.store}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-primary">{m.sold}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <GlassCard delay={0.2} className="xl:col-span-2">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Penjualan Bulanan</h2>
            <p className="text-sm text-muted-foreground">Total transaksi per bulan tahun ini</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlySales} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B61F4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0B61F4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="value" stroke="#0B61F4" strokeWidth={3} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard delay={0.24}>
          <div className="mb-4">
            <h2 className="text-lg font-bold">Jam Sibuk Kantin</h2>
            <p className="text-sm text-muted-foreground">Intensitas pesanan per jam</p>
          </div>
          <div className="space-y-3">
            {peakHours.map((p, i) => (
              <div key={p.hour} className="flex items-center gap-3">
                <span className="w-10 text-xs font-semibold text-muted-foreground">{p.hour}:00</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-accent/60">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(p.value / maxPeak) * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.05 }}
                    className="h-full rounded-full gradient-brand"
                  />
                </div>
                <span className="w-8 text-right text-xs font-bold">{p.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  );
}
