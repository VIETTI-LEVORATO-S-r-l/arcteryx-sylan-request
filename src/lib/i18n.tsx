import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "it" | "en";

const STORAGE_KEY = "sylan2.lang";

const it = {
  "nav.experience": "ESPERIENZA",
  "nav.dates": "DATE",
  "nav.request": "RICHIESTA",
  "nav.requestShort": "RICHIEDI",
  "hero.alt": "Trail runner su un crinale sopra il Lago Maggiore",
  "hero.description":
    "Un'esperienza guidata di trail running non competitiva, dedicata alla community e al test della Arc'teryx Sylan 2.",
  "hero.cta": "RICHIEDI DI PARTECIPARE",
  "hero.ctaSecondary": "SCOPRI L’ESPERIENZA",
  "hero.limited": "POSTI LIMITATI",
  "hero.k.place": "LUOGO",
  "hero.v.place": "LAGO MAGGIORE / IT",
  "hero.k.format": "FORMATO",
  "hero.v.format": "TRAIL RUN NON COMPETITIVA",
  "hero.k.access": "ACCESSO",
  "hero.v.access": "PARTECIPAZIONE LIMITATA",
  "hero.k.dates": "DATE",
  "hero.v.dates": "17—19 SETTEMBRE 2026",
  nonCompetitive:
    "L'evento è una Community Trail Run guidata e non competitiva. Non sono previsti classifica, cronometraggio ufficiale o premi legati alla performance.",
  "exp.title": "L’ESPERIENZA",
  "exp.01.t": "ARRIVO",
  "exp.01.d": "Accoglienza e check-in da VIETTI.",
  "exp.02.t": "FITTING",
  "exp.02.d": "Consegna e prova delle Arc'teryx Sylan 2 in test.",
  "exp.03.t": "TRAIL",
  "exp.03.d": "Community trail run guidata e non competitiva sul Lago Maggiore.",
  "exp.04.t": "RECOVERY",
  "exp.04.d": "Ristoro post-run e momento di community.",
  "exp.note":
    "Guide e pacer esperti accompagnano il gruppo lungo tutto il percorso. Le riprese foto e video fanno parte dello storytelling Arc’teryx × VIETTI.",
  "route.title": "IL PERCORSO",
  "route.distance": "DISTANZA",
  "route.elevation": "DISLIVELLO",
  "route.surface": "FONDO",
  "route.place": "LUOGO",
  "route.map": "PLACEHOLDER MAPPA GPX / TOPOGRAFICA",
  "dates.titleConfirmed": "DATA DELL’EVENTO CONFERMATA",
  "dates.titleChoose": "SCEGLI LA TUA DATA PREFERITA",
  "dates.confirmed": "CONFERMATA",
  "dates.meetingTime": "ORARIO DI RITROVO",
  "dates.meetingPoint": "PUNTO DI RITROVO",
  "dates.communityPreference": "PREFERENZA DELLA COMMUNITY",
  "dates.provisional": "DATE PROVVISORIE",
  "dates.requests": "RICHIESTE",
  "dates.leading": "DATA ATTUALMENTE PIÙ RICHIESTA",
  "dates.note":
    "La data più richiesta sarà considerata prioritaria. La data finale verrà confermata in base alla disponibilità dei partecipanti, alle condizioni meteo e alle esigenze organizzative.",
  "dates.selected": "SELEZIONATA",
  "dates.select": "TOCCA PER SELEZIONARE",
  "dates.open": "PREFERENZE APERTE",
  "dates.waiting": "IN ATTESA DELLE PRIME RICHIESTE",
  "media.title": "PRODUZIONE FOTO E VIDEO",
  "media.body":
    "Durante l’evento sono previste riprese foto e video per lo storytelling Arc’teryx × VIETTI. La liberatoria per immagini e video viene raccolta separatamente, solo dai partecipanti accettati, nella fase di conferma.",
  "req.title": "RICHIEDI DI PARTECIPARE",
  "req.body":
    "I posti sono limitati. Compila il modulo per inviare la tua richiesta di partecipazione: l’invio non conferma automaticamente il posto.",
  "req.tag1": "POSTI LIMITATI",
  "req.tag2": "RICHIESTA DI PARTECIPAZIONE",
  "req.tag3": "PARTECIPAZIONE SOGGETTA A CONFERMA",
  "footer.rules": "REGOLAMENTO",
  "footer.privacy": "INFORMATIVA PRIVACY",
  "footer.terms": "TERMINI DELL’EVENTO",
  "footer.cookies": "COOKIE POLICY",
  "footer.logo": "[PLACEHOLDER LOGO — CARICARE ASSET FINALI]",
  "form.closed": "RICHIESTE CHIUSE",
  "form.closedBody":
    "Le richieste di partecipazione sono attualmente chiuse. Segui VIETTI per le prossime attività Arc’teryx.",
  "form.waitlist":
    "Le richieste hanno superato la capienza iniziale dell’evento. Le nuove richieste possono essere inserite in lista d’attesa.",
  "form.s1": "I TUOI DATI",
  "form.s1h": "Servono per contattarti in caso di conferma.",
  "form.firstName": "Nome",
  "form.lastName": "Cognome",
  "form.email": "Email",
  "form.phone": "Telefono",
  "form.city": "Città",
  "form.instagram": "Instagram",
  "form.s2": "LA TUA DATA PREFERITA",
  "form.s2h": "Tocca una delle tre date. Obbligatorio.",
  "form.s3": "ALTRE DATE DISPONIBILI",
  "form.s3h": "Facoltativo — aiuta l'organizzazione.",
  "form.s4": "PROFILO RUNNING E FITTING SYLAN 2",
  "form.select": "Seleziona",
  "form.selectRange": "Seleziona un intervallo",
  "form.runningLevel": "Esperienza di running",
  "form.trailLevel": "Esperienza di trail running",
  "form.pace": "Passo indicativo",
  "form.weeklyVolume": "Volume settimanale medio",
  "form.longestRun": "Uscita più lunga negli ultimi 3 mesi",
  "form.monthlyElevation": "Dislivello positivo mensile",
  "form.recentActivity": "Attività recenti significative",
  "form.recentActivityHint": "Es. percorsi, dislivelli o uscite lunghe degli ultimi mesi.",
  "form.sizeSystem": "Sistema taglie",
  "form.shoeSize": "Taglia scarpa",
  "form.fit": "Fitting Sylan 2",
  "form.fitMen": "UOMO",
  "form.fitWomen": "DONNA",
  "form.description": "Breve descrizione della tua esperienza",
  "form.s5": "LUNCH BOX ED ESIGENZE ALIMENTARI",
  "form.s5h":
    "Al termine dell'esperienza è previsto un lunch box. Indica eventuali esigenze per permetterci di prepararlo correttamente.",
  "form.dietary": "Profilo alimentare",
  "form.allergies": "Allergie o intolleranze alimentari",
  "form.allergiesHint":
    "Indica solo le informazioni necessarie alla preparazione del lunch box.",
  "form.s6": "DICHIARAZIONI OBBLIGATORIE",
  "form.c.adult": "Dichiaro di avere 18 anni compiuti.",
  "form.c.terrain":
    "Sono consapevole che si tratta di una Community Trail Run guidata e non competitiva, che si svolge su terreno naturale e sconnesso e richiede un adeguato livello di preparazione fisica.",
  "form.c.fitness":
    "Dichiaro di essere in condizioni fisiche idonee a prendere parte all’attività proposta.",
  "form.c.rulesA": "Ho letto e accetto il",
  "form.c.rulesLink": "Regolamento della Community Trail Run",
  "form.c.rulesB": "e mi impegno a seguire le indicazioni delle guide.",
  "form.c.noGuarantee":
    "Sono consapevole che l’invio della richiesta non garantisce la partecipazione, che resta soggetta a conferma da parte dell’organizzazione.",
  "form.c.privacyA": "Ho letto l’",
  "form.c.privacyLink": "Informativa Privacy",
  "form.c.privacyB":
    "relativa al trattamento dei miei dati personali per la gestione della richiesta di partecipazione.",
  "form.optional": "FACOLTATIVO — MARKETING",
  "form.c.mkVietti": "Desidero ricevere novità e comunicazioni marketing da VIETTI.",
  "form.c.mkArcteryx": "Desidero ricevere novità e comunicazioni marketing da Arc’teryx.",
  "form.c.mkNote": "[CONFIGURABILE — ATTIVARE SOLO SE PREVISTO E APPROVATO]",
  "form.disclaimer": "L’invio del modulo non conferma automaticamente il posto.",
  "form.submit": "RICHIEDI DI PARTECIPARE",
  "form.submitting": "INVIO IN CORSO…",
  "form.errDate": "Seleziona una data preferita.",
  "form.errConsents": "Tutte le dichiarazioni obbligatorie devono essere accettate.",
  "form.errGeneric":
    "Controlla il modulo: alcune informazioni obbligatorie mancano o non sono valide.",
  "w.disclaimer":
    "Le previsioni possono cambiare. Le condizioni finali dell'evento e le decisioni relative alla sicurezza restano soggette alla valutazione dell'organizzazione.",
  "w.low": "AFFIDABILITÀ BASSA",
  "w.medium": "AFFIDABILITÀ MEDIA",
  "w.high": "AFFIDABILITÀ ALTA",
  "w.unavailable": "PREVISIONI DISPONIBILI PIÙ VICINO ALL'EVENTO",
  "w.updated": "AGGIORNATO",
  "lang.label": "LINGUA",
};

const en: Record<keyof typeof it, string> = {
  "nav.experience": "EXPERIENCE",
  "nav.dates": "DATES",
  "nav.request": "REQUEST",
  "nav.requestShort": "REQUEST",
  "hero.alt": "Trail runner on a ridge above Lake Maggiore",
  "hero.description":
    "A guided, non-competitive trail running experience dedicated to the community and to testing the Arc'teryx Sylan 2.",
  "hero.cta": "REQUEST TO JOIN",
  "hero.ctaSecondary": "DISCOVER THE EXPERIENCE",
  "hero.limited": "LIMITED SPOTS",
  "hero.k.place": "LOCATION",
  "hero.v.place": "LAKE MAGGIORE / IT",
  "hero.k.format": "FORMAT",
  "hero.v.format": "NON-COMPETITIVE TRAIL RUN",
  "hero.k.access": "ACCESS",
  "hero.v.access": "LIMITED PARTICIPATION",
  "hero.k.dates": "DATES",
  "hero.v.dates": "17—19 SEPTEMBER 2026",
  nonCompetitive:
    "This is a guided, non-competitive Community Trail Run. There is no ranking, no official timing and no performance-related prizes.",
  "exp.title": "THE EXPERIENCE",
  "exp.01.t": "ARRIVAL",
  "exp.01.d": "Welcome and check-in at VIETTI.",
  "exp.02.t": "FITTING",
  "exp.02.d": "Hand-over and fitting of the Arc'teryx Sylan 2 test units.",
  "exp.03.t": "TRAIL",
  "exp.03.d": "Guided, non-competitive community trail run on Lake Maggiore.",
  "exp.04.t": "RECOVERY",
  "exp.04.d": "Post-run refuel and community moment.",
  "exp.note":
    "Experienced guides and pacers accompany the group along the whole route. Photo and video capture is part of the Arc’teryx × VIETTI storytelling.",
  "route.title": "THE ROUTE",
  "route.distance": "DISTANCE",
  "route.elevation": "ELEVATION GAIN",
  "route.surface": "SURFACE",
  "route.place": "LOCATION",
  "route.map": "GPX / TOPOGRAPHIC MAP PLACEHOLDER",
  "dates.titleConfirmed": "CONFIRMED EVENT DATE",
  "dates.titleChoose": "CHOOSE YOUR PREFERRED DATE",
  "dates.confirmed": "CONFIRMED",
  "dates.meetingTime": "MEETING TIME",
  "dates.meetingPoint": "MEETING POINT",
  "dates.communityPreference": "COMMUNITY PREFERENCE",
  "dates.provisional": "PROVISIONAL DATES",
  "dates.requests": "REQUESTS",
  "dates.leading": "CURRENTLY MOST REQUESTED DATE",
  "dates.note":
    "The most requested date will be prioritised. The final date will be confirmed based on participant availability, weather conditions and organisational needs.",
  "dates.selected": "SELECTED",
  "dates.select": "TAP TO SELECT",
  "dates.open": "PREFERENCES OPEN",
  "dates.waiting": "AWAITING THE FIRST REQUESTS",
  "media.title": "PHOTO AND VIDEO PRODUCTION",
  "media.body":
    "Photo and video will be captured during the event for Arc’teryx × VIETTI storytelling. The image and video release is collected separately, only from accepted participants, at the confirmation stage.",
  "req.title": "REQUEST TO JOIN",
  "req.body":
    "Spots are limited. Fill in the form to send your participation request: submitting does not automatically confirm a spot.",
  "req.tag1": "LIMITED SPOTS",
  "req.tag2": "PARTICIPATION REQUEST",
  "req.tag3": "PARTICIPATION SUBJECT TO CONFIRMATION",
  "footer.rules": "RULES",
  "footer.privacy": "PRIVACY NOTICE",
  "footer.terms": "EVENT TERMS",
  "footer.cookies": "COOKIE POLICY",
  "footer.logo": "[LOGO PLACEHOLDER — UPLOAD FINAL ASSETS]",
  "form.closed": "REQUESTS CLOSED",
  "form.closedBody":
    "Participation requests are currently closed. Follow VIETTI for upcoming Arc’teryx activities.",
  "form.waitlist":
    "Requests have exceeded the initial event capacity. New requests may be placed on a waiting list.",
  "form.s1": "YOUR DETAILS",
  "form.s1h": "We need them to contact you if your request is accepted.",
  "form.firstName": "First name",
  "form.lastName": "Last name",
  "form.email": "Email",
  "form.phone": "Phone",
  "form.city": "City",
  "form.instagram": "Instagram",
  "form.s2": "YOUR PREFERRED DATE",
  "form.s2h": "Tap one of the three dates. Required.",
  "form.s3": "OTHER AVAILABLE DATES",
  "form.s3h": "Optional — it helps the organisers.",
  "form.s4": "RUNNING PROFILE AND SYLAN 2 FITTING",
  "form.select": "Select",
  "form.selectRange": "Select a range",
  "form.runningLevel": "Running experience",
  "form.trailLevel": "Trail running experience",
  "form.pace": "Typical pace",
  "form.weeklyVolume": "Average weekly volume",
  "form.longestRun": "Longest run in the last 3 months",
  "form.monthlyElevation": "Monthly elevation gain",
  "form.recentActivity": "Notable recent activity",
  "form.recentActivityHint": "E.g. routes, elevation or long runs from recent months.",
  "form.sizeSystem": "Size system",
  "form.shoeSize": "Shoe size",
  "form.fit": "Sylan 2 fitting",
  "form.fitMen": "MEN’S",
  "form.fitWomen": "WOMEN’S",
  "form.description": "Short description of your experience",
  "form.s5": "LUNCH BOX AND DIETARY NEEDS",
  "form.s5h":
    "A lunch box is provided at the end of the experience. Tell us about any requirements so we can prepare it properly.",
  "form.dietary": "Dietary profile",
  "form.allergies": "Food allergies or intolerances",
  "form.allergiesHint": "Only share what is needed to prepare the lunch box.",
  "form.s6": "REQUIRED DECLARATIONS",
  "form.c.adult": "I declare that I am 18 years of age or older.",
  "form.c.terrain":
    "I understand this is a guided, non-competitive Community Trail Run on natural, uneven terrain that requires an adequate level of physical fitness.",
  "form.c.fitness": "I declare that I am physically fit to take part in the proposed activity.",
  "form.c.rulesA": "I have read and accept the",
  "form.c.rulesLink": "Community Trail Run Rules",
  "form.c.rulesB": "and I agree to follow the guides’ instructions.",
  "form.c.noGuarantee":
    "I understand that submitting the request does not guarantee participation, which remains subject to confirmation by the organisers.",
  "form.c.privacyA": "I have read the",
  "form.c.privacyLink": "Privacy Notice",
  "form.c.privacyB":
    "concerning the processing of my personal data for managing the participation request.",
  "form.optional": "OPTIONAL — MARKETING",
  "form.c.mkVietti": "I would like to receive news and marketing communications from VIETTI.",
  "form.c.mkArcteryx": "I would like to receive news and marketing communications from Arc’teryx.",
  "form.c.mkNote": "[CONFIGURABLE — ENABLE ONLY IF FORESEEN AND APPROVED]",
  "form.disclaimer": "Submitting the form does not automatically confirm a spot.",
  "form.submit": "REQUEST TO JOIN",
  "form.submitting": "SENDING…",
  "form.errDate": "Select a preferred date.",
  "form.errConsents": "All required declarations must be accepted.",
  "form.errGeneric": "Check the form: some required information is missing or invalid.",
  "w.disclaimer":
    "Forecasts may change. Final event conditions and safety decisions remain subject to organiser assessment.",
  "w.low": "LOW CONFIDENCE",
  "w.medium": "MEDIUM CONFIDENCE",
  "w.high": "HIGHER CONFIDENCE",
  "w.unavailable": "FORECAST AVAILABLE CLOSER TO THE EVENT",
  "w.updated": "UPDATED",
  "lang.label": "LANGUAGE",
};

export type TKey = keyof typeof it;
const DICTS: Record<Lang, Record<TKey, string>> = { it, en };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string };
const LangContext = createContext<Ctx>({ lang: "it", setLang: () => {}, t: (k) => it[k] });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");

  useEffect(() => {
    let next: Lang | null = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "it" || stored === "en") next = stored;
    } catch {
      /* storage unavailable */
    }
    if (!next) {
      const nav = navigator.languages?.[0] ?? navigator.language ?? "it";
      next = nav.toLowerCase().startsWith("it") ? "it" : "en";
    }
    setLangState(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang: (l) => {
        setLangState(l);
        try {
          localStorage.setItem(STORAGE_KEY, l);
        } catch {
          /* storage unavailable */
        }
      },
      t: (k) => DICTS[lang][k],
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  return useContext(LangContext);
}

export function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={className} role="group" aria-label="Language / Lingua">
      {(["it", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={
            "tech-sm px-1.5 py-1 transition-colors " +
            (lang === l ? "text-foreground underline underline-offset-4" : "hover:text-jade-soft")
          }
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
