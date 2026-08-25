import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Who can apply to DigiSage programs?",
    a: "Our programs are open to anyone — students, graduates, young professionals, and anyone eager to build practical digital skills. No prior tech experience is required for most courses.",
  },
  {
    q: "How much does each course cost?",
    a: "Each course is ₦15,000 or $11. We offer a part payment option where you pay ₦7,500 ($5.50) upfront to secure your spot, and the remaining balance before the cohort begins.",
  },
  {
    q: "What is a cohort and how does it work?",
    a: "A cohort is a group of learners who go through a course together on a fixed schedule. This creates accountability, peer learning, and a strong community. Each cohort runs for a set number of weeks with live sessions and practical assignments.",
  },
  {
    q: "When does the next cohort start?",
    a: "Registration for the next cohort is open from 31st August to 30th September 2026. The cohort kicks off shortly after registration closes. Stay tuned on our social channels for exact start dates.",
  },
  {
    q: "Can I register for more than one course?",
    a: "Yes! You can register for multiple courses. Simply complete the registration process for each course separately. A discount may apply — contact us directly for bundle pricing.",
  },
  {
    q: "How do I pay and submit payment evidence?",
    a: "After selecting your course and payment option, you'll be prompted to upload your payment receipt or screenshot in the registration form. Our team will verify your payment and confirm your spot via email or phone.",
  },
  {
    q: "Are the classes online or in-person?",
    a: "DigiSage runs both in-person sessions at our hub and online options depending on the program and cohort. Your welcome message after registration will include full details on the format for your cohort.",
  },
  {
    q: "What do I get after completing a course?",
    a: "Graduates receive a DigiSage certificate, access to our alumni community, job placement support, and opportunities to showcase their work through the Tech Amusement Park and partner networks.",
  },
];

function FaqItem({
  faq,
  index,
}: {
  faq: { q: string; a: string };
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (index % 4) * 0.07 }}
      className={`rounded-xl border transition-colors duration-200 overflow-hidden ${
        open ? "border-accent/40 bg-accent/5" : "border-border bg-card/50"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left flex items-center justify-between gap-4 px-5 py-4 cursor-pointer"
      >
        <span className="font-medium text-foreground text-sm sm:text-base">
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown
            size={17}
            className={open ? "text-accent" : "text-muted-foreground"}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" className="py-28 relative overflow-hidden">
      {/* Teal glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-[oklch(0.74_0.17_47)] mb-4"
          >
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance"
          >
            Questions? We've got answers.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground"
          >
            Everything you need to know about joining DigiSage and our cohort programs.
          </motion.p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={faq.q} faq={faq} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-10"
        >
          Still have questions?{" "}
          <a
            href="mailto:digisagehub@gmail.com"
            className="text-accent hover:underline font-medium"
          >
            digisagehub@gmail.com
          </a>{" "}
          or reach out on our social channels.
        </motion.p>
      </div>
    </section>
  );
}
