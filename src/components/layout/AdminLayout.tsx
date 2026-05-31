import { useState } from "react";
import { motion } from "framer-motion";
import { AppSidebar, MobileSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";

export function AdminLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-200/40 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[28rem] w-[28rem] rounded-full bg-brand-100/50 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-brand-300/30 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(11,97,244,0.08) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <AppSidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-72">
        <div className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6">
          <Topbar title={title} subtitle={subtitle} onMenuClick={() => setMobileOpen(true)} />
          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}
