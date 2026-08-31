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
  "exp.note": "Guide e pacer esperti accompagnano il gruppo lungo tutto il percorso.",
  "route.title": "IL PERCORSO",
  "route.distance": "DISTANZA",
  "route.elevation": "DISLIVELLO",
  "route.surface": "FONDO",
  "route.place": "LUOGO",
  "route.map": "Percorso comunicato ai partecipanti confermati",
  "dates.titleConfirmed": "DATA DELL’EVENTO CONFERMATA",
  "dates.titleChoose": "SCEGLI LA TUA DATA PREFERITA",
  "dates.confirmed": "CONFERMATA",
  "dates.meetingTime": "ORARIO DI RITROVO",
  "dates.meetingPoint": "PUNTO DI RITROVO",
  "dates.communityPreference": "PREFERENZA DELLA COMMUNITY",
  "dates.provisional": "DATE PROVVISORIE",
  "dates.requests": "RICHIESTE",
  "dates.leading": "DATA ATTUALMENTE PIÙ RICHIESTA",
  "dates.note": "La data finale sarà confermata dall’organizzazione.",
  "dates.selected": "SELEZIONATA",
  "dates.select": "TOCCA PER SELEZIONARE",
  "dates.open": "PREFERENZE APERTE",
  "dates.waiting": "IN ATTESA DELLE PRIME RICHIESTE",
  "media.title": "PRODUZIONE FOTO E VIDEO",
  "media.body":
    "Riprese foto e video durante l’evento. La liberatoria è raccolta in fase di conferma, solo dai partecipanti accettati.",
  "req.title": "RICHIEDI DI PARTECIPARE",
  "req.body": "Posti limitati. L’invio del modulo non conferma il posto.",
  "req.tag1": "POSTI LIMITATI",
  "req.tag2": "RICHIESTA DI PARTECIPAZIONE",
  "req.tag3": "PARTECIPAZIONE SOGGETTA A CONFERMA",
  "footer.rules": "REGOLAMENTO",
  "footer.privacy": "INFORMATIVA PRIVACY",
  "footer.terms": "TERMINI DELL’EVENTO",
  "footer.cookies": "COOKIE POLICY",
  "form.closed": "RICHIESTE CHIUSE",
  "form.closedBody": "Richieste chiuse. Segui VIETTI per le prossime attività.",
  "form.waitlist": "Capienza superata: le nuove richieste vanno in lista d’attesa.",
  "form.s1": "I TUOI DATI",
  "form.s1h": "Per contattarti in caso di conferma.",
  "form.firstName": "Nome",
  "form.lastName": "Cognome",
  "form.email": "Email",
  "form.phone": "Telefono",
  "form.city": "Città",
  "form.instagram": "Instagram",
  "form.s2": "LA TUA DATA PREFERITA",
  "form.s2h": "Obbligatorio.",
  "form.s3": "ALTRE DATE DISPONIBILI",
  "form.s3h": "Facoltativo.",
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
  "form.recentActivityHint": "Es. uscite lunghe o dislivelli recenti.",
  "form.sizeSystem": "Sistema taglie",
  "form.shoeSize": "Taglia scarpa",
  "form.fit": "Fitting Sylan 2",
  "form.fitMen": "UOMO",
  "form.fitWomen": "DONNA",
  "form.description": "Breve descrizione della tua esperienza",
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
  "form.disclaimer": "L’invio del modulo non conferma automaticamente il posto.",
  "form.submit": "RICHIEDI DI PARTECIPARE",
  "form.submitting": "INVIO IN CORSO…",
  "form.errDate": "Seleziona una data preferita.",
  "form.errConsents": "Tutte le dichiarazioni obbligatorie devono essere accettate.",
  "form.errGeneric": "Controlla i campi obbligatori.",
  "w.disclaimer":
    "Le previsioni possono cambiare. Le condizioni finali dell'evento e le decisioni relative alla sicurezza restano soggette alla valutazione dell'organizzazione.",
  "w.low": "AFFIDABILITÀ BASSA",
  "w.medium": "AFFIDABILITÀ MEDIA",
  "w.high": "AFFIDABILITÀ ALTA",
  "w.unavailable": "PREVISIONI DISPONIBILI PIÙ VICINO ALL'EVENTO",
  "w.updated": "AGGIORNATO",
  "form.optionalTag": "FACOLTATIVO",
  "form.errNetwork": "Errore di connessione, riprova.",
  "err.INVALID_SUBMISSION": "Invio non valido.",
  "err.EVENT_UNAVAILABLE": "Evento non disponibile.",
  "err.APPLICATIONS_CLOSED": "Le richieste di partecipazione sono attualmente chiuse.",
  "err.MAX_APPLICATIONS": "È stato raggiunto il numero massimo di richieste.",
  "err.DUPLICATE_EMAIL": "Una richiesta è già stata inviata con questa email.",
  "err.RATE_LIMITED": "Troppe richieste. Riprova più tardi.",
  "err.SAVE_FAILED": "Non è stato possibile salvare la richiesta.",
  "rr.back": "ARC’TERYX × VIETTI",
  "rr.title1": "RICHIESTA",
  "rr.title2": "RICEVUTA",
  "rr.body": "Grazie. La tua partecipazione non è ancora confermata. Ti contatteremo una volta definiti la data dell’evento e il gruppo dei partecipanti.",
  "rr.note": "La data più richiesta sarà considerata prioritaria. La data finale verrà confermata in base alla disponibilità dei partecipanti, alle condizioni meteo e alle esigenze organizzative.",
  "rr.calendar": "AGGIUNGI AL CALENDARIO",
  "rr.calendarSoon": "AGGIUNTA AL CALENDARIO DISPONIBILE DOPO LA CONFERMA DELLA DATA FINALE",
  "cf.loading": "CARICAMENTO…",
  "cf.invalid": "Questo link di conferma non è valido.",
  "cf.notEligible": "Questa richiesta non è al momento idonea alla conferma. Stato attuale:",
  "cf.doneTitle1": "PARTECIPAZIONE",
  "cf.doneTitle2": "CONFERMATA",
  "cf.doneBody": "Grazie. I dettagli finali verranno inviati prima dell’evento.",
  "cf.stage": "FASE DUE — PARTECIPANTI ACCETTATI",
  "cf.title1": "CONFERMA IL TUO",
  "cf.title2": "POSTO",
  "cf.welcome": "Benvenuto/a",
  "cf.intro": "La tua richiesta è stata accettata. Completa i dati qui sotto per confermare la partecipazione.",
  "cf.registeredSize": "Taglia registrata:",
  "cf.emName": "Nome contatto di emergenza",
  "cf.emPhone": "Telefono contatto di emergenza",
  "cf.finalSize": "Taglia scarpa definitiva",
  "cf.lunchTitle": "LUNCH BOX ED ESIGENZE ALIMENTARI",
  "cf.dietary": "Profilo alimentare",
  "cf.allergies": "Allergie o intolleranze alimentari",
  "cf.allergiesHint": "Solo quanto serve per la preparazione del lunch box.",
  "cf.dietaryConsent": "Acconsento al trattamento delle informazioni su allergie e intolleranze al solo fine della preparazione del lunch box.",
  "cf.attending": "Confermo la mia presenza all’evento.",
  "cf.rulesA": "Dichiaro di aver letto e accettato il",
  "cf.rulesLink": "Regolamento della Community Trail Run",
  "cf.rulesB": "e di partecipare al briefing di sicurezza.",
  "cf.image": "Accetto la liberatoria per immagini e video ai fini dello storytelling Arc’teryx × VIETTI. [PLACEHOLDER — TESTO DEFINITIVO, RICHIEDE REVISIONE LEGALE]",
  "cf.required": "Tutte le conferme sono obbligatorie.",
  "cf.saveFailed": "Non è stato possibile salvare la conferma.",
  "cf.submit": "CONFERMA PARTECIPAZIONE",
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
  "exp.note": "Experienced guides and pacers accompany the group along the whole route.",
  "route.title": "THE ROUTE",
  "route.distance": "DISTANCE",
  "route.elevation": "ELEVATION GAIN",
  "route.surface": "SURFACE",
  "route.place": "LOCATION",
  "route.map": "Route shared with confirmed participants",
  "dates.titleConfirmed": "CONFIRMED EVENT DATE",
  "dates.titleChoose": "CHOOSE YOUR PREFERRED DATE",
  "dates.confirmed": "CONFIRMED",
  "dates.meetingTime": "MEETING TIME",
  "dates.meetingPoint": "MEETING POINT",
  "dates.communityPreference": "COMMUNITY PREFERENCE",
  "dates.provisional": "PROVISIONAL DATES",
  "dates.requests": "REQUESTS",
  "dates.leading": "CURRENTLY MOST REQUESTED DATE",
  "dates.note": "The final date will be confirmed by the organisers.",
  "dates.selected": "SELECTED",
  "dates.select": "TAP TO SELECT",
  "dates.open": "PREFERENCES OPEN",
  "dates.waiting": "AWAITING THE FIRST REQUESTS",
  "media.title": "PHOTO AND VIDEO PRODUCTION",
  "media.body":
    "Photo and video are captured during the event. The release is collected at the confirmation stage, from accepted participants only.",
  "req.title": "REQUEST TO JOIN",
  "req.body": "Limited spots. Submitting the form does not confirm a spot.",
  "req.tag1": "LIMITED SPOTS",
  "req.tag2": "PARTICIPATION REQUEST",
  "req.tag3": "PARTICIPATION SUBJECT TO CONFIRMATION",
  "footer.rules": "RULES",
  "footer.privacy": "PRIVACY NOTICE",
  "footer.terms": "EVENT TERMS",
  "footer.cookies": "COOKIE POLICY",
  "form.closed": "REQUESTS CLOSED",
  "form.closedBody": "Requests closed. Follow VIETTI for upcoming activities.",
  "form.waitlist": "Capacity exceeded: new requests go on a waiting list.",
  "form.s1": "YOUR DETAILS",
  "form.s1h": "To contact you if accepted.",
  "form.firstName": "First name",
  "form.lastName": "Last name",
  "form.email": "Email",
  "form.phone": "Phone",
  "form.city": "City",
  "form.instagram": "Instagram",
  "form.s2": "YOUR PREFERRED DATE",
  "form.s2h": "Required.",
  "form.s3": "OTHER AVAILABLE DATES",
  "form.s3h": "Optional.",
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
  "form.recentActivityHint": "E.g. recent long runs or elevation.",
  "form.sizeSystem": "Size system",
  "form.shoeSize": "Shoe size",
  "form.fit": "Sylan 2 fitting",
  "form.fitMen": "MEN’S",
  "form.fitWomen": "WOMEN’S",
  "form.description": "Short description of your experience",
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
  "form.disclaimer": "Submitting the form does not automatically confirm a spot.",
  "form.submit": "REQUEST TO JOIN",
  "form.submitting": "SENDING…",
  "form.errDate": "Select a preferred date.",
  "form.errConsents": "All required declarations must be accepted.",
  "form.errGeneric": "Check the required fields.",
  "w.disclaimer":
    "Forecasts may change. Final event conditions and safety decisions remain subject to organiser assessment.",
  "w.low": "LOW CONFIDENCE",
  "w.medium": "MEDIUM CONFIDENCE",
  "w.high": "HIGHER CONFIDENCE",
  "w.unavailable": "FORECAST AVAILABLE CLOSER TO THE EVENT",
  "w.updated": "UPDATED",
  "form.optionalTag": "OPTIONAL",
  "form.errNetwork": "Connection error, please try again.",
  "err.INVALID_SUBMISSION": "Invalid submission.",
  "err.EVENT_UNAVAILABLE": "Event unavailable.",
  "err.APPLICATIONS_CLOSED": "Participation requests are currently closed.",
  "err.MAX_APPLICATIONS": "The maximum number of requests has been reached.",
  "err.DUPLICATE_EMAIL": "A request has already been submitted with this email.",
  "err.RATE_LIMITED": "Too many requests. Please try again later.",
  "err.SAVE_FAILED": "The request could not be saved.",
  "rr.back": "ARC’TERYX × VIETTI",
  "rr.title1": "REQUEST",
  "rr.title2": "RECEIVED",
  "rr.body": "Thank you. Your participation is not confirmed yet. We will contact you once the event date and the group of participants are defined.",
  "rr.note": "The most requested date will be given priority. The final date will be confirmed based on participant availability, weather conditions and organisational needs.",
  "rr.calendar": "ADD TO CALENDAR",
  "rr.calendarSoon": "CALENDAR ENTRY AVAILABLE ONCE THE FINAL DATE IS CONFIRMED",
  "cf.loading": "LOADING…",
  "cf.invalid": "This confirmation link is not valid.",
  "cf.notEligible": "This request is not currently eligible for confirmation. Current status:",
  "cf.doneTitle1": "PARTICIPATION",
  "cf.doneTitle2": "CONFIRMED",
  "cf.doneBody": "Thank you. Final details will be sent before the event.",
  "cf.stage": "STAGE TWO — ACCEPTED PARTICIPANTS",
  "cf.title1": "CONFIRM YOUR",
  "cf.title2": "SPOT",
  "cf.welcome": "Welcome",
  "cf.intro": "Your request has been accepted. Complete the details below to confirm your participation.",
  "cf.registeredSize": "Registered size:",
  "cf.emName": "Emergency contact name",
  "cf.emPhone": "Emergency contact phone",
  "cf.finalSize": "Final shoe size",
  "cf.lunchTitle": "LUNCH BOX AND DIETARY NEEDS",
  "cf.dietary": "Dietary profile",
  "cf.allergies": "Food allergies or intolerances",
  "cf.allergiesHint": "Only what is needed to prepare the lunch box.",
  "cf.dietaryConsent": "I consent to the processing of information about allergies and intolerances for the sole purpose of preparing the lunch box.",
  "cf.attending": "I confirm my attendance at the event.",
  "cf.rulesA": "I declare that I have read and accepted the",
  "cf.rulesLink": "Community Trail Run Rules",
  "cf.rulesB": "and that I will take part in the safety briefing.",
  "cf.image": "I accept the image and video release for Arc’teryx × VIETTI storytelling purposes. [PLACEHOLDER — FINAL WORDING, REQUIRES LEGAL REVIEW]",
  "cf.required": "All confirmations are required.",
  "cf.saveFailed": "The confirmation could not be saved.",
  "cf.submit": "CONFIRM PARTICIPATION",
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
