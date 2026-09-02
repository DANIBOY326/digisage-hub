import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Users, Layers, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Users,
    label: "People",
    tag: "01",
    description:
      "We discover and develop young digital talents across Africa — providing the skills, mindset and confidence to thrive in the digital economy.",
    stats: "300+ trained",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/30",
    glow: "shadow-[0_0_40px_oklch(0.70_0.17_185/0.1)]",
  },
  {
    icon: Layers,
    label: "Products",
    tag: "02",
    description:
      "We turn ideas and talent into real technology solutions — from digital products to platforms built through innovation labs and collaborative sprints.",
    stats: "10+ products built",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    glow: "shadow-[0_0_40px_oklch(0.62_0.22_250/0.1)]",
  },
  {
    icon: TrendingUp,
    label: "Opportunities",
    tag: "03",
    description:
      "We connect talent with entrepreneurship, employment and the wider ecosystem — bridging the gap between skill and impact.",
    stats: "Growing network",
    color: "text-[oklch(0.74_0.17_47)]",
    bg: "bg-[oklch(0.74_0.17_47/0.1)]",
    border: "border-[oklch(0.74_0.17_47/0.3)]",
    glow: "shadow-[0_0_40px_oklch(0.74_0.17_47/0.08)]",
  },
];

export default function Ecosystem() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="community" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.62_0.22_250) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62_0.22_250) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.11_0.016_240/0.5)] to-transparent pointer-events-none" />

      <div className="relative z-10 w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4"
          >
            The Ecosystem
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance"
          >
            One Hub. Three Ways to Create Impact.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto"
          >
            A connected system where every layer powers the next.
          </motion.p>
        </div>

        {/* Three-column cards with connecting arrows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="relative flex items-stretch">
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                  className={`flex-1 rounded-2xl border ${step.border} ${step.bg} ${step.glow} p-7 flex flex-col gap-4`}
                >
                  {/* Tag */}
                  <span className={`text-xs font-bold tracking-[0.2em] ${step.color} opacity-60`}>
                    {step.tag}
                  </span>

                  {/* Icon */}
                  <div className={`w-13 h-13 w-14 h-14 rounded-2xl flex items-center justify-center ${step.bg} border ${step.border}`}>
                    <Icon className={step.color} size={26} />
                  </div>

                  {/* Label */}
                  <p className={`font-serif text-2xl font-bold ${step.color}`}>
                    {step.label}
                  </p>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {step.description}
                  </p>

                  {/* Stats badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${step.border} ${step.bg} w-fit`}>
                    <span className={`text-xs font-semibold ${step.color}`}>{step.stats}</span>
                  </div>
                </motion.div>

                {/* Arrow connector (desktop only) */}
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.15 }}
                    className="hidden md:flex items-center justify-center w-8 shrink-0 text-muted-foreground/30"
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
