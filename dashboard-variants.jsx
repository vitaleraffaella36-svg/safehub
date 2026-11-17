/* ============================================================
   SafeHub — Dashboard variations (B, C, D)
   Rendered inside design-canvas artboards.
   ============================================================ */

const { EXPIRING, ACTIVITY, EMPLOYEES, COURSES, NEAR_MISS, AUDIT_HISTORY, fmtDate, fmtDateShort, daysUntil, TODAY } = window.SafeHubData;

/* -------- shared mini-shell that gives context -------- */
const MiniShell = ({ children, label }) => (
  <div style={{
    width: "100%", height: "100%", display: "grid",
    gridTemplateColumns: "232px 1fr",
    background: "var(--bg)", fontFamily: "var(--font-body)",
    color: "var(--text)", overflow: "hidden",
  }}>
    <div style={{
      background: "var(--bg-sunk)",
      borderRight: "1px solid var(--border)",
      padding: "16px 12px",
      display: "flex", flexDirection: "column", gap: 4
    }}>
      <div className="row" style={{ gap: 10, padding: "8px 8px 16px" }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: "var(--primary)", color: "var(--primary-on)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13
        }}>S</div>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, letterSpacing: "-0.02em" }}>SafeHub</span>
      </div>
      {[
        { id: "home", label: "Panoramica", icon: "home", active: true },
        { id: "scad", label: "Scadenze", icon: "calendar", badge: 11 },
        { id: "dip",  label: "Dipendenti", icon: "users" },
        { id: "doc",  label: "Documenti", icon: "folder" },
        { id: "for",  label: "Formazione", icon: "graduation" },
        { id: "aud",  label: "Audit & checklist", icon: "clipboardCheck" },
      ].map(it => (
        <div key={it.id} className={`nav-item ${it.active ? "active" : ""}`}>
          <Icon name={it.icon} size={15}/>
          <span>{it.label}</span>
          {it.badge && <span className="badge">{it.badge}</span>}
        </div>
      ))}
      <div style={{
        marginTop: "auto", padding: 10, display: "flex", alignItems: "center", gap: 10,
        borderTop: "1px solid var(--border)"
      }}>
        <div className="avatar">AF</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 12.5, fontWeight: 600 }}>Anna Ferri</span>
          <span className="faint" style={{ fontSize: 10.5 }}>RSPP</span>
        </div>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
      <header style={{
        height: 56, display: "flex", alignItems: "center", gap: 12,
        padding: "0 20px", borderBottom: "1px solid var(--border)",
        background: "var(--bg-elev)", flexShrink: 0
      }}>
        <span className="row" style={{ gap: 6, fontSize: 13, color: "var(--text-faint)" }}>
          <span>SafeHub</span>
          <Icon name="chevronRight" size={12}/>
          <span>Tre Torri Costruzioni</span>
          <Icon name="chevronRight" size={12}/>
          <span style={{ color: "var(--text)", fontWeight: 600 }}>Panoramica</span>
        </span>
        <div style={{ flex: 1 }}/>
        <div className="chip chip-primary" style={{ height: 24 }}>
          <Icon name="spark" size={11}/> Variante {label}
        </div>
        <div className="search" style={{ width: 240 }}>
          <Icon name="search" size={13} color="var(--text-faint)"/>
          <input placeholder="Cerca..."/>
          <span className="kbd">⌘K</span>
        </div>
      </header>
      <div style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}>
        {children}
      </div>
    </div>
  </div>
);

/* ============================================================
   B. TRIAGE INBOX
   "Cosa devo fare oggi?" — meno data slop, più azione.
   ============================================================ */
const TriageDashboard = () => {
  const compliancePct = 86;

  const inbox = [
    { id: "i1", priority: 1, action: "Rinnova", what: "Patentino carrelli di Giulia Romano",     why: "Scade fra 6 giorni · ultimo rinnovo 8 apr 2021", who: "Giulia Romano", icon: "shieldAlert", emoji: "🔧" },
    { id: "i2", priority: 1, action: "Programma", what: "Formazione base per Davide Moretti",     why: "Scade fra 3 giorni · neoassunto da 13 mesi",     who: "Davide Moretti", icon: "graduation" },
    { id: "i3", priority: 1, action: "Verifica", what: "Gru cantiere Brescia — verifica periodica", why: "Scaduta da 2 giorni · ferma operativa", who: null, icon: "alertTriangle" },
    { id: "i4", priority: 2, action: "Aggiorna", what: "DVR Cantiere A14 — revisione annuale",    why: "Scade fra 11 giorni", who: null, icon: "fileText" },
    { id: "i5", priority: 2, action: "Approva", what: "Near-miss segnalato da Giulia",            why: "Caduta materiale da ponteggio · 1h fa",        who: "Giulia Romano", icon: "alertTriangle" },
    { id: "i6", priority: 3, action: "Carica",  what: "Visita medica Pietro Conti",               why: "Scade fra 14 giorni",                          who: "Pietro Conti", icon: "shieldCheck" },
    { id: "i7", priority: 3, action: "Rivedi",  what: "DUVRI Appalto manutenzione",               why: "Scade fra 27 giorni",                          who: null, icon: "fileText" },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, marginBottom: 28 }}>
        <div>
          <div className="row" style={{ gap: 10, marginBottom: 8 }}>
            <span className="faint" style={{ fontSize: 13 }}>Lunedì 25 maggio · settimana 22</span>
            <span className="chip chip-ok"><Icon name="shieldCheck" size={10}/>0 elementi critici</span>
          </div>
          <h1 style={{ fontSize: 32, lineHeight: 1.15, marginBottom: 8 }}>
            Buongiorno Anna.<br/>
            <span style={{ color: "var(--text-soft)" }}>Hai </span>
            <span style={{ color: "var(--primary)" }}>7 cose</span>
            <span style={{ color: "var(--text-soft)" }}> da chiudere oggi.</span>
          </h1>
          <p className="muted" style={{ fontSize: 14.5, maxWidth: 560 }}>
            Le ho ordinate per urgenza: prima cosa da gestire è il patentino di Giulia.
            Quando finisci, l'inbox si svuota.
          </p>
        </div>
        <ComplianceRing pct={compliancePct}/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 18 }}>
        {/* ===== Inbox column ===== */}
        <section>
          <div className="row between" style={{ marginBottom: 10 }}>
            <h3 style={{ fontSize: 16 }}>Inbox compliance</h3>
            <div className="row" style={{ gap: 4 }}>
              {["Tutte", "Urgenti", "Documenti", "Persone", "Cantieri"].map((t, i) => (
                <button key={t} className="btn btn-sm" style={{
                  background: i === 0 ? "var(--text)" : "transparent",
                  color: i === 0 ? "var(--bg)" : "var(--text-soft)",
                  borderColor: i === 0 ? "var(--text)" : "transparent"
                }}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, background: "var(--bg-elev)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", overflow: "hidden" }}>
            {/* Priority groups */}
            <PriorityHeader label="Da fare oggi" count={3} color="var(--danger)"/>
            {inbox.filter(i => i.priority === 1).map(it => <InboxRow key={it.id} item={it}/>)}

            <PriorityHeader label="Questa settimana" count={2} color="var(--warn)"/>
            {inbox.filter(i => i.priority === 2).map(it => <InboxRow key={it.id} item={it}/>)}

            <PriorityHeader label="Prossimi 30 giorni" count={2} color="var(--info)"/>
            {inbox.filter(i => i.priority === 3).map(it => <InboxRow key={it.id} item={it}/>)}

            <div className="row between" style={{ padding: "12px 18px", background: "var(--bg-sunk)", borderTop: "1px solid var(--border)" }}>
              <span className="faint" style={{ fontSize: 12 }}>Aggiornato 2 minuti fa</span>
              <button className="btn btn-sm btn-ghost">
                <Icon name="check" size={12}/><span>Segna tutto come visto</span>
              </button>
            </div>
          </div>
        </section>

        {/* ===== Right column ===== */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <h4 style={{ marginBottom: 12, fontSize: 13 }}>Questa settimana</h4>
            <WeekStrip/>
          </div>

          <div className="card">
            <div className="row between" style={{ marginBottom: 12 }}>
              <h4 style={{ fontSize: 13 }}>Aree che richiedono attenzione</h4>
            </div>
            {[
              { area: "Cantiere A14",      pct: 64, count: "3 alert" },
              { area: "Cantiere Brescia",  pct: 78, count: "1 alert" },
              { area: "Ufficio tecnico",   pct: 92, count: "—" },
            ].map(d => (
              <div key={d.area} style={{ paddingBottom: 10, marginBottom: 10, borderBottom: "1px dashed var(--border)" }}>
                <div className="row between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500 }}>{d.area}</span>
                  <span className="mono" style={{ fontSize: 12, color: d.pct >= 90 ? "var(--ok)" : d.pct >= 75 ? "var(--warn)" : "var(--danger)" }}>{d.pct}%</span>
                </div>
                <div className="progress" style={{ marginBottom: 4 }}>
                  <span style={{ width: `${d.pct}%`, background: d.pct >= 90 ? "var(--ok)" : d.pct >= 75 ? "var(--warn)" : "var(--danger)" }}/>
                </div>
                <span className="faint" style={{ fontSize: 11 }}>{d.count}</span>
              </div>
            ))}
            <button className="btn btn-sm btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
              <span>Vedi tutte le aree</span><Icon name="arrowRight" size={11}/>
            </button>
          </div>

          <div className="card" style={{ background: "var(--bg-tinted)", border: "1px solid var(--border)" }}>
            <div className="row" style={{ gap: 10, marginBottom: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--bg-elev)", color: "var(--primary)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="spark" size={14}/>
              </div>
              <h4 style={{ fontSize: 13 }}>Suggerimento</h4>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--text-soft)", lineHeight: 1.5, marginBottom: 10 }}>
              Davide e Sofia hanno entrambi formazione antincendio in scadenza il mese prossimo. 
              Posso accorpare le sessioni e risparmi 4 ore di docenza.
            </p>
            <button className="btn btn-sm btn-primary"><Icon name="zap" size={12}/><span>Programma insieme</span></button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const PriorityHeader = ({ label, count, color }) => (
  <div className="row between" style={{ padding: "10px 18px", background: "var(--bg-sunk)", borderBottom: "1px solid var(--border)" }}>
    <div className="row" style={{ gap: 8 }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: color }}/>
      <span style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-soft)" }}>{label}</span>
      <span className="mono faint" style={{ fontSize: 11.5 }}>{count}</span>
    </div>
    <Icon name="chevronDown" size={12} color="var(--text-faint)"/>
  </div>
);

const InboxRow = ({ item }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", gap: 14, alignItems: "center",
        padding: "14px 18px",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        background: hover ? "var(--bg-sunk)" : "var(--bg-elev)",
        transition: "background 0.1s"
      }}
    >
      <input type="checkbox" style={{ accentColor: "var(--primary)" }}/>
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: "var(--bg-tinted)", color: "var(--text)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        <Icon name={item.icon} size={15}/>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <div className="row" style={{ gap: 8 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 4,
            background: "var(--primary-soft)", color: "var(--primary-strong)",
            letterSpacing: "0.02em", textTransform: "uppercase"
          }}>{item.action}</span>
          <span style={{ fontSize: 13.5, fontWeight: 500 }}>{item.what}</span>
        </div>
        <div className="faint" style={{ fontSize: 12 }}>{item.why}</div>
      </div>
      {hover ? (
        <div className="row" style={{ gap: 4 }}>
          <button className="btn btn-sm"><Icon name="clock" size={12}/><span>Posticipa</span></button>
          <button className="btn btn-sm"><Icon name="user" size={12}/><span>Delega</span></button>
          <button className="btn btn-sm btn-primary"><Icon name="arrowRight" size={12}/><span>Gestisci</span></button>
        </div>
      ) : (
        item.who && <div className="avatar avatar-sm">{item.who.split(" ").map(s => s[0]).slice(0, 2).join("")}</div>
      )}
    </div>
  );
};

const ComplianceRing = ({ pct }) => {
  const r = 80;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  return (
    <div style={{
      padding: 18,
      background: "var(--bg-elev)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      display: "flex", alignItems: "center", gap: 16,
    }}>
      <div style={{ position: "relative", width: 180, height: 180, flexShrink: 0 }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={r} fill="none" stroke="var(--bg-sunk)" strokeWidth="14"/>
          <circle
            cx="90" cy="90" r={r} fill="none"
            stroke="var(--primary)" strokeWidth="14"
            strokeDasharray={c} strokeDashoffset={offset}
            transform="rotate(-90 90 90)"
            strokeLinecap="round"
          />
          {/* notches for weak departments */}
          <circle cx="90" cy="90" r={r} fill="none" stroke="var(--danger)" strokeWidth="14"
                  strokeDasharray={`${c * 0.05} ${c}`} strokeDashoffset={-c * 0.45}
                  transform="rotate(-90 90 90)" strokeLinecap="butt"/>
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 2
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em" }}>{pct}%</span>
          <span className="faint" style={{ fontSize: 11.5, fontWeight: 500 }}>conforme</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div className="faint" style={{ fontSize: 11.5, marginBottom: 2 }}>vs mese scorso</div>
          <div className="row" style={{ gap: 6 }}>
            <Icon name="arrowUpRight" size={13} color="var(--ok)"/>
            <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--ok)" }}>+4 pt</span>
          </div>
        </div>
        <div>
          <div className="faint" style={{ fontSize: 11.5, marginBottom: 2 }}>punto debole</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Cantiere A14</div>
        </div>
        <button className="btn btn-sm btn-ghost" style={{ padding: 0, color: "var(--primary-strong)" }}>
          <span>Vedi dettaglio →</span>
        </button>
      </div>
    </div>
  );
};

const WeekStrip = () => {
  const days = ["L", "M", "M", "G", "V", "S", "D"];
  const today = 1; // Monday
  // Bars represent "things to handle" per day
  const data = [3, 2, 1, 4, 2, 0, 0];
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 70 }}>
      {days.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <div style={{
              width: "100%",
              height: `${(data[i] / 4) * 100}%`,
              minHeight: data[i] ? 4 : 0,
              borderRadius: 4,
              background: i === today ? "var(--primary)" : data[i] >= 3 ? "var(--warn)" : "var(--bg-tinted)",
            }}/>
          </div>
          <span className="mono" style={{ fontSize: 10.5, color: i === today ? "var(--primary)" : "var(--text-faint)", fontWeight: i === today ? 700 : 400 }}>{d}</span>
        </div>
      ))}
    </div>
  );
};

/* ============================================================
   C. CALENDAR-FIRST
   ============================================================ */
const CalendarDashboard = () => {
  const [selected, setSelected] = React.useState(28); // May 28
  // Build May 2026: starts on Friday (May 1, 2026 = Friday)
  // 0 = Sunday, 1 = Monday … We'll use Monday-first.
  const events = {
    25: [{ type: "danger", title: "Verifica gru scaduta", who: null }],
    26: [{ type: "info", title: "Audit cantiere Brescia in corso", who: "Vincenzo Russo" }],
    28: [
      { type: "danger", title: "Formazione base — Davide Moretti", who: "Davide Moretti" },
      { type: "warn", title: "Riunione periodica RSPP", who: null },
    ],
    31: [{ type: "danger", title: "Patentino carrelli — Giulia Romano", who: "Giulia Romano" }],
    5:  [{ type: "warn", title: "DVR Cantiere A14 — revisione", who: null }],
    8:  [{ type: "info", title: "Visita medica — Pietro Conti", who: "Pietro Conti" }],
    12: [{ type: "warn", title: "Primo soccorso (richiamo) — Marco Vinciguerra", who: "Marco Vinciguerra" }],
    15: [{ type: "info", title: "DPI III cat. anticaduta — Luca De Santis", who: "Luca De Santis" }],
    21: [{ type: "info", title: "DUVRI — appalto manutenzione", who: null }],
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1320, margin: "0 auto" }}>
      <div className="row between" style={{ marginBottom: 18 }}>
        <div>
          <div className="faint" style={{ fontSize: 13, marginBottom: 4 }}>Calendario sicurezza</div>
          <h1 style={{ fontSize: 26 }}>Maggio – Giugno 2026</h1>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div className="row" style={{ gap: 0, background: "var(--bg-sunk)", borderRadius: 6, padding: 3, border: "1px solid var(--border)" }}>
            {["Mese", "Settimana", "Lista"].map((v, i) => (
              <button key={v} className="btn btn-sm" style={{
                background: i === 0 ? "var(--bg-elev)" : "transparent",
                border: "none",
                boxShadow: i === 0 ? "var(--shadow-sm)" : "none"
              }}>{v}</button>
            ))}
          </div>
          <button className="btn"><Icon name="download" size={13}/><span>Esporta ICS</span></button>
          <button className="btn btn-primary"><Icon name="plus" size={13}/><span>Nuova scadenza</span></button>
        </div>
      </div>

      {/* Top mini KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 18 }}>
        <MiniKPI label="Oggi" value="1" caption="elemento scaduto" accent="danger"/>
        <MiniKPI label="Questa settimana" value="4" caption="scadenze attive" accent="warn"/>
        <MiniKPI label="Maggio" value="11" caption="totali · 7 risolti" accent="info"/>
        <MiniKPI label="Tasso di puntualità" value="92%" caption="ultimi 90 giorni" accent="ok"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}>
        {/* Calendar */}
        <div className="card" style={{ padding: 16 }}>
          <div className="row between" style={{ marginBottom: 14 }}>
            <div className="row" style={{ gap: 6 }}>
              <button className="btn btn-sm btn-ghost"><Icon name="chevronLeft" size={13}/></button>
              <h3 style={{ fontSize: 16 }}>Maggio 2026</h3>
              <button className="btn btn-sm btn-ghost"><Icon name="chevronRight" size={13}/></button>
            </div>
            <div className="row" style={{ gap: 12, fontSize: 11.5, color: "var(--text-soft)" }}>
              <LegendDot color="var(--danger)" label="Scaduto"/>
              <LegendDot color="var(--warn)"   label="Entro 7g"/>
              <LegendDot color="var(--info)"   label="Entro 30g"/>
              <LegendDot color="var(--ok)"     label="Completato"/>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
            {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map(d => (
              <div key={d} style={{ fontSize: 11, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", textAlign: "center", padding: 6 }}>{d}</div>
            ))}
          </div>

          <CalendarGrid events={events} selected={selected} onSelect={setSelected}/>
        </div>

        {/* Right sidebar: day detail */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 0, alignSelf: "flex-start" }}>
          <div className="card">
            <div className="row" style={{ gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 12,
                background: "var(--primary)", color: "var(--primary-on)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center"
              }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{selected}</span>
                <span style={{ fontSize: 10, opacity: 0.85, marginTop: 2 }}>MAG</span>
              </div>
              <div>
                <h3 style={{ fontSize: 16 }}>Giovedì {selected} maggio</h3>
                <div className="faint" style={{ fontSize: 12 }}>{(events[selected] || []).length} elementi</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(events[selected] || []).map((e, i) => (
                <div key={i} className="row" style={{ padding: 12, background: "var(--bg-sunk)", borderRadius: 8, gap: 10 }}>
                  <div style={{ width: 4, alignSelf: "stretch", borderRadius: 999, background: `var(--${e.type})` }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{e.title}</div>
                    {e.who && <div className="faint" style={{ fontSize: 11.5 }}>Riferito a {e.who}</div>}
                  </div>
                  <Icon name="chevronRight" size={13} color="var(--text-faint)"/>
                </div>
              ))}
              {!events[selected] && <div className="empty" style={{ padding: 20 }}>
                <div style={{ fontSize: 12.5 }}>Nessuna scadenza per questo giorno</div>
              </div>}
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontSize: 13, marginBottom: 10 }}>Prossimi 14 giorni</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { date: "26 mag", txt: "Audit Brescia",            color: "info" },
                { date: "28 mag", txt: "Formazione D. Moretti",    color: "danger" },
                { date: "31 mag", txt: "Patentino G. Romano",      color: "danger" },
                { date: "5 giu",  txt: "DVR A14 — revisione",      color: "warn" },
                { date: "8 giu",  txt: "Visita medica P. Conti",   color: "warn" },
              ].map((e, i) => (
                <div key={i} className="row" style={{ gap: 10, padding: "6px 0", borderBottom: i < 4 ? "1px dashed var(--border)" : "none" }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--text-faint)", width: 50 }}>{e.date}</span>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: `var(--${e.color})` }}/>
                  <span style={{ fontSize: 12.5, flex: 1 }}>{e.txt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: "var(--bg-tinted)" }}>
            <div className="row" style={{ gap: 10, marginBottom: 8 }}>
              <Icon name="bellRing" size={14} color="var(--primary)"/>
              <h4 style={{ fontSize: 13 }}>Prossimo invio promemoria</h4>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--text-soft)", lineHeight: 1.5, margin: 0 }}>
              Domani alle <strong>09:00</strong> partirà l'email a Anna Ferri con le 4 scadenze critiche dei prossimi 7 giorni.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const MiniKPI = ({ label, value, caption, accent }) => (
  <div className="card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 4 }}>
    <span className="faint" style={{ fontSize: 11, fontWeight: 500 }}>{label}</span>
    <div className="row" style={{ gap: 8, alignItems: "baseline" }}>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: `var(--${accent})` }}>{value}</span>
      <span className="faint" style={{ fontSize: 11.5 }}>{caption}</span>
    </div>
  </div>
);

const LegendDot = ({ color, label }) => (
  <div className="row" style={{ gap: 6 }}>
    <span style={{ width: 8, height: 8, borderRadius: 999, background: color }}/>
    <span>{label}</span>
  </div>
);

const CalendarGrid = ({ events, selected, onSelect }) => {
  // May 2026: 1st falls on Friday. Monday-first grid.
  // Cells include trailing April days and leading June days.
  const cells = [];
  // April 27 (Mon) - 30 (Thu)
  for (let d = 27; d <= 30; d++) cells.push({ d, month: "apr", muted: true });
  // May 1 - 31
  for (let d = 1; d <= 31; d++) cells.push({ d, month: "may" });
  // June 1 - 7 to fill grid (35 cells)
  for (let d = 1; d <= 7; d++) cells.push({ d, month: "jun", muted: true });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
      {cells.map((c, i) => {
        const evs = c.month === "may" ? (events[c.d] || []) : [];
        const isSelected = c.month === "may" && c.d === selected;
        const isToday = c.month === "may" && c.d === 25;
        return (
          <div
            key={i}
            onClick={() => c.month === "may" && onSelect(c.d)}
            style={{
              minHeight: 100, padding: 8,
              border: `1px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
              borderRadius: 8,
              background: isSelected ? "var(--primary-soft)" : c.muted ? "var(--bg-sunk)" : "var(--bg-elev)",
              cursor: c.muted ? "default" : "pointer",
              display: "flex", flexDirection: "column", gap: 4,
              opacity: c.muted ? 0.4 : 1,
              position: "relative"
            }}
          >
            <div className="row between">
              <span className="mono" style={{
                fontSize: 12, fontWeight: isToday ? 700 : 500,
                color: isToday ? "var(--primary-on)" : isSelected ? "var(--primary-strong)" : "var(--text)",
                background: isToday ? "var(--primary)" : "transparent",
                width: isToday ? 22 : "auto", height: isToday ? 22 : "auto",
                borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center"
              }}>{c.d}</span>
              {evs.length > 0 && <span className="faint" style={{ fontSize: 10 }}>{evs.length}</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {evs.slice(0, 2).map((e, j) => (
                <div key={j} style={{
                  padding: "2px 5px",
                  borderRadius: 3,
                  background: `var(--${e.type}-soft)`,
                  color: e.type === "danger" ? "oklch(0.42 0.16 25)" : e.type === "warn" ? "oklch(0.45 0.12 75)" : "oklch(0.42 0.1 235)",
                  fontSize: 10.5,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>{e.title.split(" — ")[0]}</div>
              ))}
              {evs.length > 2 && <div className="faint" style={{ fontSize: 10 }}>+{evs.length - 2}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ============================================================
   D. CANTIERI / SITES VIEW
   ============================================================ */
const SitesDashboard = () => {
  const sites = [
    {
      id: "a14", name: "Cantiere A14", address: "Casello A14 km 132, Cesena",
      type: "Cantiere edile", manager: "Marco Bianchi",
      workers: 18, present: 16, compliance: 64,
      alerts: 3, nearMiss: 2, openAudit: { name: "Settimanale", days: -3 },
      bg: "linear-gradient(135deg, oklch(0.95 0.025 70), oklch(0.92 0.04 60))"
    },
    {
      id: "bs", name: "Cantiere Brescia", address: "Via dei Mille 18, Brescia",
      type: "Cantiere edile", manager: "Vincenzo Russo",
      workers: 12, present: 11, compliance: 78,
      alerts: 1, nearMiss: 1, openAudit: { name: "In corso", days: 0 },
      bg: "linear-gradient(135deg, oklch(0.94 0.02 200), oklch(0.92 0.035 210))"
    },
    {
      id: "mi", name: "Sede legale — Milano", address: "Via Manzoni 24, 20121 Milano",
      type: "Uffici", manager: "Chiara Lombardi",
      workers: 8, present: 7, compliance: 95,
      alerts: 0, nearMiss: 0, openAudit: { name: "Semestrale", days: 12 },
      bg: "linear-gradient(135deg, oklch(0.95 0.018 150), oklch(0.93 0.03 155))"
    },
    {
      id: "bg", name: "Magazzino — Bergamo", address: "SP671, Treviglio (BG)",
      type: "Magazzino", manager: "—",
      workers: 5, present: 5, compliance: 88,
      alerts: 1, nearMiss: 0, openAudit: null,
      bg: "linear-gradient(135deg, oklch(0.94 0.022 40), oklch(0.92 0.035 35))"
    },
  ];

  const totalWorkers = sites.reduce((acc, s) => acc + s.workers, 0);
  const totalPresent = sites.reduce((acc, s) => acc + s.present, 0);
  const avgCompliance = Math.round(sites.reduce((acc, s) => acc + s.compliance, 0) / sites.length);

  return (
    <div className="fade-in" style={{ maxWidth: 1320, margin: "0 auto" }}>
      <div className="row between" style={{ marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 26 }}>Cantieri & sedi</h1>
          <p className="subtitle">Lo stato di sicurezza di ciascuna location, in tempo reale.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn"><Icon name="mapPin" size={13}/><span>Vista mappa</span></button>
          <button className="btn btn-primary"><Icon name="plus" size={13}/><span>Nuova sede</span></button>
        </div>
      </div>

      {/* Roll-up banner */}
      <div className="card" style={{
        marginBottom: 18,
        background: "linear-gradient(120deg, var(--bg-elev) 0%, var(--bg-tinted) 100%)",
        padding: 20,
      }}>
        <div className="row" style={{ gap: 28 }}>
          <RollupCell label="Sedi attive" value="4" caption="su 4 monitorate" icon="building"/>
          <Divider/>
          <RollupCell label="Persone in turno" value={`${totalPresent}/${totalWorkers}`} caption="aggiornato 5 min fa" icon="users" accent="info"/>
          <Divider/>
          <RollupCell label="Compliance media" value={`${avgCompliance}%`} caption="ponderata su persone" icon="shieldCheck" accent={avgCompliance >= 85 ? "ok" : "warn"}/>
          <Divider/>
          <RollupCell label="Alert aperti" value="5" caption="3 critici" icon="alertTriangle" accent="warn"/>
          <Divider/>
          <RollupCell label="Audit in corso" value="2" caption="da chiudere a breve" icon="clipboardCheck" accent="info"/>
        </div>
      </div>

      {/* Filters */}
      <div className="row" style={{ gap: 8, marginBottom: 14 }}>
        {["Tutte le sedi", "Cantieri", "Uffici", "Magazzini"].map((f, i) => (
          <button key={f} className="btn btn-sm" style={{
            background: i === 0 ? "var(--text)" : "transparent",
            color: i === 0 ? "var(--bg)" : "var(--text-soft)",
            borderColor: i === 0 ? "var(--text)" : "var(--border)"
          }}>{f}</button>
        ))}
        <div style={{ flex: 1 }}/>
        <span className="faint" style={{ fontSize: 12 }}>Ordina per:</span>
        <select className="select" style={{ width: 200, height: 30, fontSize: 12.5 }}>
          <option>Compliance crescente</option>
          <option>Compliance decrescente</option>
          <option>Numero persone</option>
        </select>
      </div>

      {/* Sites grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {sites.map(s => <SiteCard key={s.id} site={s}/>)}
      </div>
    </div>
  );
};

const Divider = () => <div style={{ width: 1, height: 40, background: "var(--border)" }}/>;

const RollupCell = ({ label, value, caption, icon, accent = "primary" }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <div style={{
      width: 38, height: 38, borderRadius: 10,
      background: accent === "primary" ? "var(--primary-soft)" : `var(--${accent}-soft)`,
      color: accent === "primary" ? "var(--primary-strong)" : `var(--${accent})`,
      display: "inline-flex", alignItems: "center", justifyContent: "center"
    }}>
      <Icon name={icon} size={17}/>
    </div>
    <div>
      <div className="faint" style={{ fontSize: 11.5 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, lineHeight: 1.1 }}>{value}</div>
      <div className="faint" style={{ fontSize: 11 }}>{caption}</div>
    </div>
  </div>
);

const SiteCard = ({ site }) => {
  const complianceColor = site.compliance >= 90 ? "ok" : site.compliance >= 75 ? "warn" : "danger";
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Header band */}
      <div style={{ padding: 18, background: site.bg, borderBottom: "1px solid var(--border)", position: "relative" }}>
        <div className="row between">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row" style={{ gap: 8, marginBottom: 4 }}>
              <span className="chip">{site.type}</span>
              {site.alerts > 0 && <span className="chip chip-warn"><Icon name="alertTriangle" size={10}/>{site.alerts} alert</span>}
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 4 }}>{site.name}</h3>
            <div className="row" style={{ gap: 6, color: "var(--text-soft)", fontSize: 12.5 }}>
              <Icon name="mapPin" size={12}/>
              <span>{site.address}</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon"><Icon name="more" size={14}/></button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "center", marginBottom: 16 }}>
          {/* Mini ring */}
          <div style={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
            <svg width="96" height="96" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="var(--bg-sunk)" strokeWidth="8"/>
              <circle cx="48" cy="48" r="40" fill="none"
                stroke={`var(--${complianceColor})`} strokeWidth="8"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - site.compliance / 100)}
                transform="rotate(-90 48 48)" strokeLinecap="round"/>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>{site.compliance}%</span>
              <span className="faint" style={{ fontSize: 10 }}>conforme</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <SiteStatLine label="In turno ora" value={`${site.present}/${site.workers}`} icon="users" accent="ok"/>
            <SiteStatLine label="Near-miss 7g" value={site.nearMiss} icon="alertTriangle" accent={site.nearMiss > 0 ? "warn" : "ok"}/>
            <SiteStatLine label="Responsabile" value={site.manager} icon="user"/>
            <SiteStatLine
              label="Prossimo audit"
              value={site.openAudit ? (site.openAudit.days === 0 ? "In corso" : site.openAudit.days < 0 ? `Scad. ${-site.openAudit.days}g fa` : `fra ${site.openAudit.days}g`) : "—"}
              icon="clipboardCheck"
              accent={site.openAudit?.days < 0 ? "danger" : "info"}
            />
          </div>
        </div>

        <div className="row" style={{ gap: 8, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          <button className="btn btn-sm" style={{ flex: 1 }}>Vedi dettagli</button>
          <button className="btn btn-sm">Avvia audit</button>
          <button className="btn btn-sm btn-ghost"><Icon name="bellRing" size={12}/></button>
        </div>
      </div>
    </div>
  );
};

const SiteStatLine = ({ label, value, icon, accent }) => (
  <div className="row" style={{ gap: 8 }}>
    <Icon name={icon} size={13} color={accent ? `var(--${accent})` : "var(--text-soft)"}/>
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <span className="faint" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
    </div>
  </div>
);

/* ============================================================
   A. COCKPIT (Cockpit version of the shipped dashboard, but
   condensed to fit alongside the others for comparison)
   ============================================================ */
const CockpitDashboard = () => {
  // Re-use existing Dashboard but pass no-op handlers
  return <Dashboard goto={() => {}} openExpiring={() => {}}/>;
};

Object.assign(window, { MiniShell, TriageDashboard, CalendarDashboard, SitesDashboard, CockpitDashboard });
