/* ============================================================
   SafeHub — Dipendenti (lista + dettaglio drawer)
   ============================================================ */

const Employees = ({ openEmployee }) => {
  const { EMPLOYEES } = window.SafeHubData;
  const ui = useUI();
  const [search, setSearch] = React.useState("");
  const [dept, setDept] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sort, setSort] = React.useState("name");

  const depts = Array.from(new Set(EMPLOYEES.map(e => e.dept)));
  const filtered = EMPLOYEES
    .filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase()))
    .filter(e => dept === "all" || e.dept === dept)
    .filter(e => statusFilter === "all" || e.compliance === statusFilter)
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "training") return b.training - a.training;
      if (sort === "expiring") return b.expiring - a.expiring;
      return 0;
    });

  const stats = {
    total: EMPLOYEES.length,
    ok: EMPLOYEES.filter(e => e.compliance === "ok").length,
    warn: EMPLOYEES.filter(e => e.compliance === "warn").length,
    danger: EMPLOYEES.filter(e => e.compliance === "danger").length,
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>Dipendenti</h1>
          <p className="subtitle">Anagrafica, documentazione e stato formazione di {stats.total} dipendenti.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn" onClick={() => ui.showForm({
            title: "Importa dipendenti da CSV",
            intro: "Carica un CSV con colonne: nome, email, mansione, area, data assunzione. Scarica il template per partire.",
            fields: [
              { label: "File CSV", type: "text", placeholder: "Trascina qui o clicca per scegliere…" },
              { label: "Comportamento per duplicati", type: "select", options: ["Salta se email già presente", "Aggiorna i campi esistenti", "Crea sempre un nuovo record"] },
            ],
            submitLabel: "Importa",
            onSubmit: () => ui.toast("Importazione avviata: 0 di 15 elaborati", { kind: "ok" }),
          })}><Icon name="upload" size={14}/><span>Importa CSV</span></button>
          <button className="btn btn-primary" onClick={() => ui.showForm({
            title: "Nuovo dipendente",
            intro: "Aggiungi un dipendente all'organico. La formazione verrà assegnata automaticamente in base al ruolo.",
            fields: [
              { label: "Nome e cognome", placeholder: "es. Mario Rossi" },
              { label: "Email aziendale", type: "email", placeholder: "m.rossi@tretorri.it" },
              { label: "Mansione", placeholder: "es. Carpentiere" },
              { label: "Area / cantiere", type: "select", options: ["Cantiere A14", "Cantiere Brescia", "Ufficio tecnico", "Amministrazione", "Direzione"] },
              { label: "Data assunzione", type: "date" },
              { label: "Telefono", placeholder: "+39 ..." },
            ],
            submitLabel: "Aggiungi dipendente",
            onSubmit: () => ui.toast("Dipendente aggiunto", { kind: "ok" }),
          })}><Icon name="plus" size={14}/><span>Nuovo dipendente</span></button>
        </div>
      </div>

      <div className="row" style={{ gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <FilterPill active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
          <span>Tutti</span><span className="count">{stats.total}</span>
        </FilterPill>
        <FilterPill active={statusFilter === "ok"} onClick={() => setStatusFilter("ok")} accent="ok">
          <span>In regola</span><span className="count">{stats.ok}</span>
        </FilterPill>
        <FilterPill active={statusFilter === "warn"} onClick={() => setStatusFilter("warn")} accent="warn">
          <span>Da aggiornare</span><span className="count">{stats.warn}</span>
        </FilterPill>
        <FilterPill active={statusFilter === "danger"} onClick={() => setStatusFilter("danger")} accent="danger">
          <span>Critici</span><span className="count">{stats.danger}</span>
        </FilterPill>
      </div>

      <div className="row" style={{ gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div className="search grow">
          <Icon name="search" size={14} color="var(--text-faint)"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per nome o ruolo…"/>
        </div>
        <select className="select" style={{ width: 200 }} value={dept} onChange={e => setDept(e.target.value)}>
          <option value="all">Tutte le aree</option>
          {depts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="select" style={{ width: 180 }} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="name">Ordina per nome</option>
          <option value="training">% formazione</option>
          <option value="expiring">Scadenze attive</option>
        </select>
        <button className="btn" onClick={(ev) => ui.showMenu(ev.currentTarget, [
          { header: "Stato compliance" },
          { label: "In regola",       icon: "check",          onClick: () => {} },
          { label: "Da aggiornare",   icon: "clock",          onClick: () => {} },
          { label: "Critici",         icon: "alertTriangle",  onClick: () => {} },
          { divider: true },
          { header: "Anzianità" },
          { label: "Assunti < 1 anno", icon: "user",          onClick: () => {} },
          { label: "Assunti > 5 anni", icon: "user",          onClick: () => {} },
          { divider: true },
          { header: "Formazione" },
          { label: "Sotto al 50%",    icon: "graduation",     onClick: () => {} },
          { label: "100% completa",   icon: "graduation",     onClick: () => {} },
        ], { align: "right" })}><Icon name="filter" size={14}/><span>Più filtri</span></button>
      </div>

      <div className="card card-flush">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 28 }}><input type="checkbox"/></th>
              <th>Dipendente</th>
              <th>Ruolo · Area</th>
              <th>Compliance</th>
              <th>Formazione</th>
              <th>Scadenze</th>
              <th>Assunzione</th>
              <th style={{ width: 28 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} onClick={() => openEmployee(e)}>
                <td onClick={ev => ev.stopPropagation()}><input type="checkbox"/></td>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <div className="avatar">{initials(e.name)}</div>
                    <div className="col" style={{ gap: 1 }}>
                      <div style={{ fontWeight: 500 }}>{e.name}</div>
                      <div className="faint mono" style={{ fontSize: 11.5 }}>{e.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="col" style={{ gap: 1 }}>
                    <div>{e.role}</div>
                    <div className="faint" style={{ fontSize: 12 }}>{e.dept}</div>
                  </div>
                </td>
                <td>
                  <ComplianceChip status={e.compliance}/>
                </td>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <div className="progress" style={{ width: 80 }}>
                      <span style={{ width: `${e.training * 100}%`, background: e.training >= 0.9 ? "var(--ok)" : e.training >= 0.5 ? "var(--warn)" : "var(--danger)" }}/>
                    </div>
                    <span className="mono" style={{ fontSize: 12, color: "var(--text-soft)" }}>{Math.round(e.training * 100)}%</span>
                  </div>
                </td>
                <td>
                  {e.expiring > 0
                    ? <span className={`chip ${e.expiring >= 3 ? "chip-danger" : "chip-warn"}`}>{e.expiring} in scadenza</span>
                    : <span className="chip chip-ok"><Icon name="check" size={10}/>OK</span>}
                </td>
                <td className="mono muted" style={{ fontSize: 12 }}>{new Date(e.hire).toLocaleDateString("it-IT")}</td>
                <td onClick={ev => ev.stopPropagation()}>
                  <button onClick={(ev) => ui.showMenu(ev.currentTarget, [
                    { label: "Apri profilo",         icon: "eye",         onClick: () => openEmployee(e) },
                    { label: "Modifica anagrafica",  icon: "pencil",      onClick: () => ui.toast("Apertura modifica…") },
                    { label: "Assegna formazione",   icon: "graduation",  onClick: () => ui.toast("Apertura assegnazione corso…") },
                    { label: "Carica documento per…",icon: "upload",      onClick: () => ui.toast("Apertura caricamento…") },
                    { divider: true },
                    { label: "Rimuovi dall'organico", icon: "trash", danger: true, onClick: () => ui.confirm({
                        title: `Rimuovere ${e.name}?`,
                        body: "La persona verrà archiviata. Documenti e attestati restano nel registro storico.",
                        confirmLabel: "Archivia", danger: true,
                        action: () => ui.toast(`${e.name} archiviato`)
                      }) },
                  ], { align: "right" })} className="btn btn-ghost btn-icon" style={{ width: 26, height: 26 }}>
                    <Icon name="more" size={14} color="var(--text-faint)"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row between" style={{ marginTop: 14, padding: "0 4px" }}>
        <span className="faint" style={{ fontSize: 12.5 }}>Mostro {filtered.length} di {EMPLOYEES.length} dipendenti</span>
        {EMPLOYEES.length > 15 && (
          <div className="row" style={{ gap: 4 }}>
            <button className="btn btn-sm" disabled><Icon name="chevronLeft" size={12}/></button>
            <button className="btn btn-sm" style={{ background: "var(--primary)", color: "var(--primary-on)", borderColor: "var(--primary)" }}>1</button>
            <button className="btn btn-sm" onClick={() => ui.toast("Pagina 2 (demo)")}>2</button>
            <button className="btn btn-sm" onClick={() => ui.toast("Pagina successiva")}><Icon name="chevronRight" size={12}/></button>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterPill = ({ active, onClick, accent, children }) => {
  return (
    <button onClick={onClick} className="row" style={{
      gap: 8, padding: "6px 12px", borderRadius: 999,
      border: `1px solid ${active ? "var(--text)" : "var(--border)"}`,
      background: active ? "var(--text)" : "var(--bg-elev)",
      color: active ? "var(--bg)" : "var(--text-soft)",
      fontSize: 12.5, fontWeight: 500,
    }}>
      {accent && !active && <span style={{ width: 8, height: 8, borderRadius: 999, background: `var(--${accent})` }}/>}
      {children}
    </button>
  );
};

const ComplianceChip = ({ status }) => {
  const map = {
    ok: { cls: "chip-ok", label: "In regola", icon: "check" },
    warn: { cls: "chip-warn", label: "Da aggiornare", icon: "clock" },
    danger: { cls: "chip-danger", label: "Critico", icon: "alertTriangle" },
  };
  const c = map[status];
  return <span className={`chip ${c.cls}`}><Icon name={c.icon} size={10}/>{c.label}</span>;
};

const initials = (name) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

// ============== Employee Drawer ==============
const EmployeeDrawer = ({ employee, onClose }) => {
  const { fmtDate, daysUntil, EXPIRING, TRAININGS } = window.SafeHubData;
  const ui = useUI();
  const [tab, setTab] = React.useState("overview");

  if (!employee) return null;

  const empExpiring = EXPIRING.filter(x => x.emp_id === employee.id);
  const employeeTrainings = [
    { id: 1, name: "Formazione base lavoratori",       hours: 8,  completed: "2024-03-10", expires: daysUntil(daysUntil(0)) },
    { id: 2, name: "Antincendio rischio medio",        hours: 8,  completed: "2023-06-22", expires: 90 },
    { id: 3, name: "Primo soccorso (gruppo A)",        hours: 16, completed: "2024-01-15", expires: 240 },
    { id: 4, name: "Patentino carrelli elevatori",     hours: 12, completed: "2021-04-08", expires: 6 },
    { id: 5, name: "DPI III categoria — anticaduta",   hours: 8,  completed: null, expires: -1 },
  ];

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="row between" style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div className="row" style={{ gap: 14 }}>
            <div className="avatar avatar-lg">{initials(employee.name)}</div>
            <div className="col" style={{ gap: 4 }}>
              <div className="row" style={{ gap: 8 }}>
                <h2 style={{ fontSize: 20 }}>{employee.name}</h2>
                <ComplianceChip status={employee.compliance}/>
              </div>
              <div className="faint" style={{ fontSize: 13 }}>
                {employee.role} · {employee.dept} · in azienda dal {new Date(employee.hire).getFullYear()}
              </div>
            </div>
          </div>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn" onClick={() => ui.showForm({
              title: `Modifica ${employee.name}`,
              fields: [
                { label: "Nome e cognome", default: employee.name },
                { label: "Email aziendale", default: employee.email, type: "email" },
                { label: "Telefono", default: employee.phone },
                { label: "Mansione", default: employee.role },
                { label: "Area / cantiere", type: "select", options: ["Cantiere A14", "Cantiere Brescia", "Ufficio tecnico", "Amministrazione", "Direzione"], default: employee.dept },
              ],
              submitLabel: "Salva modifiche",
              onSubmit: () => ui.toast("Anagrafica aggiornata", { kind: "ok" }),
            })}><Icon name="pencil" size={13}/><span>Modifica</span></button>
            <button onClick={(e) => ui.showMenu(e.currentTarget, [
              { label: "Assegna formazione",  icon: "graduation", onClick: () => ui.toast("Apertura assegnazione corso…") },
              { label: "Carica documento",    icon: "upload",     onClick: () => ui.toast("Apertura caricamento documento…") },
              { label: "Invia messaggio",     icon: "mail",       onClick: () => ui.toast("Apertura nuovo messaggio…") },
              { divider: true },
              { label: "Esporta scheda PDF",  icon: "download",   onClick: () => ui.toast("PDF in preparazione…", { kind: "ok" }) },
              { label: "Archivia",            icon: "trash", danger: true, onClick: () => ui.confirm({
                  title: `Archiviare ${employee.name}?`,
                  body: "Verrà rimosso dall'organico attivo ma resterà nel registro storico.",
                  confirmLabel: "Archivia", danger: true,
                  action: () => { ui.toast(`${employee.name} archiviato`); onClose(); }
                }) },
            ], { align: "right" })} className="btn btn-ghost btn-icon"><Icon name="more" size={16}/></button>
            <button onClick={onClose} className="btn btn-ghost btn-icon"><Icon name="x" size={16}/></button>
          </div>
        </div>

        <div className="row" style={{ padding: "0 24px", gap: 24, borderBottom: "1px solid var(--border)" }}>
          {["overview", "formazione", "documenti", "timeline"].map(t => (
            <button key={t} onClick={() => setTab(t)} className="tab" style={{ padding: "12px 0" }}
              data-active={tab === t}>
              <span style={{
                color: tab === t ? "var(--text)" : "var(--text-soft)",
                borderBottom: tab === t ? "2px solid var(--primary)" : "2px solid transparent",
                paddingBottom: 12, display: "inline-block", textTransform: "capitalize"
              }}>{t === "overview" ? "Panoramica" : t}</span>
            </button>
          ))}
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: 24 }}>
          {tab === "overview" && (
            <div className="col" style={{ gap: 18 }}>
              <div className="card">
                <h4 style={{ marginBottom: 14 }}>Contatti</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <InfoRow icon="mail" label="Email" value={employee.email}/>
                  <InfoRow icon="phone" label="Telefono" value={employee.phone}/>
                  <InfoRow icon="briefcase" label="Mansione" value={employee.role}/>
                  <InfoRow icon="building" label="Area" value={employee.dept}/>
                </div>
              </div>

              <div className="card">
                <div className="row between" style={{ marginBottom: 14 }}>
                  <h4>Stato compliance</h4>
                  <ComplianceChip status={employee.compliance}/>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  <MiniStat label="Formazione" value={`${Math.round(employee.training * 100)}%`} accent={employee.training >= 0.9 ? "ok" : employee.training >= 0.5 ? "warn" : "danger"}/>
                  <MiniStat label="Scadenze attive" value={employee.expiring} accent={employee.expiring === 0 ? "ok" : employee.expiring >= 3 ? "danger" : "warn"}/>
                  <MiniStat label="Visita medica" value="OK" sub="fra 240g" accent="ok"/>
                </div>
              </div>

              {empExpiring.length > 0 && (
                <div className="card">
                  <h4 style={{ marginBottom: 10 }}>Scadenze imminenti per {employee.name.split(" ")[0]}</h4>
                  <div className="col" style={{ gap: 6 }}>
                    {empExpiring.map(e => {
                      const d = daysUntil(e.expires);
                      return (
                        <div key={e.id} className="row" style={{ padding: "10px 12px", background: "var(--bg-sunk)", borderRadius: 8, gap: 10 }}>
                          <Icon name="alertCircle" size={14} color={`var(--${d <= 7 ? "danger" : "warn"})`}/>
                          <div className="grow">{e.title}</div>
                          <span className="mono faint" style={{ fontSize: 12 }}>{fmtDate(e.expires)}</span>
                          <span className={`chip ${d <= 7 ? "chip-danger" : "chip-warn"}`}>fra {d}g</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "formazione" && (
            <div className="card card-flush">
              <table className="table">
                <thead>
                  <tr><th>Corso</th><th>Ore</th><th>Completato il</th><th>Scadenza</th><th>Stato</th></tr>
                </thead>
                <tbody>
                  {employeeTrainings.map(t => (
                    <tr key={t.id} style={{ cursor: "default" }}>
                      <td style={{ fontWeight: 500 }}>{t.name}</td>
                      <td className="mono muted">{t.hours}h</td>
                      <td className="muted">{t.completed ? new Date(t.completed).toLocaleDateString("it-IT") : "—"}</td>
                      <td>{t.expires > 0 ? <span className="mono faint">fra {t.expires}g</span> : <span className="faint">—</span>}</td>
                      <td>
                        {!t.completed
                          ? <span className="chip chip-danger">Mai svolto</span>
                          : t.expires <= 30
                            ? <span className="chip chip-warn">In scadenza</span>
                            : <span className="chip chip-ok">Valido</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "documenti" && (
            <div className="col" style={{ gap: 8 }}>
              {[
                { name: "Visita_Medica_Idoneita.pdf", size: "180 KB", date: "12 gen 2026" },
                { name: "Attestato_Formazione_Base.pdf", size: "92 KB", date: "10 mar 2024" },
                { name: "Patentino_Carrelli.pdf", size: "320 KB", date: "08 apr 2021" },
                { name: "Consegna_DPI_2025.pdf", size: "210 KB", date: "15 mag 2025" },
              ].map((d, i) => (
                <div key={i} className="row" style={{ padding: 12, background: "var(--bg-sunk)", borderRadius: 8, gap: 12 }}>
                  <div className="file-icon" style={{ background: "var(--danger-soft)", color: "var(--danger)" }}>PDF</div>
                  <div className="grow col" style={{ gap: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{d.name}</div>
                    <div className="faint mono" style={{ fontSize: 11.5 }}>{d.size} · {d.date}</div>
                  </div>
                  <button className="btn btn-sm btn-ghost"><Icon name="download" size={12}/></button>
                </div>
              ))}
            </div>
          )}

          {tab === "timeline" && (
            <div className="card">
              <div className="col" style={{ gap: 0 }}>
                {[
                  { d: "20 mag 2026", e: "Check-in giornaliero completato (app mobile)" },
                  { d: "12 mag 2026", e: "Modulo \"Antincendio\" iniziato" },
                  { d: "15 mag 2025", e: "Consegna DPI 2025 firmata" },
                  { d: "10 mar 2024", e: "Formazione base completata (8h)" },
                  { d: "14 mar 2019", e: "Inserimento in azienda" },
                ].map((t, i, arr) => (
                  <div key={i} className="row" style={{ gap: 14, padding: "10px 0", alignItems: "flex-start" }}>
                    <div style={{ position: "relative", flexShrink: 0, paddingTop: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 999, background: "var(--primary)", border: "2px solid var(--bg-elev)", boxShadow: "0 0 0 2px var(--primary-soft)" }}/>
                      {i < arr.length - 1 && <div style={{ position: "absolute", left: 4, top: 18, bottom: -8, width: 2, background: "var(--border)" }}/>}
                    </div>
                    <div className="grow col" style={{ gap: 2 }}>
                      <div style={{ fontSize: 13 }}>{t.e}</div>
                      <div className="faint mono" style={{ fontSize: 11.5 }}>{t.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="col" style={{ gap: 4 }}>
    <div className="faint" style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500 }}>{label}</div>
    <div className="row" style={{ gap: 8 }}>
      <Icon name={icon} size={14} color="var(--text-soft)"/>
      <span style={{ fontSize: 13.5 }}>{value}</span>
    </div>
  </div>
);

const MiniStat = ({ label, value, sub, accent = "info" }) => (
  <div style={{ padding: 14, background: "var(--bg-sunk)", borderRadius: 8 }}>
    <div className="faint" style={{ fontSize: 11.5, fontWeight: 500 }}>{label}</div>
    <div className="mono" style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: `var(--${accent})`, marginTop: 2 }}>{value}</div>
    {sub && <div className="faint" style={{ fontSize: 11.5 }}>{sub}</div>}
  </div>
);

Object.assign(window, { Employees, EmployeeDrawer, ComplianceChip, initials });
