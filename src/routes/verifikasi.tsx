import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Check, X, Calendar, Tag, Phone, Mail, UserSquare, Store } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Drawer } from "@/components/ui/drawer-panel";
import { DataTable, type Column } from "@/components/ui/data-table";

// Interface dicocokkan dengan data dinamis dari skema database Toko + User terpopulasi
interface PendingSeller {
  id: string;
  name: string;
  store: string;
  category: string;
  no_hp: string;
  email: string;
  registeredAt: string;
  storePhoto: string;
  ktpPhoto: string;
  selfiePhoto: string;
}

interface VerifyHistory {
  id: string;
  name: string;
  store: string;
  status: "approved" | "rejected" | "pending";
  verifiedAt: string;
}

export const Route = createFileRoute("/verifikasi")({
  head: () => ({
    meta: [
      { title: "Verifikasi Penjual — SmartBite Admin" },
      { name: "description", content: "Verifikasi pendaftaran penjual baru SmartBite." },
    ],
  }),
  component: VerifikasiPage,
});

const tabs = [
  { key: "pending", label: "Menunggu Verifikasi" },
  { key: "history", label: "Riwayat Verifikasi" },
];

function VerifikasiPage() {
  const [tab, setTab] = useState("pending");
  const [list, setList] = useState<PendingSeller[]>([]);
  const [historyList, setHistoryList] = useState<VerifyHistory[]>([]);
  const [selected, setSelected] = useState<PendingSeller | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5000/api";

  // Fungsi helper untuk mengambil token dari localStorage dengan tipe data explisit
  const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch Data Toko yang Pending
  const fetchPendingToko = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/toko/admin/pending`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      const result = await res.json();

      if (res.ok && result.success) {
        const formattedData = result.data.map((toko: any) => ({
          id: toko._id,
          name: toko.user_id?.nama || "Tidak ada nama",
          store: toko.nama || "Toko Tanpa Nama",
          category: toko.kategori || "Umum",
          no_hp: toko.user_id?.no_hp || "-", 
          email: toko.user_id?.email || "-",
          registeredAt: toko.createdAt ? new Date(toko.createdAt).toLocaleDateString("id-ID") : "-",
          storePhoto: toko.foto_url || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500", 
          ktpPhoto: toko.foto_ktp_url || "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=500",
          selfiePhoto: toko.foto_diri_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500"
        }));
        setList(formattedData);
      } else {
        toast.error(result.message || "Gagal memuat daftar verifikasi");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal terhubung ke server backend");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Data Semua Riwayat Verifikasi
  const fetchHistoryToko = async () => {
    try {
      const res = await fetch(`${API_URL}/toko/admin/history`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      const result = await res.json();

      if (res.ok && result.success) {
        const formattedHistory = result.data.map((item: any) => ({
          id: item._id,
          name: item.user_id?.nama || "Tidak ada nama",
          store: item.nama || "Toko Tanpa Nama",
          status: item.status_verifikasi, // approved, rejected, atau pending
          verifiedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("id-ID") : "-"
        }));
        setHistoryList(formattedHistory);
      }
    } catch (err) {
      console.error("Gagal mengambil data riwayat", err);
    }
  };

  useEffect(() => {
    fetchPendingToko();
    fetchHistoryToko(); // Load riwayat bersamaan saat halaman dibuka
  }, []);

  const approve = async (s: PendingSeller) => {
    try {
      const res = await fetch(`${API_URL}/toko/verify/${s.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status: "approved" }),
      });
      const result = await res.json();

      if (res.ok) {
        // Refresh data riwayat & data pending langsung dari DB biar akurat
        fetchPendingToko();
        fetchHistoryToko();
        setSelected(null);
        toast.success(`${s.store} berhasil disetujui`);
      } else {
        toast.error(result.message || "Gagal menyetujui toko");
      }
    } catch (err) {
      toast.error("Gagal melakukan koneksi untuk verifikasi");
    }
  };

  const reject = async (s: PendingSeller) => {
    if (!reason.trim()) {
      toast.error("Alasan penolakan wajib diisi");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/toko/verify/${s.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ 
          status: "rejected",
          alasan_penolakan: reason 
        }),
      });
      const result = await res.json();

      if (res.ok) {
        // Refresh data riwayat & data pending langsung dari DB biar akurat
        fetchPendingToko();
        fetchHistoryToko();
        setSelected(null);
        setRejecting(false);
        setReason("");
        toast.success(`${s.store} berhasil ditolak`);
      } else {
        toast.error(result.message || "Gagal menolak toko");
      }
    } catch (err) {
      toast.error("Gagal melakukan koneksi untuk verifikasi");
    }
  };

  const historyCols: Column<VerifyHistory>[] = [
    { key: "name", header: "Nama Seller", render: (r) => <span className="font-semibold">{r.name}</span> },
    { key: "store", header: "Nama Toko", render: (r) => r.store },
    {
      key: "status", header: "Status", render: (r) => (
        <StatusBadge variant={r.status === "approved" ? "success" : r.status === "rejected" ? "danger" : "warning"}>
          {r.status === "approved" ? "Disetujui" : r.status === "rejected" ? "Ditolak" : "Pending"}
        </StatusBadge>
      ),
    },
    { key: "date", header: "Tanggal", render: (r) => <span className="text-muted-foreground">{r.verifiedAt}</span> },
  ];

  const filteredHistory = historyList.filter((h) => statusFilter === "all" || h.status === statusFilter);

  return (
    <AdminLayout title="Verifikasi Penjual" subtitle="Tinjau dan verifikasi penjual baru">
      <div className="mb-6 inline-flex rounded-2xl border border-border bg-card/90 p-1 backdrop-blur-md">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="relative rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
          >
            {tab === t.key && (
              <motion.span layoutId="vtab" className="absolute inset-0 rounded-xl gradient-brand" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
            )}
            <span className={`relative z-10 ${tab === t.key ? "text-primary-foreground" : "text-muted-foreground"}`}>
              {t.label}
              {t.key === "pending" && ` (${list.length})`}
            </span>
          </button>
        ))}
      </div>

      {tab === "pending" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="sm:col-span-2 xl:col-span-3 text-center text-muted-foreground py-8">
              Memuat data toko pending...
            </div>
          ) : (
            list.map((s, i) => (
              <GlassCard key={s.id} delay={i * 0.05} hover>
                <div onClick={() => setSelected(s)}>
                  <div className="h-32 overflow-hidden rounded-2xl">
                    <img src={s.storePhoto} alt={s.store} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">{s.store}</h3>
                      <p className="text-sm text-muted-foreground">{s.name}</p>
                    </div>
                    <StatusBadge variant="warning">Pending</StatusBadge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Tag className="h-3.5 w-3.5" />{s.category}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{s.registeredAt}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="overflow-hidden rounded-xl border border-border">
                      <img src={s.ktpPhoto} alt="KTP" className="h-16 w-full object-cover" />
                      <p className="bg-accent/40 py-1 text-center text-[10px] font-medium text-muted-foreground">Foto KTP</p>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-border">
                      <img src={s.selfiePhoto} alt="Diri" className="h-16 w-full object-cover" />
                      <p className="bg-accent/40 py-1 text-center text-[10px] font-medium text-muted-foreground">Foto Diri</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
          {!loading && list.length === 0 && (
            <GlassCard className="sm:col-span-2 xl:col-span-3 text-center text-muted-foreground">
              Semua penjual sudah diverifikasi. 🎉
            </GlassCard>
          )}
        </div>
      ) : (
        <DataTable
          data={filteredHistory}
          columns={historyCols}
          searchKeys={["name", "store"]}
          searchPlaceholder="Cari seller / toko..."
          filters={[{
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "Semua Status", value: "all" },
              { label: "Disetujui", value: "approved" },
              { label: "Ditolak", value: "rejected" },
              { label: "Pending", value: "pending" },
            ],
          }]}
        />
      )}

      <Drawer
        open={!!selected}
        onClose={() => { setSelected(null); setRejecting(false); setReason(""); }}
        title={selected?.store ?? ""}
        subtitle="Detail pendaftaran penjual"
        footer={selected && (
          <div className="space-y-3">
            {rejecting && (
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tulis alasan penolakan (wajib)..."
                rows={3}
                className="w-full rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:shadow-glow"
              />
            )}
            <div className="flex gap-3">
              {!rejecting ? (
                <>
                  <button onClick={() => approve(selected)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl gradient-brand py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]">
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button onClick={() => setRejecting(true)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 py-3 text-sm font-bold text-destructive transition-colors hover:bg-destructive/20">
                    <X className="h-4 w-4" /> Reject
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setRejecting(false); setReason(""); }} className="flex-1 rounded-2xl border border-border py-3 text-sm font-bold transition-colors hover:bg-accent">Batal</button>
                  <button onClick={() => reject(selected)} className="flex-1 rounded-2xl bg-destructive py-3 text-sm font-bold text-destructive-foreground transition-transform hover:scale-[1.02]">Konfirmasi Tolak</button>
                </>
              )}
            </div>
          </div>
        )}
      >
        {selected && (
          <div className="space-y-5">
            <DetailRow icon={UserSquare} label="Nama Penjual" value={selected.name} />
            <DetailRow icon={Store} label="Nama Toko" value={selected.store} />
            <DetailRow icon={Tag} label="Kategori Toko" value={selected.category} />
            <DetailRow icon={Phone} label="Nomor HP" value={selected.no_hp} />
            <DetailRow icon={Mail} label="Email" value={selected.email} />
            <DetailRow icon={Calendar} label="Tanggal Pendaftaran" value={selected.registeredAt} />

            <div>
              <p className="mb-2 text-sm font-semibold">Foto Toko</p>
              <img src={selected.storePhoto} alt={selected.store} className="h-40 w-full rounded-2xl object-cover" />
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Dokumen Verifikasi</p>
              <div className="grid grid-cols-2 gap-3">
                <DocCard src={selected.ktpPhoto} label="Foto KTP" />
                <DocCard src={selected.selfiePhoto} label="Foto Diri" />
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </AdminLayout>
  );
}

// Sub-komponen pembantu (DetailRow dan DocCard) tetap di bawah seperti kode asli Anda...
function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/60 text-primary">
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function DocCard({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-accent/30">
      <img src={src} alt={label} className="h-28 w-full object-cover" />
      <p className="py-2 text-center text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}