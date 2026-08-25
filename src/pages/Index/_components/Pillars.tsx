import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { GraduationCap, Rocket, Globe, CheckCircle2 } from "lucide-react";

const pillars = [
  {
    icon: GraduationCap,
    tag: "LEARN",
    title: "Digital Skills & Career Development",
    description:
      "Practical training in 7 programs — from Data Analysis to Cybersecurity — built for the real world and designed to launch careers.",
    points: ["7 hands-on courses", "Cohort-based learning", "Certificates on completion"],
    color: "text-accent",
    border: "border-accent/30",
    bg: "bg-accent/8",
    glow: "shadow-[0_0_48px_oklch(0.70_0.17_185/0.1)]",
    highlight: "bg-accent",
  },
  {
    icon: Rocket,
    tag: "BUILD",
    title: "Innovation & Product Development",
    description:
      "Young talents collaborate, experiment and build real-world digital products through the Tech Amusement Park — our flagship innovation experience.",
    points: ["Product labs & hackathons", "Tech Amusement Park", "Mentorship & co-creation"],
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/8",
    glow: "shadow-[0_0_48px_oklch(0.62_0.22_250/0.1)]",
    highlight: "bg-primary",
  },
  {
    icon: Globe,
    tag: "IMPACT",
    title: "Technology for Trust & Transformation",
    description:
      "Through Due Diligence and community initiatives, we drive technology-driven solutions for business verification, transparency and digital intelligence.",
    points: ["Due Diligence platform", "Community initiatives", "Partnerships & ecosystem"],
    color: "text-[oklch(0.74_0.17_47)]",
    border: "border-[oklch(0.74_0.17_47/0.3)]",
    bg: "bg-[oklch(0.74_0.17_47/0.08)]",
    glow: "shadow-[0_0_48px_oklch(0.74_0.17_47/0.08)]",
    highlight: "bg-[oklch(0.74_0.17_47)]",
  },
];

function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = pillar.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.15, ease: "easeOut" }}
      className={`relative rounded-2xl border ${pillar.border} ${pillar.bg} ${pillar.glow} p-8 flex flex-col gap-5 overflow-hidden`}
    >
      {/* Accent bar top */}
      <div className={`absolute top-0 left-8 right-8 h-px ${pillar.highlight} opacity-40`} />

      {/* Number watermark */}
      <span className="absolute top-5 right-6 text-8xl font-serif font-bold text-white/[0.03] select-none pointer-events-none leading-none">
        0{index + 1}
      </span>

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pillar.bg} border ${pillar.border}`}>
        <Icon className={pillar.color} size={22} />
      </div>

      <div>
        <span className={`text-xs font-bold tracking-[0.2em] uppercase ${pillar.color} mb-2 block`}>
          {pillar.tag}
        </span>
        <h3 className="text-xl font-semibold text-foreground mb-3">{pillar.title}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm mb-5">{pillar.description}</p>

        <ul className="space-y-2">
          {pillar.points.map((pt) => (
            <li key={pt} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 className={`${pillar.color} shrink-0`} size={14} />
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Pillars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[oklch(0.12_0.018_240)] to-background pointer-events-none" />
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,oklch(0.62_0.22_250/0.04),transparent)] pointer-events-none" />

      <div className="relative z-10 w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4"
          >
            The Three Pillars
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-foreground text-balance"
          >
            How We Create Impact
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.tag} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
