import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/button.tsx";
import { ArrowRight } from "lucide-react";
import { useCohortModal } from "@/hooks/use-cohort-modal.tsx";

export default function CallToAction() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { openCohortModal } = useCohortModal();

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="tap" className="py-28 relative overflow-hidden">
      {/* Blue glow — trust & technology */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/8 blur-[100px] rounded-full pointer-events-none" />
      {/* Orange glow — energy & opportunity */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[oklch(0.74_0.17_47/0.06)] blur-[80px] rounded-full pointer-events-none" />
      {/* Teal glow — innovation & growth */}
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/6 blur-[80px] rounded-full pointer-events-none" />

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-[oklch(0.74_0.17_47)] mb-6">
            Ready to Start?
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
            Your Journey Starts{" "}
            <span className="text-[oklch(0.74_0.17_47)]">Here.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Whether you want to learn, build, or create impact — DigiSage has a
            pathway for you. Join our growing community of young digital
            innovators shaping Africa's future.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="font-semibold text-base px-10 group"
              onClick={openCohortModal}
            >
              Join a Cohort
              <ArrowRight
                size={16}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="font-semibold text-base px-10 text-accent hover:text-accent hover:bg-accent/10 border border-accent/30"
              onClick={() => scrollTo("#contact")}
            >
              Get in Touch
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
