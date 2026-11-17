/* ============================================================
   SafeHub — mock data (Italian SMB demo)
   ============================================================ */

const TODAY = new Date(2026, 4, 25); // 25 maggio 2026

const daysFromNow = (n) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + n);
  return d;
};

const fmtDate = (d) => {
  if (!(d instanceof Date)) d = new Date(d);
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });
};
const fmtDateShort = (d) => {
  if (!(d instanceof Date)) d = new Date(d);
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "2-digit" });
};

const daysUntil = (d) => {
  if (!(d instanceof Date)) d = new Date(d);
  return Math.ceil((d - TODAY) / (1000 * 60 * 60 * 24));
};

const COMPANIES = [
  { id: "tre-torri",    name: "Tre Torri Costruzioni S.r.l.",  sector: "Edilizia",   employees: 47, sites: 6, vatin: "IT01234567890" },
  { id: "meccanica-bg", name: "Meccanica Bergamasca S.p.A.",   sector: "Manifattura", employees: 128, sites: 2, vatin: "IT09876543210" },
  { id: "logistica-pd", name: "Padova Logistica",              sector: "Logistica",  employees: 84, sites: 3, vatin: "IT11223344556" },
];

const EMPLOYEES = [
  // Tre Torri Costruzioni
  { id: 1,  name: "Marco Bianchi",      role: "Capocantiere",        dept: "Cantiere A14",     hire: "2019-03-14", company: "tre-torri", phone: "+39 348 1234567", email: "m.bianchi@tretorri.it", training: 0.92, expiring: 0, compliance: "ok" },
  { id: 2,  name: "Giulia Romano",      role: "Operaia specializzata",dept: "Cantiere A14",    hire: "2021-06-01", company: "tre-torri", phone: "+39 333 7894561", email: "g.romano@tretorri.it", training: 0.45, expiring: 2, compliance: "warn" },
  { id: 3,  name: "Salvatore Esposito", role: "Gruista",              dept: "Cantiere Brescia", hire: "2017-09-22", company: "tre-torri", phone: "+39 320 4567812", email: "s.esposito@tretorri.it", training: 1.0, expiring: 0, compliance: "ok" },
  { id: 4,  name: "Anna Ferri",         role: "RSPP",                 dept: "Direzione",        hire: "2015-01-15", company: "tre-torri", phone: "+39 347 9988776", email: "a.ferri@tretorri.it", training: 1.0, expiring: 0, compliance: "ok", isCurrentUser: true },
  { id: 5,  name: "Pietro Conti",       role: "Carpentiere",          dept: "Cantiere A14",     hire: "2022-11-04", company: "tre-torri", phone: "+39 339 1112223", email: "p.conti@tretorri.it", training: 0.7, expiring: 1, compliance: "warn" },
  { id: 6,  name: "Luca De Santis",     role: "Operaio",              dept: "Cantiere Brescia", hire: "2023-02-20", company: "tre-torri", phone: "+39 348 5556667", email: "l.desantis@tretorri.it", training: 0.3, expiring: 3, compliance: "danger" },
  { id: 7,  name: "Roberta Galli",      role: "Geometra",             dept: "Ufficio tecnico",  hire: "2018-10-08", company: "tre-torri", phone: "+39 333 1414151", email: "r.galli@tretorri.it", training: 0.85, expiring: 0, compliance: "ok" },
  { id: 8,  name: "Davide Moretti",     role: "Manovale",             dept: "Cantiere A14",     hire: "2024-04-12", company: "tre-torri", phone: "+39 320 7777888", email: "d.moretti@tretorri.it", training: 0.15, expiring: 4, compliance: "danger" },
  { id: 9,  name: "Chiara Lombardi",    role: "Direttore tecnico",    dept: "Direzione",        hire: "2014-06-01", company: "tre-torri", phone: "+39 347 2223334", email: "c.lombardi@tretorri.it", training: 1.0, expiring: 0, compliance: "ok" },
  { id: 10, name: "Karim Haidari",      role: "Saldatore",            dept: "Cantiere Brescia", hire: "2020-08-17", company: "tre-torri", phone: "+39 339 8889990", email: "k.haidari@tretorri.it", training: 0.8, expiring: 1, compliance: "warn" },
  { id: 11, name: "Elena Rizzo",        role: "Assistente HR",        dept: "Amministrazione", hire: "2022-03-01", company: "tre-torri", phone: "+39 348 4445556", email: "e.rizzo@tretorri.it", training: 0.95, expiring: 0, compliance: "ok" },
  { id: 12, name: "Marco Vinciguerra",  role: "Carpentiere",          dept: "Cantiere A14",     hire: "2023-09-14", company: "tre-torri", phone: "+39 333 6667778", email: "m.vinciguerra@tretorri.it", training: 0.6, expiring: 2, compliance: "warn" },
  { id: 13, name: "Sofia Marchetti",    role: "Geometra junior",      dept: "Ufficio tecnico",  hire: "2024-01-08", company: "tre-torri", phone: "+39 320 1112224", email: "s.marchetti@tretorri.it", training: 0.5, expiring: 1, compliance: "warn" },
  { id: 14, name: "Tommaso Greco",      role: "Operaio",              dept: "Cantiere Brescia", hire: "2021-11-20", company: "tre-torri", phone: "+39 347 5556668", email: "t.greco@tretorri.it", training: 0.75, expiring: 0, compliance: "ok" },
  { id: 15, name: "Vincenzo Russo",     role: "Capocantiere",         dept: "Cantiere Brescia", hire: "2016-04-10", company: "tre-torri", phone: "+39 339 2223335", email: "v.russo@tretorri.it", training: 1.0, expiring: 0, compliance: "ok" },
];

// Trainings & certifications
const TRAININGS = [
  { id: "f-base",    name: "Formazione base lavoratori",                hours: 8,  cycle: 5, art: "Accordo Stato-Regioni 2011" },
  { id: "f-spec-r-alto", name: "Formazione specifica rischio alto",     hours: 12, cycle: 5, art: "D.Lgs. 81/08, art. 37" },
  { id: "primo-soccorso", name: "Primo soccorso (gruppo A)",            hours: 16, cycle: 3, art: "DM 388/03" },
  { id: "antincendio",    name: "Addetto antincendio (rischio medio)", hours: 8,  cycle: 3, art: "DM 02/09/2021" },
  { id: "preposto",   name: "Formazione preposto",                      hours: 8,  cycle: 2, art: "Accordo Stato-Regioni" },
  { id: "ple",        name: "Patentino PLE (piattaforma elevabile)",   hours: 10, cycle: 5, art: "Accordo Stato-Regioni 2012" },
  { id: "carrelli",   name: "Patentino carrelli elevatori",            hours: 12, cycle: 5, art: "Accordo Stato-Regioni 2012" },
  { id: "gru-mobili", name: "Patentino gru mobili",                    hours: 14, cycle: 5, art: "Accordo Stato-Regioni 2012" },
  { id: "dpi-iii",    name: "DPI III categoria — anticaduta",          hours: 8,  cycle: 5, art: "D.Lgs. 81/08" },
];

// Generated expiring items
const EXPIRING = [
  { id: 101, type: "Formazione",  title: "Formazione base lavoratori",       employee: "Davide Moretti",     emp_id: 8,  expires: daysFromNow(3),   ref: "f-base" },
  { id: 102, type: "Certificato", title: "Patentino carrelli elevatori",     employee: "Giulia Romano",      emp_id: 2,  expires: daysFromNow(6),   ref: "carrelli" },
  { id: 103, type: "Documento",   title: "DVR Cantiere A14 — revisione",     employee: null,                  emp_id: null, expires: daysFromNow(11),  ref: "dvr-a14" },
  { id: 104, type: "Visita medica", title: "Idoneit\u00e0 mansione",          employee: "Pietro Conti",        emp_id: 5,  expires: daysFromNow(14),  ref: null },
  { id: 105, type: "Formazione",  title: "Primo soccorso (richiamo)",        employee: "Marco Vinciguerra",   emp_id: 12, expires: daysFromNow(19),  ref: "primo-soccorso" },
  { id: 106, type: "Certificato", title: "DPI III cat. anticaduta",          employee: "Luca De Santis",      emp_id: 6,  expires: daysFromNow(22),  ref: "dpi-iii" },
  { id: 107, type: "Documento",   title: "DUVRI — appalto manutenzione",     employee: null,                  emp_id: null, expires: daysFromNow(27),  ref: "duvri-2026" },
  { id: 108, type: "Formazione",  title: "Antincendio rischio medio",        employee: "Sofia Marchetti",     emp_id: 13, expires: daysFromNow(33),  ref: "antincendio" },
  { id: 109, type: "Certificato", title: "Patentino PLE",                    employee: "Karim Haidari",       emp_id: 10, expires: daysFromNow(45),  ref: "ple" },
  { id: 110, type: "Documento",   title: "Verifica periodica gru",           employee: null,                  emp_id: null, expires: daysFromNow(-2),  ref: null, overdue: true },
  { id: 111, type: "Formazione",  title: "Formazione preposto",              employee: "Tommaso Greco",       emp_id: 14, expires: daysFromNow(58),  ref: "preposto" },
];

// Documents
const DOCUMENTS = [
  { id: "d1",  name: "DVR_TreTorri_2025_v3.2.pdf",         folder: "DVR",        size: "4.8 MB", ext: "pdf", uploaded: "2025-03-10", uploader: "Anna Ferri", expires: daysFromNow(289), tags: ["dvr","2025"] },
  { id: "d2",  name: "DVR_Cantiere_A14.pdf",                folder: "DVR",        size: "2.1 MB", ext: "pdf", uploaded: "2025-09-02", uploader: "Anna Ferri", expires: daysFromNow(11), tags: ["dvr","cantiere"] },
  { id: "d3",  name: "DUVRI_Appalto_Manutenzione_2026.pdf", folder: "DUVRI",      size: "1.4 MB", ext: "pdf", uploaded: "2026-01-15", uploader: "Chiara Lombardi", expires: daysFromNow(27), tags: ["duvri","appalto"] },
  { id: "d4",  name: "POS_Cantiere_Brescia.pdf",            folder: "POS",        size: "3.2 MB", ext: "pdf", uploaded: "2025-11-20", uploader: "Vincenzo Russo", expires: daysFromNow(140), tags: ["pos"] },
  { id: "d5",  name: "Verbale_Sopralluogo_2026-04.pdf",     folder: "Verbali",    size: "780 KB", ext: "pdf", uploaded: "2026-04-22", uploader: "Anna Ferri", expires: null, tags: ["sopralluogo"] },
  { id: "d6",  name: "Certificati_Idoneit\u00e0_2026.zip",  folder: "Idoneit\u00e0", size: "12.4 MB", ext: "zip", uploaded: "2026-02-10", uploader: "Elena Rizzo", expires: null, tags: ["medicina","raccolta"] },
  { id: "d7",  name: "Registro_Infortuni_2025.xlsx",        folder: "Infortuni",  size: "210 KB", ext: "xlsx", uploaded: "2025-12-31", uploader: "Anna Ferri", expires: null, tags: ["registro","2025"] },
  { id: "d8",  name: "Manuale_Uso_Gru_LR1100.pdf",          folder: "Macchinari", size: "8.6 MB", ext: "pdf", uploaded: "2024-07-04", uploader: "Salvatore Esposito", expires: null, tags: ["manuale","gru"] },
  { id: "d9",  name: "Foglio_Firme_Formazione_Mag.pdf",     folder: "Formazione", size: "640 KB", ext: "pdf", uploaded: "2026-05-18", uploader: "Elena Rizzo", expires: null, tags: ["firme","formazione"] },
  { id: "d10", name: "Piano_Emergenza_Sede.pdf",            folder: "Emergenza",  size: "1.9 MB", ext: "pdf", uploaded: "2025-06-12", uploader: "Anna Ferri", expires: daysFromNow(380), tags: ["emergenza"] },
];

const FOLDERS = [
  { id: "DVR",       name: "DVR",                 count: 2, desc: "Documenti Valutazione Rischi" },
  { id: "DUVRI",     name: "DUVRI",               count: 1, desc: "Documenti Unici Valutazione Rischi Interferenti" },
  { id: "POS",       name: "POS",                 count: 1, desc: "Piani Operativi di Sicurezza" },
  { id: "Formazione",name: "Formazione",          count: 1, desc: "Attestati, registri, fogli firme" },
  { id: "Idoneit\u00e0", name: "Idoneit\u00e0",  count: 1, desc: "Visite mediche e idoneit\u00e0 alla mansione" },
  { id: "Macchinari",name: "Macchinari",          count: 1, desc: "Verifiche periodiche, manuali, marcature CE" },
  { id: "Emergenza", name: "Emergenza",           count: 1, desc: "Piani emergenza, evacuazione" },
  { id: "Verbali",   name: "Verbali",             count: 1, desc: "Verbali sopralluoghi, riunioni periodiche" },
  { id: "Infortuni", name: "Infortuni",           count: 1, desc: "Registro infortuni, denunce INAIL" },
];

// Training courses (catalogue + assigned)
const COURSES = [
  { id: "c1", training_id: "f-base", title: "Formazione base — Modulo 2026", participants: 12, completed: 8, in_progress: 3, todo: 1, deadline: daysFromNow(45), modality: "Aula + e-learning" },
  { id: "c2", training_id: "antincendio", title: "Antincendio rischio medio", participants: 6, completed: 3, in_progress: 2, todo: 1, deadline: daysFromNow(20), modality: "Pratica in aula" },
  { id: "c3", training_id: "carrelli", title: "Patentino carrelli (richiamo)", participants: 4, completed: 1, in_progress: 1, todo: 2, deadline: daysFromNow(8), modality: "Pratica" },
  { id: "c4", training_id: "primo-soccorso", title: "Primo soccorso gruppo A", participants: 5, completed: 5, in_progress: 0, todo: 0, deadline: daysFromNow(-12), modality: "Aula" },
  { id: "c5", training_id: "preposto", title: "Formazione preposto", participants: 3, completed: 0, in_progress: 2, todo: 1, deadline: daysFromNow(60), modality: "E-learning" },
];

// Audit checklist template
const AUDIT_TEMPLATES = [
  {
    id: "at-cantiere",
    name: "Audit cantiere — settimanale",
    sections: [
      { name: "Segnaletica e accessi", items: [
        "Recinzione cantiere integra e completa",
        "Segnaletica di sicurezza posizionata correttamente",
        "Accesso pedonale separato da quello veicolare",
        "Cartello di cantiere aggiornato e visibile",
      ]},
      { name: "DPI e protezioni collettive", items: [
        "Lavoratori indossano DPI previsti dal POS",
        "Parapetti su ogni quota > 2m",
        "Linee vita installate e certificate",
        "Reti anticaduta presenti dove richiesto",
      ]},
      { name: "Impianti e macchinari", items: [
        "Quadro elettrico chiuso e con messa a terra",
        "Estintori presenti e revisionati",
        "Macchinari con verifica periodica in corso",
        "Cavi sospesi o protetti",
      ]},
      { name: "Sostanze pericolose", items: [
        "Schede dati sicurezza disponibili",
        "Stoccaggio in area dedicata",
        "Etichettatura conforme",
      ]},
    ],
  },
  {
    id: "at-officina",
    name: "Audit officina — mensile",
    sections: [
      { name: "Postazioni di lavoro", items: [
        "Ergonomia delle postazioni rispettata",
        "Illuminazione adeguata",
        "Vie di fuga libere",
      ]},
      { name: "Macchine utensili", items: [
        "Protezioni meccaniche integre",
        "Pulsanti emergenza accessibili e funzionanti",
        "Manutenzione registrata",
      ]},
    ],
  },
  {
    id: "at-uffici",
    name: "Audit uffici — semestrale",
    sections: [
      { name: "Postazione VDT", items: [
        "Sedia regolabile in 5 punti",
        "Monitor ad altezza occhi",
        "Pausa di 15 min ogni 2h documentata",
      ]},
      { name: "Emergenze", items: [
        "Cartellonistica vie di fuga visibile",
        "Estintori accessibili",
        "Cassetta primo soccorso completa",
      ]},
    ],
  },
];

// Past audits history
const AUDIT_HISTORY = [
  { id: "a1", template: "Audit cantiere — settimanale", site: "Cantiere A14",     date: daysFromNow(-7),  by: "Anna Ferri",  status: "completato", findings: 2, score: 87 },
  { id: "a2", template: "Audit officina — mensile",     site: "Officina Brescia", date: daysFromNow(-12), by: "Marco Bianchi", status: "completato", findings: 4, score: 76 },
  { id: "a3", template: "Audit cantiere — settimanale", site: "Cantiere Brescia", date: daysFromNow(-3),  by: "Vincenzo Russo", status: "in corso",  findings: null, score: null },
  { id: "a4", template: "Audit uffici — semestrale",    site: "Sede legale",      date: daysFromNow(-31), by: "Anna Ferri",  status: "completato", findings: 1, score: 94 },
  { id: "a5", template: "Audit cantiere — settimanale", site: "Cantiere A14",     date: daysFromNow(-14), by: "Anna Ferri",  status: "completato", findings: 0, score: 100 },
];

// Reports definitions
const REPORTS = [
  { id: "r1", name: "Stato formazione per dipendente", desc: "Elenco completo con scadenze e ore svolte", format: ["xlsx","pdf"], last_run: daysFromNow(-4), category: "Formazione" },
  { id: "r2", name: "Scadenziario consolidato",         desc: "Tutte le scadenze nei prossimi 90 giorni",  format: ["xlsx","pdf"], last_run: daysFromNow(-1), category: "Scadenze" },
  { id: "r3", name: "Registro infortuni annuale",       desc: "Eventi registrati con classificazione INAIL", format: ["xlsx","pdf"], last_run: daysFromNow(-22), category: "Infortuni" },
  { id: "r4", name: "Report audit interni",             desc: "Audit completati con findings e score",     format: ["pdf"],         last_run: daysFromNow(-9),  category: "Audit" },
  { id: "r5", name: "Documentazione per ispezione",     desc: "Pacchetto pronto per ASL / ITL",            format: ["zip"],        last_run: daysFromNow(-45), category: "Compliance" },
  { id: "r6", name: "Indicatori KPI sicurezza",         desc: "Near-miss, ore formazione, % compliance",   format: ["xlsx","pdf"], last_run: daysFromNow(-2),  category: "KPI" },
];

// Activity feed
const ACTIVITY = [
  { who: "Davide Moretti",    what: "ha completato il check-in giornaliero", when: "10 min fa",  type: "checkin" },
  { who: "Giulia Romano",     what: "ha segnalato un near-miss in Cantiere A14", when: "1h fa",  type: "nearmiss" },
  { who: "Anna Ferri",        what: "ha caricato \"DVR_TreTorri_2025_v3.2.pdf\"", when: "3h fa",  type: "upload" },
  { who: "Sistema",           what: "alert email inviato per 4 scadenze imminenti", when: "Ieri, 09:00", type: "alert" },
  { who: "Marco Bianchi",     what: "ha completato Audit cantiere — settimanale", when: "Ieri", type: "audit" },
  { who: "Pietro Conti",      what: "ha completato il modulo \"Antincendio\"", when: "2 giorni fa", type: "training" },
];

// Near miss / risk reports (mobile-side, summary view)
const NEAR_MISS = [
  { id: "nm1", who: "Giulia Romano",    site: "Cantiere A14",     when: daysFromNow(0),  type: "Quasi-incidente", severity: "media",  desc: "Caduta materiale da ponteggio (nessun ferito)" },
  { id: "nm2", who: "Davide Moretti",   site: "Cantiere A14",     when: daysFromNow(-2), type: "Rischio",          severity: "alta",  desc: "Mancanza parapetto su lato sud livello 3" },
  { id: "nm3", who: "Karim Haidari",    site: "Cantiere Brescia", when: daysFromNow(-5), type: "Quasi-incidente", severity: "bassa", desc: "Cavo elettrico esposto vicino zona saldatura" },
];

// Alert email settings
const ALERT_RULES = [
  { id: "ar1", name: "Scadenze formazione", windows: [30, 15, 7], recipients: ["RSPP", "HR"], enabled: true, channels: ["email"] },
  { id: "ar2", name: "Scadenze documenti DVR/DUVRI", windows: [60, 30, 15], recipients: ["RSPP", "Direzione"], enabled: true, channels: ["email"] },
  { id: "ar3", name: "Visite mediche in scadenza", windows: [30, 15, 7], recipients: ["RSPP", "HR"], enabled: true, channels: ["email"] },
  { id: "ar4", name: "Patentini e certificati", windows: [60, 30, 15, 7], recipients: ["RSPP"], enabled: true, channels: ["email"] },
  { id: "ar5", name: "Audit non completato", windows: [3], recipients: ["RSPP"], enabled: false, channels: ["email"] },
];

const ROLES = {
  admin:  { id: "admin",  label: "Admin azienda", desc: "Accesso completo, gestione utenti e billing" },
  rspp:   { id: "rspp",   label: "RSPP",          desc: "Gestione documenti, audit, formazione, scadenze" },
  hr:     { id: "hr",     label: "HR",            desc: "Gestione dipendenti e formazione" },
  worker: { id: "worker", label: "Lavoratore",    desc: "Solo lettura su proprio profilo + app mobile" },
};

// Export to window so other Babel scripts can read
window.SafeHubData = {
  TODAY, daysFromNow, fmtDate, fmtDateShort, daysUntil,
  COMPANIES, EMPLOYEES, TRAININGS, EXPIRING, DOCUMENTS, FOLDERS, COURSES,
  AUDIT_TEMPLATES, AUDIT_HISTORY, REPORTS, ACTIVITY, NEAR_MISS, ALERT_RULES, ROLES,
};
