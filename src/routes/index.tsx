import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Receipt, CheckCircle2, TrendingUp, TrendingDown, Trophy,
} from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer,
} from "recharts";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { AnalyticsCard } from "@/components/ui/analytics-card";
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
  { label: "Total Transaksi Hari Ini", value: "1.284", growth: 12.4, up: true, icon: Receipt, trend: [30, 45, 38, 60, 72, 58, 84] },
  { label: "Pesanan Selesai Hari Ini", value: "1.156", growth: 8.1, up: true, icon: CheckCircle2, trend: [20, 35, 30, 48, 55, 62, 70] },
];

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const chart = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={48}>
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

function Dashboard() {
  const maxPeak = Math.max(...peakHours.map((p) => p.value));
  const daily = dailySales.map((d) => ({ label: d.day, value: d.value }));
  const monthly = monthlySales.map((m) => ({ label: m.month, value: m.value }));

  return (
    <AdminLayout title="Dashboard" subtitle="Pusat monitoring platform SmartBite">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {kpis.map((k, i) => (
          <GlassCard key={k.label} delay={i * 0.06} hover>
            <div className="flex items-start justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-primary-foreground shadow-glow">
                <k.icon className="h-6 w-6" />
              </div>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${k.up ? "bg-success/12 text-success" : "bg-destructive/12 text-destructive"}`}>
                {k.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {k.growth}%
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">{k.label}</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight">{k.value}</p>
            <div className="mt-3"><Sparkline data={k.trend} up={k.up} /></div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <AnalyticsCard
          className="xl:col-span-2"
          title="Analitik Penjualan"
          subtitle="Jumlah transaksi platform"
          daily={daily}
          monthly={monthly}
          delay={0.1}
        />

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

      <div className="mt-6">
        <GlassCard delay={0.24}>
          <div className="mb-4">
            <h2 className="text-lg font-bold">Jam Sibuk Kantin</h2>
            <p className="text-sm text-muted-foreground">Intensitas pesanan per jam</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {peakHours.map((p, i) => (
              <div key={p.hour} className="flex items-center gap-3">
                <span className="w-12 text-xs font-semibold text-muted-foreground">{p.hour}:00</span>
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
