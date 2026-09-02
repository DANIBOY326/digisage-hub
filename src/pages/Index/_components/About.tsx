import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/button.tsx";
import { ArrowRight } from "lucide-react";

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1655720348590-c739c860beed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwzfHx5b3VuZyUyMEFmcmljYW4lMjB0ZWNoJTIwaW5ub3ZhdGlvbiUyMGRpZ2l0YWwlMjBza2lsbHN8ZW58MHx8fHwxNzg3NTAwNzMwfDA&ixlib=rb-4.1.0&q=80&w=1080";

const stats = [
  { value: "300+", label: "Young people trained" },
  { value: "3", label: "Core pillars" },
  { value: "10+", label: "Tech programs" },
  { value: "1", label: "Innovation Hub" },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about" className="py-28 relative overflow-hidden">
      <div className="w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src={ABOUT_IMG}
                alt="DigiSage community members"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -right-6 bg-card border border-border rounded-2xl p-5 shadow-2xl hidden sm:block"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Active since</p>
              <p className="font-serif text-3xl font-bold text-accent">2020</p>
              <p className="text-xs text-muted-foreground mt-1">Bridging ideas to the future</p>
            </motion.div>

            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl border border-accent/20 bg-accent/5 -z-10" />
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-accent mb-4">
              About DigiSage
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance leading-tight">
              An Innovation Ecosystem for Africa's Future
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              <p>
                DigiSage Tech Hub is an innovation ecosystem focused on digital
                skills, technology, entrepreneurship and youth development.
              </p>
              <p>
                We believe talent exists everywhere, but opportunity does not.
                DigiSage exists to close that gap by creating accessible pathways
                for young people to learn practical technology skills, collaborate
                with others, build real solutions and connect their abilities to
                meaningful opportunities.
              </p>
              <p>
                From digital skills training to innovation experiences and
                technology products, we are building an ecosystem where ideas can
                move from{" "}
                <span className="text-[oklch(0.74_0.17_47)] font-medium">
                  learning → experimentation → creation → impact
                </span>
                .
              </p>
            </div>

            <Button
              size="lg"
              className="font-semibold group"
              onClick={() => scrollTo("#programs")}
            >
              Explore Our Programs
              <ArrowRight
                size={16}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 pt-12 border-t border-border"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-4xl font-bold text-accent mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
