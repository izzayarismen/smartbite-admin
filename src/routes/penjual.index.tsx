import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Star, Power, PowerOff, Trash2, Clock } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable, type Column } from "@/components/ui/data-table";
import { sellers as seedSellers, type Seller } from "@/lib/data";

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
  const [data, setData] = useState<Seller[]>(seedSellers);
  const [statusFilter, setStatusFilter] = useState("all");

  const toggle = (s: Seller) => {
    setData((d) => d.map((x) => (x.id === s.id ? { ...x, status: x.status === "active" ? "inactive" : "active" } : x)));
    toast.success(`${s.store} ${s.status === "active" ? "ditutup" : "dibuka"}`);
  };

  const remove = (s: Seller) => {
    setData((d) => d.filter((x) => x.id !== s.id));
    toast.success(`Toko ${s.store} dihapus`);
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
    { key: "status", header: "Status", render: (s) => <StatusBadge variant={s.status === "active" ? "success" : "neutral"}>{s.status === "active" ? "Buka" : "Tutup"}</StatusBadge> },
    { key: "rating", header: "Rating", render: (s) => <span className="inline-flex items-center gap-1 font-semibold"><Star className="h-3.5 w-3.5 fill-warning text-warning" />{s.rating}</span> },
    { key: "order", header: "Total Order", render: (s) => <span className="font-semibold">{s.totalOrder.toLocaleString("id-ID")}</span> },
    {
      key: "hours", header: "Jam Operasional", render: (s) => (
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />{s.openTime} - {s.closeTime}
        </span>
      ),
    },
    {
      key: "action", header: "Aksi", render: (s) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => toggle(s)} className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors ${s.status === "active" ? "border-destructive/30 text-destructive hover:bg-destructive/10" : "border-success/30 text-success hover:bg-success/10"}`} title={s.status === "active" ? "Tutup Toko" : "Buka Toko"}>
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
    </AdminLayout>
  );
}
