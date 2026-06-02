import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag, Clock, Mail, Phone, Calendar } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";

interface CustomerData {
  _id: string;
  nama: string;
  email: string;
  no_hp?: string;
  totalOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const Route = createFileRoute("/customer/$id")({
  head: () => ({ meta: [{ title: "Detail Customer — SmartBite Admin" }] }),
  component: DetailCustomer,
});

function DetailCustomer() {
  // Ambil parameter secara dinamis menggunakan safety cast 'as any' 
  // untuk mencegah bentrokan kompilasi pada file routeTree.gen.ts
  const params = Route.useParams() as any;
  const id = params?.id;

  const [c, setC] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch detail customer murni menggunakan Client-Side Rendering (CSR)
  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Request menuju port lokal 5000 sesuai instruksi Anda
        const response = await axios.get(`http://localhost:5000/api/auth/customers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && response.data.customer) {
          setC(response.data.customer);
        } else {
          setC(null);
        }
      } catch (error: any) {
        console.error("Gagal memuat detail customer:", error);
        toast.error(error.response?.data?.message || "Gagal menyambung ke server backend lokal (Port 5000)");
        setC(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerDetail();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Detail Customer">
        <GlassCard>
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground animate-pulse">
            Sedang memuat profil customer dari server...
          </div>
        </GlassCard>
      </AdminLayout>
    );
  }

  // Jika data customer tidak ada atau backend mati, tampilkan card info dengan aman tanpa melempar Error Component global
  if (!c) {
    return (
      <AdminLayout title="Detail Customer">
        <div className="space-y-4">
          <Link to="/customer" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Manajemen Customer
          </Link>
          <GlassCard>
            <p className="text-sm text-muted-foreground text-center py-4">
              Data pelanggan dengan ID <span className="font-mono font-bold">{id}</span> tidak ditemukan atau server <span className="font-mono text-destructive">http://localhost:5000</span> belum dinyalakan.
            </p>
          </GlassCard>
        </div>
      </AdminLayout>
    );
  }

  // Pengondisian format waktu yang aman dari resiko Nil/Null crash
  const joinedDate = c.createdAt 
    ? new Date(c.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "-";

  const lastActiveTime = c.updatedAt
    ? new Date(c.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) + 
      " " + new Date(c.updatedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : "-";

  const stats = [
    { label: "Total Pesanan", value: c.totalOrder ?? 0, icon: ShoppingBag },
    { label: "Aktivitas Terakhir", value: lastActiveTime, icon: Clock },
    { label: "Status Customer", value: "Aktif", icon: Calendar },
  ];

  return (
    <AdminLayout title="Detail Customer" subtitle={c.nama}>
      <Link to="/customer" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Manajemen Customer
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-brand text-2xl font-extrabold text-primary-foreground shadow-glow">
                {c.nama ? c.nama.charAt(0) : "?"}
              </div>
              <div>
                <h2 className="text-xl font-bold">{c.nama}</h2>
                <p className="text-sm text-muted-foreground">Bergabung {joinedDate}</p>
              </div>
            </div>
            <StatusBadge variant="success">Akun Aktif</StatusBadge>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-accent/40 p-4">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-card text-primary">
                  <s.icon className="h-[18px] w-[18px]" />
                </div>
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
            <Row icon={Phone} value={c.no_hp || "-"} />
            <Row icon={Calendar} value={`Bergabung ${joinedDate}`} />
            <Row icon={Clock} value={`Aktif ${lastActiveTime}`} />
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  );
}

function Row({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/60 text-primary">
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}