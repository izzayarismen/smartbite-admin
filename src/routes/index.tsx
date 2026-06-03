import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Store, UserCheck, TrendingUp, Loader2, Trophy } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { AnalyticsCard } from "@/components/ui/analytics-card";
import { toast } from "sonner";

const API_URL = "http://localhost:5000/api/toko";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SmartBite Admin" },
      { name: "description", content: "Pusat monitoring platform SmartBite Self Pickup untuk kampus & pujasera." },
    ],
  }),
  component: Dashboard,
});

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
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/admin/dashboard-stats`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        } else {
          toast.error(result.message || "Gagal memuat ringkasan data");
        }
      } catch (error) {
        toast.error("Gagal menghubungkan ke server backend");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex h-64 w-full items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm font-medium">Sinkronisasi data platform...</span>
        </div>
      </AdminLayout>
    );
  }

  // Pengkondisian Data KPI Dinamis mengikuti mapping state database riil
  const kpis = [
    { 
      label: "Total Toko Terdaftar", 
      value: stats?.totalToko?.toLocaleString("id-ID") || "0", 
      growth: 100, 
      up: true, 
      icon: Store, 
      trend: stats?.analytics?.daily?.map((d: any) => d.value) || [0, 0, 0, 0, 0, 0, 0] 
    },
    { 
      label: "Total Customer Aktif", 
      value: stats?.totalCustomer?.toLocaleString("id-ID") || "0", 
      growth: 100, 
      up: true, 
      icon: UserCheck, 
      trend: stats?.analytics?.monthly?.slice(0, 7).map((m: any) => m.value) || [0, 0, 0, 0, 0, 0, 0] 
    },
  ];

  const daily = stats?.analytics?.daily || [];
  const monthly = stats?.analytics?.monthly || [];
  const topMenus = stats?.topMenus || [];

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
                <TrendingUp className="h-3.5 w-3.5" />
                Live Data
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
          subtitle="Jumlah transaksi platform global"
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
            {topMenus.length > 0 ? (
              topMenus.map((m: any, i: number) => {
                // Validasi proteksi: Jika backend tidak sengaja mengirim object di dalam properti name
                const menuName = typeof m.name === 'object' ? (m.name.nama || "Menu") : m.name;
                const storeName = typeof m.store === 'object' ? (m.store.nama || "Kantin") : m.store;
                const totalTerjual = typeof m.sold === 'object' ? 0 : m.sold;

                return (
                  <div key={i} className="flex items-center gap-3 rounded-2xl bg-accent/40 p-3">
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-bold ${i === 0 ? "gradient-brand text-primary-foreground" : "bg-card text-primary"}`}>
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{String(menuName)}</p>
                      <p className="truncate text-xs text-muted-foreground">{String(storeName)}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-primary">
                      {isNaN(Number(totalTerjual)) ? 0 : Number(totalTerjual)} Porsi
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl bg-accent/20 p-4 text-center text-xs text-muted-foreground">
                Belum ada rekaman transaksi menu terjual di dalam platform.
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  );
}