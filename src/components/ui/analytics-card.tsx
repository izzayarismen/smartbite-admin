import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LineChart } from "lucide-react";
import {
  CartesianGrid, Line, LineChart as ReLineChart, ResponsiveContainer, Tooltip, XAxis,
} from "recharts";
import { GlassCard } from "@/components/ui/glass-card";

const tooltipStyle = {
  borderRadius: 16,
  border: "1px solid #2773F5",
  background: "rgba(255,255,255,0.96)",
  boxShadow: "0 10px 40px rgba(11,97,244,0.25)",
  color: "#0B61F4",
  fontSize: 12,
  fontWeight: 600,
} as const;

type Period = "daily" | "monthly";

export function AnalyticsCard({
  title,
  subtitle,
  daily,
  monthly,
  delay = 0,
  className,
}: {
  title: string;
  subtitle?: string;
  daily: { label: string; value: number }[];
  monthly: { label: string; value: number }[];
  delay?: number;
  className?: string;
}) {
  const [period, setPeriod] = useState<Period>("daily");
  const [open, setOpen] = useState(false);
  const data = period === "daily" ? daily : monthly;

  return (
    <GlassCard delay={delay} className={className}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-primary-foreground shadow-glow">
            <LineChart className="h-[18px] w-[18px]" />
          </div>
          <div>
            <h2 className="text-lg font-bold leading-tight">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-3.5 py-2 text-sm font-semibold transition-shadow hover:shadow-glow"
          >
            {period === "daily" ? "Harian" : "Bulanan"}
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-20 mt-2 w-36 overflow-hidden rounded-2xl border border-border bg-card/95 p-1 shadow-soft backdrop-blur-md"
              >
                {(["daily", "monthly"] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPeriod(p); setOpen(false); }}
                    className={`block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${period === p ? "gradient-brand text-primary-foreground" : "hover:bg-accent"}`}
                  >
                    {p === "daily" ? "Harian" : "Bulanan"}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ReLineChart data={data} margin={{ left: -20 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="rgba(11,97,244,0.10)" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={12} stroke="#2773F5" />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ stroke: "#2773F5", strokeWidth: 1.5, strokeDasharray: "4 4" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0B61F4"
            strokeWidth={3}
            dot={{ r: 3, fill: "#0B61F4", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#0B61F4", stroke: "#6EA8FF", strokeWidth: 3 }}
            animationDuration={600}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
