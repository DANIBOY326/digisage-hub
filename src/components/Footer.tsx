import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Explore: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Programs", href: "#programs" },
    { label: "Tech Amusement Park", href: "#tap" },
  ],
  Platform: [
    { label: "Due Diligence", href: "#due-diligence" },
    { label: "Community", href: "#community" },
    { label: "Events", href: "#events" },
    { label: "FAQ", href: "#faq" },
  ],
};

const socials = [
  { label: "Facebook", href: "#", abbr: "FB" },
  { label: "Instagram", href: "#", abbr: "IG" },
  { label: "X / Twitter", href: "#", abbr: "X" },
  { label: "LinkedIn", href: "#", abbr: "in" },
  { label: "YouTube", href: "#", abbr: "YT" },
];

const contactItems = [
  { icon: Mail, text: "digisagehub@gmail.com", href: "mailto:digisagehub@gmail.com" },
  { icon: Phone, text: "0814 434 2627 (WhatsApp)", href: "https://wa.me/2348144342627" },
  { icon: Phone, text: "0810 675 9178 (WhatsApp)", href: "https://wa.me/2348106759178" },
  { icon: MapPin, text: "Nigeria, Africa", href: "#" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const handleClick = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="contact" className="border-t border-border bg-[oklch(0.08_0.012_240)]">
      <div className="w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img
                src="https://hercules-cdn.com/file_0UQ9fwrzIcHN6JorZshNrbyC"
                alt="DigiSage Hub"
                className="h-10 w-auto object-contain rounded-md bg-white px-2 py-0.5"
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              An innovation and digital skills ecosystem empowering young people across Africa. Where Ideas Become Technology.
            </p>

            {/* Contact */}
            <div className="space-y-2.5 mb-6">
              {contactItems.map(({ icon: Icon, text, href }) => (
                <a
                  key={text}
                  href={href}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Icon size={13} className="text-accent shrink-0" />
                  <span>{text}</span>
                </a>
              ))}
            </div>

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-accent font-medium">Active & Growing</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleClick(link.href)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">
              Connect
            </h4>
            <div className="flex flex-wrap gap-2">
              {socials.map(({ abbr, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-accent/10 transition-all cursor-pointer text-xs font-bold"
                >
                  {abbr}
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Follow us for updates on cohort openings, events, and opportunities.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {year} DigiSage Tech Hub. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Bridging Ideas to the Future &middot; Where Ideas Become Technology.
          </p>
        </div>
      </div>
    </footer>
  );
}
