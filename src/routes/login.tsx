import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, UtensilsCrossed, ArrowRight, ShieldCheck } from "lucide-react";
import loginIllustration from "@/assets/login-illustration.jpg";
import axios from "axios";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — SmartBite Admin" },
      { name: "description", content: "Masuk ke panel admin SmartBite." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // State untuk menangkap input form secara dinamis
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Hit ke endpoint production Vercel
      const response = await axios.post("http://localhost:5000/api/auth/login-admin", {
        email,
        password,
      });

      console.log(response.data);

      if (response.data && response.data.token) {
        // 1. Simpan token ke localStorage browser
        localStorage.setItem("token", response.data.token);

        toast.success(response.data.message || "Berhasil masuk");

        // 2. Alihkan ke dashboard utama
        await navigate({ to: "/" });

        // FIX UNTUK CSR: Paksa reload halaman agar router membersihkan cache instan
        // dan useEffect Guarding di __root.tsx langsung membaca token baru dengan akurat.
        window.location.reload();
      } else {
        toast.error("Gagal mendapatkan kunci otentikasi dari server.");
      }
    } catch (error: any) {
      console.error("Login Admin Error:", error);
      toast.error(
        error.response?.data?.message || "Gagal masuk. Periksa kembali email dan password Anda.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background lg:grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden gradient-brand p-12 text-primary-foreground lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/15 blur-[100px]" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur-md">
            <UtensilsCrossed className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xl font-extrabold leading-tight">SmartBite</p>
            <p className="text-sm text-primary-foreground/80">Admin Panel</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative my-8"
        >
          <img
            src={loginIllustration}
            alt="Ekosistem pemesanan makanan kampus SmartBite"
            width={1024}
            height={1024}
            className="mx-auto w-full max-w-md rounded-3xl border border-white/20 shadow-2xl"
          />
        </motion.div>
      </div>

      {/* Right login card */}
      <div className="relative flex min-h-screen items-center justify-center p-6">
        <div className="pointer-events-none absolute inset-0 lg:hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-200/40 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-brand-100/50 blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-md rounded-3xl border border-white/30 bg-card/90 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-10"
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-brand text-primary-foreground shadow-glow">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-extrabold">SmartBite</p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">Selamat datang kembali</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Masuk ke akun admin Anda untuk melanjutkan
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@smartbite.id"
                  className="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm outline-none transition-shadow focus:shadow-glow"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-11 text-sm outline-none transition-shadow focus:shadow-glow"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border accent-primary"
                  defaultChecked
                />
                Ingat saya
              </label>
              <button type="button" className="text-sm font-semibold text-primary hover:underline">
                Lupa password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl gradient-brand text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Masuk"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Akses panel admin terbatas & terenkripsi
          </p>
        </motion.div>
      </div>
    </div>
  );
}
