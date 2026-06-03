import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Star, ShoppingBag, Clock, User, Trophy, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { AnalyticsCard } from "@/components/ui/analytics-card";
import { toast } from "sonner";

const API_URL = "http://localhost:5000/api/toko";

export const Route = createFileRoute("/penjual/$id")({
  head: () => ({ meta: [{ title: "Detail Penjual — SmartBite Admin" }] }),
  component: DetailPenjual,
});

function DetailPenjual() {
  const { id } = Route.useParams();
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSellerDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/admin/penjual/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const result = await response.json();

        if (result.success) {
          setSeller(result.data);
        } else {
          toast.error(result.message || "Gagal mengambil rincian data toko");
        }
      } catch (error) {
        toast.error("Gagal menghubungkan ke server backend");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerDetail();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Detail Penjual">
        <div className="flex h-64 w-full items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm font-medium">Memuat rincian data penjual...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!seller) {
    return (
      <AdminLayout title="Detail Penjual">
        <GlassCard>Penjual tidak ditemukan.</GlassCard>
      </AdminLayout>
    );
  }

  const daily = seller.analytics?.daily || [];
  const monthly = seller.analytics?.monthly || [];
  const popularMenu = seller.menu_terlaris || [];

  const stats = [
    { label: "Rating", value: seller.rating, icon: Star },
    { label: "Total Pesanan", value: seller.totalOrder.toLocaleString("id-ID"), icon: ShoppingBag },
    { label: "Kategori Kantin", value: seller.kategori, icon: Trophy },
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
                <p className="text-sm text-muted-foreground">
                  {seller.kategori} · Bergabung {seller.user_details?.createdAt ? new Date(seller.user_details.createdAt).toLocaleDateString("id-ID", { year: 'numeric', month: 'long' }) : "Baru saja"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-2xl bg-accent/60 px-3 py-1.5 text-xs font-semibold border border-border text-primary">
                <Clock className="h-3.5 w-3.5" />
                <span>{seller.jam_buka} - {seller.jam_tutup}</span>
              </div>
              <StatusBadge variant={seller.status === "active" ? "success" : "neutral"}>
                {seller.status === "active" ? "Sedang Buka" : "Sedang Tutup"}
              </StatusBadge>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-accent/40 p-4">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-card text-primary"><s.icon className="h-4 w-4" /></div>
                <p className="mt-3 text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-extrabold">{s.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.08}>
          <div className="mb-3 flex items-center gap-2"><User className="h-5 w-5 text-primary" /><h3 className="font-bold">Profil Pemilik</h3></div>
          <div className="space-y-3 text-sm">
            <Info label="Nama Pemilik" value={seller.owner} />
            <Info label="Kategori Menu" value={seller.kategori} />
            <Info label="Jam Operasional" value={`${seller.jam_buka} - ${seller.jam_tutup}`} />
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
            {popularMenu.length > 0 ? (
              popularMenu.map((m: any, i: number) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl bg-accent/40 p-3">
                  <span className="grid h-7 w-7 place-items-center rounded-lg gradient-brand text-xs font-bold text-primary-foreground">{i + 1}</span>
                  <span className="flex-1 text-sm font-semibold">{m.name}</span>
                  <span className="text-sm font-bold text-primary">{m.sold} Porsi</span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-accent/20 p-4 text-center text-xs text-muted-foreground">
                Belum ada data transaksi menu selesai untuk toko ini.
              </div>
            )}
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