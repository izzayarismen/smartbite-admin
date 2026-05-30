import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, type Column } from "@/components/ui/data-table";
import { customers as seed, type Customer } from "@/lib/data";

export const Route = createFileRoute("/customer/")({
  head: () => ({
    meta: [
      { title: "Manajemen Customer — SmartBite Admin" },
      { name: "description", content: "Kelola akun customer SmartBite." },
    ],
  }),
  component: CustomerPage,
});

function CustomerPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Customer[]>(seed);

  const remove = (c: Customer) => {
    setData((d) => d.filter((x) => x.id !== c.id));
    toast.success(`Customer ${c.name} dihapus`);
  };

  const cols: Column<Customer>[] = [
    {
      key: "name", header: "Nama", render: (c) => (
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-xs font-bold text-primary-foreground">{c.name.charAt(0)}</div>
          <p className="font-semibold">{c.name}</p>
        </div>
      ),
    },
    { key: "email", header: "Email", render: (c) => <span className="text-muted-foreground">{c.email}</span> },
    { key: "phone", header: "Nomor HP", render: (c) => <span className="text-muted-foreground">{c.phone}</span> },
    { key: "order", header: "Total Order", render: (c) => <span className="font-semibold">{c.totalOrder}</span> },
    {
      key: "action", header: "Aksi", render: (c) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => remove(c)} className="grid h-9 w-9 place-items-center rounded-xl border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10" title="Hapus Customer"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Manajemen Customer" subtitle="Kelola akun pengguna platform">
      <DataTable
        data={data}
        columns={cols}
        searchKeys={["name", "email"]}
        searchPlaceholder="Cari nama / email..."
        onRowClick={(c) => navigate({ to: "/customer/$id", params: { id: c.id } })}
      />
    </AdminLayout>
  );
}
