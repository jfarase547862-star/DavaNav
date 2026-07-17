import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/mobile/AppHeader";
import { Footer } from "@/components/mobile/Footer";

import {
  QrCode,
  Building2,
  Compass,
  Map,
  ArrowRight,
  Eye,
  Type,
  Volume2,
} from "lucide-react";

type Card = { to: string; icon: typeof QrCode; title: string; desc: string; accent?: boolean };
type TextSize = "normal" | "large";
type Language = "ENG" | "CEB" | "FIL";

const cards: Card[] = [
  { to: "/m/scan", icon: QrCode, title: "Scan QR", desc: "Detect my location", accent: true },
  { to: "/m/directory", icon: Building2, title: "Office Directory", desc: "Browse all offices" },
  { to: "/m/search", icon: Compass, title: "Search Service", desc: "Find the right office" },
  { to: "/m/map", icon: Map, title: "Interactive Map", desc: "Ground & Second floors" },
];

const contentByLanguage: Record<
  Language,
  {
    greeting: string;
    subtitle: string;
    heroTitle: string;
    heroDesc: string;
    cta: string;
    tipLabel: string;
    tipLink: string;
    tipText: string;
  }
> = {
  ENG: {
    greeting: "Good day, Visitor",
    subtitle: "Davao City Hall · Main Building",
    heroTitle: "Scan a QR to set your location",
    heroDesc: "Available at all City Hall entrances and office signage.",
    cta: "Open scanner",
    tipLabel: "Tip",
    tipLink: "Search by Service",
    tipText: "— type something like \"business permit\" or \"birth certificate\".",
  },
  CEB: {
    greeting: "Maayong adlaw, Bisita",
    subtitle: "Davao City Hall · Main Building",
    heroTitle: "I-scan ang QR para itakda ang imong lokasyon",
    heroDesc: "Magamit sa tanang entrada ug signage sa City Hall.",
    cta: "Ablihi ang scanner",
    tipLabel: "Suhestyon",
    tipLink: "Pagpangita pinaagi sa Serbisyo",
    tipText: "— mag-type og \"business permit\" o \"birth certificate\".",
  },
  FIL: {
    greeting: "Magandang araw, Bisita",
    subtitle: "Davao City Hall · Main Building",
    heroTitle: "I-scan ang QR para itakda ang iyong lokasyon",
    heroDesc: "Available sa lahat ng entrances at signage ng City Hall.",
    cta: "Buksan ang scanner",
    tipLabel: "Tip",
    tipLink: "Paghahanap ayon sa Serbisyo",
    tipText: "— mag-type ng \"business permit\" o \"birth certificate\".",
  },
};

export default function Dashboard() {
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [language, setLanguage] = useState<Language>("ENG");
  const [voiceGuide, setVoiceGuide] = useState(false);

  const big = textSize === "large";
  const copy = contentByLanguage[language];

  const speak = (message: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !voiceGuide) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    if (language === "CEB") {
      utterance.lang = "ceb-PH";
    } else if (language === "FIL") {
      utterance.lang = "fil-PH";
    } else {
      utterance.lang = "en-US";
    }
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!voiceGuide) {
      return;
    }

    speak(`${copy.greeting}. ${copy.heroTitle}`);
  }, [copy.greeting, copy.heroTitle, voiceGuide]);

  return (
    <>
      <Head title="Visitor Dashboard — DavaNav" />
      <AppHeader title={copy.greeting} subtitle={copy.subtitle} />

      <main className="bg-slate-50 px-4 pb-4 pt-4">
{/* Accessibility bar — resized/compact */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" style={{ color: "#0b3d84" }} />
            <div className="text-xs font-semibold text-slate-800">Accessibility</div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Language</span>
            <div className="flex overflow-hidden rounded-full border border-slate-200">
              {(["ENG", "CEB", "FIL"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setLanguage(item);
                    if (voiceGuide) {
                      speak(`Language changed to ${item}`);
                    }
                  }}
                  className="h-6 px-2 text-[10px] font-bold transition"
                  style={
                    language === item
                      ? { background: "#0b3d84", color: "#ffffff" }
                      : { background: "transparent", color: "#64748b" }
                  }
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const next = big ? "normal" : "large";
                setTextSize(next);
                if (voiceGuide) {
                  speak(`Text size ${next}`);
                }
              }}
              className="flex h-6 items-center gap-1 rounded-full border border-slate-200 px-2 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Type className="h-3 w-3" style={{ color: "#0b3d84" }} />
              {big ? "LARGE" : "NORMAL"}
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !voiceGuide;
                setVoiceGuide(next);
                if (next) {
                  speak(`${copy.greeting}. Voice guide on.`);
                }
              }}
              className="flex h-6 items-center gap-1 rounded-full border border-slate-200 px-2 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Volume2 className="h-3 w-3" style={{ color: "#0b3d84" }} />
              {voiceGuide ? "ON" : "OFF"}
            </button>
          </div>

          {voiceGuide ? (
            <div className="mt-1.5 text-[10px] text-slate-500">Voice guidance is ready for this screen.</div>
          ) : null}
        </div>

        <Link
          href="/scan"
          className="relative block overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b3d84] via-[#123f7f] to-[#0a2f66] text-white shadow-[0_12px_28px_-8px_rgba(10,47,102,0.55)]"
          onClick={() => {
            if (voiceGuide) {
              speak(copy.heroTitle);
            }
          }}
        >
          <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5">
            <div className="min-w-0">
              <div className="text-xs font-semibold tracking-wide text-amber-400">
                Quickest way to start
              </div>
              <h2 className={`mt-1 font-bold leading-snug ${big ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
                {copy.heroTitle}
              </h2>
              <p className={`mt-1.5 leading-relaxed text-white/75 ${big ? "text-sm" : "text-xs"}`}>
                {copy.heroDesc}
              </p>
              <span className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-xs font-bold text-[#1a1a1a] transition hover:bg-amber-300">
                {copy.cta} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <QrCode className="h-8 w-8" strokeWidth={1.75} />
            </div>
          </div>
        </Link>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {cards.map((c) => (
            <Link
              key={c.title}
              href={c.to}
              className="group flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-[#0b3d84]/25 hover:shadow-[0_8px_20px_-6px_rgba(15,23,42,0.15)]"
              onClick={() => {
                if (voiceGuide) {
                  speak(c.title);
                }
              }}
            >
              <span
                className={`grid h-11 w-11 place-items-center rounded-xl ${
                  c.accent
                    ? "bg-amber-400 text-[#1a1a1a]"
                    : "bg-blue-50 text-[#0b3d84]"
                }`}
              >
                <c.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <div className={`truncate font-bold text-slate-900 ${big ? "text-[16px]" : "text-[15px]"}`}>{c.title}</div>
                <div className={`truncate text-slate-500 ${big ? "text-sm" : "text-xs"}`}>{c.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-[#0b3d84]/25 bg-blue-50/60 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#0b3d84]">{copy.tipLabel}</div>
          <div className="mt-1 text-sm leading-relaxed text-slate-700">
            {copy.tipLink === "Search by Service" ? "Not sure where to go? Try " : "Dili ka sigurado asa moadto? Sulayi ang "}
            <Link href="/search" className="font-semibold text-[#0b3d84] underline-offset-2 hover:underline">
              {copy.tipLink}
            </Link>{" "}
            {copy.tipText}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}