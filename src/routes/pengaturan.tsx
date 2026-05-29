import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Building2, Image, ImageUp, Mail, User, Lock, UtensilsCrossed } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";

export const Route = createFileRoute("/pengaturan")({
  head: () => ({
    meta: [
      { title: "Pengaturan — SmartBite Admin" },
      { name: "description", content: "Atur platform dan profil admin SmartBite." },
    ],
  }),
  component: PengaturanPage,
});

function Field({ icon: Icon, label, ...props }: { icon: React.ElementType; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input {...props} className="h-11 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition-shadow focus:shadow-glow" />
      </div>
    </label>
  );
}

function Upload({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-accent/30 py-8 text-muted-foreground transition-colors hover:bg-accent/50">
        <Icon className="h-6 w-6" />
        <span className="text-xs font-medium">Klik untuk unggah</span>
      </div>
    </div>
  );
}

function PengaturanPage() {
  const [tab, setTab] = useState<"platform" | "admin">("platform");

  return (
    <AdminLayout title="Pengaturan" subtitle="Konfigurasi platform dan akun admin">
      <div className="mb-6 inline-flex rounded-2xl border border-border bg-card/90 p-1 backdrop-blur-md">
        {(["platform", "admin"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${tab === t ? "gradient-brand text-primary-foreground" : "text-muted-foreground"}`}>
            {t === "platform" ? "Pengaturan Platform" : "Pengaturan Admin"}
          </button>
        ))}
      </div>

      {tab === "platform" ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <GlassCard>
            <div className="mb-4 flex items-center gap-2"><UtensilsCrossed className="h-5 w-5 text-primary" /><h3 className="font-bold">Informasi Platform</h3></div>
            <div className="space-y-4">
              <Field icon={Building2} label="Nama Platform" defaultValue="SmartBite" />
              <Field icon={Mail} label="Email Support" type="email" defaultValue="support@smartbite.id" />
              <button onClick={() => toast.success("Pengaturan platform disimpan")} className="w-full rounded-2xl gradient-brand py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01]">Simpan Perubahan</button>
            </div>
          </GlassCard>

          <GlassCard delay={0.08}>
            <div className="mb-4 flex items-center gap-2"><Image className="h-5 w-5 text-primary" /><h3 className="font-bold">Aset Visual</h3></div>
            <div className="space-y-4">
              <Upload icon={ImageUp} label="Logo Platform" />
              <Upload icon={Image} label="Banner Login" />
            </div>
          </GlassCard>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <GlassCard>
            <div className="mb-4 flex items-center gap-2"><User className="h-5 w-5 text-primary" /><h3 className="font-bold">Edit Profil</h3></div>
            <div className="space-y-4">
              <Field icon={User} label="Nama Admin" defaultValue="Admin Rama" />
              <Field icon={Mail} label="Email" type="email" defaultValue="rama@smartbite.id" />
              <button onClick={() => toast.success("Profil diperbarui")} className="w-full rounded-2xl gradient-brand py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01]">Simpan Profil</button>
            </div>
          </GlassCard>

          <GlassCard delay={0.08}>
            <div className="mb-4 flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /><h3 className="font-bold">Ubah Password</h3></div>
            <div className="space-y-4">
              <Field icon={Lock} label="Password Lama" type="password" placeholder="••••••••" />
              <Field icon={Lock} label="Password Baru" type="password" placeholder="••••••••" />
              <Field icon={Lock} label="Konfirmasi Password" type="password" placeholder="••••••••" />
              <button onClick={() => toast.success("Password berhasil diubah")} className="w-full rounded-2xl gradient-brand py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01]">Ubah Password</button>
            </div>
          </GlassCard>
        </div>
      )}
    </AdminLayout>
  );
}
