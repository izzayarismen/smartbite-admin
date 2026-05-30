import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Star, ShoppingBag, Clock, Store, User, Trophy } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { AnalyticsCard } from "@/components/ui/analytics-card";
import { sellers, sellerMenu, dailySales, monthlySales } from "@/lib/data";

export const Route = createFileRoute("/penjual/$id")({
  head: () => ({ meta: [{ title: "Detail Penjual — SmartBite Admin" }] }),
  component: DetailPenjual,
});

function DetailPenjual() {
  const { id } = Route.useParams();
  const seller = sellers.find((s) => s.id === id);

  if (!seller) {
    return (
      <AdminLayout title="Detail Penjual">
        <GlassCard>Penjual tidak ditemukan.</GlassCard>
      </AdminLayout>
    );
  }

  const factor = 0.4 + (Number(seller.id.slice(-1)) % 7) * 0.12;
  const daily = dailySales.map((d) => ({ label: d.day, value: Math.round(d.value * factor) }));
  const monthly = monthlySales.map((m) => ({ label: m.month, value: Math.round(m.value * factor) }));

  const stats = [
    { label: "Rating", value: seller.rating, icon: Star },
    { label: "Total Pesanan", value: seller.totalOrder.toLocaleString("id-ID"), icon: ShoppingBag },
    { label: "Jam Operasional", value: `${seller.openTime} - ${seller.closeTime}`, icon: Clock },
  ];

  return (
    <AdminLayout title="Detail Penjual" subtitle={seller.store}>
      <Link to="/penjual" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Manajemen Penjual
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-brand text-2xl font-extrabold text-primary-foreground shadow-glow">
                {seller.store.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{seller.store}</h2>
                <p className="text-sm text-muted-foreground">{seller.category} · Bergabung {seller.joined}</p>
              </div>
            </div>
            <StatusBadge variant={seller.status === "active" ? "success" : "neutral"}>
              {seller.status === "active" ? "Sedang Buka" : "Sedang Tutup"}
            </StatusBadge>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-accent/40 p-4">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-card text-primary"><s.icon className="h-[18px] w-[18px]" /></div>
                <p className="mt-3 text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-extrabold">{s.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.08}>
          <div className="mb-3 flex items-center gap-2"><User className="h-5 w-5 text-primary" /><h3 className="font-bold">Profil Pemilik</h3></div>
          <div className="space-y-3 text-sm">
            <Info label="Nama" value={seller.owner} />
            <Info label="ID Penjual" value={seller.id} />
            <Info label="Kategori" value={seller.category} />
            <Info label="Status Toko" value={seller.status === "active" ? "Sedang Buka" : "Sedang Tutup"} />
          </div>
        </GlassCard>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <AnalyticsCard
          className="lg:col-span-2"
          title="Analitik Penjualan"
          subtitle={`Performa transaksi ${seller.store}`}
          daily={daily}
          monthly={monthly}
          delay={0.1}
        />

        <GlassCard delay={0.14}>
          <div className="mb-3 flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" /><h3 className="font-bold">Menu Terlaris</h3></div>
          <div className="space-y-3">
            {sellerMenu.map((m, i) => (
              <div key={m.name} className="flex items-center gap-3 rounded-2xl bg-accent/40 p-3">
                <span className="grid h-7 w-7 place-items-center rounded-lg gradient-brand text-xs font-bold text-primary-foreground">{i + 1}</span>
                <span className="flex-1 text-sm font-semibold">{m.name}</span>
                <span className="text-sm font-bold text-primary">{m.sold}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-2xl bg-accent/40 p-3 text-sm">
              <Store className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Jam buka</span>
              <span className="ml-auto font-semibold">{seller.openTime} - {seller.closeTime}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
