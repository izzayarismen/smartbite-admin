import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag, Wallet, Clock, Mail, Phone, Calendar } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { customers, formatIDR } from "@/lib/data";

export const Route = createFileRoute("/customer/$id")({
  head: () => ({ meta: [{ title: "Detail Customer — SmartBite Admin" }] }),
  component: DetailCustomer,
});

const orders = [
  { id: "O1", store: "Ayam Geprek Mantul", item: "Ayam Geprek + Es Teh", total: 28000, date: "Hari ini" },
  { id: "O2", store: "Kopi Senja", item: "Kopi Susu Gula Aren", total: 18000, date: "Kemarin" },
  { id: "O3", store: "Nasi Goreng Pak Budi", item: "Nasi Goreng Spesial", total: 25000, date: "2 hari lalu" },
  { id: "O4", store: "Bakso Beranak", item: "Bakso Komplit", total: 22000, date: "3 hari lalu" },
];

function DetailCustomer() {
  const { id } = Route.useParams();
  const c = customers.find((x) => x.id === id);

  if (!c) {
    return <AdminLayout title="Detail Customer"><GlassCard>Customer tidak ditemukan.</GlassCard></AdminLayout>;
  }

  const totalSpent = orders.reduce((a, o) => a + o.total, 0) * 6;
  const stats = [
    { label: "Total Pesanan", value: c.totalOrder, icon: ShoppingBag },
    { label: "Total Transaksi", value: formatIDR(totalSpent), icon: Wallet },
    { label: "Aktivitas Terakhir", value: c.lastActive, icon: Clock },
  ];

  return (
    <AdminLayout title="Detail Customer" subtitle={c.name}>
      <Link to="/customer" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Manajemen Customer
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-brand text-2xl font-extrabold text-primary-foreground shadow-glow">{c.name.charAt(0)}</div>
              <div>
                <h2 className="text-xl font-bold">{c.name}</h2>
                <p className="text-sm text-muted-foreground">{c.id} · Bergabung {c.joined}</p>
              </div>
            </div>
            <StatusBadge variant={c.status === "active" ? "success" : "danger"}>{c.status === "active" ? "Akun Aktif" : "Suspended"}</StatusBadge>
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
          <h3 className="mb-3 font-bold">Profil Customer</h3>
          <div className="space-y-3 text-sm">
            <Row icon={Mail} value={c.email} />
            <Row icon={Phone} value={c.phone} />
            <Row icon={Calendar} value={`Bergabung ${c.joined}`} />
            <Row icon={Clock} value={`Aktif ${c.lastActive}`} />
          </div>
        </GlassCard>
      </div>

      <GlassCard delay={0.12} className="mt-5">
        <h3 className="mb-4 font-bold">Riwayat Pesanan</h3>
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between rounded-2xl bg-accent/40 p-4">
              <div>
                <p className="text-sm font-semibold">{o.item}</p>
                <p className="text-xs text-muted-foreground">{o.store} · {o.date}</p>
              </div>
              <span className="text-sm font-bold text-primary">{formatIDR(o.total)}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </AdminLayout>
  );
}

function Row({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/60 text-primary"><Icon className="h-[18px] w-[18px]" /></div>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}
