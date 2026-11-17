/* ============================================================
   SafeHub — Dashboard (panoramica RSPP)
   ============================================================ */

const Dashboard = ({ goto, openExpiring, openEmployee }) => {
  const { EXPIRING, ACTIVITY, EMPLOYEES, COURSES, NEAR_MISS, AUDIT_HISTORY, fmtDate, fmtDateShort, daysUntil } = window.SafeHubData;
  const ui = useUI();

  const totalEmployees = EMPLOYEES.length;
  const compliant = EMPLOYEES.filter((e) => e.compliance === "ok").length;
  const compliancePct = Math.round(100 * compliant / totalEmployees);
  const expiringSoon = EXPIRING.filter((e) => daysUntil(e.expires) <= 30 && daysUntil(e.expires) >= 0).length;
  const overdue = EXPIRING.filter((e) => daysUntil(e.expires) < 0).length;
  const trainingHoursMonth = 142;

  const exportMenu = (anchorEl) => ui.showMenu(anchorEl, [
    { header: "Esportazioni rapide" },
    { label: "Scadenziario consolidato",    icon: "calendar",       onClick: () => ui.toast("Scadenziario PDF in preparazione…", { kind: "ok" }) },
    { label: "Stato formazione (XLSX)",     icon: "graduation",     onClick: () => ui.toast("Export formazione avviato", { kind: "ok" }) },
    { label: "Registro infortuni",          icon: "alertTriangle",  onClick: () => ui.toast("Registro infortuni in preparazione…", { kind: "ok" }) },
    { label: "Pacchetto ispezione ASL/ITL", icon: "shieldCheck",    onClick: () => ui.toast("Stiamo preparando il pacchetto ZIP…", { kind: "ok" }) },
    { divider: true },
    { label: "Vai a tutti i report",        icon: "barChart",       onClick: () => goto("report") },
  ], { align: "right", minWidth: 240 });

  const newActionMenu = (anchorEl) => ui.showMenu(anchorEl, [
    { header: "Crea" },
    { label: "Nuovo dipendente",        icon: "user",           onClick: () => ui.showForm({
        title: "Nuovo dipendente",
        intro: "Aggiungi un dipendente all'organico. Potrai assegnare formazione e DPI in un secondo momento.",
        fields: [
          { label: "Nome e cognome", placeholder: "es. Mario Rossi" },
          { label: "Email aziendale", type: "email", placeholder: "m.rossi@tretorri.it" },
          { label: "Mansione", placeholder: "es. Carpentiere" },
          { label: "Area / cantiere", type: "select", options: ["Cantiere A14", "Cantiere Brescia", "Ufficio tecnico", "Amministrazione", "Direzione"] },
          { label: "Data assunzione", type: "date" },
        ],
        submitLabel: "Aggiungi dipendente",
        onSubmit: () => ui.toast("Dipendente creato. Lo trovi nella lista.", { kind: "ok" }),
      }) },
    { label: "Carica documento",        icon: "upload",         onClick: () => { goto("documenti"); ui.toast("Apri \"Carica documenti\" in alto a destra"); } },
    { label: "Pianifica corso",         icon: "graduation",     onClick: () => goto("formazione") },
    { label: "Avvia audit",             icon: "clipboardCheck", onClick: () => goto("audit") },
    { label: "Aggiungi scadenza",       icon: "calendar",       onClick: () => goto("scadenze") },
    { divider: true },
    { label: "Invita utente al workspace", icon: "mail",        onClick: () => ui.showForm({
        title: "Invita un utente",
        intro: "L'utente riceverà un'email per attivare il proprio accesso a SafeHub.",
        fields: [
          { label: "Email", type: "email", placeholder: "nome@azienda.it" },
          { label: "Ruolo", type: "select", options: ["RSPP", "HR", "Admin azienda", "Direzione", "Lavoratore (solo app mobile)"] },
          { label: "Messaggio (opzionale)", type: "textarea", placeholder: "Ciao, ti invito a usare SafeHub per gestire…" },
        ],
        submitLabel: "Invia invito",
        onSubmit: () => ui.toast("Invito inviato", { kind: "ok" }),
      }) },
  ], { align: "right", minWidth: 240 });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="row" style={{ gap: 10, marginBottom: 6 }}>
            <span className="faint" style={{ fontSize: 13 }}>Lunedì 25 maggio 2026</span>
            <span className="chip chip-ok"><Icon name="shieldCheck" size={10} />Compliance buona</span>
          </div>
          <h1>Buongiorno Anna</h1>
          <p className="subtitle">
            Hai <strong>{expiringSoon} scadenze</strong> nei prossimi 30 giorni e {overdue > 0 ? <span style={{ color: "var(--danger)" }}>{overdue} elemento già scaduto</span> : "nessun arretrato"}.
          </p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button onClick={(e) => exportMenu(e.currentTarget)} className="btn">
            <Icon name="download" size={14} /><span>Esporta report</span><Icon name="chevronDown" size={12}/>
          </button>
          <button onClick={(e) => newActionMenu(e.currentTarget)} className="btn btn-primary">
            <Icon name="plus" size={14} /><span>Nuova azione</span><Icon name="chevronDown" size={12}/>
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="stat-grid">
        <StatCard label="Compliance complessiva"
          value={`${compliancePct}%`}
          delta="+4% vs mese scorso"
          accent="ok"
          icon="shieldCheck"
          onClick={() => goto("dipendenti")} />

        <StatCard
          label="Scadenze nei prossimi 30g"
          value={expiringSoon}
          delta={`${overdue} già scaduta`}
          accent={overdue > 0 ? "danger" : "warn"}
          icon="clock"
          onClick={() => goto("scadenze")} />

        <StatCard
          label="Ore di formazione (mese)"
          value={trainingHoursMonth}
          delta="su 180 pianificate"
          accent="info"
          icon="graduation"
          progress={trainingHoursMonth / 180}
          onClick={() => goto("formazione")} />

        <StatCard
          label="Near-miss aperti"
          value={NEAR_MISS.length}
          delta="ultimi 7 giorni"
          accent="warn"
          icon="alertTriangle"
          onClick={() => ui.openNearMiss(NEAR_MISS[0])} />
      </div>

      {/* Main grid */}
      <div className="dash-grid">
        <div className="col" style={{ gap: 16 }}>
          <ExpiringPanel openExpiring={openExpiring} goto={goto} />
          <ComplianceByDept goto={goto} />
          <RecentAudits goto={goto} />
        </div>
        <div className="col" style={{ gap: 16 }}>
          <TrainingProgress goto={goto} />
          <NearMissPanel />
          <ActivityFeed openEmployee={openEmployee} goto={goto}/>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, delta, accent = "info", icon, progress, onClick }) => {
  return (
    <div className="stat-card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default", transition: "transform 0.1s, box-shadow 0.1s" }}
         onMouseEnter={onClick ? (e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; } : undefined}
         onMouseLeave={onClick ? (e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; } : undefined}>
      <div className="row between">
        <span className="label">{label}</span>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: `var(--${accent}-soft)`, color: `var(--${accent})`,
          display: "inline-flex", alignItems: "center", justifyContent: "center"
        }}>
          <Icon name={icon} size={14} />
        </div>
      </div>
      <div className="value mono">{value}</div>
      <div className="delta">{delta}</div>
      {progress !== undefined &&
        <div className="progress" style={{ marginTop: 6 }}>
          <span style={{ width: `${progress * 100}%`, background: `var(--${accent})` }} />
        </div>
      }
    </div>
  );
};

const ExpiringPanel = ({ openExpiring, goto }) => {
  const { EXPIRING, fmtDate, daysUntil } = window.SafeHubData;
  const ui = useUI();
  const [filter, setFilter] = React.useState("all");
  const filtered = EXPIRING
    .filter((e) => filter === "all" || e.type.toLowerCase().includes(filter))
    .sort((a, b) => new Date(a.expires) - new Date(b.expires))
    .slice(0, 7);

  const rowMenu = (e, anchorEl, item) => {
    e.stopPropagation();
    ui.showMenu(anchorEl, [
      { label: "Apri dettaglio",          icon: "eye",     onClick: () => openExpiring(item) },
      { label: "Segna come rinnovata",    icon: "check",   onClick: () => ui.toast(`"${item.title}" segnata come rinnovata`, { kind: "ok" }) },
      { label: "Invia promemoria",        icon: "mail",    onClick: () => ui.toast("Promemoria inviato via email", { kind: "ok" }) },
      { label: "Assegna responsabile",    icon: "user",    onClick: () => ui.toast("Apertura selezione responsabile…") },
      { divider: true },
      { label: "Posticipa di 7 giorni",   icon: "clock",   onClick: () => ui.toast("Scadenza posticipata di 7 giorni") },
      { label: "Rimuovi dalla lista",     icon: "trash",   danger: true, onClick: () => ui.confirm({
          title: "Rimuovere questa scadenza?",
          body: "L'elemento sarà rimosso dal scadenziario. Puoi sempre ripristinarlo dalle attività recenti.",
          confirmLabel: "Rimuovi", danger: true,
          action: () => ui.toast("Scadenza rimossa")
        }) },
    ], { align: "right" });
  };

  return (
    <section className="card card-flush">
      <div className="row between" style={{ padding: "16px 20px 8px" }}>
        <div>
          <h3>Scadenze imminenti</h3>
          <div className="faint" style={{ fontSize: 12 }}>Ordinato per data di scadenza</div>
        </div>
        <div className="row" style={{ gap: 4 }}>
          {["all", "formazione", "documento", "certificato"].map((f) =>
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="btn btn-sm"
              style={{
                background: filter === f ? "var(--primary-soft)" : "transparent",
                color: filter === f ? "var(--primary-strong)" : "var(--text-soft)",
                border: filter === f ? "1px solid var(--primary-soft)" : "1px solid transparent",
                textTransform: "capitalize"
              }}>
              {f === "all" ? "Tutte" : f}
            </button>
          )}
        </div>
      </div>
      <hr className="divider" />
      <div>
        {filtered.map((e) => {
          const days = daysUntil(e.expires);
          const accent = days < 0 ? "danger" : days <= 7 ? "danger" : days <= 15 ? "warn" : "info";
          const chipClass = days < 0 ? "chip-danger" : days <= 7 ? "chip-danger" : days <= 15 ? "chip-warn" : "chip-info";
          return (
            <div
              key={e.id}
              onClick={() => openExpiring && openExpiring(e)}
              className="row"
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid var(--border)",
                gap: 14,
                cursor: "pointer"
              }}
              onMouseEnter={(el) => el.currentTarget.style.background = "var(--bg-sunk)"}
              onMouseLeave={(el) => el.currentTarget.style.background = "transparent"}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: `var(--${accent}-soft)`, color: `var(--${accent})`,
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Icon name={e.type === "Formazione" ? "graduation" : e.type === "Documento" ? "fileText" : e.type === "Visita medica" ? "shieldCheck" : "shield"} size={16} />
              </div>
              <div className="grow col" style={{ gap: 4, minWidth: 0 }}>
                <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{e.title}</span>
                  <span className="chip" style={{ background: "var(--bg-sunk)" }}>{e.type}</span>
                </div>
                <div className="faint" style={{ fontSize: 12 }}>
                  {e.employee || "Documento aziendale"} · scade il <span className="mono">{fmtDate(e.expires)}</span>
                </div>
              </div>
              <div className="col" style={{ alignItems: "flex-end", gap: 4, minWidth: 110, flexShrink: 0 }}>
                <span className={`chip ${chipClass}`}>
                  {days < 0 ? `scaduta da ${-days}g` : days === 0 ? "scade oggi" : `fra ${days} giorni`}
                </span>
              </div>
              <button onClick={(ev) => rowMenu(ev, ev.currentTarget, e)} className="btn btn-ghost btn-icon" style={{ width: 26, height: 26 }}>
                <Icon name="more" size={14} color="var(--text-faint)"/>
              </button>
            </div>
          );
        })}
      </div>
      <div className="row between" style={{ padding: "12px 20px", background: "var(--bg-sunk)" }}>
        <span className="faint" style={{ fontSize: 12 }}>Mostro {filtered.length} di {EXPIRING.length}</span>
        <button className="btn btn-sm btn-ghost" onClick={() => goto("scadenze")}>
          <span>Vedi tutte le scadenze</span>
          <Icon name="arrowRight" size={12} />
        </button>
      </div>
    </section>
  );
};

const ComplianceByDept = ({ goto }) => {
  const ui = useUI();
  const data = [
    { dept: "Direzione",        count: 2, pct: 100, color: "ok" },
    { dept: "Ufficio tecnico",  count: 2, pct: 92,  color: "ok" },
    { dept: "Amministrazione",  count: 1, pct: 95,  color: "ok" },
    { dept: "Cantiere A14",     count: 5, pct: 64,  color: "warn" },
    { dept: "Cantiere Brescia", count: 5, pct: 78,  color: "ok" },
  ];
  return (
    <section className="card">
      <div className="row between" style={{ marginBottom: 16 }}>
        <div>
          <h3>Compliance per area</h3>
          <div className="faint" style={{ fontSize: 12 }}>% di dipendenti pienamente in regola</div>
        </div>
        <button onClick={() => goto("dipendenti")} className="btn btn-sm btn-ghost">
          <span>Vedi dipendenti</span><Icon name="arrowRight" size={11}/>
        </button>
      </div>
      <div className="col" style={{ gap: 12 }}>
        {data.map((d) =>
          <button
            key={d.dept}
            onClick={() => { goto("dipendenti"); ui.toast(`Filtro per "${d.dept}"`); }}
            className="col"
            style={{ width: "100%", padding: "8px 10px", borderRadius: 6, background: "transparent", textAlign: "left", margin: "-8px -10px" }}
            onMouseEnter={(el) => el.currentTarget.style.background = "var(--bg-sunk)"}
            onMouseLeave={(el) => el.currentTarget.style.background = "transparent"}>
            <div className="row between" style={{ marginBottom: 4, width: "100%" }}>
              <div className="row" style={{ gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{d.dept}</span>
                <span className="faint" style={{ fontSize: 12 }}>{d.count} dip.</span>
              </div>
              <span className="mono" style={{ fontSize: 13, fontWeight: 500, color: `var(--${d.color})` }}>{d.pct}%</span>
            </div>
            <div className="progress" style={{ width: "100%" }}>
              <span style={{ width: `${d.pct}%`, background: `var(--${d.color})` }} />
            </div>
          </button>
        )}
      </div>
    </section>
  );
};

const TrainingProgress = ({ goto }) => {
  const { COURSES, fmtDate, daysUntil } = window.SafeHubData;
  const ui = useUI();
  return (
    <section className="card">
      <div className="row between" style={{ marginBottom: 14 }}>
        <h3>Formazione in corso</h3>
        <button className="btn btn-sm btn-ghost" onClick={() => goto("formazione")}>
          <span>Tutto</span><Icon name="arrowRight" size={11} />
        </button>
      </div>
      <div className="col" style={{ gap: 6 }}>
        {COURSES.slice(0, 3).map((c) => {
          const pct = c.participants > 0 ? c.completed / c.participants : 0;
          const days = daysUntil(c.deadline);
          return (
            <button
              key={c.id}
              onClick={() => ui.openCourse(c)}
              className="col"
              style={{ width: "100%", padding: 10, borderRadius: 8, background: "transparent", textAlign: "left", gap: 4, margin: 0, border: "1px solid transparent" }}
              onMouseEnter={(el) => { el.currentTarget.style.background = "var(--bg-sunk)"; el.currentTarget.style.borderColor = "var(--border)"; }}
              onMouseLeave={(el) => { el.currentTarget.style.background = "transparent"; el.currentTarget.style.borderColor = "transparent"; }}>
              <div className="row between" style={{ width: "100%" }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{c.title}</div>
                <span className="mono faint" style={{ fontSize: 12 }}>{c.completed}/{c.participants}</span>
              </div>
              <div className="progress" style={{ width: "100%" }}>
                <span style={{ width: `${pct * 100}%` }} />
              </div>
              <div className="row between" style={{ width: "100%" }}>
                <span className="faint" style={{ fontSize: 11.5 }}>{c.modality}</span>
                <span className={`chip ${days < 0 ? "chip-danger" : days < 14 ? "chip-warn" : ""}`}
                      style={{ height: 18, fontSize: 10.5 }}>
                  {days < 0 ? `scaduto ${-days}g fa` : days === 0 ? "oggi" : `fra ${days}g`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

const NearMissPanel = () => {
  const { NEAR_MISS, fmtDateShort } = window.SafeHubData;
  const ui = useUI();
  return (
    <section className="card">
      <div className="row between" style={{ marginBottom: 12 }}>
        <h3>Segnalazioni dal campo</h3>
        <span className="chip chip-warn">{NEAR_MISS.length} aperte</span>
      </div>
      <div className="col" style={{ gap: 8 }}>
        {NEAR_MISS.map((n) =>
          <button
            key={n.id}
            onClick={() => ui.openNearMiss(n)}
            className="row"
            style={{
              gap: 10,
              padding: 10,
              background: "var(--bg-sunk)",
              borderRadius: 8,
              border: "1px solid transparent",
              width: "100%",
              textAlign: "left",
              cursor: "pointer"
            }}
            onMouseEnter={(el) => el.currentTarget.style.borderColor = "var(--border-strong)"}
            onMouseLeave={(el) => el.currentTarget.style.borderColor = "transparent"}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: n.severity === "alta" ? "var(--danger-soft)" : n.severity === "media" ? "var(--warn-soft)" : "var(--info-soft)",
              color: n.severity === "alta" ? "var(--danger)" : n.severity === "media" ? "var(--warn)" : "var(--info)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <Icon name="alertTriangle" size={14} />
            </div>
            <div className="grow col" style={{ gap: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{n.desc}</div>
              <div className="faint" style={{ fontSize: 11.5 }}>
                {n.who} · {n.site} · {fmtDateShort(n.when)}
              </div>
            </div>
            <Icon name="chevronRight" size={13} color="var(--text-faint)" />
          </button>
        )}
      </div>
    </section>
  );
};

const RecentAudits = ({ goto }) => {
  const { AUDIT_HISTORY, fmtDate } = window.SafeHubData;
  const ui = useUI();
  return (
    <section className="card card-flush">
      <div className="row between" style={{ padding: "16px 20px 8px" }}>
        <h3>Audit recenti</h3>
        <button className="btn btn-sm btn-ghost" onClick={() => goto("audit")}>
          <span>Tutto</span><Icon name="arrowRight" size={11} />
        </button>
      </div>
      <hr className="divider" />
      <table className="table">
        <thead>
          <tr>
            <th>Audit</th><th>Sede</th><th>Data</th><th>Stato</th><th>Score</th>
          </tr>
        </thead>
        <tbody>
          {AUDIT_HISTORY.slice(0, 4).map((a) =>
            <tr key={a.id} onClick={() => ui.openAudit(a)}>
              <td style={{ fontWeight: 500 }}>{a.template}</td>
              <td className="muted">{a.site}</td>
              <td className="mono muted">{fmtDate(a.date)}</td>
              <td>
                {a.status === "completato"
                  ? <span className="chip chip-ok"><Icon name="check" size={10} />Completato</span>
                  : <span className="chip chip-warn"><Icon name="clock" size={10} />In corso</span>}
              </td>
              <td>
                {a.score !== null
                  ? <span className="mono" style={{ fontWeight: 600, color: a.score >= 90 ? "var(--ok)" : a.score >= 75 ? "var(--warn)" : "var(--danger)" }}>{a.score}/100</span>
                  : <span className="faint">—</span>}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

const ActivityFeed = ({ openEmployee, goto }) => {
  const { ACTIVITY, EMPLOYEES, NEAR_MISS, DOCUMENTS, AUDIT_HISTORY } = window.SafeHubData;
  const ui = useUI();
  const iconFor = (t) => ({
    checkin:  { name: "check",         color: "ok" },
    nearmiss: { name: "alertTriangle", color: "warn" },
    upload:   { name: "upload",        color: "info" },
    alert:    { name: "mail",          color: "info" },
    audit:    { name: "clipboardCheck",color: "ok" },
    training: { name: "graduation",    color: "primary" }
  })[t] || { name: "spark", color: "info" };

  const handleClick = (a) => {
    if (a.type === "nearmiss") return ui.openNearMiss(NEAR_MISS[0]);
    if (a.type === "audit")    return ui.openAudit(AUDIT_HISTORY.find(h => h.by === a.who) || AUDIT_HISTORY[0]);
    if (a.type === "upload")   return ui.openDocument(DOCUMENTS[0]);
    if (a.type === "alert")    return goto("alert");
    if (a.type === "training") {
      const emp = EMPLOYEES.find(e => e.name === a.who);
      if (emp) return openEmployee(emp);
    }
    if (a.type === "checkin") {
      const emp = EMPLOYEES.find(e => e.name === a.who);
      if (emp) return openEmployee(emp);
    }
    ui.toast(`Apertura: ${a.what}`);
  };

  return (
    <section className="card">
      <div className="row between" style={{ marginBottom: 12 }}>
        <h3>Attività recente</h3>
        <button
          onClick={(e) => ui.showMenu(e.currentTarget, [
            { label: "Filtra: tutto", icon: "filter", onClick: () => {} },
            { label: "Solo check-in",  icon: "check",  onClick: () => ui.toast("Filtro: solo check-in") },
            { label: "Solo near-miss", icon: "alertTriangle", onClick: () => ui.toast("Filtro: solo near-miss") },
            { label: "Solo documenti", icon: "upload", onClick: () => ui.toast("Filtro: solo documenti") },
            { divider: true },
            { label: "Esporta log attività CSV", icon: "download", onClick: () => ui.toast("Export CSV avviato", { kind: "ok" }) },
          ], { align: "right" })}
          className="btn btn-ghost btn-icon"
          style={{ width: 26, height: 26 }}>
          <Icon name="more" size={14} color="var(--text-faint)" />
        </button>
      </div>
      <div className="col" style={{ gap: 0, position: "relative" }}>
        {ACTIVITY.map((a, i) => {
          const ic = iconFor(a.type);
          return (
            <button
              key={i}
              onClick={() => handleClick(a)}
              className="row"
              style={{ gap: 10, padding: "8px 6px", alignItems: "flex-start", margin: "0 -6px", borderRadius: 6, background: "transparent", textAlign: "left", width: "calc(100% + 12px)" }}
              onMouseEnter={(el) => el.currentTarget.style.background = "var(--bg-sunk)"}
              onMouseLeave={(el) => el.currentTarget.style.background = "transparent"}>
              <div style={{ position: "relative", flexShrink: 0, paddingTop: 2 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: ic.color === "primary" ? "var(--primary-soft)" : `var(--${ic.color}-soft)`,
                  color: ic.color === "primary" ? "var(--primary-strong)" : `var(--${ic.color})`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Icon name={ic.name} size={12} />
                </div>
                {i < ACTIVITY.length - 1 &&
                  <div style={{ position: "absolute", left: 11, top: 28, bottom: -8, width: 2, background: "var(--border)" }} />
                }
              </div>
              <div className="grow col" style={{ gap: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13 }}><strong>{a.who}</strong> {a.what}</div>
                <div className="faint" style={{ fontSize: 11.5 }}>{a.when}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

Object.assign(window, { Dashboard });
