export interface FormQuestion {
  key: string
  label: string
  type: 'text' | 'textarea' | 'email' | 'tel' | 'url' | 'number' | 'slider' | 'radio' | 'competitors'
  required?: boolean
  placeholder?: string
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  minLabel?: string
  maxLabel?: string
  helperText?: string
  options?: string[]
}

export interface FormSection {
  title: string
  icon: string
  description: string
  questions: FormQuestion[]
}

export const DEFAULT_ANALISI_LAMPO_CONFIG: FormSection[] = [
  {
    title: "Dati aziendali",
    icon: "🧱",
    description: "STEP 1 - Informazioni base della tua impresa",
    questions: [
      { key: "nomeReferente", label: "Nome e cognome del referente", type: "text", placeholder: "Mario Rossi" },
      { key: "nomeAzienda", label: "Nome azienda", type: "text", placeholder: "Edil Costruzioni Srl" },
      { key: "descrizioneAzienda", label: "Breve descrizione dell'azienda", type: "textarea", required: true, placeholder: "Descrivi brevemente la tua azienda, i servizi offerti e il mercato di riferimento..." },
      { key: "ruoloReferente", label: "Ruolo del referente", type: "text", placeholder: "Titolare / Direttore tecnico / Commerciale / Altro" },
      { key: "emailAziendale", label: "Email aziendale", type: "email", placeholder: "info@azienda.it" },
      { key: "telefono", label: "Numero di telefono / WhatsApp", type: "tel", placeholder: "123 456 7890" },
      { key: "sitoWeb", label: "Sito web", type: "url", placeholder: "www.tuaimpresa.it (se non c'è, indicare nessuno)" },
      { key: "profiloSocial", label: "Profilo social maggiormente utilizzato", type: "text", required: true, placeholder: "Es: Instagram, LinkedIn, Facebook...", helperText: "Indicare il nome utente o l'URL del profilo" },
      { key: "settorePrincipale", label: "Settore principale", type: "text", placeholder: "Impresa edile / Impiantista / Prefabbricatore / Studio tecnico / Altro" },
      { key: "zonaOperativa", label: "Zona operativa", type: "text", placeholder: "Regione o Provincia" },
      { key: "rangeFatturato", label: "Range di fatturato annuo", type: "radio", options: ["500k–1M €", "1M–2M €", "2–5M €", "oltre-5M €"] },
    ],
  },
  {
    title: "Visibilità web",
    icon: "🧱",
    description: "STEP 2 - Presenza Digitale & Branding",
    questions: [
      { key: "sitoWebFunzionante", label: "Hai un sito web aziendale funzionante e aggiornato?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Assente", maxLabel: "Ottimizzato", helperText: "5 = Ottimizzato per acquisizione contatti (CTA chiara, aggiornato)" },
      { key: "googleMyBusiness", label: "Il tuo profilo Google My Business è attivo e curato?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Inesistente", maxLabel: "Curato", helperText: "5 = Con foto recenti, post, recensioni gestite" },
      { key: "presenzaSocial", label: "Quanto è presente e attiva la tua azienda sui social media pertinenti al settore?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Assente", maxLabel: "Attivo", helperText: "1 = Nessuna presenza o profilo abbandonato, 5 = Post costanti, interazioni, piano editoriale" },
    ],
  },
  {
    title: "Acquisizione contatti",
    icon: "🧱",
    description: "STEP 3 - Funnel & Acquisizione Contatti",
    questions: [
      { key: "diversificazioneCanali", label: "Quanto sono diversificati i tuoi canali di acquisizione contatti?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Unico canale", maxLabel: "3+ canali", helperText: "1 = Passaparola o un solo canale, 5 = Più di 3 canali (sito, Google, social, eventi, etc.)" },
      { key: "nuoviContattiMese", label: "Quanti nuovi contatti qualificati ricevi in media al mese?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "< 5", maxLabel: "> 30", helperText: "1 = meno di 5, 5 = più di 30 / mese" },
      { key: "tassoConversione", label: "Conosci il tasso di conversione da contatto a preventivo o proposta?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Non lo so", maxLabel: "Sì, > 50%", helperText: "5 = Conosco il tasso e supera il 50%" },
      { key: "formCTA", label: "Sul sito web ci sono form o CTA (Call To Action) chiari per la richiesta preventivo/contatto?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Nessuna", maxLabel: "Ottimizzate", helperText: "1 = Nessun form o difficile da trovare, 5 = Form prominente, CTA ben visibile" },
    ],
  },
  {
    title: "Gestione interna",
    icon: "🧱",
    description: "STEP 4 - Gestione Interna & CRM",
    questions: [
      { key: "usoCRM", label: "Come gestite le lead e i contatti? Usate un CRM o strumenti di tracciamento strutturati?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Nessun CRM", maxLabel: "CRM completo", helperText: "1 = Excel o carta, 5 = CRM dedicato (HubSpot, Pipedrive, etc.)" },
      { key: "preventiviMese", label: "Quanti preventivi o proposte commerciali preparate al mese in media?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "< 5", maxLabel: "> 30", helperText: "1 = meno di 5, 5 = oltre 30" },
      { key: "followUpPreventivo", label: "Fate follow-up strutturati dopo aver inviato un preventivo?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Mai", maxLabel: "Sempre", helperText: "1 = Nessun follow-up, 5 = Follow-up tempestivo e calendarizzato" },
      { key: "misurazioneTassoAccettazione", label: "Misurate il tasso di accettazione dei vostri preventivi?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "No", maxLabel: "Sì", helperText: "1 = Non misuriamo, 5 = Misuriamo regolarmente e ottimizziamo" },
      { key: "conoscenzaColliBottiglia", label: "Conoscete i colli di bottiglia del vostro processo di vendita/acquisizione?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Non li conosciamo", maxLabel: "Li conosciamo e stiamo lavorando per risolverli", helperText: "1 = Non sappiamo dove sono i problemi, 5 = Abbiamo individuato i problemi e abbiamo un piano" },
    ],
  },
  {
    title: "Follow-up",
    icon: "🧱",
    description: "STEP 5 - Follow-up & Tempi di Risposta",
    questions: [
      { key: "velocitaRisposta", label: "Quanto veloce è la vostra risposta ai contatti?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "> 3 giorni", maxLabel: "< 2 ore", helperText: "1 = Rispondiamo dopo più di 3 giorni, 5 = Rispondiamo entro 2 ore" },
      { key: "chiRisponde", label: "Chi risponde ai contatti?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Qualcuno non specificato", maxLabel: "Referente specifico", helperText: "1 = Qualcuno non specificato, 5 = Referente specifico" },
      { key: "sistemaFollowUp", label: "Utilizzate un sistema di follow-up strutturato?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "No", maxLabel: "Sì", helperText: "1 = Non usiamo sistemi di follow-up, 5 = Sistemi completi e ben gestiti" },
    ],
  },
  {
    title: "Competitor",
    icon: "🧱",
    description: "STEP 6 - Competitor & Posizionamento",
    questions: [
      { key: "competitors", label: "Inserisci almeno 2 competitor principali (nome azienda e sito web)", type: "competitors" },
      { key: "individuazioneCompetitor", label: "Avete individuato i principali competitori nel vostro settore?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "No", maxLabel: "Sì", helperText: "1 = Non abbiamo individuato competitori, 5 = Siamo ben consapevoli dei principali competitori" },
      { key: "propostoValore", label: "Quanto è chiaro il vostro valore proposto rispetto ai competitori?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Non lo sappiamo", maxLabel: "Molto chiaro", helperText: "1 = Non sappiamo cosa differenzia il nostro valore, 5 = Il nostro valore è molto chiaro e distintivo" },
      { key: "visibilitaOnline", label: "Quanto è visibile la vostra azienda online rispetto ai competitori?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Non visibile", maxLabel: "Molto visibile", helperText: "1 = Non ci troviamo online, 5 = Siamo molto visibili online" },
    ],
  },
  {
    title: "KPI Sintetici",
    icon: "📊",
    description: "STEP 7 - KPI Sintetici",
    questions: [
      { key: "tempoMedioRisposta", label: "Tempo medio risposta (in ore)", type: "text", required: true, placeholder: "Es: 2 ore, 1 giorno, ecc." },
      { key: "percentualeFollowUp", label: "% follow-up attivi (in percentuale)", type: "text", required: true, placeholder: "Es: 50%, 75%, ecc." },
      { key: "leadMensili", label: "Lead mensili stimati (a numero)", type: "text", required: true, placeholder: "Es: 20, 50, 100, ecc." },
      { key: "tassoChiusura", label: "Tasso chiusura preventivi (in percentuale)", type: "text", required: true, placeholder: "Es: 30%, 45%, ecc." },
    ],
  },
  {
    title: "Obiettivi",
    icon: "📈",
    description: "STEP 8 - Consapevolezza & Obiettivi",
    questions: [
      { key: "chiarezzaObiettivo", label: "Quanto è chiaro l'obiettivo di crescita digitale che vuoi raggiungere?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Per niente", maxLabel: "Chiarissimo" },
      { key: "realismoObiettivo", label: "Quanto ritieni realistico raggiungere questo obiettivo nei prossimi 6-12 mesi?", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Poco realistico", maxLabel: "Molto realistico" },
    ],
  },
  {
    title: "Conferma",
    icon: "✅",
    description: "STEP 9 - Conferma e Invia",
    questions: [],
  },
]

export const DEFAULT_DIAGNOSI_STRATEGICA_CONFIG: FormSection[] = [
  {
    title: "Dati aziendali",
    icon: "🧱",
    description: "STEP 1 - Informazioni base della tua impresa",
    questions: [
      { key: "nomeReferente", label: "Nome e cognome del referente", type: "text", placeholder: "Mario Rossi" },
      { key: "nomeAzienda", label: "Nome azienda", type: "text", placeholder: "Edil Costruzioni Srl" },
      { key: "tipoAziendaSettore", label: "Che tipo di azienda sei, e in che settore operi?", type: "textarea", required: true, placeholder: "Descrivi il tipo di azienda e il settore in cui operi..." },
      { key: "descrizioneAzienda", label: "Breve descrizione dell'azienda", type: "textarea", placeholder: "Descrivi brevemente la tua azienda..." },
      { key: "emailAziendale", label: "Email aziendale", type: "email", placeholder: "info@azienda.it" },
      { key: "sitoWeb", label: "Sito web", type: "url", placeholder: "www.tuaimpresa.it" },
    ],
  },
  {
    title: "Cliente ideale e obiettivi",
    icon: "🎯",
    description: "STEP 2 - Chi vuoi raggiungere e dove vuoi arrivare",
    questions: [
      { key: "clienteIdeale", label: "Chi è oggi il tuo cliente ideale? Descrivilo come se dovessi formare un venditore da zero.", type: "textarea", required: true, placeholder: "Descrivi il tuo cliente ideale in modo dettagliato..." },
      { key: "obiettiviCrescita", label: "Quali sono gli obiettivi di crescita concreti per i prossimi 12 mesi?", type: "textarea", required: true, placeholder: "Indica gli obiettivi misurabili che vuoi raggiungere..." },
    ],
  },
  {
    title: "Contatti e acquisizione",
    icon: "📞",
    description: "STEP 3 - Volume e fonti dei contatti",
    questions: [
      { key: "nuoviContattiMese", label: "In media quanti nuovi contatti ricevi ogni mese?", type: "number", placeholder: "Es: 10, 25, 50..." },
      { key: "valutazioneQuantitaContatti", label: "Valuta la quantità di contatti su una scala da 1 a 5", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Troppo pochi", maxLabel: "Più che sufficienti", helperText: "1 = insufficienti per gli obiettivi, 5 = quantità adeguata" },
      { key: "fontiContatti", label: "Quali sono oggi le fonti principali dei tuoi contatti?", type: "textarea", placeholder: "Es: passaparola, sito web, Google, social, fiere..." },
      { key: "conversioneContattiClienti", label: "Quanti dei tuoi contatti diventano clienti? (conversione stimata %)", type: "text", placeholder: "Es: 15%, 30%, 50%..." },
      { key: "soddisfazioneConversione", label: "Valuta su 1-5 quanto sei soddisfatto della conversione", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Per niente", maxLabel: "Molto soddisfatto", helperText: "1 = insoddisfatto, 5 = molto soddisfatto del tasso di conversione" },
    ],
  },
  {
    title: "Processo di vendita",
    icon: "🤝",
    description: "STEP 4 - Come gestisci le trattative",
    questions: [
      { key: "trattativaTipo", label: "Descrivici come avviene oggi una trattativa tipo nella tua azienda, passo per passo.", type: "textarea", required: true, placeholder: "Dal primo contatto alla chiusura: descrivi il processo..." },
      { key: "sistemaFollowUp", label: "Hai un sistema strutturato di follow-up? Come funziona?", type: "textarea", placeholder: "Descrivi il tuo sistema di follow-up..." },
      { key: "valutazioneFollowUp", label: "Valutazione follow-up da 1 a 5", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Assente", maxLabel: "Strutturato", helperText: "1 = nessun follow-up, 5 = sistema completo e strutturato" },
    ],
  },
  {
    title: "Inefficienze",
    icon: "⚠️",
    description: "STEP 5 - Punti critici da migliorare",
    questions: [
      { key: "treInefficienze", label: "Quali sono, secondo te, le 3 inefficienze maggiori nel tuo marketing e nella tua vendita oggi?", type: "textarea", required: true, placeholder: "Indica le 3 principali inefficienze che vorresti risolvere..." },
    ],
  },
  {
    title: "Strumenti e presenza online",
    icon: "🛠️",
    description: "STEP 6 - Tool digitali e visibilità",
    questions: [
      { key: "strumentiDigitali", label: "Quali strumenti digitali utilizzi attualmente (CRM, tool email, campagne, etc.)?", type: "textarea", placeholder: "Elenca gli strumenti che usi..." },
      { key: "gradoUtilizzoStrumenti", label: "Valuta il tuo grado di utilizzo su scala 1-5", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Poco utilizzati", maxLabel: "Ottimizzati", helperText: "1 = strumenti poco sfruttati, 5 = utilizzo pieno e ottimizzato" },
      { key: "sitoSocialPubblicita", label: "Hai un sito web e profili social attivi? Fai pubblicità online?", type: "textarea", placeholder: "Descrivi la tua presenza online e le attività pubblicitarie..." },
      { key: "valutazionePresenzaOnline", label: "Valuta su 1-5 la tua presenza online", type: "slider", min: 1, max: 5, step: 1, defaultValue: 3, minLabel: "Assente", maxLabel: "Solida", helperText: "1 = presenza scarsa o assente, 5 = presenza forte e curata" },
    ],
  },
  {
    title: "Competitor e posizionamento",
    icon: "🏆",
    description: "STEP 7 - Concorrenza e proposta di valore",
    questions: [
      { key: "principaliCompetitor", label: "Chi sono i tuoi 2-3 principali concorrenti, e cosa pensi che facciano meglio di te?", type: "textarea", placeholder: "Nome concorrenti e cosa li distingue..." },
      { key: "promessaForte", label: "Qual è oggi, secondo te, la promessa più forte che potresti fare al mercato?", type: "textarea", placeholder: "La tua proposta di valore distintiva..." },
    ],
  },
  {
    title: "Fatturato e team",
    icon: "👥",
    description: "STEP 8 - Revenue e risorse dedicate",
    questions: [
      { key: "fonteFatturato", label: "Da dove arriva il tuo fatturato: più clienti nuovi o clienti che tornano? Fai qualcosa per fidelizzarli?", type: "textarea", placeholder: "Descrivi il mix di fatturato e le attività di fidelizzazione..." },
      { key: "teamVenditaMarketing", label: "Quante persone si occupano oggi della vendita e del marketing nella tua azienda? Chi fa cosa?", type: "textarea", placeholder: "Descrivi il team e le responsabilità..." },
    ],
  },
  {
    title: "Note aggiuntive",
    icon: "📝",
    description: "STEP 9 - Spazio per informazioni extra",
    questions: [
      { key: "noteAggiuntive", label: "Se c'è qualcosa che non ti abbiamo chiesto ma ritieni importante farci sapere, scrivilo qui.", type: "textarea", placeholder: "Qualsiasi informazione aggiuntiva rilevante..." },
    ],
  },
  {
    title: "Conferma",
    icon: "✅",
    description: "STEP 10 - Conferma e Invia",
    questions: [],
  },
]
