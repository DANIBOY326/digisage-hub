import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Globe, Mail } from "lucide-react";

// lucide-react no longer ships brand/logo icons (e.g. LinkedIn), so we use a
// small inline SVG to keep the same look, sizing, and props pattern.
function LinkedinIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z" />
    </svg>
  );
}

type TeamMember = {
  name: string;
  role: string;
  expertise: string[];
  bio: string;
  photo: string | null;
  socials?: { linkedin?: string; website?: string; email?: string };
  color: string;
  border: string;
  bg: string;
};

const team: TeamMember[] = [
  {
    name: "Name Coming Soon",
    role: "Lead Trainer & Founder",
    expertise: ["Digital Strategy", "Innovation", "Leadership"],
    bio: "Portfolio and full bio will be available soon. Stay tuned.",
    photo: null,
    socials: {},
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/8",
  },
  {
    name: "Name Coming Soon",
    role: "UI/UX & Graphic Design Trainer",
    expertise: ["Figma", "Adobe Suite", "Brand Identity"],
    bio: "Portfolio and full bio will be available soon. Stay tuned.",
    photo: null,
    socials: {},
    color: "text-accent",
    border: "border-accent/30",
    bg: "bg-accent/8",
  },
  {
    name: "Name Coming Soon",
    role: "Data Analysis Trainer",
    expertise: ["Excel", "Power BI", "Tableau", "Data Storytelling"],
    bio: "Portfolio and full bio will be available soon. Stay tuned.",
    photo: null,
    socials: {},
    color: "text-[oklch(0.74_0.17_47)]",
    border: "border-[oklch(0.74_0.17_47/0.3)]",
    bg: "bg-[oklch(0.74_0.17_47/0.08)]",
  },
  {
    name: "Name Coming Soon",
    role: "Digital Marketing Trainer",
    expertise: ["SEO & SEM", "Social Media", "Content Strategy"],
    bio: "Portfolio and full bio will be available soon. Stay tuned.",
    photo: null,
    socials: {},
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/8",
  },
];

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const initials = member.name
    .split(" ")
    .filter((w) => w.length > 1)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1, ease: "easeOut" }}
      className={`rounded-2xl border ${member.border} ${member.bg} p-6 flex flex-col gap-4`}
    >
      {/* Headshot */}
      <div className="flex items-start gap-4">
        <div
          className={`w-16 h-16 rounded-xl shrink-0 border-2 ${member.border} flex items-center justify-center overflow-hidden`}
        >
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className={`text-xl font-serif font-bold ${member.color} opacity-40`}>
              {initials || "?"}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-base text-foreground leading-tight">{member.name}</h3>
          <p className={`text-xs font-medium mt-0.5 ${member.color}`}>{member.role}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>

      {/* Expertise pills */}
      <div className="flex flex-wrap gap-1.5">
        {member.expertise.map((skill) => (
          <span
            key={skill}
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${member.border} ${member.bg} ${member.color}`}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Socials */}
      {member.socials && Object.values(member.socials).some(Boolean) && (
        <div className="flex items-center gap-2 pt-2 border-t border-border/50 mt-auto">
          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-7 h-7 rounded-lg border ${member.border} flex items-center justify-center ${member.color} hover:scale-105 transition-transform`}
            >
              <LinkedinIcon size={12} />
            </a>
          )}
          {member.socials.website && (
            <a
              href={member.socials.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-7 h-7 rounded-lg border ${member.border} flex items-center justify-center ${member.color} hover:scale-105 transition-transform`}
            >
              <Globe size={12} />
            </a>
          )}
          {member.socials.email && (
            <a
              href={`mailto:${member.socials.email}`}
              className={`w-7 h-7 rounded-lg border ${member.border} flex items-center justify-center ${member.color} hover:scale-105 transition-transform`}
            >
              <Mail size={12} />
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function Team() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="team" className="py-28 relative overflow-hidden">
      {/* Subtle blue glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-accent mb-4"
          >
            The People Behind DigiSage
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance"
          >
            Meet Our Team & Trainers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto"
          >
            Experienced practitioners who've built real careers in tech — now dedicated to building yours.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((member, i) => (
            <MemberCard key={member.role} member={member} index={i} />
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-10"
        >
          Full trainer profiles and portfolios will be published before cohort launch.
        </motion.p>
      </div>
    </section>
  );
}
