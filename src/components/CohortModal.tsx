import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
  BarChart2,
  Brush,
  Globe,
  Megaphone,
  ShieldCheck,
  Code2,
  Monitor,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  Clock,
  BadgeDollarSign,
  Banknote,
} from "lucide-react";

// ── Registration window ────────────────────────────────────────────────────────
// Opens: Aug 31 2026 00:00 WAT (UTC+1) = Aug 30 23:00 UTC
// Closes: Sep 30 2026 23:59 WAT
const REG_OPEN = new Date("2026-08-30T23:00:00Z");
const REG_CLOSE = new Date("2026-09-30T22:59:59Z");

export function getRegistrationState(): "before" | "open" | "closed" {
  const now = new Date();
  if (now < REG_OPEN) return "before";
  if (now > REG_CLOSE) return "closed";
  return "open";
}

export function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const s = Math.floor(diff / 1000);
    return {
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

// ── Courses ────────────────────────────────────────────────────────────────────
const COURSES = [
  {
    id: "data-analysis",
    name: "Data Analysis",
    icon: BarChart2,
    description: "Turn raw data into business insights using modern tools.",
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/8",
    selectedBg: "bg-primary/15",
    selectedBorder: "border-primary",
  },
  {
    id: "uiux-design",
    name: "UI/UX Design",
    icon: Brush,
    description: "Design intuitive digital experiences users love.",
    color: "text-accent",
    border: "border-accent/30",
    bg: "bg-accent/8",
    selectedBg: "bg-accent/15",
    selectedBorder: "border-accent",
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    icon: Globe,
    description: "Master visual communication for brands and digital media.",
    color: "text-[oklch(0.74_0.17_47)]",
    border: "border-[oklch(0.74_0.17_47/0.3)]",
    bg: "bg-[oklch(0.74_0.17_47/0.08)]",
    selectedBg: "bg-[oklch(0.74_0.17_47/0.15)]",
    selectedBorder: "border-[oklch(0.74_0.17_47)]",
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    icon: Megaphone,
    description: "Grow audiences and drive results across digital channels.",
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/8",
    selectedBg: "bg-primary/15",
    selectedBorder: "border-primary",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    icon: ShieldCheck,
    description: "Protect systems and build careers in digital security.",
    color: "text-accent",
    border: "border-accent/30",
    bg: "bg-accent/8",
    selectedBg: "bg-accent/15",
    selectedBorder: "border-accent",
  },
  {
    id: "web-development",
    name: "Web Development",
    icon: Code2,
    description: "Build modern websites and web applications from scratch.",
    color: "text-[oklch(0.74_0.17_47)]",
    border: "border-[oklch(0.74_0.17_47/0.3)]",
    bg: "bg-[oklch(0.74_0.17_47/0.08)]",
    selectedBg: "bg-[oklch(0.74_0.17_47/0.15)]",
    selectedBorder: "border-[oklch(0.74_0.17_47)]",
  },
  {
    id: "basic-computer-training",
    name: "Basic Computer Training",
    icon: Monitor,
    description: "Master essential computer skills for the modern digital world.",
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/8",
    selectedBg: "bg-primary/15",
    selectedBorder: "border-primary",
  },
] as const;

const COHORT_OPTIONS = [
  "Next available cohort",
  "Q4 2026 (October – December)",
  "Q1 2027 (January – March)",
  "Q2 2027 (April – June)",
];

// ── Form schema ────────────────────────────────────────────────────────────────
const formSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  cohortPreference: z.string().min(1, "Please choose a cohort"),
  motivation: z
    .string()
    .min(20, "Please tell us a bit more (at least 20 characters)"),
  paymentType: z.enum(["full", "part"]),
});

type FormValues = z.infer<typeof formSchema>;

// ── Props ──────────────────────────────────────────────────────────────────────
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// ── Countdown tile ─────────────────────────────────────────────────────────────
function CountTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
        {label}
      </span>
    </div>
  );
}

function CountdownSeparator() {
  return <span className="text-2xl font-bold text-muted-foreground pb-3">:</span>;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function CohortModal({ open, onOpenChange }: Props) {
  const regState = getRegistrationState();
  const countdownTarget = regState === "before" ? REG_OPEN : REG_CLOSE;
  const countdown = useCountdown(countdownTarget);

  const [step, setStep] = useState<"courses" | "form" | "success">("courses");
  const [selectedCourse, setSelectedCourse] = useState<
    (typeof COURSES)[number] | null
  >(null);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.registrations.generateUploadUrl);
  const submitRegistration = useMutation(api.registrations.submitRegistration);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      cohortPreference: "",
      motivation: "",
      paymentType: "full",
    },
  });

  const paymentType = form.watch("paymentType");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "application/pdf",
  ];

  if (!allowedTypes.includes(file.type)) {
    toast.error("Please upload a PNG, JPG, or PDF file.");
    e.target.value = "";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    toast.error("File must be under 10MB.");
    e.target.value = "";
    return;
  }

  setEvidenceFile(file);

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = (ev) => {
      setEvidencePreview(ev.target?.result as string);
    };

    reader.readAsDataURL(file);
  } else {
    setEvidencePreview(null);
  }
};

  const removeFile = () => {
    setEvidenceFile(null);
    setEvidencePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (values: FormValues) => {
  if (!selectedCourse) {
    toast.error("Please select a course.");
    return;
  }

  if (!evidenceFile) {
    toast.error("Please upload your payment evidence before submitting.");
    return;
  }

  try {
    // 1. Get Convex upload URL
    const uploadUrl = await generateUploadUrl();

    // 2. Upload evidence
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": evidenceFile.type,
      },
      body: evidenceFile,
    });

    if (!uploadResponse.ok) {
      throw new Error("Payment evidence upload failed.");
    }

    // 3. Get storage ID
    const { storageId } = (await uploadResponse.json()) as {
      storageId: Id<"_storage">;
    };

    // 4. Save registration
    await submitRegistration({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      cohortPreference: values.cohortPreference,
      motivation: values.motivation,
      paymentType: values.paymentType,
      paymentEvidenceStorageId: storageId,
    });

    // 5. Show success
    setStep("success");

    toast.success("Registration submitted successfully!");
  } catch (error) {
    console.error("Registration error:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "We could not submit your registration. Please try again."
    );
  }
};

  const handleClose = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setStep("courses");
        setSelectedCourse(null);
        setEvidenceFile(null);
        setEvidencePreview(null);
        form.reset();
      }, 300);
    }
    onOpenChange(open);
  };

  const progressWidth =
    step === "courses" ? "33%" : step === "form" ? "66%" : "100%";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border p-0">
        {/* Progress bar */}
        {step !== "success" && (
          <div className="h-1 bg-border rounded-t-xl overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: progressWidth }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">

            {/* ── Registration Closed / Not Open Yet ── */}
            {regState !== "open" && (
              <motion.div
                key="closed"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[oklch(0.74_0.17_47/0.15)] border border-[oklch(0.74_0.17_47/0.3)] flex items-center justify-center mx-auto mb-5">
                  <Clock className="text-[oklch(0.74_0.17_47)]" size={28} />
                </div>

                {regState === "before" ? (
                  <>
                    <DialogTitle className="font-serif text-2xl font-bold mb-2">
                      Registration Opens Soon
                    </DialogTitle>
                    <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                      Our next cohort registration opens on{" "}
                      <span className="text-foreground font-semibold">
                        31st August 2026
                      </span>{" "}
                      and closes 30th September 2026.
                    </p>
                    <div className="flex items-end justify-center gap-3 mb-6">
                      <CountTile value={countdown.days} label="Days" />
                      <CountdownSeparator />
                      <CountTile value={countdown.hours} label="Hours" />
                      <CountdownSeparator />
                      <CountTile value={countdown.minutes} label="Mins" />
                      <CountdownSeparator />
                      <CountTile value={countdown.seconds} label="Secs" />
                    </div>
                  </>
                ) : (
                  <>
                    <DialogTitle className="font-serif text-2xl font-bold mb-2">
                      Registration Closed
                    </DialogTitle>
                    <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                      The registration window for this cohort has ended. Stay
                      tuned for the next opening.
                    </p>
                  </>
                )}

                <Button onClick={() => handleClose(false)}>Got it</Button>
              </motion.div>
            )}

            {/* ── Step 1: Course Selection ── */}
            {regState === "open" && step === "courses" && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <DialogHeader className="mb-2">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[oklch(0.74_0.17_47)] mb-1 block">
                    Step 1 of 2
                  </span>
                  <DialogTitle className="font-serif text-2xl sm:text-3xl font-bold">
                    Choose Your Program
                  </DialogTitle>
                </DialogHeader>

                {/* Pricing banner */}
                <div className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/8 px-4 py-3 mb-5">
                  <BadgeDollarSign className="text-accent shrink-0" size={18} />
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">
                      ₦15,000 / $11
                    </span>{" "}
                    <span className="text-muted-foreground">per course · </span>
                    <span className="text-accent font-medium">
                      Part payment available
                    </span>
                  </div>
                  {/* Closing countdown */}
                  <div className="ml-auto flex items-center gap-1.5 text-xs text-[oklch(0.74_0.17_47)] font-semibold whitespace-nowrap">
                    <Clock size={12} />
                    Closes in {countdown.days}d {countdown.hours}h
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                  {COURSES.map((course) => {
                    const Icon = course.icon;
                    const isSelected = selectedCourse?.id === course.id;
                    return (
                      <button
                        key={course.id}
                        onClick={() => setSelectedCourse(course)}
                        className={`text-left rounded-xl border p-4 transition-all cursor-pointer ${
                          isSelected
                            ? `${course.selectedBorder} ${course.selectedBg}`
                            : `${course.border} ${course.bg} hover:border-white/20`
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${course.bg} border ${course.border} shrink-0 mt-0.5`}
                          >
                            <Icon className={course.color} size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-semibold text-sm mb-1 ${isSelected ? course.color : "text-foreground"}`}
                            >
                              {course.name}
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {course.description}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2
                              className={`${course.color} shrink-0 ml-auto mt-0.5`}
                              size={16}
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Button
                  className="w-full font-semibold group"
                  size="lg"
                  onClick={() => {
                    if (!selectedCourse) {
                      toast.error("Please select a course to continue.");
                      return;
                    }
                    setStep("form");
                  }}
                  disabled={!selectedCourse}
                >
                  Continue to Registration
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </motion.div>
            )}

            {/* ── Step 2: Registration Form ── */}
            {regState === "open" && step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <DialogHeader className="mb-5">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1 block">
                    Step 2 of 2
                  </span>
                  <DialogTitle className="font-serif text-2xl sm:text-3xl font-bold">
                    Your Details
                  </DialogTitle>
                  
                  {selectedCourse && (() => {
                const SelectedCourseIcon = selectedCourse.icon;

                return (
                  <div
                    className={`inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full border ${selectedCourse.border} ${selectedCourse.bg} w-fit`}
                  >
                    <SelectedCourseIcon
                      className={selectedCourse.color}
                      size={13}
                    />
                    <span className={`text-xs font-semibold ${selectedCourse.color}`}>
                      {selectedCourse.name}
                    </span>
                  </div>
                );
              })()}

                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="example@gmail.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+234 800 000 0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cohortPreference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cohort Preference</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a cohort" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {COHORT_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="motivation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Why do you want to join?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us what motivates you to learn this skill..."
                              className="resize-none min-h-[90px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* ── Payment Section ── */}
                    <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-1"> <Banknote size={15} className="text-accent" />
                    <span className="text-sm font-semibold text-foreground"> Payment — ₦15,000 / $11 </span> </div>
                    
                    {/* Payment Account Details */}
                    
                    <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                         Make Payment To
                      </p>
                      
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Bank</span>
                        <span className="font-semibold text-foreground">OPay</span>
                        
                    </div>
                    
                    <div className="flex items-center justify-between gap-4"> 
                      <span className="text-muted-foreground">Account Name</span>
                      <span className="font-semibold text-foreground text-right">
                        Daniel Temitope Ojo
                        </span>
                      
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Account Number</span>
                        <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText("9051967160");
                          toast.success("Account number copied!");
                          }}
                          className="font-bold text-accent hover:underline cursor-pointer"
                          title="Click to copy account number"
                          
                        >
                          9051967160
                          </button>
                          </div>
                        </div>
                        
                      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                        Click the account number to copy it, then make your payment using your banking app.
                        
                        </p>
                        
                      </div>
                      
                {/* Payment Options */}
                
                <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Option</FormLabel>
                    
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      
                {/* Full payment */}
                
                <button
                type="button"
                onClick={() => field.onChange("full")}
                className={`rounded-xl border p-3 text-left cursor-pointer transition-all ${
                  field.value === "full"
                  ? "border-primary bg-primary/15"
                  : "border-border bg-card hover:border-white/20"
                  
                  }`}
                  
                  >
                    <p className={`text-sm font-semibold mb-0.5 ${
                      field.value === "full"
                      ? "text-primary"
                      : "text-foreground"
                      
                      }`}
                      
                      > Full Payment
                      </p>
                      
                      <p className="text-xs text-muted-foreground">
                        ₦15,000 / $11 now
                        </p>
                        </button>
                  
                  {/* Part payment */}
                  
                  <button
                  type="button"
                  onClick={() => field.onChange("part")}
                  className={`rounded-xl border p-3 text-left cursor-pointer transition-all ${
                    field.value === "part"
                    ? "border-accent bg-accent/15"
                    : "border-border bg-card hover:border-white/20"
                    
                    }`}
                  
                  >
                    <p
                    className={`text-sm font-semibold mb-0.5 ${
                      field.value === "part"
                      ? "text-accent"
                      : "text-foreground"
                      }`}
                    >
                      Part Payment
                      
                    </p>
                      <p className="text-xs text-muted-foreground">
                        ₦7,500 / $5.50 now, balance later
                        
                      </p>
                      
                    </button>
                  </div> 
                
                {paymentType === "part" && (
                  <p className="text-xs text-accent mt-2">
                    You pay ₦7,500 / $5.50 now to secure your spot. The remaining
                    balance is due before the cohort starts.
                    
                  </p>
                )}
                <FormMessage />
                </FormItem>
              
              )}
              />
              
              <div className="space-y-2">
  <p className="text-sm font-medium text-foreground">
    Payment Evidence{" "}
    <span className="text-destructive">*</span>
    <span className="text-muted-foreground font-normal text-xs">
      {" "}(screenshot or receipt)
    </span>
  </p>

  {!evidenceFile ? (
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className="w-full border-2 border-dashed border-border rounded-xl py-5 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
    >
      <Upload size={20} className="text-muted-foreground" />

      <p className="text-sm text-muted-foreground">
        Click to upload payment evidence (required)
      </p>

      <p className="text-xs text-muted-foreground/60">
        PNG, JPG, PDF up to 10MB
      </p>
    </button>
  ) : (
    <div className="border border-border rounded-xl p-3 flex items-center gap-3 bg-card">
      {evidencePreview ? (
        <img
          src={evidencePreview}
          alt="Payment evidence"
          className="w-12 h-12 rounded-lg object-cover border border-border shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0 border border-border">
          <Upload
            size={16}
            className="text-muted-foreground"
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {evidenceFile.name}
        </p>

        <p className="text-xs text-muted-foreground">
          {(evidenceFile.size / 1024).toFixed(0)} KB
        </p>
      </div>

      <button
        type="button"
        onClick={removeFile}
        className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
        aria-label="Remove payment evidence"
      >
        <X size={14} />
      </button>
    </div>
  )}

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*,.pdf"
    className="hidden"
    onChange={handleFileChange}
  />
</div>

                    <div className="flex gap-3 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        className="gap-2 text-muted-foreground"
                        onClick={() => setStep("courses")}
                      >
                        <ArrowLeft size={14} />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 font-semibold"
                        size="lg"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting
                          ? "Submitting..."
                          : "Submit Registration"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}

            {/* ── Step 3: Success ── */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="text-accent" size={36} />
                </motion.div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                  You're on the list!
                </h2>
                <p className="text-muted-foreground mb-1 max-w-sm mx-auto">
                  Your registration for{" "}
                  <span className="text-foreground font-semibold">
                    {selectedCourse?.name}
                  </span>{" "}
                  has been received.
                </p>
                <p className="text-sm text-muted-foreground mb-2 max-w-sm mx-auto">
                  Payment type:{" "}
                  <span className="text-foreground font-medium">
                    {form.getValues("paymentType") === "full"
                      ? "Full Payment (₦15,000 / $11)"
                      : "Part Payment (₦7,500 / $5.50 now)"}
                  </span>
                </p>
                <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
                  The DigiSage team will be in touch soon with next steps and cohort details.
                </p>

            {/* WhatsApp Group CTA */} 
                <div className="max-w-sm mx-auto mb-8 p-4 rounded-xl bg-accent/10 border border-accent/20">
                  <p className="text-sm font-medium text-foreground mb-3">
                    Join the DigiSage Hub WhatsApp Group
                  </p>
                  
                  <p className="text-xs text-muted-foreground mb-4">
                    Join the official group to receive important announcements, cohort
                    updates, learning resources, and other information.
                  </p>
                      
                  <a 
                    href="https://chat.whatsapp.com/JaDw0jAzBBD81UVs29HhWS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
                  >
                    Join WhatsApp Group
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="ghost"
                    className="text-accent border border-accent/30 hover:bg-accent/10 hover:text-accent"
                    onClick={() => {
                      setStep("courses");
                      setSelectedCourse(null);
                      setEvidenceFile(null);
                      setEvidencePreview(null);
                      form.reset();
                    }}
                  >
                    Register for another course
                  </Button>
                  <Button onClick={() => handleClose(false)}>Done</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
