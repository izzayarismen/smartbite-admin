import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Star, Power, PowerOff, Trash2, Clock, Globe, AlertTriangle, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable, type Column } from "@/components/ui/data-table";
import { type Seller } from "@/lib/data";

// Asumsi base URL API backend Anda (sesuaikan dengan config service frontend Anda)
const API_URL = "http://localhost:5000/api/toko"; 

export const Route = createFileRoute("/penjual/")({
  head: () => ({
    meta: [
      { title: "Manajemen Penjual — SmartBite Admin" },
      { name: "description", content: "Kelola seluruh tenant kantin SmartBite." },
    ],
  }),
  component: PenjualPage,
});

function PenjualPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Global operational controls
  const [platformOn, setPlatformOn] = useState(true);
  const [globalOpen, setGlobalOpen] = useState("07:00");
  const [globalClose, setGlobalClose] = useState("16:00");
  const [confirmState, setConfirmState] = useState<null | boolean>(null);

  // 1. Fetching Data Penjual dari Backend saat Component Mount
  const fetchSellers = async () => {
    try {
      setLoading(true);
      // Ganti token_admin_disini sesuai manajemen token auth di frontend Anda (misal localStorage)
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${API_URL}/admin/penjual`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        toast.error(result.message || "Gagal mengambil data dari server");
      }
    } catch (error: any) {
      toast.error("Gagal terhubung ke server backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // 2. Aksi Mengubah Status Toko Secara Individu (Toggle Switch)
  const toggle = async (s: Seller) => {
    if (!platformOn) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/penjual/toggle/${s.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (result.success) {
        setData((d) =>
          d.map((x) => (x.id === s.id ? { ...x, status: result.aktif ? "active" : "inactive" } : x))
        );
        toast.success(`${s.store} ${result.aktif ? "dibuka" : "ditutup"}`);
      } else {
        toast.error(result.message || "Gagal mengubah status toko");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan");
    }
  };

  // 3. Aksi Menghapus Toko dari Platform
  const remove = async (s: Seller) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/penjual/${s.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (result.success) {
        setData((d) => d.filter((x) => x.id !== s.id));
        toast.success(`Toko ${s.store} dihapus`);
      } else {
        toast.error(result.message || "Gagal menghapus toko");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan");
    }
  };

  // 4. Aksi Mengubah Operasional Platform Sekaligus (Master Global Switch)
  const applyPlatform = async (next: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/penjual/global-switch`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: next })
      });
      const result = await response.json();

      if (result.success) {
        setPlatformOn(next);
        setConfirmState(null);
        // Memperbarui visual seluruh tabel status mengikuti switch global secara real-time
        setData((d) => d.map((x) => ({ ...x, status: next ? "active" : "inactive" })));
        toast.success(next ? "Operasional platform diaktifkan" : "Operasional platform dinonaktifkan");
      } else {
        toast.error(result.message || "Gagal mengubah status global platform");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan");
    }
  };

  const filtered = data.filter((s) => statusFilter === "all" || s.status === statusFilter);

  const cols: Column<Seller>[] = [
    {
      key: "store", header: "Toko", render: (s) => (
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-xs font-bold text-primary-foreground">
            {s.store.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{s.store}</p>
            <p className="text-xs text-muted-foreground">{s.owner}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status", header: "Status", render: (s) =>
        !platformOn ? (
          <StatusBadge variant="danger">Tutup Oleh Admin</StatusBadge>
        ) : (
          <StatusBadge variant={s.status === "active" ? "success" : "neutral"}>{s.status === "active" ? "Buka" : "Tutup"}</StatusBadge>
        ),
    },
    { key: "rating", header: "Rating", render: (s) => <span className="inline-flex items-center gap-1 font-semibold"><Star className="h-3.5 w-3.5 fill-warning text-warning" />{s.rating}</span> },
    { key: "order", header: "Total Order", render: (s) => <span className="font-semibold">{s.totalOrder.toLocaleString("id-ID")}</span> },
    {
      key: "hours", header: "Jam Operasional", render: () => (
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />{globalOpen} - {globalClose}
        </span>
      ),
    },
    {
      key: "action", header: "Aksi", render: (s) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button disabled={!platformOn} onClick={() => toggle(s)} className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${s.status === "active" ? "border-destructive/30 text-destructive hover:bg-destructive/10" : "border-success/30 text-success hover:bg-success/10"}`} title={!platformOn ? "Platform nonaktif" : s.status === "active" ? "Tutup Toko" : "Buka Toko"}>
            {s.status === "active" ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
          </button>
          <button onClick={() => remove(s)} className="grid h-9 w-9 place-items-center rounded-xl border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10" title="Hapus Toko">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Manajemen Penjual" subtitle="Kelola seluruh tenant kantin">
      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-primary-foreground shadow-glow">
              <Clock className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Jam Operasional Global</h2>
              <p className="text-sm text-muted-foreground">Berlaku untuk seluruh penjual</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Jam Buka Global</label>
              <input type="time" value={globalOpen} onChange={(e) => setGlobalOpen(e.target.value)} className="h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:shadow-glow" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Jam Tutup Global</label>
              <input type="time" value={globalClose} onChange={(e) => setGlobalClose(e.target.value)} className="h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:shadow-glow" />
            </div>
          </div>
          <p className="mt-3 rounded-2xl bg-accent/50 px-4 py-2.5 text-sm font-semibold text-primary">
            Semua penjual mengikuti jadwal {globalOpen} - {globalClose}
          </p>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-primary-foreground shadow-glow">
              <Globe className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Status Operasional Platform</h2>
              <p className="text-sm text-muted-foreground">Master switch seluruh toko</p>
            </div>
          </div>

          <button
            onClick={() => setConfirmState(!platformOn)}
            className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-colors ${platformOn ? "border-success/30 bg-success/10" : "border-destructive/30 bg-destructive/10"}`}
          >
            <span className={`text-sm font-bold ${platformOn ? "text-success" : "text-destructive"}`}>
              {platformOn ? "Platform AKTIF (ON)" : "Platform NONAKTIF (OFF)"}
            </span>
            <span className={`relative h-7 w-12 rounded-full transition-colors ${platformOn ? "bg-success" : "bg-muted-foreground/40"}`}>
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className={`absolute top-1 h-5 w-5 rounded-full bg-card shadow ${platformOn ? "right-1" : "left-1"}`}
              />
            </span>
          </button>
          {!platformOn && (
            <p className="mt-3 text-xs font-medium text-destructive">
              Semua toko ditutup oleh admin. Penjual tidak dapat membuka toko.
            </p>
          )}
        </GlassCard>
      </div>

      {loading ? (
        <div className="flex h-48 w-full items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm font-medium">Memuat data penjual...</span>
        </div>
      ) : (
        <DataTable
          data={filtered}
          columns={cols}
          searchKeys={["store", "owner"]}
          searchPlaceholder="Cari toko / pemilik..."
          onRowClick={(s) => navigate({ to: "/penjual/$id", params: { id: s.id } })}
          filters={[{
            label: "Status", value: statusFilter, onChange: setStatusFilter,
            options: [
              { label: "Semua Status", value: "all" },
              { label: "Buka", value: "active" },
              { label: "Tutup", value: "inactive" },
            ],
          }]}
        />
      )}

      <AnimatePresence>
        {confirmState !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 grid place-items-center bg-foreground/30 p-4 backdrop-blur-sm"
            onClick={() => setConfirmState(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-sm p-6 text-center"
            >
              <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${confirmState ? "bg-success/12 text-success" : "bg-destructive/12 text-destructive"}`}>
                <AlertTriangle className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold">
                {confirmState ? "Aktifkan Platform?" : "Nonaktifkan Platform?"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {confirmState
                  ? "Seluruh penjual akan kembali ke status operasional normal."
                  : "Seluruh toko akan ditutup dan menampilkan status \"Tutup Oleh Admin\"."}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setConfirmState(null)}
                  className="flex-1 rounded-2xl border border-border py-3 text-sm font-bold transition-colors hover:bg-accent"
                >
                  Batal
                </button>
                <button
                  onClick={() => applyPlatform(confirmState)}
                  className={`flex-1 rounded-2xl py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] ${confirmState ? "gradient-brand shadow-glow" : "bg-destructive"}`}
                >
                  {confirmState ? "Aktifkan" : "Nonaktifkan"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}