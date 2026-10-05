import { motion } from "motion/react";
import { ArrowRight, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useCohortModal } from "@/hooks/use-cohort-modal.tsx";
import { useCountdown, getRegistrationState } from "@/components/CohortModal.tsx";

const HERO_IMG =
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwyfHx5b3VuZyUyMEFmcmljYW4lMjB0ZWNoJTIwaW5ub3ZhdGlvbiUyMGRpZ2l0YWwlMjBza2lsbHN8ZW58MHx8fHwxNzg3NTAwNzMwfDA&ixlib=rb-4.1.0&q=80&w=1080";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

export default function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const { openCohortModal } = useCohortModal();
  const regState = getRegistrationState();
  // Show countdown to open if before; to close if open
  const REG_OPEN = new Date("2026-08-30T23:00:00Z");
  const REG_CLOSE = new Date("2026-10-31T22:59:59Z");
  const countdownTarget = regState === "before" ? REG_OPEN : REG_CLOSE;
  const countdown = useCountdown(countdownTarget);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Young innovators at DigiSage"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.015_240/0.97)] via-[oklch(0.08_0.015_240/0.85)] to-[oklch(0.08_0.015_240/0.5)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.015_240)] via-transparent to-transparent" />
      </div>

      {/* Decorative grid lines — Blue (trust/tech) */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.62_0.22_250) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62_0.22_250) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Blue glow — trust anchor on left */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      {/* Orange glow — energy on right */}
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[oklch(0.74_0.17_47/0.07)] blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="max-w-3xl">
          {/* Badge — Teal: innovation ecosystem */}
          <motion.div {...fadeUp(0.1)} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase">
              <Sparkles size={12} />
              Innovation Ecosystem for Africa
            </span>
          </motion.div>

          {/* Main headline — "Ideas" in Teal (growth/innovation) */}
          <motion.h1
            {...fadeUp(0.2)}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] text-balance mb-4"
          >
            Bridging{" "}
            <span className="text-accent">Ideas</span>{" "}
            to the Future.
          </motion.h1>

          {/* Sub tagline */}
          <motion.p
            {...fadeUp(0.35)}
            className="text-xl sm:text-2xl font-medium text-white/80 mb-4 text-balance"
          >
            Where Ideas Become Technology.
          </motion.p>

          {/* Description */}
          <motion.p
            {...fadeUp(0.45)}
            className="text-base sm:text-lg text-white/60 max-w-xl mb-10 leading-relaxed"
          >
            We empower young people with practical digital skills, foster
            innovation, and build technology-driven solutions for Africa's
            future.
          </motion.p>

          {/* Registration countdown banner */}
          <motion.div {...fadeUp(0.5)} className="mb-8">
            <div className="inline-flex items-center gap-3 rounded-xl border border-[oklch(0.74_0.17_47/0.35)] bg-[oklch(0.74_0.17_47/0.08)] px-4 py-3">
              <Clock size={14} className="text-[oklch(0.74_0.17_47)] shrink-0" />
              <div className="text-sm">
                {regState === "before" && (
                  <span className="text-white/80">
                    Registration opens in{" "}
                    <span className="text-[oklch(0.74_0.17_47)] font-bold">
                      {countdown.days}d {countdown.hours}h {countdown.minutes}m
                    </span>{" "}
                    · <span className="text-white/60">31 Aug – 31 Oct · ₦15,000 / $11</span>
                  </span>
                )}
                {regState === "open" && (
                  <span className="text-white/80">
                    Registration closes in{" "}
                    <span className="text-[oklch(0.74_0.17_47)] font-bold">
                      {countdown.days}d {countdown.hours}h {countdown.minutes}m
                    </span>{" "}
                    · <span className="text-white/60">₦15,000 / $11 per course</span>
                  </span>
                )}
                {regState === "closed" && (
                  <span className="text-white/60">
                    Registration for this cohort has closed. Stay tuned for the next opening.
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.55)}
            className="flex flex-col sm:flex-row gap-4"
          >
            {/* Blue — trust: primary action */}
            <Button
              size="lg"
              className="font-semibold text-base px-8 group"
              onClick={() => scrollTo("#about")}
            >
              Explore DigiSage
              <ArrowRight
                size={16}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="font-semibold text-base px-8 border border-white/20 bg-white/10 hover:bg-white/15 text-white"
              onClick={openCohortModal}
            >
              Join a Cohort
            </Button>
            {/* Orange — energy & opportunity */}
            <Button
              size="lg"
              variant="ghost"
              className="font-semibold text-base px-8 text-[oklch(0.74_0.17_47)] hover:text-[oklch(0.74_0.17_47)] hover:bg-[oklch(0.74_0.17_47/0.1)] border border-[oklch(0.74_0.17_47/0.35)]"
              onClick={() => scrollTo("#tap")}
            >
              Build With Us
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-accent/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
