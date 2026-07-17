import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/shared/site-layout';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  ShieldCheck,
  Building2,
  Eye,
  Type,
  Volume2,
} from 'lucide-react';

const BLUE = '#1a4fa0';
type TextSize = 'normal' | 'large';
type Language = 'ENG' | 'CEB' | 'FIL';

const contentByLanguage: Record<Language, {
  heading: string;
  subheading: string;
  viewMap: string;
  directory: string;
  chip1: string;
  chip2: string;
  chip3: string;
  footer: string;
}> = {
  ENG: {
    heading: 'Need help finding an office?',
    subheading: 'Tap one button.',
    viewMap: 'View Map',
    directory: 'Directory',
    chip1: 'High-contrast display',
    chip2: 'Large touch targets',
    chip3: 'Auto-return ready',
    footer: 'Touch to begin anytime',
  },
  CEB: {
    heading: 'Nangita ka ba og opisina?',
    subheading: 'Pindota ang usa ka buton.',
    viewMap: 'Tan-awa ang Mapa',
    directory: 'Direktoryo',
    chip1: 'Gipasimple nga display',
    chip2: 'Dako nga touch targets',
    chip3: 'Andam sa pagbalik',
    footer: 'Pindota aron magsugod any time',
  },
  FIL: {
    heading: 'Kailangan mo bang hanapin ang isang opisina?',
    subheading: 'I-tap ang isang button.',
    viewMap: 'Tingnan ang Mapa',
    directory: 'Direktorya',
    chip1: 'High-contrast na display',
    chip2: 'Malaking touch targets',
    chip3: 'Handa sa auto-return',
    footer: 'I-tap upang simulan anumang oras',
  },
};

export default function LandingPage() {
  const [textSize, setTextSize] = useState<TextSize>('normal');
  const [language, setLanguage] = useState<Language>('ENG');
  const [voiceGuide, setVoiceGuide] = useState(false);

  const big = textSize === 'large';
  const copy = contentByLanguage[language];

  const speak = (message: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !voiceGuide) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    if (language === 'CEB') {
      utterance.lang = 'ceb-PH';
    } else if (language === 'FIL') {
      utterance.lang = 'fil-PH';
    } else {
      utterance.lang = 'en-US';
    }
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!voiceGuide) {
      return;
    }

    speak(`${copy.heading}. ${copy.subheading}`);
  }, [copy.heading, copy.subheading, voiceGuide]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Head title="DavaNav Solution — QR-Based Office Navigation" />

      <SiteHeader />
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 flex-shrink-0" style={{ color: BLUE }} />
              <div>
                <div className="text-sm font-bold tracking-wide text-slate-800">DAVANAV ACCESSIBILITY</div>
                <div className="text-[11px] text-slate-400"> Tap options to make screen easier to read</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Language:</span>
              <div className="flex overflow-hidden rounded-full border border-slate-200">
                {(['ENG', 'CEB', 'FIL'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLanguage(item)}
                    className="h-8 px-3 text-xs font-bold transition"
                    style={
                      language === item
                        ? { background: BLUE, color: '#ffffff' }
                        : { background: 'transparent', color: '#64748b' }
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = big ? 'normal' : 'large';
                  setTextSize(next);
                  if (voiceGuide) {
                    speak(`Text size ${next}`);
                  }
                }}
                className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Type className="h-3.5 w-3.5" style={{ color: BLUE }} />
                Text Size: {big ? 'LARGE' : 'NORMAL'}
              </button>


              <button
                type="button"
                onClick={() => {
                  const next = !voiceGuide;
                  setVoiceGuide(next);
                  if (next) {
                    speak(`${copy.heading}. Voice guide on.`);
                  }
                }}
                className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Volume2 className="h-3.5 w-3.5" style={{ color: BLUE }} />
                <span className="hidden sm:inline">Voice Guide: </span>
                {voiceGuide ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
      </div>

      <main className="flex-1">
        <section
          className="relative overflow-hidden"
          style={{
            background:
              'radial-gradient(circle at top left, rgba(59,130,246,0.12), transparent 34%), linear-gradient(180deg, #f8fbff 0%, #eef4fb 44%, #ffffff 100%)',
          }}
        >
          <div
            className="pointer-events-none absolute -right-28 -top-28 h-[420px] w-[420px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 68%)' }}
          />

          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-blue-50 px-4 py-2 text-sm font-medium text-slate-700">
                <ShieldCheck className="h-4 w-4" />
                Touch-first navigation
              </div>

              <h1
                className={`mt-6 font-bold tracking-tight leading-[1.02] text-slate-950 ${
                  big ? 'text-6xl lg:text-7xl' : 'text-5xl lg:text-6xl'
                }`}
              >
                {copy.heading}
                <div className="mt-3 block" style={{ color: BLUE }}>
                  {copy.subheading}
                </div>
              </h1>

              <p className={`mt-6 max-w-2xl text-slate-600 ${big ? 'text-xl leading-9' : 'text-lg leading-8'}`}>
                View the map, open the office directory, or scan a QR code if you already
                know where you are going.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Button
                  asChild
                  style={{ backgroundColor: BLUE, color: '#fff' }}
                  className="h-20 rounded-2xl text-xl font-semibold shadow-md hover:opacity-90 sm:text-2xl"
                >
                  <Link href="/kiosk/kiosk-map" className="inline-flex items-center justify-center gap-3">
                    <MapPin className="h-7 w-7" />
                    {copy.viewMap}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-20 rounded-2xl border-2 border-slate-200 bg-white text-xl font-semibold text-slate-800 shadow-md hover:bg-slate-50 sm:text-2xl"
                >
                  <Link href="/kiosk/kiosk-directory" className="inline-flex items-center justify-center gap-3">
                    <Building2 className="h-7 w-7" style={{ color: BLUE }} />
                    {copy.directory}
                  </Link>
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">{copy.chip1}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">{copy.chip2}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">{copy.chip3}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50 py-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 text-sm text-slate-500 sm:px-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Main Entrance Lobby Kiosk #1 · Online
            </div>
            <span className="italic text-slate-400">{copy.footer}</span>
          </div>
        </section>
      </main>
    </div>
  );
}