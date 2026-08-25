import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  BarChart2,
  Brush,
  Globe,
  Megaphone,
  ShieldCheck,
  Code2,
  Monitor,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useCohortModal } from "@/hooks/use-cohort-modal.tsx";

type Course = {
  id: string;
  icon: React.ElementType;
  name: string;
  description: string;
  skills: string[];
  comingSoon?: boolean;
  color: string;
  border: string;
  bg: string;
  glow: string;
};

const courses = [
  {
    id: "data-analysis",
    icon: BarChart2,
    name: "Data Analysis",
    description:
      "Transform raw data into powerful business insights. Learn Excel, Power BI, Tableau and data storytelling techniques used by top companies.",
    skills: ["Excel", "Power BI / Charts", "Tableau", "Data Storytelling"],
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/8",
    glow: "hover:shadow-[0_0_32px_oklch(0.62_0.22_250/0.12)]",
  },
  {
    id: "uiux-design",
    icon: Brush,
    name: "UI/UX Design",
    description:
      "Design digital products people love. Master user research, wireframing, prototyping and design systems using Figma.",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    color: "text-accent",
    border: "border-accent/30",
    bg: "bg-accent/8",
    glow: "hover:shadow-[0_0_32px_oklch(0.70_0.17_185/0.12)]",
  },
  {
    id: "graphic-design",
    icon: Globe,
    name: "Graphic Design",
    description:
      "Build a visual communication career. Learn brand identity, print design, social media graphics and content creation.",
    skills: ["Brand Identity", "Adobe Suite", "CorelDRAW", "Color Theory", "Social Graphics", "Typography"],
    color: "text-[oklch(0.74_0.17_47)]",
    border: "border-[oklch(0.74_0.17_47/0.3)]",
    bg: "bg-[oklch(0.74_0.17_47/0.08)]",
    glow: "hover:shadow-[0_0_32px_oklch(0.74_0.17_47/0.1)]",
  },
  {
    id: "digital-marketing",
    icon: Megaphone,
    name: "Digital Marketing",
    description:
      "Grow brands and businesses online. Master SEO, social media strategy, paid ads, content marketing and analytics.",
    skills: ["SEO & SEM", "Social Media", "Google Ads", "Analytics"],
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/8",
    glow: "hover:shadow-[0_0_32px_oklch(0.62_0.22_250/0.12)]",
  },
  {
    id: "cybersecurity",
    icon: ShieldCheck,
    name: "Cybersecurity",
    description:
      "Defend digital systems and build a career in one of the fastest-growing tech fields. Covers fundamentals, ethical hacking, and security tools.",
    skills: ["Network Security", "Ethical Hacking", "Security Tools", "Risk Management"],
    comingSoon: true,
    color: "text-accent",
    border: "border-accent/30",
    bg: "bg-accent/8",
    glow: "hover:shadow-[0_0_32px_oklch(0.70_0.17_185/0.12)]",
  },
  {
    id: "web-development",
    icon: Code2,
    name: "Web Development",
    description:
      "Build real websites and web apps from scratch. Learn HTML, CSS, JavaScript and modern frameworks used across the industry.",
    skills: ["HTML & CSS", "JavaScript", "React Basics", "Deployment"],
    comingSoon: true,
    color: "text-[oklch(0.74_0.17_47)]",
    border: "border-[oklch(0.74_0.17_47/0.3)]",
    bg: "bg-[oklch(0.74_0.17_47/0.08)]",
    glow: "hover:shadow-[0_0_32px_oklch(0.74_0.17_47/0.1)]",
  },
  {
    id: "basic-computer-training",
    icon: Monitor,
    name: "Basic Computer Training",
    description:
      "Start your digital journey with confidence. Covers computer fundamentals, Microsoft Office, internet skills and digital safety.",
    skills: ["MS Office", "Internet Skills", "Digital Safety", "File Management"],
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/8",
    glow: "hover:shadow-[0_0_32px_oklch(0.62_0.22_250/0.12)]",
  },
];

function CourseCard({
  course,
  index,
}: {
  course: Course;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = course.icon;
  const { openCohortModal } = useCohortModal();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: "easeOut" }}
      className={`group relative rounded-2xl border ${course.border} ${course.bg} ${course.glow} p-6 flex flex-col gap-4 transition-all duration-300`}
    >
      {/* Coming soon ribbon */}
      {course.comingSoon && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted border border-border text-[10px] font-semibold text-muted-foreground">
          <Clock size={9} /> Coming Soon
        </div>
      )}

      {/* Icon */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${course.bg} border ${course.border}`}
      >
        <Icon className={course.color} size={20} />
      </div>

      {/* Name & description */}
      <div>
        <h3 className="font-semibold text-lg text-foreground mb-1.5">{course.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
      </div>

      {/* Skills pills */}
      <div className="flex flex-wrap gap-1.5">
        {course.skills.map((skill) => (
          <span
            key={skill}
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${course.border} ${course.bg} ${course.color}`}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-auto pt-3 border-t border-border/50 flex justify-end">
        {course.comingSoon ? (
          <span className="text-xs text-muted-foreground italic">Tutor not available yet</span>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className={`gap-1.5 ${course.color} border ${course.border} text-xs font-semibold`}
            onClick={openCohortModal}
          >
            Enrol <ArrowRight size={13} />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default function Programs() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { openCohortModal } = useCohortModal();

  return (
    <section id="programs" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[oklch(0.11_0.016_240)] to-background pointer-events-none" />

      <div className="relative z-10 w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-accent mb-4"
          >
            Our Programs
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance"
          >
            7 Courses. One Ecosystem.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto mb-6"
          >
            Hands-on, practical cohort training designed for young Africans ready to build digital careers.
          </motion.p>
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button size="lg" className="font-semibold group px-10" onClick={openCohortModal}>
            Join a Cohort
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Registration: 31 August – 30 September 2026
          </p>
        </motion.div>
      </div>
    </section>
  );
}
