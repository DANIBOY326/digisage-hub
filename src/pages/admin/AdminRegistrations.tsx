import { useState, useEffect, useCallback } from "react";
import { supabase, PAYMENT_EVIDENCE_BUCKET } from "@/lib/supabaseClient.ts";
import type { Registration } from "@/lib/registration.ts";
import { useAuth } from "@/hooks/use-auth.ts";
import { motion } from "motion/react";
import {
  Users,
  Clock,
  Eye,
  PhoneCall,
  Filter,
  Trash2,
  ChevronDown,
  BarChart2,
  RefreshCw,
  Download,
  ExternalLink,
  CreditCard,
  Banknote,
  ShieldAlert,
  Wallet,
  Loader2,
  LogIn,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { toast } from "sonner";
import { format } from "date-fns";
import Papa from "papaparse";

// ── UI-shaped registration (camelCase, mirrors the Supabase row shape) ─────────

type UIRegistration = {
  _id: string;
  _creationTime: number;
  fullName: string;
  email: string;
  phone: string;
  courseId: string;
  courseName: string;
  cohortPreference: string;
  motivation: string;
  status: "pending" | "reviewed" | "contacted";
  paymentType: "full" | "part";
  paymentEvidencePath: string | null;
  evidenceUrl?: string | null;
};

function mapRow(row: Registration): UIRegistration {
  return {
    _id: row.id,
    _creationTime: new Date(row.created_at).getTime(),
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    courseId: row.course_id,
    courseName: row.course_name,
    cohortPreference: row.cohort_preference,
    motivation: row.motivation,
    status: row.status,
    paymentType: row.payment_type,
    paymentEvidencePath: row.payment_evidence_path,
    evidenceUrl: null,
  };
}

const PAGE_SIZE = 20;

async function fetchRegistrationsPage(opts: {
  courseFilter: string;
  statusFilter: StatusFilter;
  from: number;
  to: number;
}) {
  let query = supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false })
    .range(opts.from, opts.to);
  if (opts.courseFilter !== "all") query = query.eq("course_id", opts.courseFilter);
  if (opts.statusFilter !== "all") query = query.eq("status", opts.statusFilter);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Registration[];
}

async function attachEvidenceUrls(rows: Registration[]): Promise<UIRegistration[]> {
  const mapped = rows.map(mapRow);
  await Promise.all(
    mapped.map(async (r) => {
      if (!r.paymentEvidencePath) return;
      const { data } = await supabase.storage
        .from(PAYMENT_EVIDENCE_BUCKET)
        .createSignedUrl(r.paymentEvidencePath, 3600);
      r.evidenceUrl = data?.signedUrl ?? null;
    }),
  );
  return mapped;
}

type AdminStats = {
  total: number;
  pending: number;
  reviewed: number;
  contacted: number;
  fullPayment: number;
  partPayment: number;
  byCourse: Record<string, number>;
};

async function loadStats(): Promise<AdminStats> {
  const base = () => supabase.from("registrations").select("id", { count: "exact", head: true });

  const [totalRes, pendingRes, reviewedRes, contactedRes, fullRes, partRes, courseRes] =
    await Promise.all([
      base(),
      base().eq("status", "pending"),
      base().eq("status", "reviewed"),
      base().eq("status", "contacted"),
      base().eq("payment_type", "full"),
      base().eq("payment_type", "part"),
      supabase.from("registrations").select("course_name"),
    ]);

  const byCourse: Record<string, number> = {};
  for (const row of courseRes.data ?? []) {
    const name = (row as { course_name: string }).course_name;
    byCourse[name] = (byCourse[name] ?? 0) + 1;
  }

  return {
    total: totalRes.count ?? 0,
    pending: pendingRes.count ?? 0,
    reviewed: reviewedRes.count ?? 0,
    contacted: contactedRes.count ?? 0,
    fullPayment: fullRes.count ?? 0,
    partPayment: partRes.count ?? 0,
    byCourse,
  };
}

// ── Constants ─────────────────────────────────────────────────────────────────

const COURSES = [
  { id: "all", name: "All Courses" },
  { id: "data-analysis", name: "Data Analysis" },
  { id: "uiux-design", name: "UI/UX Design" },
  { id: "graphic-design", name: "Graphic Design" },
  { id: "digital-marketing", name: "Digital Marketing" },
  { id: "cybersecurity", name: "Cybersecurity" },
  { id: "web-development", name: "Web Development" },
  { id: "basic-computer-training", name: "Basic Computer Training" },
];

const STATUS_FILTERS = [
  { id: "all", name: "All Statuses" },
  { id: "pending", name: "Pending" },
  { id: "reviewed", name: "Reviewed" },
  { id: "contacted", name: "Contacted" },
] as const;

type StatusFilter = "all" | "pending" | "reviewed" | "contacted";

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === "pending")
    return (
      <Badge className="bg-[oklch(0.74_0.17_47/0.15)] text-[oklch(0.74_0.17_47)] border border-[oklch(0.74_0.17_47/0.3)] hover:bg-[oklch(0.74_0.17_47/0.2)]">
        <Clock size={10} className="mr-1" /> Pending
      </Badge>
    );
  if (status === "reviewed")
    return (
      <Badge className="bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20">
        <Eye size={10} className="mr-1" /> Reviewed
      </Badge>
    );
  return (
    <Badge className="bg-accent/15 text-accent border border-accent/30 hover:bg-accent/20">
      <PhoneCall size={10} className="mr-1" /> Contacted
    </Badge>
  );
}

// ── Payment badge ─────────────────────────────────────────────────────────────

function PaymentBadge({ paymentType }: { paymentType: "full" | "part" | undefined }) {
  if (paymentType === "full")
    return (
      <Badge className="bg-accent/10 text-accent border border-accent/25 hover:bg-accent/15 gap-1">
        <CreditCard size={9} /> Full
      </Badge>
    );
  if (paymentType === "part")
    return (
      <Badge className="bg-[oklch(0.74_0.17_47/0.12)] text-[oklch(0.74_0.17_47)] border border-[oklch(0.74_0.17_47/0.25)] hover:bg-[oklch(0.74_0.17_47/0.18)] gap-1">
        <Banknote size={9} /> Part
      </Badge>
    );
  return <span className="text-xs text-muted-foreground">—</span>;
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | undefined;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} shrink-0`}>
        <Icon size={18} />
      </div>
      <div>
        {value === undefined ? (
          <Skeleton className="h-7 w-12 mb-1" />
        ) : (
          <p className="text-2xl font-serif font-bold text-foreground">{value}</p>
        )}
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

// ── CSV export ────────────────────────────────────────────────────────────────

type ExportRow = {
  _id: string;
  _creationTime: number;
  fullName: string;
  email: string;
  phone: string;
  courseName: string;
  cohortPreference: string;
  paymentType?: "full" | "part";
  status: string;
  motivation: string;
  evidenceUrl?: string | null;
};

function exportToCsv(rows: ExportRow[], courseFilter: string, statusFilter: string) {
  const mapped = rows.map((r) => ({
    "Registration Date": format(new Date(r._creationTime), "d MMM yyyy HH:mm"),
    "Full Name": r.fullName,
    "Email": r.email,
    "Phone": r.phone,
    "Course": r.courseName,
    "Cohort Preference": r.cohortPreference,
    "Payment Type": r.paymentType === "full" ? "Full Payment" : r.paymentType === "part" ? "Part Payment" : "",
    "Status": r.status,
    "Motivation": r.motivation,
    "Payment Evidence URL": r.evidenceUrl ?? "",
  }));

  const csv = Papa.unparse(mapped, { quotes: true, header: true });
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const date = format(new Date(), "yyyy-MM-dd");
  const suffix = [
    courseFilter !== "all" ? courseFilter : "",
    statusFilter !== "all" ? statusFilter : "",
  ]
    .filter(Boolean)
    .join("-");
  link.download = `digisage-registrations-${date}${suffix ? `-${suffix}` : ""}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── Access denied screen ──────────────────────────────────────────────────────

function AccessDenied() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      toast.success("Signed in");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Sign in failed. Check your credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-sm w-full">
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="text-destructive" size={24} />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Admin Access Only</h1>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          This area is restricted to DigiSage administrators. Please sign in with your admin account to continue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <div className="space-y-1.5">
            <Label htmlFor="admin-email" className="text-xs">Email</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-password" className="text-xs">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full gap-1.5" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <LogIn size={14} />
            )}
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <a href="/" className="block mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Back to site
        </a>
      </div>
    </div>
  );
}

// ── Admin inner ───────────────────────────────────────────────────────────────

function AdminInner() {
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [stats, setStats] = useState<AdminStats | undefined>(undefined);
  const [exportCount, setExportCount] = useState<number | undefined>(undefined);
  const [results, setResults] = useState<UIRegistration[]>([]);
  const [status, setStatus] = useState<
    "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted"
  >("LoadingFirstPage");

  const refreshStats = useCallback(async () => {
    try {
      const s = await loadStats();
      setStats(s);
    } catch {
      toast.error("Failed to load stats");
    }
  }, []);

  const refreshExportCount = useCallback(async () => {
    let query = supabase
      .from("registrations")
      .select("id", { count: "exact", head: true });
    if (courseFilter !== "all") query = query.eq("course_id", courseFilter);
    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    const { count } = await query;
    setExportCount(count ?? undefined);
  }, [courseFilter, statusFilter]);

  useEffect(() => {
    let cancelled = false;
    // Resetting to a loading state before the async fetch is the standard
    // "reset-then-fetch on dependency change" pattern — correct and safe,
    // but flagged by the experimental react-compiler lint rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("LoadingFirstPage");
    setResults([]);
    (async () => {
      try {
        const rows = await fetchRegistrationsPage({
          courseFilter,
          statusFilter,
          from: 0,
          to: PAGE_SIZE - 1,
        });
        if (cancelled) return;
        const withUrls = await attachEvidenceUrls(rows);
        if (cancelled) return;
        setResults(withUrls);
        setStatus(rows.length < PAGE_SIZE ? "Exhausted" : "CanLoadMore");
      } catch {
        if (!cancelled) {
          toast.error("Failed to load registrations");
          setStatus("Exhausted");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseFilter, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshStats();
    refreshExportCount();
  }, [refreshStats, refreshExportCount]);

  const loadMore = async () => {
    setStatus("LoadingMore");
    try {
      const rows = await fetchRegistrationsPage({
        courseFilter,
        statusFilter,
        from: results.length,
        to: results.length + PAGE_SIZE - 1,
      });
      const withUrls = await attachEvidenceUrls(rows);
      setResults((prev) => [...prev, ...withUrls]);
      setStatus(rows.length < PAGE_SIZE ? "Exhausted" : "CanLoadMore");
    } catch {
      toast.error("Failed to load more registrations");
      setStatus("CanLoadMore");
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "pending" | "reviewed" | "contacted",
  ) => {
    try {
      const { error } = await supabase
        .from("registrations")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      setResults((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r)),
      );
      toast.success("Status updated");
      refreshStats();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const target = results.find((r) => r._id === deleteTarget);
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("id", deleteTarget);
      if (error) throw error;
      if (target?.paymentEvidencePath) {
        await supabase.storage
          .from(PAYMENT_EVIDENCE_BUCKET)
          .remove([target.paymentEvidencePath]);
      }
      setResults((prev) => prev.filter((r) => r._id !== deleteTarget));
      toast.success("Registration deleted");
      setDeleteTarget(null);
      refreshStats();
      refreshExportCount();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let query = supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });
      if (courseFilter !== "all") query = query.eq("course_id", courseFilter);
      if (statusFilter !== "all") query = query.eq("status", statusFilter);
      const { data, error } = await query;
      if (error) throw error;
      const rows = (data ?? []) as Registration[];

      // Signed URLs valid for 7 days — long enough to be useful in a
      // downloaded CSV, unlike the 1-hour links used for on-screen viewing.
      const withEvidence: ExportRow[] = await Promise.all(
        rows.map(async (row) => {
          let evidenceUrl: string | null = null;
          if (row.payment_evidence_path) {
            const { data: signed } = await supabase.storage
              .from(PAYMENT_EVIDENCE_BUCKET)
              .createSignedUrl(row.payment_evidence_path, 60 * 60 * 24 * 7);
            evidenceUrl = signed?.signedUrl ?? null;
          }
          return { ...mapRow(row), evidenceUrl };
        }),
      );

      exportToCsv(withEvidence, courseFilter, statusFilter);
      toast.success(`Exported ${withEvidence.length} registrations`);
    } catch {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm font-serif">DS</span>
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-foreground leading-tight">
                Registrations
              </h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-xs gap-1.5 border border-border"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download size={13} />
              {isExporting ? "Exporting..." : `Export CSV${exportCount !== undefined ? ` (${exportCount})` : ""}`}
            </Button>
            <a
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to site
            </a>
          </div>
        </div>
      </div>

      <div className="w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          <StatCard label="Total" value={stats?.total} icon={Users} color="bg-primary/15 text-primary" />
          <StatCard label="Pending" value={stats?.pending} icon={Clock} color="bg-[oklch(0.74_0.17_47/0.15)] text-[oklch(0.74_0.17_47)]" />
          <StatCard label="Reviewed" value={stats?.reviewed} icon={Eye} color="bg-primary/15 text-primary" />
          <StatCard label="Contacted" value={stats?.contacted} icon={PhoneCall} color="bg-accent/15 text-accent" />
          <StatCard label="Full Payment" value={stats?.fullPayment} icon={CreditCard} color="bg-accent/10 text-accent" />
          <StatCard label="Part Payment" value={stats?.partPayment} icon={Wallet} color="bg-[oklch(0.74_0.17_47/0.12)] text-[oklch(0.74_0.17_47)]" />
        </motion.div>

        {/* Course breakdown */}
        {stats && Object.keys(stats.byCourse).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={15} className="text-accent" />
              <h2 className="text-sm font-semibold text-foreground">By Course</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.byCourse).map(([course, count]) => (
                <div
                  key={course}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs"
                >
                  <span className="text-foreground font-medium">{course}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <Filter size={14} className="text-muted-foreground" />
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-44 h-9 text-sm">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              {COURSES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="w-40 h-9 text-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(courseFilter !== "all" || statusFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 text-xs text-muted-foreground gap-1"
              onClick={() => {
                setCourseFilter("all");
                setStatusFilter("all");
              }}
            >
              <RefreshCw size={12} /> Clear filters
            </Button>
          )}
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-xl border border-border overflow-hidden"
        >
          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-[2fr_2fr_2fr_1fr_1.2fr_1.2fr_auto] gap-3 px-6 py-3 bg-secondary/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Name</span>
            <span>Contact</span>
            <span>Course</span>
            <span>Payment</span>
            <span>Evidence</span>
            <span>Status</span>
            <span />
          </div>

          {status === "LoadingFirstPage" ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex gap-4">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="px-6 py-16 text-center text-muted-foreground text-sm">
              No registrations found.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {results.map((reg) => {
                const regWithUrl = reg as typeof reg & { evidenceUrl?: string | null };
                return (
                  <div key={reg._id}>
                    {/* Desktop row */}
                    <div className="hidden md:grid grid-cols-[2fr_2fr_2fr_1fr_1.2fr_1.2fr_auto] gap-3 px-6 py-4 items-center hover:bg-secondary/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{reg.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(reg._creationTime), "d MMM yyyy")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground truncate">{reg.email}</p>
                        <p className="text-xs text-muted-foreground">{reg.phone}</p>
                      </div>
                      <p className="text-sm text-foreground">{reg.courseName}</p>

                      {/* Payment type */}
                      <PaymentBadge paymentType={reg.paymentType} />

                      {/* Evidence link */}
                      <div>
                        {regWithUrl.evidenceUrl ? (
                          <a
                            href={regWithUrl.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            View <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </div>

                      {/* Status selector */}
                      <Select
                        value={reg.status}
                        onValueChange={(v) =>
                          handleStatusChange(
                            reg._id,
                            v as "pending" | "reviewed" | "contacted",
                          )
                        }
                      >
                        <SelectTrigger className="h-9 w-36 text-xs cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            setExpandedId(expandedId === reg._id ? null : reg._id)
                          }
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                          title="View motivation"
                        >
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${expandedId === reg._id ? "rotate-180" : ""}`}
                          />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(reg._id)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded motivation */}
                    {expandedId === reg._id && (
                      <div className="hidden md:block px-6 pb-4 bg-secondary/20">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Motivation
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {reg.motivation}
                        </p>
                        {reg.cohortPreference && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Cohort preference: {reg.cohortPreference}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Mobile card */}
                    <div className="md:hidden px-4 py-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{reg.fullName}</p>
                          <p className="text-xs text-muted-foreground">{reg.email}</p>
                          <p className="text-xs text-muted-foreground">{reg.phone}</p>
                        </div>
                        <button
                          onClick={() => setDeleteTarget(reg._id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs bg-secondary px-2 py-1 rounded-md border border-border">
                          {reg.courseName}
                        </span>
                        <StatusBadge status={reg.status} />
                        <PaymentBadge paymentType={reg.paymentType} />
                        {regWithUrl.evidenceUrl && (
                          <a
                            href={regWithUrl.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            Evidence <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                      <Select
                        value={reg.status}
                        onValueChange={(v) =>
                          handleStatusChange(
                            reg._id,
                            v as "pending" | "reviewed" | "contacted",
                          )
                        }
                      >
                        <SelectTrigger className="h-8 w-full text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                        </SelectContent>
                      </Select>
                      <details className="text-xs">
                        <summary className="text-muted-foreground cursor-pointer">
                          View motivation
                        </summary>
                        <p className="mt-2 text-foreground leading-relaxed">{reg.motivation}</p>
                      </details>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load more */}
          {status === "CanLoadMore" && (
            <div className="px-6 py-4 border-t border-border text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => loadMore()}
              >
                Load more
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete registration?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The registration and any uploaded payment evidence will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Page with auth gate ───────────────────────────────────────────────────────

export default function AdminRegistrations() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Checking access…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AccessDenied />;
  }

  return <AdminInner />;
}
